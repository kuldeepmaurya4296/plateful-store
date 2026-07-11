'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Import JSON data
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

interface AppContextType {
  restaurants: any[];
  menuItems: any[];
  tables: any[];
  orders: any[];
  bills: any[];
  expenses: any[];
  forecast: any[];
  bookings: any[];
  reviews: any[];
  stories: any[];
  posts: any[];
  messages: any[];
  counters: any[];
  visits: any[];
  
  // State Mutators
  addOrder: (order: any) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
  updateTableStatus: (tableId: string, status: 'available' | 'occupied' | 'billing', activeSession?: any) => void;
  settleTableBill: (tableId: string, paymentMode: string, settledBy: string, slipPhoto?: string) => any;
  addExpense: (expense: any) => void;
  markForecastPurchased: (forecastId: string) => void;
  addBookingRequest: (booking: any) => void;
  updateBookingStatus: (bookingId: string, status: 'confirmed' | 'declined', tableNumber?: number) => void;
  addReview: (review: any) => void;
  addPost: (post: any) => void;
  likePost: (postId: string) => void;
  commentOnPost: (postId: string, commentText: string) => void;
  addStory: (story: any) => void;
  toggleStoryPermanent: (storyId: string) => void;
  sendMessage: (restaurantId: string, userId: string, sender: 'customer' | 'restaurant', text: string) => void;
  triggerVisitPayment: (tableId: string, customerPhone?: string) => void;
  addMenuItem: (item: any) => void;
  updateMenuItem: (itemId: string, updatedFields: any) => void;
  deleteMenuItem: (itemId: string) => void;
  addTable: (table: any) => void;
  updateTenantSubscription: (restaurantId: string, plan: string) => void;
  toggleTenantStatus: (restaurantId: string) => void;
  addTenantRestaurant: (restaurant: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [forecast, setForecast] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [counters, setCounters] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);

  // Load Initial Data on Mount
  useEffect(() => {
    setRestaurants(restaurantsData);
    setMenuItems(menuItemsData);
    setTables(tablesData);
    setOrders(ordersData);
    setBills(billsData);
    setExpenses(expensesData);
    setForecast(forecastData);
    setBookings(bookingsData);
    setReviews(reviewsData);
    setStories(storiesData);
    setPosts(postsData);
    setMessages(messagesData);
    setCounters(countersData);
    setVisits(visitsData);
  }, []);

  // Mutators implementation
  const addOrder = (order: any) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const updateTableStatus = (tableId: string, status: 'available' | 'occupied' | 'billing', activeSession?: any) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          status,
          activeSession: status === 'available' ? null : (activeSession !== undefined ? activeSession : t.activeSession)
        };
      }
      return t;
    }));
  };

  const settleTableBill = (tableId: string, paymentMode: string, settledBy: string, slipPhoto?: string) => {
    const table = tables.find(t => t.id === tableId);
    if (!table || !table.activeSession) return null;

    const session = table.activeSession;
    const billId = `B-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBill = {
      id: billId,
      tableNumber: table.number,
      restaurantId: table.restaurantId,
      customerName: session.customerName || 'Anonymous',
      customerPhone: session.customerPhone || '',
      paymentMode,
      total: session.total,
      tax: Math.round(session.total * 0.05), // 5% GST mock
      discount: 0,
      grandTotal: Math.round(session.total * 1.05),
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
    const newVisit = {
      id: visitId,
      userId: "u1", // Default to main customer Riya for demo purposes
      restaurantId: table.restaurantId,
      tableId: table.id,
      paymentConfirmedAt: new Date().toISOString(),
      reviewWindowOpensAt: new Date().toISOString(),
      reviewWindowClosesAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes from now
      isReviewed: false,
      billId
    };
    setVisits(prev => [newVisit, ...prev]);

    // Revert Table Status to Available
    updateTableStatus(tableId, 'available');

    return newBill;
  };

  const addExpense = (expense: any) => {
    setExpenses(prev => [expense, ...prev]);
  };

  const markForecastPurchased = (forecastId: string) => {
    const item = forecast.find(f => f.id === forecastId);
    if (!item) return;

    // Mark as purchased in forecast
    setForecast(prev => prev.map(f => f.id === forecastId ? { ...f, isPurchased: true } : f));

    // Add to logged expenses
    const newExpense = {
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

  const addBookingRequest = (booking: any) => {
    setBookings(prev => [booking, ...prev]);
  };

  const updateBookingStatus = (bookingId: string, status: 'confirmed' | 'declined', tableNumber?: number) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status, tableNumber } : b));
  };

  const addReview = (review: any) => {
    setReviews(prev => [review, ...prev]);
    // Mark the associated visit as reviewed
    setVisits(prev => prev.map(v => v.id === review.visitId ? { ...v, isReviewed: true } : v));
  };

  const addPost = (post: any) => {
    setPosts(prev => [post, ...prev]);
  };

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likesCount: p.likesCount + 1 } : p));
  };

  const commentOnPost = (postId: string, commentText: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p));
  };

  const addStory = (story: any) => {
    setStories(prev => [story, ...prev]);
  };

  const toggleStoryPermanent = (storyId: string) => {
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, isPermanent: !s.isPermanent, expiresAt: s.isPermanent ? new Date(Date.now() + 24*60*60*1000).toISOString() : null } : s));
  };

  const sendMessage = (restaurantId: string, userId: string, sender: 'customer' | 'restaurant', text: string) => {
    const newMsg = {
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
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    // Simulate requesting a bill
    updateTableStatus(tableId, 'billing');
  };

  const addMenuItem = (item: any) => {
    setMenuItems(prev => [...prev, item]);
  };

  const updateMenuItem = (itemId: string, updatedFields: any) => {
    setMenuItems(prev => prev.map(m => m.id === itemId ? { ...m, ...updatedFields } : m));
  };

  const deleteMenuItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(m => m.id !== itemId));
  };

  const addTable = (table: any) => {
    setTables(prev => [...prev, table]);
  };

  const updateTenantSubscription = (restaurantId: string, plan: string) => {
    setRestaurants(prev => prev.map(r => r.id === restaurantId ? { ...r, subscriptionPlan: plan } : r));
  };

  const toggleTenantStatus = (restaurantId: string) => {
    setRestaurants(prev => prev.map(r => r.id === restaurantId ? { ...r, subscriptionStatus: r.subscriptionStatus === 'Active' ? 'Suspended' : 'Active' } : r));
  };

  const addTenantRestaurant = (restaurant: any) => {
    setRestaurants(prev => [...prev, restaurant]);
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
      addTenantRestaurant
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
