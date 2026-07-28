'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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
  settleTableBill: (tableId: string, paymentMode: string, settledBy: string, slipPhoto?: string) => Promise<Bill | null>;
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
  resetAllData: () => Promise<void>;

  // Global UI Modal States
  isCreatePostOpen: boolean;
  setCreatePostOpen: (open: boolean) => void;
  activeDetailedPostId: string | null;
  setActiveDetailedPostId: (postId: string | null) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [counters, setCounters] = useState<Counter[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isCreatePostOpen, setCreatePostOpen] = useState(false);
  const [activeDetailedPostId, setActiveDetailedPostId] = useState<string | null>(null);

  // Fetch initial data from backend API
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [
        resRestaurants,
        resMenuItems,
        resTables,
        resOrders,
        resBills,
        resExpenses,
        resForecast,
        resBookings,
        resReviews,
        resStories,
        resPosts,
        resMessages,
        resCounters,
        resVisits,
        resNotifications,
        resUsers
      ] = await Promise.all([
        fetch('/api/restaurants').then(r => r.ok ? r.json() : []),
        fetch('/api/menu-items').then(r => r.ok ? r.json() : []),
        fetch('/api/tables').then(r => r.ok ? r.json() : []),
        fetch('/api/orders').then(r => r.ok ? r.json() : []),
        fetch('/api/bills').then(r => r.ok ? r.json() : []),
        fetch('/api/expenses').then(r => r.ok ? r.json() : []),
        fetch('/api/forecast').then(r => r.ok ? r.json() : []),
        fetch('/api/bookings').then(r => r.ok ? r.json() : []),
        fetch('/api/reviews').then(r => r.ok ? r.json() : []),
        fetch('/api/stories').then(r => r.ok ? r.json() : []),
        fetch('/api/posts').then(r => r.ok ? r.json() : []),
        fetch('/api/messages').then(r => r.ok ? r.json() : []),
        fetch('/api/counters').then(r => r.ok ? r.json() : []),
        fetch('/api/visits').then(r => r.ok ? r.json() : []),
        fetch('/api/notifications').then(r => r.ok ? r.json() : []),
        fetch('/api/users').then(r => r.ok ? r.json() : [])
      ]);

      setRestaurants(resRestaurants);
      setMenuItems(resMenuItems);
      setTables(resTables);
      setOrders(resOrders);
      setBills(resBills);
      setExpenses(resExpenses);
      setForecast(resForecast);
      setBookings(resBookings);
      setReviews(resReviews);
      setStories(resStories);
      setPosts(resPosts);
      setMessages(resMessages);
      setCounters(resCounters);
      setVisits(resVisits);
      setNotifications(resNotifications);
      setUsers(resUsers);
    } catch (error) {
      console.error('Error loading data from MongoDB API backend:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const resetAllData = async () => {
    try {
      await fetch('/api/seed', { method: 'POST' });
      await refreshData();
    } catch (e) {
      console.error('Error resetting database:', e);
    }
  };

  const addOrder = async (order: Order) => {
    setOrders(prev => [order, ...prev]);
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
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

    if (success) {
      fetch(`/api/tables/${tableId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, activeSession })
      }).catch(err => console.error('Error updating table status:', err));
    }

    return success;
  };

  const settleTableBill = async (tableId: string, paymentMode: string, settledBy: string, slipPhoto?: string): Promise<Bill | null> => {
    try {
      const res = await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId, paymentMode, settledBy, slipPhoto })
      });
      if (res.ok) {
        const newBill = await res.json();
        setBills(prev => [newBill, ...prev]);
        setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: 'available', activeSession: null } : t));
        return newBill;
      }
    } catch (e) {
      console.error('Error settling bill:', e);
    }
    return null;
  };

  const addExpense = async (expense: Expense) => {
    setExpenses(prev => [expense, ...prev]);
    await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });
  };

  const markForecastPurchased = async (forecastId: string) => {
    setForecast(prev => prev.map(f => f.id === forecastId ? { ...f, isPurchased: true } : f));
    await fetch(`/api/forecast/${forecastId}/purchase`, { method: 'PATCH' });
    // Refresh expenses
    fetch('/api/expenses').then(r => r.json()).then(setExpenses);
  };

  const addBookingRequest = async (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
    await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
  };

  const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'declined', tableNumber?: number) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status, tableNumber } : b));
    await fetch(`/api/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, tableNumber })
    });
  };

  const addReview = async (review: Review) => {
    setReviews(prev => [review, ...prev]);
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
  };

  const addPost = async (post: Post) => {
    setPosts(prev => [post, ...prev]);
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });
  };

  const likePost = async (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likesCount: p.likesCount + 1 } : p));
    await fetch(`/api/posts/${postId}/like`, { method: 'PATCH' });
  };

  const commentOnPost = async (postId: string, commentText: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p));
    await fetch(`/api/posts/${postId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: commentText, userName: 'Riya Kapoor' })
    });
  };

  const addStory = async (story: Story) => {
    setStories(prev => [story, ...prev]);
    await fetch('/api/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(story)
    });
  };

  const toggleStoryPermanent = async (storyId: string) => {
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, isPermanent: !s.isPermanent } : s));
    await fetch(`/api/stories/${storyId}`, { method: 'PATCH' });
  };

  const sendMessage = async (restaurantId: string, userId: string, sender: 'customer' | 'restaurant', text: string) => {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      restaurantId,
      userId,
      sender,
      text,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMsg]);
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMsg)
    });
  };

  const triggerVisitPayment = (tableId: string) => {
    updateTableStatus(tableId, 'billing');
  };

  const addMenuItem = async (item: MenuItem) => {
    setMenuItems(prev => [...prev, item]);
    await fetch('/api/menu-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
  };

  const updateMenuItem = async (itemId: string, updatedFields: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(m => m.id === itemId ? { ...m, ...updatedFields } : m));
    await fetch(`/api/menu-items/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields)
    });
  };

  const deleteMenuItem = async (itemId: string) => {
    setMenuItems(prev => prev.filter(m => m.id !== itemId));
    await fetch(`/api/menu-items/${itemId}`, { method: 'DELETE' });
  };

  const addTable = async (table: Table) => {
    setTables(prev => [...prev, table]);
    await fetch('/api/tables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(table)
    });
  };

  const updateTenantSubscription = async (restaurantId: string, plan: Restaurant['subscriptionPlan']) => {
    setRestaurants(prev => prev.map(r => r.id === restaurantId ? { ...r, subscriptionPlan: plan } : r));
    await fetch(`/api/restaurants/${restaurantId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptionPlan: plan })
    });
  };

  const toggleTenantStatus = async (restaurantId: string) => {
    const target = restaurants.find(r => r.id === restaurantId);
    if (!target) return;
    const newStatus = target.subscriptionStatus === 'Active' ? 'Suspended' : 'Active';
    setRestaurants(prev => prev.map(r => r.id === restaurantId ? { ...r, subscriptionStatus: newStatus } : r));
    await fetch(`/api/restaurants/${restaurantId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptionStatus: newStatus })
    });
  };

  const addTenantRestaurant = async (restaurant: Restaurant) => {
    setRestaurants(prev => [...prev, restaurant]);
    await fetch('/api/restaurants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(restaurant)
    });
  };

  const addNotification = async (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification)
    });
  };

  const markNotificationRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const toggleUserBan = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: !u.isBanned } : u));
  };

  const respondToReview = async (reviewId: string, responseText: string) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, ownerResponse: responseText } : r));
    await fetch(`/api/reviews/${reviewId}/respond`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responseText })
    });
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
      setActiveDetailedPostId,
      isLoading
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
