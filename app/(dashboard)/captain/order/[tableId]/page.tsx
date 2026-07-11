'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { ArrowLeft, Send, Receipt, Undo2, Plus, Minus, Info } from 'lucide-react';
import Link from 'next/link';

import { useScopedAccess } from '@/lib/hooks/useScopedAccess';

export default function CaptainTakeOrderPage() {
  const params = useParams();
  const router = useRouter();
  const tableId = params.tableId as string;
  
  const { user } = useAuth();
  const { tables, menuItems, updateTableStatus } = useApp();
  const { toast } = useToast();
  const { checkTableAccess } = useScopedAccess();

  const { isAuthorized, table } = checkTableAccess(tableId);
  const items = menuItems.filter(m => m.restaurantId === user?.restaurantId);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [preparationNote, setPreparationNote] = useState('');
  const [cart, setCart] = useState<{ [itemId: string]: number }>({});

  useEffect(() => {
    if (table && !isAuthorized) {
      toast({
        type: 'error',
        title: 'Access Denied',
        description: 'You are not authorized to view or manage this table.'
      });
      router.replace('/captain');
    }
  }, [isAuthorized, table, router, toast]);

  useEffect(() => {
    if (table && table.activeSession) {
      const session = table.activeSession;
      setCustomerName(session.customerName || '');
      setCustomerPhone(session.customerPhone || '');
      setPreparationNote(session.preparationNote || '');
      
      // Load current session items into cart
      const currentCart: { [itemId: string]: number } = {};
      session.items.forEach((item: any) => {
        currentCart[item.menuItemId] = item.quantity;
      });
      setCart(currentCart);
    }
  }, [table]);

  if (!table || !isAuthorized) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 text-center">
        <h3 className="text-sm font-serif font-bold text-ink">Access Denied / Table Not Found</h3>
        <Link href="/captain">
          <Button variant="primary" className="mt-4">Back to Grid</Button>
        </Link>
      </div>
    );
  }

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

  const handleSendOrder = () => {
    const orderItems = Object.keys(cart).map(id => {
      const menuItem = items.find(m => m.id === id);
      return {
        menuItemId: id,
        quantity: cart[id],
        name: menuItem?.name || '',
        price: menuItem?.price || 0
      };
    });

    if (orderItems.length === 0) {
      toast({
        type: 'error',
        title: 'Empty Order',
        description: 'Please add at least one item before sending.'
      });
      return;
    }

    const total = orderItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

    const activeSession = {
      customerName: customerName || 'Walk-in Guest',
      customerPhone: customerPhone || '',
      startedBy: user?.id || 'u4',
      startedAt: table.activeSession?.startedAt || new Date().toISOString(),
      items: orderItems,
      total,
      preparationNote
    };

    updateTableStatus(table.id, 'occupied', activeSession);
    
    toast({
      type: 'success',
      title: 'Order Synced',
      description: `Table ${table.number} order has been updated and sent to kitchen.`
    });
    router.push('/captain');
  };

  const cartTotal = Object.keys(cart).reduce((acc, id) => {
    const menuItem = items.find(m => m.id === id);
    return acc + ((menuItem?.price || 0) * cart[id]);
  }, 0);

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-line">
        <div className="flex items-center gap-3">
          <Link href="/captain">
            <Button variant="ghost" size="sm" className="!p-1.5 rounded-full border border-line bg-bg">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-base font-serif font-bold text-ink leading-tight">
              Table {table.number} · Take Order
            </h2>
            <p className="text-[10px] text-ink-soft mt-0.5 font-medium">Capacity: {table.capacity} guests</p>
          </div>
        </div>
        <Badge variant={table.status === 'available' ? 'success' : (table.status === 'occupied' ? 'danger' : 'warning')}>
          {table.status}
        </Badge>
      </div>

      {/* Guest Details (Optional for Captain) */}
      <Card className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">Guest Details (Optional)</h3>
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Guest Name"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            className="text-xs"
          />
          <Input
            placeholder="Mobile Number"
            value={customerPhone}
            onChange={e => setCustomerPhone(e.target.value)}
            className="text-xs"
          />
        </div>
        <Input
          placeholder="Preparation Note (e.g. no onions, extra spicy...)"
          value={preparationNote}
          onChange={e => setPreparationNote(e.target.value)}
          className="text-xs"
        />
      </Card>

      {/* Menu List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">Dishes Menu</h3>
        
        {items.map(item => (
          <Card key={item.id} className="!p-3.5 flex justify-between items-center">
            <div className="space-y-1 pr-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-ink">{item.name}</span>
                <Badge variant={item.isVeg ? 'success' : 'danger'}>
                  {item.isVeg ? 'Veg' : 'N-Veg'}
                </Badge>
              </div>
              <span className="text-[10px] text-ink-soft block">₹{item.price} · Plating: {item.presentationNote}</span>
            </div>
            
            <div className="flex-shrink-0">
              {cart[item.id] ? (
                <div className="flex items-center gap-2.5 border border-line rounded p-1.5 bg-bg text-xs">
                  <button onClick={() => removeFromCart(item.id)} className="w-5 h-5 font-bold cursor-pointer"><Minus className="w-3.5 h-3.5" /></button>
                  <span className="font-semibold">{cart[item.id]}</span>
                  <button onClick={() => addToCart(item.id)} className="w-5 h-5 font-bold cursor-pointer"><Plus className="w-3.5 h-3.5" /></button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => addToCart(item.id)} className="px-3">
                  Add
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-bg-card border-t border-line shadow-2xl p-4 max-w-xl mx-auto rounded-t-xl flex gap-3">
        <Link href="/captain" className="flex-1">
          <Button variant="outline" fullWidth className="py-2.5 flex items-center justify-center gap-2">
            <Undo2 className="w-4 h-4" />
            <span>Grid</span>
          </Button>
        </Link>
        
        <Button variant="primary" className="flex-2 py-2.5 flex items-center justify-center gap-2" onClick={handleSendOrder}>
          <Send className="w-4 h-4" />
          <span>Send Kitchen ({Object.keys(cart).reduce((a, b) => a + cart[b], 0)})</span>
        </Button>

        {table.status !== 'available' && (
          <Link href={`/captain/settlement/${table.id}`} className="flex-1">
            <Button variant="secondary" fullWidth className="py-2.5 flex items-center justify-center gap-2 !bg-amber-accent border-amber-accent">
              <Receipt className="w-4 h-4" />
              <span>Settle</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
