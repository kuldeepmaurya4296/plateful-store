'use client';

import React, { useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useApp } from '@/lib/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { StarRating } from '@/components/ui/StarRating';
import { ReviewForm } from '@/features/review/components/ReviewForm';
import { 
  Heart, 
  MapPin, 
  Settings, 
  ArrowRight, 
  LogOut, 
  Clock, 
  MessageSquare,
  BookOpen,
  CalendarCheck
} from 'lucide-react';
import Link from 'next/link';

export default function CustomerAccountPage() {
  const { user, logout } = useAuth();
  const { visits, restaurants, reviews, bookings, bills } = useApp();

  const [activeReviewVisit, setActiveReviewVisit] = useState<any | null>(null);

  // Filter user specific data
  const userReviews = reviews.filter(r => r.userId === user?.id || r.userId === 'u1');
  const userBookings = bookings.filter(b => b.userId === user?.id || b.userId === 'u1');
  const userBills = bills.filter(b => b.customerPhone === user?.phone || b.customerName === user?.name);

  // Check for active unreviewed visits with open windows
  const activeUnreviewedVisit = visits.find(v => {
    if (v.isReviewed) return false;
    const closesAt = new Date(v.reviewWindowClosesAt);
    return closesAt > new Date(); // still active
  });

  const getRestaurantName = (id: string) => {
    return restaurants.find(r => r.id === id)?.name || 'Spice Route';
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-20 space-y-6">
      {/* Active unreviewed visit alert box (A.7 Review prompt) */}
      {activeUnreviewedVisit && (
        <Card className="bg-primary-soft/40 border-primary/20 p-4 space-y-3">
          <div className="flex gap-2 items-start">
            <Clock className="w-5 h-5 text-primary mt-0.5 animate-pulse" />
            <div>
              <h4 className="text-sm font-semibold text-primary">Pending Visit Review</h4>
              <p className="text-xs text-ink-soft mt-0.5 leading-normal">
                You have an active review window for your recent visit to {getRestaurantName(activeUnreviewedVisit.restaurantId)}.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => setActiveReviewVisit(activeUnreviewedVisit)}
          >
            Review Plating & Food Taste
          </Button>
        </Card>
      )}

      {/* Profile summary */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary-soft text-primary font-bold text-xl flex items-center justify-center border border-primary/20">
          {user?.avatar || 'RK'}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-serif font-bold text-ink leading-tight">
            {user?.name || 'Riya Kapoor'}
          </h2>
          <p className="text-xs text-ink-soft mt-0.5 font-medium">@{user?.username || 'riya.eats'}</p>
        </div>
        <Button variant="ghost" size="sm" className="!p-2 border border-line bg-bg hover:bg-bg-alt rounded-lg">
          <Settings className="w-4.5 h-4.5 text-ink-soft" />
        </Button>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-3 gap-3 text-center bg-bg-card border border-line rounded-lg p-3">
        <div>
          <p className="text-sm font-bold text-ink">42</p>
          <p className="text-[10px] text-ink-soft font-medium uppercase tracking-wider mt-0.5">Posts</p>
        </div>
        <div>
          <p className="text-sm font-bold text-ink">{userReviews.length}</p>
          <p className="text-[10px] text-ink-soft font-medium uppercase tracking-wider mt-0.5">Reviews</p>
        </div>
        <div>
          <p className="text-sm font-bold text-ink">230</p>
          <p className="text-[10px] text-ink-soft font-medium uppercase tracking-wider mt-0.5">Followers</p>
        </div>
      </div>

      {/* Tabs / lists sections */}
      <div className="space-y-4">
        {/* Bookings */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
              My Dine-in Bookings
            </h3>
            <span className="text-[10px] font-semibold text-primary hover:underline cursor-pointer">View all</span>
          </div>
          <div className="space-y-2">
            {userBookings.map(b => (
              <Card key={b.id} className="!p-3.5 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-ink">{b.restaurantName}</span>
                  <div className="flex items-center gap-2 text-[10px] text-ink-soft">
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>{b.date} · {b.timeSlot} · {b.partySize} guests</span>
                  </div>
                </div>
                <Badge variant={b.status === 'confirmed' ? 'success' : 'warning'}>
                  {b.status}
                </Badge>
              </Card>
            ))}
          </div>
        </div>

        {/* Visited / Past bills */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
            Past Visited Outlets
          </h3>
          <div className="space-y-2">
            {userBills.length > 0 ? (
              userBills.map(bill => (
                <Card key={bill.id} className="!p-3.5 flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-ink">Spice Route, Table {bill.tableNumber}</span>
                    <p className="text-[10px] text-ink-soft">
                      {new Date(bill.createdAt).toLocaleDateString()} · Paid via {bill.paymentMode}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-primary">₹{bill.grandTotal}</span>
                </Card>
              ))
            ) : (
              <Card className="text-center py-4 bg-bg-alt/10">
                <span className="text-xs text-ink-soft">No past visits recorded</span>
              </Card>
            )}
          </div>
        </div>

        {/* Reviews list */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
            My Reviews ({userReviews.length})
          </h3>
          <div className="space-y-3">
            {userReviews.map(r => (
              <Card key={r.id} className="!p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-ink">{getRestaurantName(r.restaurantId)}</span>
                  <span className="text-[10px] text-ink-soft">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                {/* Independent ratings */}
                <div className="grid grid-cols-3 gap-2 bg-bg/50 p-2 rounded text-[10px]">
                  <div className="flex flex-col items-center">
                    <span className="text-ink-soft">Food</span>
                    <StarRating rating={r.foodRating} size="sm" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-ink-soft">Plating</span>
                    <StarRating rating={r.presentationRating} size="sm" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-ink-soft">Ambiance</span>
                    <StarRating rating={r.ambianceRating} size="sm" />
                  </div>
                </div>
                {r.text && <p className="text-xs text-ink-soft italic leading-relaxed">"{r.text}"</p>}
              </Card>
            ))}
          </div>
        </div>

        {/* Wishlist outlet links */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
            Wishlisted Outlets
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {restaurants.slice(0, 2).map(r => (
              <Card key={r.id} className="!p-3 flex items-center justify-between hover:border-primary/30 cursor-pointer">
                <div>
                  <span className="text-xs font-semibold block text-ink">{r.name}</span>
                  <span className="text-[9px] text-ink-soft">{r.cuisine} · {r.city}</span>
                </div>
                <Heart className="w-3.5 h-3.5 fill-primary text-primary" />
              </Card>
            ))}
          </div>
        </div>

        {/* Log out */}
        <div className="pt-4">
          <Button
            variant="outline"
            fullWidth
            onClick={logout}
            className="flex items-center gap-2 justify-center py-2.5 text-danger border-danger/20 hover:bg-danger-bg/25 hover:border-danger/30"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Sign Out from Account</span>
          </Button>
        </div>
      </div>

      {/* Review Modal portal */}
      <Modal
        isOpen={activeReviewVisit !== null}
        onClose={() => setActiveReviewVisit(null)}
        title="Verified Dine-in Review"
      >
        {activeReviewVisit && (
          <ReviewForm
            visit={activeReviewVisit}
            onSuccess={() => setActiveReviewVisit(null)}
          />
        )}
      </Modal>
    </div>
  );
}
