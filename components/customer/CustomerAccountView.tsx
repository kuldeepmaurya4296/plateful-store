'use client';

import React, { useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useApp } from '@/lib/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { StarRating } from '@/components/ui/StarRating';
import { ReviewForm } from '@/features/review/components/ReviewForm';
import { 
  Heart, 
  MapPin, 
  LogOut, 
  Clock, 
  Edit2, 
  Utensils 
} from 'lucide-react';

export const CustomerAccountView: React.FC = () => {
  const { user, logout } = useAuth();
  const { 
    visits, 
    restaurants, 
    reviews, 
    bookings, 
    bills, 
    posts, 
    updateUserProfile 
  } = useApp();

  const [activeReviewVisit, setActiveReviewVisit] = useState<any | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<'posts' | 'reviews' | 'visits' | 'wishlist'>('posts');
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || 'Gourmet enthusiast and plating reviewer.');
  const [editCity, setEditCity] = useState(user?.preferences?.city || 'Mumbai');
  const [editDiet, setEditDiet] = useState<'veg' | 'non-veg' | 'both'>(user?.preferences?.dietFilter || 'both');

  const userReviews = reviews.filter(r => r.userId === user?.id || r.userId === 'u1');
  const userBookings = bookings.filter(b => b.userId === user?.id || b.userId === 'u1');
  const userBills = bills.filter(b => b.customerPhone === user?.phone || b.customerName === user?.name);
  const userPosts = posts.filter(p => p.authorId === user?.id || p.authorId === 'u1');
  const userWishlist = restaurants.filter(r => user?.wishlist?.includes(r.id) || r.id === 'r1' || r.id === 'r2');

  const activeUnreviewedVisit = visits.find(v => {
    if (v.isReviewed) return false;
    const closesAt = new Date(v.reviewWindowClosesAt);
    return closesAt > new Date();
  });

  const getRestaurantName = (id: string) => {
    return restaurants.find(r => r.id === id)?.name || 'Spice Route';
  };

  const handleEditProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    updateUserProfile(user.id, {
      name: editName,
      bio: editBio,
      preferences: {
        city: editCity,
        dietFilter: editDiet
      }
    });

    setShowEditModal(false);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-20 space-y-6">
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
          <div className="flex items-center gap-1.5">
            <h2 className="text-lg font-serif font-bold text-ink leading-tight">
              {user?.name || 'Riya Kapoor'}
            </h2>
            <button 
              onClick={() => {
                setEditName(user?.name || '');
                setEditBio(user?.bio || 'Gourmet enthusiast and plating reviewer.');
                setEditCity(user?.preferences?.city || 'Mumbai');
                setEditDiet(user?.preferences?.dietFilter || 'both');
                setShowEditModal(true);
              }}
              className="text-ink-soft hover:text-primary transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-ink-soft font-mono">@{user?.username || 'riya.eats'}</p>
          <p className="text-xs text-ink-soft mt-1 leading-normal italic">
            "{user?.bio || 'Gourmet enthusiast and plating reviewer.'}"
          </p>
          <div className="flex items-center gap-1 text-[10px] text-primary font-bold mt-1.5 uppercase tracking-wider">
            <MapPin className="w-3 h-3" />
            <span>{user?.preferences?.city || 'Mumbai'} · diet: {user?.preferences?.dietFilter || 'both'}</span>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-4 gap-2 text-center bg-bg-card border border-line rounded-lg p-3">
        <div>
          <p className="text-sm font-bold text-ink">{userPosts.length}</p>
          <p className="text-[10px] text-ink-soft font-medium uppercase tracking-wider mt-0.5">Posts</p>
        </div>
        <div>
          <p className="text-sm font-bold text-ink">{userReviews.length}</p>
          <p className="text-[10px] text-ink-soft font-medium uppercase tracking-wider mt-0.5">Reviews</p>
        </div>
        <div>
          <p className="text-sm font-bold text-ink">{userBookings.length}</p>
          <p className="text-[10px] text-ink-soft font-medium uppercase tracking-wider mt-0.5">Bookings</p>
        </div>
        <div>
          <p className="text-sm font-bold text-primary">150 pts</p>
          <p className="text-[10px] text-ink-soft font-medium uppercase tracking-wider mt-0.5">Loyalty</p>
        </div>
      </div>

      {/* Loyalty & Rewards Card */}
      <Card className="bg-gradient-to-r from-amber-accent/20 to-primary/10 border-primary/20 p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Plateful Rewards · Silver Tier</span>
            <h3 className="text-base font-serif font-bold text-ink">150 Loyalty Points</h3>
          </div>
          <Button variant="primary" size="sm" onClick={() => alert('Redeemed 50 pts for ₹50 dining discount voucher!')}>
            Redeem 50 pts
          </Button>
        </div>
        <p className="text-xs text-ink-soft leading-relaxed">
          Earn 10 points on every verified visit review and dining booking!
        </p>
      </Card>

      {/* Refer-a-Friend Card */}
      <Card className="p-4 space-y-2 border-line">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">Refer a Friend</h4>
            <p className="text-xs text-ink-soft mt-0.5">Share code <span className="font-mono font-bold text-primary">PLATEFUL-RIYA50</span> for ₹100 dining credit.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => alert('Referral link copied to clipboard!')}>
            Copy Code
          </Button>
        </div>
      </Card>

      {/* Profile Sections tabs */}
      <div className="flex border-b border-line gap-2">
        {[
          { id: 'posts', name: 'My Posts' },
          { id: 'reviews', name: 'My Reviews' },
          { id: 'visits', name: 'Visits' },
          { id: 'wishlist', name: 'Wishlist' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveProfileTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeProfileTab === tab.id 
                ? 'border-primary text-primary font-bold' 
                : 'border-transparent text-ink-soft hover:text-ink'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Profile Section Content */}
      <div className="space-y-4">
        {activeProfileTab === 'posts' && (
          <div className="grid grid-cols-2 gap-4">
            {userPosts.map(post => (
              <Card key={post.id} className="p-3 space-y-2 border-line/60">
                {post.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={post.photoUrl} 
                    alt="plating upload" 
                    className="w-full h-28 object-cover rounded-lg border border-line" 
                  />
                ) : (
                  <div className="w-full h-28 bg-gradient-to-tr from-primary/15 to-amber-accent/15 rounded-lg flex items-center justify-center border border-line">
                    <Utensils className="w-6 h-6 text-primary/30" />
                  </div>
                )}
                <p className="text-[10px] text-ink leading-tight font-medium line-clamp-2">
                  {post.caption}
                </p>
                <span className="text-[8px] text-ink-soft font-mono">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </Card>
            ))}
            {userPosts.length === 0 && (
              <div className="col-span-2 text-center py-8 text-xs text-ink-soft italic">
                You haven't shared any community posts yet.
              </div>
            )}
          </div>
        )}

        {activeProfileTab === 'reviews' && (
          <div className="space-y-3">
            {userReviews.map(r => (
              <Card key={r.id} className="!p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-ink">{getRestaurantName(r.restaurantId)}</span>
                  <span className="text-[10px] text-ink-soft font-medium">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
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
                {r.ownerResponse && (
                  <div className="bg-primary-soft/10 border-l-2 border-primary p-2.5 rounded text-[10px] italic">
                    <span className="font-bold text-primary block">Owner reply:</span>
                    "{r.ownerResponse}"
                  </div>
                )}
              </Card>
            ))}
            {userReviews.length === 0 && (
              <div className="text-center py-8 text-xs text-ink-soft italic">
                You haven't left any restaurant reviews yet.
              </div>
            )}
          </div>
        )}

        {activeProfileTab === 'visits' && (
          <div className="space-y-3">
            {userBills.map(bill => (
              <Card key={bill.id} className="!p-3.5 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-ink">Spice Route, Table {bill.tableNumber}</span>
                  <p className="text-[10px] text-ink-soft">
                    {new Date(bill.createdAt).toLocaleDateString()} · Paid via {bill.paymentMode}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary">₹{bill.grandTotal}</span>
                  <Button variant="outline" size="sm" onClick={() => alert('Order items reloaded into cart!')}>
                    Reorder
                  </Button>
                </div>
              </Card>
            ))}
            {userBills.length === 0 && (
              <div className="text-center py-8 text-xs text-ink-soft italic">
                No past restaurant visits recorded.
              </div>
            )}
          </div>
        )}

        {activeProfileTab === 'wishlist' && (
          <div className="grid grid-cols-2 gap-3">
            {userWishlist.map(r => (
              <Card key={r.id} className="!p-3 flex items-center justify-between hover:border-primary/30 cursor-pointer">
                <div>
                  <span className="text-xs font-semibold block text-ink">{r.name}</span>
                  <span className="text-[9px] text-ink-soft">{r.cuisine} · {r.city}</span>
                </div>
                <Heart className="w-3.5 h-3.5 fill-primary text-primary" />
              </Card>
            ))}
          </div>
        )}

        {/* Sign Out */}
        <div className="pt-4">
          <Button
            variant="outline"
            fullWidth
            onClick={logout}
            className="flex items-center gap-2 justify-center py-2.5 text-danger border-danger/20 hover:bg-danger-bg/25 hover:border-danger/30 text-xs font-bold"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Sign Out from Account</span>
          </Button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Plateful Profile"
      >
        <form onSubmit={handleEditProfileSubmit} className="space-y-4">
          <Input
            label="Name"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Bio</label>
            <textarea
              value={editBio}
              onChange={e => setEditBio(e.target.value)}
              className="text-xs border border-line rounded p-2.5 bg-bg-card text-ink min-h-[60px]"
              maxLength={150}
              required
            />
          </div>
          <Input
            label="City Location"
            value={editCity}
            onChange={e => setEditCity(e.target.value)}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Dietary Filter</label>
            <select
              value={editDiet}
              onChange={e => setEditDiet(e.target.value as any)}
              className="text-xs border border-line rounded p-2 bg-bg-card text-ink"
            >
              <option value="both">Both (Veg & Non-Veg)</option>
              <option value="veg">Veg Only</option>
              <option value="non-veg">Non-Veg Only</option>
            </select>
          </div>
          <Button type="submit" variant="primary" fullWidth className="py-2.5">
            Save Changes
          </Button>
        </form>
      </Modal>

      {/* Review Modal */}
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
};
