import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { dbConnect } from '@/lib/db/connection';
import { Restaurant } from '@/lib/db/models/Restaurant';

export interface AuthenticatedUser {
  id: string;
  name?: string;
  email?: string;
  role: 'superadmin' | 'owner' | 'manager' | 'captain' | 'customer';
  username: string;
  restaurantId?: string;
  counterId?: string;
}

/**
 * Retrieves the current authenticated user session on the server side.
 */
export async function getAuthSession(): Promise<AuthenticatedUser | null> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return null;
    return session.user as AuthenticatedUser;
  } catch (error) {
    console.error('Error fetching server session:', error);
    return null;
  }
}

/**
 * Checks whether the current user has one of the allowed roles.
 */
export async function requireAuthRoles(allowedRoles: Array<'superadmin' | 'owner' | 'manager' | 'captain' | 'customer'>): Promise<{ user: AuthenticatedUser } | { error: string; status: number }> {
  const user = await getAuthSession();
  if (!user) {
    return { error: 'Unauthorized: Authentication session required.', status: 401 };
  }
  if (!allowedRoles.includes(user.role)) {
    return { error: `Forbidden: Access restricted for role '${user.role}'.`, status: 403 };
  }
  return { user };
}

/**
 * Checks server-side SaaS plan permissions for a given feature.
 */
export const SAAS_FEATURE_TIERS: Record<string, Array<'Basic' | 'Premium' | 'Enterprise'>> = {
  'customer_stories': ['Premium', 'Enterprise'],
  'discount_campaigns': ['Premium', 'Enterprise'],
  'todays_special': ['Premium', 'Enterprise'],
  'interactive_layout': ['Premium', 'Enterprise'],
  'raw_material_forecast': ['Enterprise'],
  'cash_audits': ['Enterprise']
};

export async function checkSaaSPlanPermission(restaurantId: string, feature: string): Promise<{ allowed: boolean; plan?: string; error?: string }> {
  try {
    await dbConnect();
    const restaurant = await Restaurant.findOne({ id: restaurantId }).lean();
    if (!restaurant) {
      return { allowed: false, error: 'Restaurant not found.' };
    }

    const currentPlan = restaurant.subscriptionPlan || 'Basic';
    const allowedPlans = SAAS_FEATURE_TIERS[feature] || ['Basic', 'Premium', 'Enterprise'];

    if (!allowedPlans.includes(currentPlan as any)) {
      return { 
        allowed: false, 
        plan: currentPlan,
        error: `Feature '${feature}' requires a ${allowedPlans.join(' or ')} plan. Current plan is ${currentPlan}.` 
      };
    }

    return { allowed: true, plan: currentPlan };
  } catch (error: any) {
    return { allowed: false, error: error.message };
  }
}
