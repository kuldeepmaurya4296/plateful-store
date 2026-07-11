export type UserRole = 'customer' | 'owner' | 'manager' | 'captain' | 'superadmin';

export interface UserPreferences {
  dietFilter: 'veg' | 'non-veg' | 'both';
  city: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  avatar: string;
  username: string;
  restaurantId?: string;
  counterId?: string;
  assignedTables?: string[];
  preferences?: UserPreferences;
  followedRestaurants?: string[];
  wishlist?: string[];
  bio?: string;
  isActive?: boolean;
  isBanned?: boolean;
  createdAt?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  city: string;
  address: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  avatar: string;
  description: string;
  phone: string;
  email: string;
  features: string[];
  coverImage: string;
  subscriptionPlan: 'Basic' | 'Premium' | 'Enterprise';
  subscriptionStatus: 'Active' | 'Suspended';
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  category: string;
  isVeg: boolean;
  isAvailable: boolean;
  description: string;
  presentationNote?: string;
  image?: string;
}

export type TableStatus = 'available' | 'occupied' | 'billing' | 'settling';

export interface OrderItem {
  menuItemId?: string;
  name: string;
  quantity: number;
  price: number;
}

export interface ActiveSession {
  customerName: string;
  customerPhone: string;
  startedBy: string;
  startedAt: string;
  items: OrderItem[];
  total: number;
  preparationNote?: string;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  counterId: string;
  restaurantId: string;
  qrToken: string;
  activeSession: ActiveSession | null;
}

export interface Order {
  id: string;
  restaurantId: string;
  type: 'online' | 'dine-in';
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'completed' | 'cancelled';
  createdAt: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  tableNumber?: number;
}

export interface Bill {
  id: string;
  tableNumber?: number;
  restaurantId: string;
  customerName: string;
  customerPhone: string;
  paymentMode: string;
  total: number;
  tax: number;
  discount: number;
  grandTotal: number;
  startedBy: string;
  settledBy: string;
  createdAt: string;
  items: OrderItem[];
  slipPhoto?: string;
}

export interface Expense {
  id: string;
  restaurantId: string;
  itemName: string;
  quantity: string;
  cost: number;
  category: string;
  date: string;
  notes?: string;
}

export interface ForecastItem {
  id: string;
  restaurantId: string;
  itemName: string;
  quantityNeeded: string;
  estimatedCost: number;
  isPurchased: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  restaurantId: string;
  restaurantName: string;
  date: string;
  timeSlot: string;
  partySize: number;
  specialRequest?: string;
  status: 'pending' | 'confirmed' | 'declined';
  advancePaid: number;
  tableNumber?: number;
  createdAt: string;
}

export interface Review {
  id: string;
  visitId: string;
  restaurantId: string;
  userId: string;
  userName: string;
  foodRating: number;
  presentationRating: number;
  ambianceRating: number;
  text: string;
  createdAt: string;
  ownerResponse?: string;
}

export interface Story {
  id: string;
  restaurantId: string;
  mediaUrl: string;
  caption: string;
  isPermanent: boolean;
  createdAt: string;
  expiresAt: string | null;
  views?: number;
  title?: string;
}

export interface Post {
  id: string;
  authorType: 'restaurant' | 'customer';
  authorId: string;
  authorName: string;
  authorAvatar: string;
  restaurantId?: string;
  restaurantName?: string;
  city: string;
  photoUrl: string;
  caption: string;
  isVeg: boolean;
  rating?: number;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  commentsList?: any[];
}

export interface Message {
  id: string;
  restaurantId: string;
  userId: string;
  sender: 'customer' | 'restaurant';
  text: string;
  createdAt: string;
}

export interface Counter {
  id: string;
  name: string;
  restaurantId: string;
  tableRange: string;
  captainId: string;
  captainName: string;
}

export interface Visit {
  id: string;
  userId: string;
  restaurantId: string;
  tableId: string;
  paymentConfirmedAt: string;
  reviewWindowOpensAt: string;
  reviewWindowClosesAt: string;
  isReviewed: boolean;
  billId: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}
