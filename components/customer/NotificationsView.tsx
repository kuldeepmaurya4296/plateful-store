'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Check, CalendarCheck, ShoppingBag, Info, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const { toast } = useToast();
  const [filterType, setFilterType] = useState<'all' | 'booking' | 'order' | 'system'>('all');

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'all') return true;
    if (filterType === 'booking') return n.type.includes('booking');
    if (filterType === 'order') return n.type.includes('order');
    if (filterType === 'system') return n.type.includes('system') || n.type.includes('welcome');
    return true;
  });

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    toast({
      type: 'success',
      title: 'Inbox Cleared',
      description: 'All notifications marked as read.'
    });
  };

  const getIcon = (type: string) => {
    if (type.includes('booking')) return <CalendarCheck className="w-4.5 h-4.5 text-primary" />;
    if (type.includes('order')) return <ShoppingBag className="w-4.5 h-4.5 text-secondary" />;
    if (type.includes('spam') || type.includes('warn')) return <ShieldAlert className="w-4.5 h-4.5 text-danger" />;
    return <Info className="w-4.5 h-4.5 text-primary" />;
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-20 space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-serif font-bold text-ink">Notifications</h1>
          <p className="text-xs text-ink-soft font-medium mt-0.5">Stay updated with table bookings, kitchen statuses, and follow events.</p>
        </div>
        {notifications.some(n => !n.isRead) && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleMarkAllRead}
            className="flex gap-1 items-center bg-bg border-line text-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line gap-2">
        {[
          { id: 'all', name: 'All' },
          { id: 'booking', name: 'Bookings' },
          { id: 'order', name: 'Orders' },
          { id: 'system', name: 'System' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id as any)}
            className={`px-3 py-1.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              filterType === tab.id 
                ? 'border-primary text-primary font-bold' 
                : 'border-transparent text-ink-soft hover:text-ink'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredNotifications.map(n => (
          <Card 
            key={n.id} 
            className={`p-4 flex gap-4 items-start border-line/60 transition-all ${
              !n.isRead ? 'bg-primary-soft/10 border-l-2 border-l-primary' : 'bg-bg-card'
            }`}
            onClick={() => !n.isRead && markNotificationRead(n.id)}
          >
            <div className={`p-2.5 rounded-lg bg-bg-alt/50 shrink-0`}>
              {getIcon(n.type)}
            </div>
            
            <div className="flex-1 space-y-1 text-xs">
              <div className="flex justify-between items-start gap-3">
                <h4 className={`font-bold text-ink leading-tight ${!n.isRead ? 'text-primary' : ''}`}>
                  {n.title}
                </h4>
                <span className="text-[9px] text-ink-soft shrink-0">
                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-ink-soft leading-normal">{n.message}</p>
              {n.link && (
                <Link href={n.link} className="text-[10px] text-primary hover:underline font-bold block pt-1.5">
                  View Details &rarr;
                </Link>
              )}
            </div>
          </Card>
        ))}
        {filteredNotifications.length === 0 && (
          <div className="text-center py-12 text-ink-soft italic text-xs">
            No notifications in this filter group.
          </div>
        )}
      </div>
    </div>
  );
};
