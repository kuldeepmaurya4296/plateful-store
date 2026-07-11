'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Search, Sparkles, MessageSquare, Heart, Clock } from 'lucide-react';

export default function ManagerCustomersPage() {
  const { user } = useAuth();
  const { visits, reviews, users, restaurants } = useApp();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterVipOnly, setFilterVipOnly] = useState(false);

  // Filter users who have interacted with this restaurant (dined, left review, or followed)
  // In demo, we list customers u1 (Riya) and u_rahul (Rahul) who have visited Spice Route r1
  const tenantVisits = visits.filter(v => v.restaurantId === user?.restaurantId);
  const tenantReviews = reviews.filter(r => r.restaurantId === user?.restaurantId);

  // Group visits by userId to count dining frequency
  const visitCounts = tenantVisits.reduce((acc: { [key: string]: number }, curr) => {
    acc[curr.userId] = (acc[curr.userId] || 0) + 1;
    return acc;
  }, {});

  const localCustomers = users.filter(u => u.role === 'customer' && (visitCounts[u.id] > 0 || tenantReviews.some(r => r.userId === u.id)));

  const customerList = localCustomers.map(cust => {
    const totalVisits = visitCounts[cust.id] || 0;
    const isVip = totalVisits >= 2; // threshold for demo is 2 visits
    const userReviews = tenantReviews.filter(r => r.userId === cust.id);
    const avgRating = userReviews.length > 0 
      ? parseFloat((userReviews.reduce((sum, r) => sum + r.foodRating, 0) / userReviews.length).toFixed(1))
      : null;

    return {
      ...cust,
      totalVisits,
      isVip,
      reviewsCount: userReviews.length,
      avgRating
    };
  });

  const filteredCustomers = customerList.filter(cust => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      cust.name.toLowerCase().includes(searchLower) ||
      cust.username.toLowerCase().includes(searchLower) ||
      (cust.phone || '').includes(searchTerm);

    if (filterVipOnly) {
      return matchesSearch && cust.isVip;
    }
    return matchesSearch;
  });

  const handleSendPromo = (name: string) => {
    toast({
      type: 'success',
      title: 'Promotional Story Dispatched',
      description: `Dispatched private gourmet story showcase to ${name}'s explore feed.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-ink">Restaurant Customer Directory</h1>
        <p className="text-xs text-ink-soft mt-0.5 font-medium">Analyze guest dining frequency, feedback averages, and dispatch target stories to VIP tables.</p>
      </div>

      {/* Filter and stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-3 items-center flex-1 max-w-md">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, phone, handle..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 border border-line rounded-lg text-ink"
            />
          </div>
          <button
            onClick={() => setFilterVipOnly(!filterVipOnly)}
            className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              filterVipOnly 
                ? 'bg-primary text-bg border-primary' 
                : 'bg-bg-card border-line text-ink hover:bg-bg-alt'
            }`}
          >
            VIP Guests Only
          </button>
        </div>
      </div>

      {/* Grid of Customers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCustomers.map(cust => (
          <Card key={cust.id} className="p-5 flex flex-col justify-between gap-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-secondary-soft text-secondary font-bold text-sm flex items-center justify-center border border-secondary/15">
                  {cust.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-serif font-bold text-base text-ink">{cust.name}</h4>
                    {cust.isVip && (
                      <Badge variant="primary" className="text-[9px] uppercase tracking-wider font-bold">VIP Guest</Badge>
                    )}
                  </div>
                  <p className="text-[10px] text-ink-soft mt-0.5">@{cust.username} · {cust.phone || 'No phone registered'}</p>
                </div>
              </div>

              {cust.avgRating && (
                <div className="flex items-center gap-1 text-xs font-bold text-amber-accent">
                  <span>★</span>
                  <span>{cust.avgRating} Feedback</span>
                </div>
              )}
            </div>

            {/* Visit stats summary */}
            <div className="grid grid-cols-3 gap-2 bg-bg p-3 rounded-lg border border-line text-center text-xs">
              <div>
                <span className="text-[10px] text-ink-soft block mb-0.5">Total Visits</span>
                <span className="font-bold text-ink flex justify-center items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  {cust.totalVisits} Times
                </span>
              </div>
              <div>
                <span className="text-[10px] text-ink-soft block mb-0.5">Reviews Given</span>
                <span className="font-bold text-ink flex justify-center items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-primary" />
                  {cust.reviewsCount}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-ink-soft block mb-0.5">Diet Style</span>
                <span className="font-bold text-ink capitalize">
                  {cust.preferences?.dietFilter || 'Veg'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                fullWidth
                size="sm"
                className="text-xs bg-bg border-line hover:bg-bg-alt flex gap-1 items-center justify-center"
                onClick={() => alert(`Showing history for ${cust.name}: Dined on 2026-07-11, 2026-07-10.`)}
              >
                <span>Visit History</span>
              </Button>
              <Button
                variant="primary"
                fullWidth
                size="sm"
                className="text-xs flex gap-1 items-center justify-center"
                onClick={() => handleSendPromo(cust.name)}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Send Promo Story</span>
              </Button>
            </div>
          </Card>
        ))}
        {filteredCustomers.length === 0 && (
          <div className="col-span-2 text-center py-12 text-ink-soft italic">
            No customers found matching the filter search.
          </div>
        )}
      </div>
    </div>
  );
}
