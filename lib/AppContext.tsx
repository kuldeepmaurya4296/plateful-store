'use client';

import React, { createContext, useContext } from 'react';
import { usePersistedState } from './hooks/usePersistedState';
import { validateTableTransition } from './tableStateMachine';
import { 
  Restaurant, 
  MenuItem, 
  Table, 
  Order, 
  Bill, 
  Expense, 
  ForecastItem, 
  Booking, 
  Review, 
  Story, 
  Post, 
  Message, 
  Counter, 
  Visit, 
  Notification,
  TableStatus,
  User
} from './types';

// Import JSON data for defaults
import restaurantsData from '@/data/restaurants.json';
import menuItemsData from '@/data/menu-items.json';
import tablesData from '@/data/tables.json';
import ordersData from '@/data/orders.json';
import billsData from '@/data/bills.json';
import expensesData from '@/data/expenses.json';
import forecastData from '@/data/forecast.json';
import bookingsData from '@/data/bookings.json';
import reviewsData from '@/data/reviews.json';
import storiesData from '@/data/stories.json';
import postsData from '@/data/posts.json';
import messagesData from '@/data/messages.json';
import countersData from '@/data/counters.json';
import visitsData from '@/data/visits.json';
import notificationsData from '@/data/notifications.json';
import usersData from '@/data/users.json';

interface AppContextType {
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  tables: Table[];
  orders: Order[];
  bills: Bill[];
  expenses: Expense[];
  forecast: ForecastItem[];
  bookings: Booking[];
  reviews: Review[];
  stories: Story[];
  posts: Post[];
  messages: Message[];
  counters: Counter[];
  visits: Visit[];
  notifications: Notification[];
  users: User[];
  
  // State Mutators
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateTableStatus: (tableId: string, status: TableStatus, activeSession?: any) => boolean;
  settleTableBill: (tableId: string, paymentMode: string, settledBy: string, slipPhoto?: string) => Bill | null;
  addExpense: (expense: Expense) => void;
  markForecastPurchased: (forecastId: string) => void;
  addBookingRequest: (booking: Booking) => void;
  updateBookingStatus: (bookingId: string, status: 'confirmed' | 'declined', tableNumber?: number) => void;
  addReview: (review: Review) => void;
  addPost: (post: Post) => void;
  likePost: (postId: string) => void;
  commentOnPost: (postId: string, commentText: string) => void;
  addStory: (story: Story) => void;
  toggleStoryPermanent: (storyId: string) => void;
  sendMessage: (restaurantId: string, userId: string, sender: 'customer' | 'restaurant', text: string) => void;
  triggerVisitPayment: (tableId: string, customerPhone?: string) => void;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (itemId: string, updatedFields: Partial<MenuItem>) => void;
  deleteMenuItem: (itemId: string) => void;
  addTable: (table: Table) => void;
  updateTenantSubscription: (restaurantId: string, plan: Restaurant['subscriptionPlan']) => void;
  toggleTenantStatus: (restaurantId: string) => void;
  addTenantRestaurant: (restaurant: Restaurant) => void;

  // New Mutators
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleUserBan: (userId: string) => void;
  respondToReview: (reviewId: string, responseText: string) => void;
  followRestaurant: (userId: string, restaurantId: string) => void;
  unfollowRestaurant: (userId: string, restaurantId: string) => void;
  updateUserProfile: (userId: string, fields: Partial<User>) => void;
  resetAllData: () => void;

  // Global UI Modal States
  isCreatePostOpen: boolean;
  setCreatePostOpen: (open: boolean) => void;
  activeDetailedPostId: string | null;
  setActiveDetailedPostId: (postId: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restaurants, setRestaurants] = usePersistedState<Restaurant[]>('plateful_restaurants', restaurantsData as Restaurant[]);
  const [menuItems, setMenuItems] = usePersistedState<MenuItem[]>('plateful_menuItems', menuItemsData as MenuItem[]);
  const [tables, setTables] = usePersistedState<Table[]>('plateful_tables', tablesData as Table[]);
  const [orders, setOrders] = usePersistedState<Order[]>('plateful_orders', ordersData as Order[]);
  const [bills, setBills] = usePersistedState<Bill[]>('plateful_bills', billsData as Bill[]);
  const [expenses, setExpenses] = usePersistedState<Expense[]>('plateful_expenses', expensesData as Expense[]);
  const [forecast, setForecast] = usePersistedState<ForecastItem[]>('plateful_forecast', forecastData as ForecastItem[]);
  const [bookings, setBookings] = usePersistedState<Booking[]>('plateful_bookings', bookingsData as Booking[]);
  const [reviews, setReviews] = usePersistedState<Review[]>('plateful_reviews', reviewsData as Review[]);
  const [stories, setStories] = usePersistedState<Story[]>('plateful_stories', storiesData as Story[]);
  const [posts, setPosts] = usePersistedState<Post[]>('plateful_posts', postsData as Post[]);
  const [messages, setMessages] = usePersistedState<Message[]>('plateful_messages', messagesData as Message[]);
  const [counters, setCounters] = usePersistedState<Counter[]>('plateful_counters', countersData as Counter[]);
  const [visits, setVisits] = usePersistedState<Visit[]>('plateful_visits', visitsData as Visit[]);
  const [notifications, setNotifications] = usePersistedState<Notification[]>('plateful_notifications', notificationsData as Notification[]);
  const [users, setUsers] = usePersistedState<User[]>('plateful_users', usersData as User[]);

  const [isCreatePostOpen, setCreatePostOpen] = React.useState(false);
  const [activeDetailedPostId, setActiveDetailedPostId] = React.useState<string | null>(null);

  const resetAllData = () => {
    localStorage.removeItem('plateful_restaurants');
    localStorage.removeItem('plateful_menuItems');
    localStorage.removeItem('plateful_tables');
    localStorage.removeItem('plateful_orders');
    localStorage.removeItem('plateful_bills');
    localStorage.removeItem('plateful_expenses');
    localStorage.removeItem('plateful_forecast');
    localStorage.removeItem('plateful_bookings');
    localStorage.removeItem('plateful_reviews');
    localStorage.removeItem('plateful_stories');
    localStorage.removeItem('plateful_posts');
    localStorage.removeItem('plateful_messages');
    localStorage.removeItem('plateful_counters');
    localStorage.removeItem('plateful_visits');
    localStorage.removeItem('plateful_notifications');
    localStorage.removeItem('plateful_users');
    
    setRestaurants(restaurantsData as Restaurant[]);
    setMenuItems(menuItemsData as MenuItem[]);
    setTables(tablesData as Table[]);
    setOrders(ordersData as Order[]);
    setBills(billsData as Bill[]);
    setExpenses(expensesData as Expense[]);
    setForecast(forecastData as ForecastItem[]);
    setBookings(bookingsData as Booking[]);
    setReviews(reviewsData as Review[]);
    setStories(storiesData as Story[]);
    setPosts(postsData as Post[]);
    setMessages(messagesData as Message[]);
    setCounters(countersData as Counter[]);
    setVisits(visitsData as Visit[]);
    setNotifications(notificationsData as Notification[]);
    setUsers(usersData as User[]);
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const updateTableStatus = (tableId: string, status: TableStatus, activeSession?: any): boolean => {
    let success = false;
    setTables(prev => {
      const targetTable = prev.find(t => t.id === tableId);
      if (!targetTable) return prev;

      const { isValid, errorMessage } = validateTableTransition(targetTable.status, status);
      if (!isValid) {
        console.warn(errorMessage);
        return prev;
      }

      success = true;
      return prev.map(t => {
        if (t.id === tableId) {
          return {
            ...t,
            status,
            activeSession: status === 'available' ? null : (activeSession !== undefined ? activeSession : t.activeSession)
          };
        }
        return t;
      });
    });
    return success;
  };

  const settleTableBill = (tableId: string, paymentMode: string, settledBy: string, slipPhoto?: string): Bill | null => {
    const table = tables.find(t => t.id === tableId);
    if (!table || !table.activeSession) return null;

    const session = table.activeSession;
    
    // Check if table transition from billing to settling/available is allowed
    const { isValid } = validateTableTransition(table.status, 'available');
    if (!isValid) {
      console.warn(`Table ${table.number} cannot be settled directly from ${table.status}`);
      return null;
    }

    const billId = `B-${Math.floor(1000 + Math.random() * 9000)}`;
    const grandTotal = Math.round(session.total * 1.05);

    const newBill: Bill = {
      id: billId,
      tableNumber: table.number,
      restaurantId: table.restaurantId,
      customerName: session.customerName || 'Anonymous',
      customerPhone: session.customerPhone || '',
      paymentMode,
      total: session.total,
      tax: Math.round(session.total * 0.05), // 5% GST
      discount: 0,
      grandTotal,
      startedBy: session.startedBy,
      settledBy,
      createdAt: new Date().toISOString(),
      items: session.items,
      slipPhoto
    };

    // Add to bills list
    setBills(prev => [newBill, ...prev]);

    // Create a visit record to trigger a 10-minute review window for this customer
    const visitId = `v_dyn_${Date.now()}`;
    const newVisit: Visit = {
      id: visitId,
      userId: "u1", // Default to main customer Riya for demo
      restaurantId: table.restaurantId,
      tableId: table.id,
      paymentConfirmedAt: new Date().toISOString(),
      reviewWindowOpensAt: new Date().toISOString(),
      reviewWindowClosesAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
      isReviewed: false,
      billId
    };
    setVisits(prev => [newVisit, ...prev]);

    // Revert Table Status to Available
    updateTableStatus(tableId, 'available');

    return newBill;
  };

  const addExpense = (expense: Expense) => {
    setExpenses(prev => [expense, ...prev]);
  };

  const markForecastPurchased = (forecastId: string) => {
    const item = forecast.find(f => f.id === forecastId);
    if (!item) return;

    // Mark as purchased in forecast
    setForecast(prev => prev.map(f => f.id === forecastId ? { ...f, isPurchased: true } : f));

    // Add to logged expenses
    const newExpense: Expense = {
      id: `e_dyn_${Date.now()}`,
      restaurantId: item.restaurantId,
      itemName: item.itemName,
      quantity: item.quantityNeeded,
      cost: item.estimatedCost,
      category: 'Raw Material',
      date: new Date().toISOString().split('T')[0],
      notes: 'Purchased from forecast'
    };
    addExpense(newExpense);
  };

  const addBookingRequest = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  };

  const updateBookingStatus = (bookingId: string, status: 'confirmed' | 'declined', tableNumber?: number) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status, tableNumber } : b));
  };

  const addReview = (review: Review) => {
    setReviews(prev => [review, ...prev]);
    // Mark the associated visit as reviewed
    setVisits(prev => prev.map(v => v.id === review.visitId ? { ...v, isReviewed: true } : v));
  };

  const addPost = (post: Post) => {
    setPosts(prev => [post, ...prev]);
  };

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likesCount: p.likesCount + 1 } : p));
  };

  const commentOnPost = (postId: string, commentText: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p));
  };

  const addStory = (story: Story) => {
    setStories(prev => [story, ...prev]);
  };

  const toggleStoryPermanent = (storyId: string) => {
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, isPermanent: !s.isPermanent, expiresAt: s.isPermanent ? new Date(Date.now() + 24*60*60*1000).toISOString() : null } : s));
  };

  const sendMessage = (restaurantId: string, userId: string, sender: 'customer' | 'restaurant', text: string) => {
    const newMsg: Message = {
      id: `msg_dyn_${Date.now()}`,
      restaurantId,
      userId,
      sender,
      text,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const triggerVisitPayment = (tableId: string, customerPhone?: string) => {
    // Simulate requesting a bill
    updateTableStatus(tableId, 'billing');
  };

  const addMenuItem = (item: MenuItem) => {
    setMenuItems(prev => [...prev, item]);
  };

  const updateMenuItem = (itemId: string, updatedFields: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(m => m.id === itemId ? { ...m, ...updatedFields } : m));
  };

  const deleteMenuItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(m => m.id !== itemId));
  };

  const addTable = (table: Table) => {
    setTables(prev => [...prev, table]);
  };

  const updateTenantSubscription = (restaurantId: string, plan: Restaurant['subscriptionPlan']) => {
    setRestaurants(prev => prev.map(r => r.id === restaurantId ? { ...r, subscriptionPlan: plan } : r));
  };

  const toggleTenantStatus = (restaurantId: string) => {
    setRestaurants(prev => prev.map(r => r.id === restaurantId ? { ...r, subscriptionStatus: r.subscriptionStatus === 'Active' ? 'Suspended' : 'Active' } : r));
  };

  const addTenantRestaurant = (restaurant: Restaurant) => {
    setRestaurants(prev => [...prev, restaurant]);
  };

  // New Mutators
  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const toggleUserBan = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: !u.isBanned } : u));
  };

  const respondToReview = (reviewId: string, responseText: string) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, ownerResponse: responseText } : r));
  };

  const followRestaurant = (userId: string, restaurantId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const followed = u.followedRestaurants || [];
        if (!followed.includes(restaurantId)) {
          return { ...u, followedRestaurants: [...followed, restaurantId] };
        }
      }
      return u;
    }));
  };

  const unfollowRestaurant = (userId: string, restaurantId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const followed = u.followedRestaurants || [];
        return { ...u, followedRestaurants: followed.filter(id => id !== restaurantId) };
      }
      return u;
    }));
  };

  const updateUserProfile = (userId: string, fields: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...fields } : u));
  };

  return (
    <AppContext.Provider value={{
      restaurants,
      menuItems,
      tables,
      orders,
      bills,
      expenses,
      forecast,
      bookings,
      reviews,
      stories,
      posts,
      messages,
      counters,
      visits,
      notifications,
      users,
      
      addOrder,
      updateOrderStatus,
      updateTableStatus,
      settleTableBill,
      addExpense,
      markForecastPurchased,
      addBookingRequest,
      updateBookingStatus,
      addReview,
      addPost,
      likePost,
      commentOnPost,
      addStory,
      toggleStoryPermanent,
      sendMessage,
      triggerVisitPayment,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      addTable,
      updateTenantSubscription,
      toggleTenantStatus,
      addTenantRestaurant,

      // New
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      toggleUserBan,
      respondToReview,
      followRestaurant,
      unfollowRestaurant,
      updateUserProfile,
      resetAllData,
      
      isCreatePostOpen,
      setCreatePostOpen,
      activeDetailedPostId,
      setActiveDetailedPostId
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
