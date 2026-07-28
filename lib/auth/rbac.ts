import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'owner' | 'manager' | 'captain' | 'superadmin';
  username: string;
  restaurantId?: string;
  counterId?: string;
}

/**
 * Get current authenticated user session on server-side
 */
export async function getAuthSession(): Promise<AuthenticatedUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session.user as AuthenticatedUser;
}

/**
 * Verify user is authenticated and possesses one of the allowed roles
 */
export async function verifyRole(allowedRoles: Array<'customer' | 'owner' | 'manager' | 'captain' | 'superadmin'>) {
  const user = await getAuthSession();
  
  if (!user) {
    return {
      authorized: false,
      user: null,
      response: NextResponse.json({ error: 'Unauthorized: Session missing' }, { status: 401 })
    };
  }

  if (!allowedRoles.includes(user.role)) {
    return {
      authorized: false,
      user,
      response: NextResponse.json({ 
        error: `Forbidden: Role '${user.role}' is not authorized for this resource` 
      }, { status: 403 })
    };
  }

  return { authorized: true, user, response: null };
}

/**
 * Verify user has tenant access to specific restaurant ID
 */
export async function verifyRestaurantAccess(restaurantId: string, allowedRoles: Array<'owner' | 'manager' | 'captain' | 'superadmin'> = ['owner', 'manager', 'captain', 'superadmin']) {
  const auth = await verifyRole(allowedRoles);
  if (!auth.authorized || !auth.user) return auth;

  // Superadmin can access any restaurant tenant
  if (auth.user.role === 'superadmin') {
    return auth;
  }

  // Tenant check
  if (auth.user.restaurantId && auth.user.restaurantId !== restaurantId) {
    return {
      authorized: false,
      user: auth.user,
      response: NextResponse.json({ 
        error: `Forbidden: User belongs to restaurant '${auth.user.restaurantId}' and cannot access '${restaurantId}'` 
      }, { status: 403 })
    };
  }

  return auth;
}
