'use client';

import React, { useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { ShoppingBag, Bell, Check, X, Clock, HelpCircle } from 'lucide-react';

export default function ManagerOrdersPage() {
  const { user } = useAuth();
  const { orders, updateOrderStatus, addOrder } = useApp();
  const { toast } = useToast();

  const tenantOrders = orders.filter(o => o.restaurantId === user?.restaurantId);
  const onlineOrders = tenantOrders.filter(o => o.type === 'online');

  const getStatusBadge = (status: string) => {
    if (status === 'pending') return 'warning';
    if (status === 'preparing') return 'info';
    if (status === 'ready') return 'success';
    return 'neutral';
  };

  const handleAccept = (orderId: string) => {
    updateOrderStatus(orderId, 'preparing');
    toast({
      type: 'success',
      title: 'Order Accepted',
      description: `Order #${orderId.replace('o', '')} has been sent to kitchen printer.`
    });
  };

  const handleDeny = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled');
    toast({
      type: 'warning',
      title: 'Order Cancelled',
      description: `Order #${orderId.replace('o', '')} has been rejected and refunded.`
    });
  };

  // Simulate receiving a new online order alert (FR-B.3.2 notification toast)
  const triggerIncomingOrderSim = () => {
    const newOrderId = `o${Math.floor(1043 + Math.random() * 100)}`;
    const newOrder = {
      id: newOrderId,
      restaurantId: user?.restaurantId || 'r1',
      type: 'online' as const,
      items: [{ menuItemId: 'm1', quantity: 2, name: 'Volcano paneer tikka', price: 270 }],
      total: 540,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      customerName: 'Rohit Sharma',
      customerPhone: '+91-9877766655',
      deliveryAddress: 'Flat 405, Hill View, Bandra West'
    };

    // Show app-wide notification toast with Accept and Deny actions (FR-B.3.3)
    toast({
      type: 'order',
      title: 'New Online Order · ₹540',
      description: 'Order #1043 · 2x Volcano paneer tikka',
      duration: 8000,
      actions: [
        {
          label: 'Accept',
          primary: true,
          onClick: () => {
            addOrder(newOrder);
            updateOrderStatus(newOrderId, 'preparing');
            toast({
              type: 'success',
              title: 'Order Accepted',
              description: `Incoming Order #${newOrderId.replace('o', '')} is now preparing.`
            });
          }
        },
        {
          label: 'Deny',
          onClick: () => {
            toast({
              type: 'warning',
              title: 'Order Denied',
              description: `Incoming Order #${newOrderId.replace('o', '')} was rejected.`
            });
          }
        }
      ]
    });
  };

  // Auto trigger simulation after 4 seconds on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerIncomingOrderSim();
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-serif font-bold text-ink">Online orders</h1>
          <p className="text-xs text-ink-soft font-medium mt-0.5">Live feed of incoming delivery and website orders.</p>
        </div>
        
        {/* Simulate incoming order button */}
        <Button variant="outline" size="sm" onClick={triggerIncomingOrderSim} className="flex gap-2 items-center bg-bg-alt border-line">
          <Bell className="w-4 h-4 text-primary animate-pulse" />
          <span>Simulate Incoming Order</span>
        </Button>
      </div>

      <div className="space-y-4">
        {onlineOrders.map(order => (
          <Card key={order.id} className="!p-4 space-y-4">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-line pb-3">
              <div className="flex items-center gap-3">
                <div className="bg-primary-soft text-primary p-2 rounded-lg">
                  <ShoppingBag className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-ink leading-none">
                    Order #{order.id.replace('o', '')}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-ink-soft mt-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Badge variant={getStatusBadge(order.status)}>
                  {order.status === 'pending' ? 'Pending Accept' : (order.status === 'preparing' ? 'In Kitchen' : order.status)}
                </Badge>
                <span className="text-sm font-bold text-primary">₹{order.total}</span>
              </div>
            </div>

            {/* Order detail lists */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">Items</span>
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="font-semibold text-ink">
                    {item.name} × {item.quantity}
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">Customer details</span>
                <p className="font-semibold text-ink leading-tight">{order.customerName}</p>
                <p className="text-ink-soft mt-0.5">{order.customerPhone}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">Delivery address</span>
                <p className="text-ink-soft leading-normal">{order.deliveryAddress}</p>
              </div>
            </div>

            {/* Actions for Pending order */}
            {order.status === 'pending' && (
              <div className="flex gap-3 justify-end pt-2 border-t border-line">
                <Button variant="outline" size="sm" className="flex gap-1.5 items-center text-danger border-danger/25 hover:bg-danger-bg/25" onClick={() => handleDeny(order.id)}>
                  <X className="w-4 h-4" />
                  <span>Deny</span>
                </Button>
                <Button variant="primary" size="sm" className="flex gap-1.5 items-center" onClick={() => handleAccept(order.id)}>
                  <Check className="w-4 h-4" />
                  <span>Accept Order</span>
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
