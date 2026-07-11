'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Send, ArrowLeft, MessageSquare, ShieldAlert } from 'lucide-react';

export default function CustomerMessagesPage() {
  const { user } = useAuth();
  const { messages, restaurants, sendMessage } = useApp();
  const { toast } = useToast();

  const [activeRestaurantId, setActiveRestaurantId] = useState<string>('r1');
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const activeRestaurant = restaurants.find(r => r.id === activeRestaurantId);

  // Filter messages for current conversation
  const conversationMessages = messages.filter(
    m => m.restaurantId === activeRestaurantId && m.userId === (user?.id || 'u1')
  );

  // Auto scroll to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    const messageText = inputText.trim();
    sendMessage(activeRestaurantId, user.id, 'customer', messageText);
    setInputText('');

    // Simulate restaurant manager typing & auto-responding in 2 seconds
    setTimeout(() => {
      let reply = "Hello! Thanks for your inquiry. One of our managers will verify this details shortly.";
      if (messageText.toLowerCase().includes('booking') || messageText.toLowerCase().includes('table')) {
        reply = "Certainly! You can request a table booking using the 'Book' button on our profile page, which maps table details in real-time.";
      } else if (messageText.toLowerCase().includes('vegan') || messageText.toLowerCase().includes('diet')) {
        reply = "We offer a range of customizable options! Our chef can swap dairy for almond milk or gluten-free alternatives on request.";
      }

      sendMessage(activeRestaurantId, user.id, 'restaurant', reply);
      
      toast({
        type: 'info',
        title: `${activeRestaurant?.name || 'Restaurant'} Replied`,
        description: 'New message received in thread.'
      });
    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-20 h-[580px] flex flex-col justify-between">
      {/* Top Header Selector */}
      <div className="flex justify-between items-center border-b border-line pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center border border-primary/20">
            {activeRestaurant?.avatar || 'SR'}
          </div>
          <div>
            <h1 className="text-sm font-serif font-bold text-ink leading-tight">{activeRestaurant?.name} Chat</h1>
            <p className="text-[10px] text-success mt-0.5 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping" />
              Restaurant Online
            </p>
          </div>
        </div>

        {/* Quick change conversation for testing */}
        <select
          value={activeRestaurantId}
          onChange={e => setActiveRestaurantId(e.target.value)}
          className="text-[10px] font-bold border border-line rounded px-1.5 py-1 bg-bg text-ink"
        >
          {restaurants.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3.5 scrollbar-none">
        {conversationMessages.map(msg => {
          const isCustomer = msg.sender === 'customer';
          return (
            <div 
              key={msg.id} 
              className={`flex items-start gap-2.5 max-w-[85%] text-xs ${
                isCustomer ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div className={`w-7 h-7 rounded-full font-bold flex items-center justify-center border shrink-0 text-[10px] ${
                isCustomer 
                  ? 'bg-secondary-soft text-secondary border-secondary/15' 
                  : 'bg-primary-soft text-primary border-primary/15'
              }`}>
                {isCustomer ? (user?.avatar || 'RK') : (activeRestaurant?.avatar || 'SR')}
              </div>

              {/* Balloon */}
              <div className={`p-2.5 rounded-xl border leading-relaxed ${
                isCustomer 
                  ? 'bg-secondary-soft/20 border-secondary/20 text-ink rounded-tr-none' 
                  : 'bg-bg border-line text-ink-soft rounded-tl-none'
              }`}>
                <p>{msg.text}</p>
                <span className="text-[8px] text-ink-soft block text-right mt-1 font-medium">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        {conversationMessages.length === 0 && (
          <div className="h-full flex flex-col justify-center items-center py-20 text-center space-y-2">
            <MessageSquare className="w-10 h-10 text-ink-soft/40" />
            <h4 className="text-xs font-serif font-bold text-ink">Direct Chat Connection</h4>
            <p className="text-[10px] text-ink-soft max-w-xs leading-normal">Send a message below. Plateful maps connection directly to manager and owner portals in real-time.</p>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Reply input form */}
      <form onSubmit={handleSend} className="border-t border-line pt-3 flex gap-2">
        <input
          type="text"
          placeholder="Ask a question about the menu or booking..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          className="flex-grow text-xs border border-line bg-bg-card rounded-md px-3 py-2 text-ink"
          maxLength={200}
          required
        />
        <Button type="submit" variant="primary" size="sm" className="px-3">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
