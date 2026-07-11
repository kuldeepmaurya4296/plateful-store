'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Search, MapPin, Star, Utensils, Users, ChevronRight, Filter } from 'lucide-react';
import Link from 'next/link';

export default function CustomerSearchPage() {
  const { restaurants, posts } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'outlets' | 'dishes' | 'foodies'>('outlets');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  // Curated list of mock foodies (bloggers) for the Foodies tab
  const mockFoodies = [
    { id: 'f1', name: 'Riya Kapoor', username: 'riya.eats', followers: '2.4k', reviews: 18, avatar: 'RK', bio: 'Obsessed with fine-dine plating & dessert decoration in Mumbai ✨' },
    { id: 'f2', name: 'Rahul Sharma', username: 'rahul.foodie', followers: '1.8k', reviews: 12, avatar: 'RS', bio: 'Searching for the best butter chicken & smoky tikkas. Food is life!' },
    { id: 'f3', name: 'Karan Malhotra', username: 'karan_bites', followers: '4.2k', reviews: 29, avatar: 'KM', bio: 'Culinary reviewer & visual designer. Rating restaurants by plating score.' },
    { id: 'f4', name: 'Nisha Sen', username: 'nisha_plates', followers: '950', reviews: 8, avatar: 'NS', bio: 'Health blogger. Reviewing gluten-free plating & presentation aesthetics.' }
  ];

  // Trending Search Tags
  const trendingSearches = ['Naan', 'Bandra Cafes', 'Tikka', 'Mumbai Mains', 'Desserts'];

  // Handle Tag click
  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
  };

  // Filter Outlets (Restaurants)
  const filteredRestaurants = restaurants.filter(rest => {
    const matchesQuery = rest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rest.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rest.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = ratingFilter ? rest.rating >= ratingFilter : true;
    
    return matchesQuery && matchesRating;
  });

  // Filter Dishes (Posts)
  const filteredDishes = posts.filter(post => {
    const matchesQuery = post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (post.restaurantName && post.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDiet = dietFilter === 'veg' ? post.isVeg : (dietFilter === 'non-veg' ? !post.isVeg : true);
    const matchesRating = ratingFilter ? (post.rating !== undefined && post.rating >= ratingFilter) : true;

    return matchesQuery && matchesDiet && matchesRating;
  });

  // Filter Foodies
  const filteredFoodies = mockFoodies.filter(foodie => {
    return foodie.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           foodie.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
           foodie.bio.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-20 space-y-5">
      {/* Search Header */}
      <div>
        <h1 className="text-xl font-serif font-bold text-ink">Plateful search</h1>
        <p className="text-xs text-ink-soft font-medium mt-0.5">Find premium plating joints, signature recipes, and verified food critics.</p>
      </div>

      {/* Search Bar Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search cafes, dishes, tikkas, or foodie profiles..."
          className="w-full pl-10 pr-4 py-2.5 text-xs"
        />
        <Search className="w-4 h-4 text-ink-soft absolute left-3.5 top-3.5" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-3.5 text-ink-soft hover:text-ink text-xs font-semibold cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Trending Search Tags */}
      {!searchQuery && (
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Trending Highlights</span>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="text-xs px-3 py-1.5 bg-bg-alt/30 border border-line rounded-full hover:bg-primary-soft hover:text-primary transition-all cursor-pointer font-medium"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation tabs */}
      <div className="flex border-b border-line text-xs font-semibold">
        <button
          onClick={() => setActiveTab('outlets')}
          className={`flex-1 pb-2 border-b-2 text-center transition-all cursor-pointer ${
            activeTab === 'outlets' ? 'border-primary text-primary font-bold' : 'border-transparent text-ink-soft'
          }`}
        >
          Outlets ({filteredRestaurants.length})
        </button>
        <button
          onClick={() => setActiveTab('dishes')}
          className={`flex-1 pb-2 border-b-2 text-center transition-all cursor-pointer ${
            activeTab === 'dishes' ? 'border-primary text-primary font-bold' : 'border-transparent text-ink-soft'
          }`}
        >
          Dishes ({filteredDishes.length})
        </button>
        <button
          onClick={() => setActiveTab('foodies')}
          className={`flex-1 pb-2 border-b-2 text-center transition-all cursor-pointer ${
            activeTab === 'foodies' ? 'border-primary text-primary font-bold' : 'border-transparent text-ink-soft'
          }`}
        >
          Foodies ({filteredFoodies.length})
        </button>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-2 items-center justify-between bg-bg-alt/15 p-2 rounded-lg border border-line text-xs">
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-ink-soft" />
          <span className="font-semibold text-[10px] text-ink-soft uppercase tracking-wider">Filters:</span>
        </div>

        <div className="flex gap-2">
          {/* Diet filter (only for Dishes tab) */}
          {activeTab === 'dishes' && (
            <select
              value={dietFilter}
              onChange={e => setDietFilter(e.target.value as any)}
              className="text-[10px] font-bold p-1 px-2 border border-line rounded bg-bg-card"
            >
              <option value="all">Diet: Both</option>
              <option value="veg">Diet: Veg Only</option>
              <option value="non-veg">Diet: Non-Veg</option>
            </select>
          )}

          {/* Rating filter */}
          <select
            value={ratingFilter || ''}
            onChange={e => setRatingFilter(e.target.value ? parseFloat(e.target.value) : null)}
            className="text-[10px] font-bold p-1 px-2 border border-line rounded bg-bg-card"
          >
            <option value="">Rating: Any</option>
            <option value="4.5">Rating: 4.5+ ★</option>
            <option value="4.0">Rating: 4.0+ ★</option>
          </select>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="space-y-3">
        {/* Outlets (Restaurants) list */}
        {activeTab === 'outlets' && (
          filteredRestaurants.length > 0 ? (
            filteredRestaurants.map(rest => (
              <Card key={rest.id} className="!p-3.5 flex justify-between items-center hover:border-primary/20 cursor-pointer">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-ink leading-none">{rest.name}</span>
                    <Badge variant="primary" className="scale-85 py-0.5">{rest.subscriptionPlan || 'Basic'}</Badge>
                  </div>
                  <p className="text-[10px] text-ink-soft leading-none font-medium">{rest.cuisine} · {rest.city}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-xs font-bold text-primary gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{rest.rating || 4.5}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ink-soft" />
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-bg-card border border-line rounded-lg">
              <span className="text-xs text-ink-soft italic">No restaurants found matching "{searchQuery}"</span>
            </div>
          )
        )}

        {/* Dishes (Posts/Photos) list */}
        {activeTab === 'dishes' && (
          filteredDishes.length > 0 ? (
            filteredDishes.map(post => (
              <Card key={post.id} className="!p-3.5 flex items-center gap-4 hover:border-primary/20 cursor-pointer">
                {/* Visual Thumbnail */}
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-tr ${
                  (post as any).isMockGradient ? (post as any).mockGradientStyle : 'from-primary to-amber-accent'
                } flex items-center justify-center text-white font-serif font-bold text-xs flex-shrink-0 border border-line/45`}>
                  <span>{post.authorAvatar}</span>
                </div>
                <div className="flex-1 min-w-0 space-y-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-ink truncate max-w-[150px] block">{post.caption.split('#')[0]}</span>
                    <Badge variant={post.isVeg ? 'success' : 'danger'} className="scale-80">
                      {post.isVeg ? 'Veg' : 'Non-Veg'}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-ink-soft truncate leading-none">by {post.authorName} at <span className="font-semibold text-primary">{post.restaurantName || 'Spice Route'}</span></p>
                  
                  {/* Plating and taste score stars */}
                  <div className="flex items-center text-[10px] text-primary font-bold gap-0.5">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Plating Score: {post.rating} / 5</span>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-bg-card border border-line rounded-lg">
              <span className="text-xs text-ink-soft italic">No dishes found matching "{searchQuery}"</span>
            </div>
          )
        )}

        {/* Foodies (critics) list */}
        {activeTab === 'foodies' && (
          filteredFoodies.length > 0 ? (
            filteredFoodies.map(foodie => (
              <Card key={foodie.id} className="!p-4 space-y-2 hover:border-primary/20 cursor-pointer">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary-soft text-secondary font-bold text-sm flex items-center justify-center border border-secondary/15 flex-shrink-0">
                      {foodie.avatar}
                    </div>
                    <div className="text-left leading-none">
                      <span className="text-xs font-bold text-ink block">{foodie.name}</span>
                      <span className="text-[10px] text-ink-soft mt-1 block">@{foodie.username}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-[10px] py-0 px-3">
                    Follow
                  </Button>
                </div>
                <p className="text-[10px] text-ink-soft leading-relaxed italic">"{foodie.bio}"</p>
                <div className="flex gap-4 text-[9px] text-ink font-bold pt-1 border-t border-line/60">
                  <span>{foodie.followers} followers</span>
                  <span>{foodie.reviews} verified reviews</span>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-bg-card border border-line rounded-lg">
              <span className="text-xs text-ink-soft italic">No food blogger profiles found matching "{searchQuery}"</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
