import { 
  Home, 
  Grid, 
  ShoppingCart, 
  Receipt, 
  Users, 
  Wallet, 
  ChefHat, 
  Share2, 
  User,
  Search,
  PlusSquare,
  Film,
  CalendarCheck,
  MessageSquare,
  Bell,
  LucideIcon
} from 'lucide-react';
import { UserRole } from './types';

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  ownerOnly?: boolean;
  isModal?: boolean;
}

export const navigationConfig: Record<UserRole, NavItem[]> = {
  superadmin: [
    { name: 'SaaS Overview', href: '/superadmin', icon: Home },
    { name: 'Manage Tenants', href: '/superadmin/tenants', icon: Users },
    { name: 'Pricing Config', href: '/superadmin/config', icon: Wallet },
    { name: 'Manage Owners', href: '/superadmin/owners', icon: Users },
    { name: 'Manage Customers', href: '/superadmin/customers', icon: Users },
    { name: 'Account', href: '/superadmin/account', icon: User }
  ],
  owner: [
    { name: 'Home', href: '/manager', icon: Home, ownerOnly: true },
    { name: 'Table Management', href: '/manager/tables', icon: Grid },
    { name: 'Online Orders', href: '/manager/orders', icon: ShoppingCart },
    { name: 'Billing History', href: '/manager/billing', icon: Receipt },
    { name: 'Staff Roster', href: '/manager/staff', icon: Users, ownerOnly: true },
    { name: 'User Management', href: '/manager/users', icon: Users, ownerOnly: true },
    { name: 'Customer Directory', href: '/manager/customers', icon: Users },
    { name: 'Add Expenses', href: '/manager/expenses', icon: Wallet, ownerOnly: true },
    { name: 'Load Menu', href: '/manager/menu', icon: ChefHat },
    { name: 'Reviews Portal', href: '/manager/reviews', icon: MessageSquare },
    { name: 'Manage Social', href: '/manager/social', icon: Share2 },
    { name: 'Account', href: '/manager/account', icon: User }
  ],
  manager: [
    { name: 'Table Management', href: '/manager/tables', icon: Grid },
    { name: 'Online Orders', href: '/manager/orders', icon: ShoppingCart },
    { name: 'Billing History', href: '/manager/billing', icon: Receipt },
    { name: 'Customer Directory', href: '/manager/customers', icon: Users },
    { name: 'Load Menu', href: '/manager/menu', icon: ChefHat },
    { name: 'Reviews Portal', href: '/manager/reviews', icon: MessageSquare },
    { name: 'Manage Social', href: '/manager/social', icon: Share2 },
    { name: 'Account', href: '/manager/account', icon: User }
  ],
  captain: [
    { name: 'Tables', href: '/captain', icon: Grid },
    { name: 'Bookings', href: '/captain/bookings', icon: CalendarCheck },
    { name: 'Account', href: '/captain/account', icon: User }
  ],
  customer: [
    { name: 'Feed', href: '/customer', icon: Home },
    { name: 'Search', href: '/customer/search', icon: Search },
    { name: 'Create', href: '#create', icon: PlusSquare, isModal: true },
    { name: 'Reels', href: '/customer/reels', icon: Film },
    { name: 'Account', href: '/customer/account', icon: User }
  ]
};
