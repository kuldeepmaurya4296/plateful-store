'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { MapPin, MessageSquare, Plus, Check, QrCode, Calendar, Sparkles, Send, Play } from 'lucide-react';
import { StoryViewerModal } from './StoryViewerModal';

export const RestaurantProfileView: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params?.id as string;
  const { user } = useAuth();
  const { 
    restaurants, 
    menuItems, 
    reviews, 
    posts, 
    stories,
    followRestaurant,
    unfollowRestaurant,
    addBookingRequest,
    sendMessage
  } = useApp();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'stories' | 'feed'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  const [bookDate, setBookDate] = useState('2026-07-12');
  const [bookTime, setBookTime] = useState('7:30 PM');
  const [bookSize, setBookSize] = useState('2');
  const [bookRequest, setBookRequest] = useState('');

  const [dmText, setDmText] = useState('');

  const restaurant = restaurants.find(r => r.id === restaurantId);

  if (!restaurant) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 text-center">
        <h3 className="text-sm font-serif font-bold text-ink">Restaurant Not Found</h3>
        <Button variant="primary" className="mt-4" onClick={() => router.push('/customer')}>
          Back to Feed
        </Button>
      </div>
    );
  }

  const isFollowing = user?.followedRestaurants?.includes(restaurant.id);

  const handleFollowToggle = () => {
    if (!user) return;
    if (isFollowing) {
      unfollowRestaurant(user.id, restaurant.id);
      toast({
        type: 'info',
        title: 'Unfollowed',
        description: `You unfollowed ${restaurant.name}.`
      });
    } else {
      followRestaurant(user.id, restaurant.id);
      toast({
        type: 'success',
        title: 'Following',
        description: `You are now following ${restaurant.name} for story updates!`
      });
    }
  };

  const restaurantMenu = menuItems.filter(m => m.restaurantId === restaurant.id);
  const restaurantReviews = reviews.filter(r => r.restaurantId === restaurant.id);
  const restaurantPosts = posts.filter(p => p.restaurantId === restaurant.id);
  const restaurantStories = stories.filter(s => s.restaurantId === restaurant.id);

  const categories = ['All', ...Array.from(new Set(restaurantMenu.map(m => m.category)))];
  const filteredMenu = selectedCategory === 'All'
    ? restaurantMenu
    : restaurantMenu.filter(m => m.category === selectedCategory);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBooking = {
      id: `b_dyn_${Date.now()}`,
      userId: user?.id || 'u1',
      userName: user?.name || 'Riya Kapoor',
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      date: bookDate,
      timeSlot: bookTime,
      partySize: parseInt(bookSize),
      specialRequest: bookRequest,
      status: 'pending' as const,
      advancePaid: 100,
      createdAt: new Date().toISOString()
    };

    addBookingRequest(newBooking);
    setIsBookModalOpen(false);
    toast({
      type: 'success',
      title: 'Booking Request Sent',
      description: `Your reservation for ${bookSize} guests on ${bookDate} is pending confirmation.`
    });
  };

  const handleSendDM = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dmText.trim() || !user) return;

    sendMessage(restaurant.id, user.id, 'customer', dmText);
    setDmText('');
    setIsMessageModalOpen(false);
    toast({
      type: 'success',
      title: 'Message Sent',
      description: 'Your inquiry has been dispatched to the restaurant console.'
    });
    router.push('/customer/messages');
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-20 space-y-6">
      {/* Hero Header */}
      <div className="relative h-44 rounded-xl overflow-hidden border border-line shadow-sm">
        <div className="absolute inset-0 bg-stone-900 flex items-center justify-center">
          <span className="text-white/30 text-xs italic">Spice Route Ambience Backdrop</span>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-4 text-white">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h1 className="text-xl font-serif font-bold text-white">{restaurant.name}</h1>
              <p className="text-[10px] text-white/70 flex items-center gap-1 font-sans">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {restaurant.address}
              </p>
            </div>
            <Badge variant="primary" className="text-xs">
              ★ {restaurant.rating} ({restaurant.reviewCount} Reviews)
            </Badge>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <Button 
          variant={isFollowing ? 'outline' : 'primary'} 
          size="sm" 
          onClick={handleFollowToggle}
          className="flex justify-center items-center gap-1.5"
        >
          {isFollowing ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isFollowing ? 'Following' : 'Follow'}</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push('/customer/scan')}
          className="border-line bg-bg-card hover:bg-bg-alt flex justify-center items-center gap-1.5"
        >
          <QrCode className="w-4 h-4 text-primary" />
          <span>Check-in</span>
        </Button>

        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsBookModalOpen(true)}
          className="border-line bg-bg-card hover:bg-bg-alt flex justify-center items-center gap-1.5"
        >
          <Calendar className="w-4 h-4 text-primary" />
          <span>Book</span>
        </Button>

        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsMessageModalOpen(true)}
          className="border-line bg-bg-card hover:bg-bg-alt flex justify-center items-center gap-1.5"
        >
          <MessageSquare className="w-4 h-4 text-primary" />
          <span>Message</span>
        </Button>
      </div>

      {/* Stories tray */}
      {restaurantStories.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">Stories Highlights</span>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {restaurantStories.map(story => (
              <div 
                key={story.id} 
                className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-primary to-amber-accent flex items-center justify-center flex-shrink-0 cursor-pointer"
                onClick={() => router.push('/customer')}
              >
                <div className="w-full h-full rounded-full bg-bg-card border border-line flex items-center justify-center font-bold text-[9px] text-primary">
                  {restaurant.avatar}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs (FR-A.4.3: Menu, Review, Stories) */}
      <div className="flex border-b border-line gap-2">
        {[
          { id: 'menu', name: 'Menu' },
          { id: 'reviews', name: 'Reviews' },
          { id: 'stories', name: 'Stories' },
          { id: 'feed', name: 'Community Feed' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id 
                ? 'border-primary text-primary font-bold' 
                : 'border-transparent text-ink-soft hover:text-ink'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="space-y-4">
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-primary text-bg border-primary' 
                      : 'bg-bg-card border-line text-ink-soft hover:text-ink'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredMenu.map(item => (
                <Card key={item.id} className="p-4 flex justify-between gap-4 border-line/60">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-3.5 h-3.5 border flex items-center justify-center rounded-sm text-[8px] font-bold shrink-0 ${
                        item.isVeg ? 'border-success text-success bg-success-bg/20' : 'border-danger text-danger bg-danger-bg/20'
                      }`}>
                        {item.isVeg ? 'V' : 'NV'}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-ink leading-tight">{item.name}</h4>
                    </div>
                    <p className="text-[10px] text-ink-soft leading-normal line-clamp-2">{item.description}</p>
                    {item.presentationNote && (
                      <p className="text-[9px] text-primary font-medium flex items-center gap-0.5 mt-1 font-serif">
                        <Sparkles className="w-3 h-3" />
                        Plating: {item.presentationNote}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex flex-col justify-between items-end shrink-0">
                    <span className="font-bold text-primary text-sm">₹{item.price}</span>
                    <Button 
                      size="sm" 
                      variant="primary" 
                      onClick={() => {
                        toast({ type: 'success', title: 'Table Check-in Required', description: 'Please check-in at a table to place self-orders.' });
                        router.push('/customer/scan');
                      }}
                      className="text-[10px] px-2.5 py-1"
                    >
                      Order
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {restaurantReviews.map(review => (
              <Card key={review.id} className="p-4 space-y-3 border-line/60">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-secondary-soft text-secondary font-bold text-[10px] flex items-center justify-center border border-secondary/10">
                      {review.userName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-ink text-xs leading-none">{review.userName}</h4>
                      <div className="mt-1">
                        <StarRating rating={review.foodRating} size="sm" />
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] text-ink-soft">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-ink-soft italic">"{review.text}"</p>
                {review.ownerResponse && (
                  <div className="bg-primary-soft/20 border-l-2 border-primary p-2.5 rounded-r-md text-[11px] text-ink-soft">
                    <span className="font-bold text-primary block mb-0.5">Response from Owner:</span>
                    "{review.ownerResponse}"
                  </div>
                )}
              </Card>
            ))}
            {restaurantReviews.length === 0 && (
              <p className="text-xs text-ink-soft text-center py-6 italic">No reviews for this restaurant yet.</p>
            )}
          </div>
        )}

        {activeTab === 'feed' && (
          <div className="space-y-4">
            {restaurantPosts.map(post => (
              <Card key={post.id} className="p-4 space-y-2 border-line/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-secondary-soft text-secondary font-bold text-[10px] flex items-center justify-center">
                    {post.authorAvatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-ink text-xs leading-none">{post.authorName}</h4>
                    <p className="text-[9px] text-ink-soft mt-1">{post.city}</p>
                  </div>
                </div>
                {post.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.photoUrl.startsWith('indexeddb://') ? '#' : post.photoUrl} alt="Plating design" className="w-full h-40 object-cover rounded-lg border border-line" />
                ) : (
                  <div className="w-full h-24 bg-gradient-to-tr from-primary/10 to-amber-accent/10 rounded-lg flex items-center justify-center border border-line">
                    <Sparkles className="w-6 h-6 text-primary/30" />
                  </div>
                )}
                <p className="text-xs text-ink-soft leading-normal">"{post.caption}"</p>
              </Card>
            ))}
            {restaurantPosts.length === 0 && (
              <p className="text-xs text-ink-soft text-center py-6 italic">No community posts for this restaurant yet.</p>
            )}
          </div>
        )}

        {activeTab === 'stories' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {restaurantStories.map((story, idx) => (
                <div
                  key={story.id}
                  onClick={() => {
                    setSelectedStoryIndex(idx);
                    setIsStoryViewerOpen(true);
                  }}
                  className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border border-line group shadow-sm hover:shadow-md transition-all"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={story.mediaUrl}
                    alt={story.caption || 'Story'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-2.5">
                    {story.isPermanent && (
                      <span className="bg-primary/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded self-start mb-1 shadow-sm">
                        Permanent
                      </span>
                    )}
                    <p className="text-[11px] text-white font-medium line-clamp-2 drop-shadow">
                      {story.caption || 'Tap to view'}
                    </p>
                  </div>
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white">
                    <Play className="w-3 h-3 fill-white ml-0.5" />
                  </div>
                </div>
              ))}
            </div>

            {restaurantStories.length === 0 && (
              <p className="text-xs text-ink-soft text-center py-6 italic">No stories published by this restaurant yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Story Viewer Modal (FR-A.2.3, SRS §A.2) */}
      <StoryViewerModal
        isOpen={isStoryViewerOpen}
        onClose={() => setIsStoryViewerOpen(false)}
        stories={restaurantStories}
        restaurantName={restaurant.name}
        restaurantAvatar={restaurant.name.substring(0, 2).toUpperCase()}
        initialIndex={selectedStoryIndex}
        onReply={(storyId, text) => sendMessage(restaurant.id, user?.id || 'u1', 'customer', `[Story Reply]: ${text}`)}
      />

      {/* Booking Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title={`Book Table at ${restaurant.name}`}
      >
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <Input
            label="Date"
            type="date"
            value={bookDate}
            onChange={e => setBookDate(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Time Slot</label>
              <select
                value={bookTime}
                onChange={e => setBookTime(e.target.value)}
                className="text-xs border border-line rounded p-2 bg-bg-card text-ink"
              >
                <option value="7:00 PM">7:00 PM</option>
                <option value="7:30 PM">7:30 PM</option>
                <option value="8:00 PM">8:00 PM</option>
                <option value="8:30 PM">8:30 PM</option>
                <option value="9:00 PM">9:00 PM</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Party Size</label>
              <select
                value={bookSize}
                onChange={e => setBookSize(e.target.value)}
                className="text-xs border border-line rounded p-2 bg-bg-card text-ink"
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests (Default)</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="6">6 Guests</option>
                <option value="8">8 Guests</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Special Requests</label>
            <textarea
              value={bookRequest}
              onChange={e => setBookRequest(e.target.value)}
              placeholder="e.g. Window seat, low spice preference..."
              className="text-xs border border-line rounded p-2 bg-bg-card text-ink min-h-[60px]"
              maxLength={150}
            />
          </div>

          <Button type="submit" variant="primary" fullWidth className="py-2.5">
            Confirm & Prepay booking fee (₹100)
          </Button>
        </form>
      </Modal>

      {/* DM Modal */}
      <Modal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        title={`Message ${restaurant.name}`}
      >
        <form onSubmit={handleSendDM} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Your Inquiry</label>
            <textarea
              value={dmText}
              onChange={e => setDmText(e.target.value)}
              placeholder="Ask about reservation packages, vegan substitutions, corporate deals..."
              className="text-xs border border-line rounded p-2.5 bg-bg-card text-ink min-h-[80px]"
              maxLength={300}
              required
            />
          </div>
          <Button type="submit" variant="primary" fullWidth className="py-2.5 flex items-center justify-center gap-1.5">
            <Send className="w-4 h-4" />
            <span>Send Direct Message</span>
          </Button>
        </form>
      </Modal>
    </div>
  );
};
