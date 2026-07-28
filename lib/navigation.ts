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
  Building,
  QrCode,
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
    { name: 'Overview', href: '/superadmin', icon: Home },
    { name: 'Tenants', href: '/superadmin/tenants', icon: Building },
    { name: 'Pricing', href: '/superadmin/config', icon: Wallet },
    { name: 'Owners', href: '/superadmin/owners', icon: Users },
    { name: 'Account', href: '/superadmin/account', icon: User }
  ],
  owner: [
    { name: 'Dashboard', href: '/manager', icon: Home, ownerOnly: true },
    { name: 'Tables', href: '/manager/tables', icon: Grid },
    { name: 'Orders', href: '/manager/orders', icon: ShoppingCart },
    { name: 'Billing', href: '/manager/billing', icon: Receipt },
    { name: 'Menu', href: '/manager/menu', icon: ChefHat },
    { name: 'Account', href: '/manager/account', icon: User }
  ],
  manager: [
    { name: 'Dashboard', href: '/manager', icon: Home },
    { name: 'Tables', href: '/manager/tables', icon: Grid },
    { name: 'Orders', href: '/manager/orders', icon: ShoppingCart },
    { name: 'Menu', href: '/manager/menu', icon: ChefHat },
    { name: 'Reviews', href: '/manager/reviews', icon: MessageSquare },
    { name: 'Account', href: '/manager/account', icon: User }
  ],
  captain: [
    { name: 'Floor Grid', href: '/captain', icon: Grid },
    { name: 'Scan QR', href: '/customer/scan', icon: QrCode },
    { name: 'Bookings', href: '/captain/bookings', icon: CalendarCheck },
    { name: 'Settlement', href: '/captain/settlement/t1', icon: Receipt },
    { name: 'Account', href: '/captain/account', icon: User }
  ],
  customer: [
    { name: 'Feed', href: '/customer', icon: Home },
    { name: 'Search', href: '/customer/search', icon: Search },
    { name: 'Create', href: '#create', icon: PlusSquare, isModal: true },
    { name: 'Scan QR', href: '/customer/scan', icon: QrCode },
    { name: 'Reels', href: '/customer/reels', icon: Film },
    { name: 'Profile', href: '/customer/account', icon: User }
  ]
};
