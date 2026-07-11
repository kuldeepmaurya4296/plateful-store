'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { ArrowLeft, UserPlus, Info, Check, X, Shield, Users } from 'lucide-react';
import Link from 'next/link';

export default function QRMenuPage() {
  const params = useParams();
  const router = useRouter();
  const tableId = params.tableId as string;
  const { tables, menuItems, restaurants, updateTableStatus } = useApp();
  const { toast } = useToast();

  const [isAdmin, setIsAdmin] = useState(false);
  const [showJoinRequest, setShowJoinRequest] = useState(false);
  const [cart, setCart] = useState<{ [itemId: string]: number }>({});
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderSent, setOrderSent] = useState(false);

  const table = tables.find(t => t.id === tableId || t.qrToken === tableId);
  const restaurant = table ? restaurants.find(r => r.id === table.restaurantId) : null;
  const items = restaurant ? menuItems.filter(m => m.restaurantId === restaurant.id) : [];

  useEffect(() => {
    if (!table) return;

    if (!table.activeSession) {
      // If table session is clear, make this scanning user the Session Admin
      setIsAdmin(true);
      toast({
        type: 'info',
        title: 'Table Session Initialized',
        description: `You are now the Session Admin for Table ${table.number}.`
      });
    } else {
      // If a session is open, trigger simulated join request for admin
      setIsAdmin(false);
      // Simulate that another user wants to join or we are joining a session
      setShowJoinRequest(true);
    }
  }, [table, tableId, toast]);

  if (!table || !restaurant) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-bg p-6">
        <Card className="text-center max-w-sm">
          <h3 className="text-lg font-serif font-bold text-ink">Invalid QR Code</h3>
          <p className="text-xs text-ink-soft mt-1.5">
            This QR code token does not map to any active table on our servers.
          </p>
          <Link href="/explore">
            <Button variant="primary" className="mt-4">Back to Discovery</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleJoinAccept = () => {
    setShowJoinRequest(false);
    toast({
      type: 'success',
      title: 'Joined Shared Order',
      description: `You have joined Table ${table.number}'s shared ordering session.`
    });
  };

  const handleJoinDeny = () => {
    setShowJoinRequest(false);
    toast({
      type: 'warning',
      title: 'Join Request Denied',
      description: 'You cannot place orders on this table session.'
    });
    router.push('/explore');
  };

  const addToCart = (itemId: string) => {
    setCart(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const updated = { ...prev };
      if (updated[itemId] > 1) {
        updated[itemId] -= 1;
      } else {
        delete updated[itemId];
      }
      return updated;
    });
  };

  const handlePlaceOrder = () => {
    if (!customerPhone.trim()) {
      toast({
        type: 'error',
        title: 'Phone Number Required',
        description: 'Customer phone number is required for self-placed orders.'
      });
      return;
    }

    const orderItems = Object.keys(cart).map(id => {
      const item = items.find(m => m.id === id);
      return {
        menuItemId: id,
        quantity: cart[id],
        name: item?.name || '',
        price: item?.price || 0
      };
    });

    const total = orderItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

    const activeSession = {
      customerName: customerName || 'Self Order Guest',
      customerPhone: customerPhone,
      startedBy: 'customer',
      startedAt: new Date().toISOString(),
      items: orderItems,
      total: total,
      preparationNote: 'Self-placed order'
    };

    updateTableStatus(table.id, 'occupied', activeSession);
    setOrderSent(true);
    setCart({});
    
    toast({
      type: 'success',
      title: 'Order Sent to Kitchen',
      description: 'Your order has been queued. Plating will begin shortly.'
    });
  };

  const cartTotal = Object.keys(cart).reduce((acc, id) => {
    const item = items.find(m => m.id === id);
    return acc + ((item?.price || 0) * cart[id]);
  }, 0);

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-24 space-y-6 min-h-screen relative">
      {/* Shared Order Join Prompt Overlay */}
      {showJoinRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-bg-card border border-line rounded-lg p-6 shadow-2xl text-center space-y-4"
          >
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-ink">Rahul wants to join Table {table.number}</h3>
              <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                Another user scanned the same table QR and wants to contribute to this session.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleJoinDeny}
                className="flex-1 py-2 text-xs font-semibold text-ink-soft border border-line rounded-md hover:bg-bg-alt cursor-pointer"
              >
                Deny
              </button>
              <button
                onClick={handleJoinAccept}
                className="flex-1 py-2 text-xs font-semibold bg-primary text-bg rounded-md hover:bg-primary-hover cursor-pointer"
              >
                Accept Join
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-line">
        <Link href="/explore">
          <Button variant="ghost" size="sm" className="!p-1.5 rounded-full border border-line bg-bg">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-base font-serif font-bold text-ink leading-tight">
            {restaurant.name}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-ink-soft mt-1 font-medium">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span>Table {table.number} · {isAdmin ? 'You are Admin' : 'Shared Session'}</span>
          </div>
        </div>
      </div>

      {/* Plating visual items */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
          Visual Menu
        </h3>
        
        {items.map(item => (
          <Card key={item.id} className="overflow-hidden !p-0">
            {/* Dish header details */}
            <div className="p-4 flex justify-between items-start gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ink">{item.name}</span>
                  <Badge variant={item.isVeg ? 'success' : 'danger'}>
                    {item.isVeg ? 'Veg' : 'Non-Veg'}
                  </Badge>
                </div>
                <p className="text-xs text-ink-soft leading-normal">{item.description}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-primary font-medium bg-primary-soft/30 px-2 py-0.5 rounded w-fit mt-1">
                  <Info className="w-3 h-3" />
                  <span>Plating: {item.presentationNote}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-sm font-bold text-ink">₹{item.price}</span>
                {item.isAvailable ? (
                  <div className="mt-3">
                    {cart[item.id] ? (
                      <div className="flex items-center gap-2 border border-line rounded p-1 bg-bg text-xs">
                        <button onClick={() => removeFromCart(item.id)} className="w-5 h-5 font-bold cursor-pointer">-</button>
                        <span className="font-semibold">{cart[item.id]}</span>
                        <button onClick={() => addToCart(item.id)} className="w-5 h-5 font-bold cursor-pointer">+</button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => addToCart(item.id)}>
                        Add
                      </Button>
                    )}
                  </div>
                ) : (
                  <Badge variant="neutral" className="mt-3">Sold Out</Badge>
                )}
              </div>
            </div>

            {/* Dish Plating Image Placeholder */}
            <div className="bg-bg-alt/25 aspect-video w-full border-t border-line flex flex-col justify-center items-center text-center p-8">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
                <UtensilsIcon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-ink-soft max-w-[280px]">
                Plating reference: Served with cutlery and house dressings as shown in the plating guidelines.
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Cart Drawer Panel */}
      {Object.keys(cart).length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-bg-card border-t border-line shadow-2xl p-4 space-y-4 max-w-xl mx-auto rounded-t-xl">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-ink-soft uppercase tracking-wider">
              Shared Order Build ({Object.keys(cart).reduce((a, b) => a + cart[b], 0)} items)
            </span>
            <span className="text-base font-bold text-primary">₹{cartTotal}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Your Name"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className="text-xs"
            />
            <input
              type="text"
              placeholder="Your Phone (Required)"
              value={customerPhone}
              onChange={e => setCustomerPhone(e.target.value)}
              className="text-xs"
              required
            />
          </div>

          <Button variant="primary" fullWidth className="py-3" onClick={handlePlaceOrder}>
            Send Order to Kitchen
          </Button>
        </div>
      )}

      {/* Order Sent confirmation state */}
      {orderSent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink/40 backdrop-blur-sm">
          <Card className="text-center max-w-sm space-y-4">
            <div className="w-12 h-12 bg-success-bg text-success rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-ink">Order In Preparation</h3>
              <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                Table {table.number}'s order has been synced. The kitchen is preparing your dishes. Enjoy your dining experience!
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <Button variant="outline" size="sm" onClick={() => setOrderSent(false)}>
                Order More
              </Button>
              <Link href="/explore">
                <Button variant="primary" size="sm">
                  Back to Discovery
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

const UtensilsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z" />
    <path d="M19 15v7" />
  </svg>
);
