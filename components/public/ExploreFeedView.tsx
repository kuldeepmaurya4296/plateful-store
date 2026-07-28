'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { StoryTray } from '@/features/feed/components/StoryTray';
import { FeedCard } from '@/features/feed/components/FeedCard';
import { Button } from '@/components/ui/Button';
import { MapPin, QrCode, Search, Utensils } from 'lucide-react';
import Link from 'next/link';

export const ExploreFeedView: React.FC = () => {
  const { posts } = useApp();
  const [city, setCity] = useState('Mumbai');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [showCitySelector, setShowCitySelector] = useState(false);

  const filteredPosts = posts.filter(post => {
    if (post.city.toLowerCase() !== city.toLowerCase()) return false;
    if (dietFilter === 'veg' && !post.isVeg) return false;
    if (dietFilter === 'non-veg' && post.isVeg) return false;
    return true;
  });

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-20 space-y-6 relative min-h-screen">
      {/* Feed Header */}
      <div className="flex items-center justify-between sticky top-0 bg-bg/95 backdrop-blur-md py-3 z-30 border-b border-line -mx-4 px-4">
        {/* City Location */}
        <div className="relative">
          <button
            onClick={() => setShowCitySelector(!showCitySelector)}
            className="flex items-center gap-1.5 font-medium text-ink hover:text-primary transition-colors cursor-pointer text-sm"
          >
            <MapPin className="w-4 h-4 text-primary" />
            <span>{city}</span>
            <span className="text-[10px] text-ink-soft">▼</span>
          </button>
          
          {showCitySelector && (
            <div className="absolute top-7 left-0 bg-bg-card border border-line rounded-lg shadow-lg py-1.5 w-32 z-40">
              {['Mumbai', 'Delhi', 'Bangalore', 'Pune'].map(c => (
                <button
                  key={c}
                  onClick={() => {
                    setCity(c);
                    setShowCitySelector(false);
                  }}
                  className="block w-full text-left px-3 py-1.5 text-xs text-ink hover:bg-bg-alt font-medium cursor-pointer"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Diet Toggles */}
        <div className="flex bg-bg-alt p-0.5 rounded-lg border border-line text-xs font-semibold">
          <button
            onClick={() => setDietFilter('all')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              dietFilter === 'all'
                ? 'bg-bg-card text-ink shadow-sm'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            Both
          </button>
          <button
            onClick={() => setDietFilter('veg')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              dietFilter === 'veg'
                ? 'bg-bg-card text-success shadow-sm'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            Veg
          </button>
          <button
            onClick={() => setDietFilter('non-veg')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              dietFilter === 'non-veg'
                ? 'bg-bg-card text-danger shadow-sm'
                : 'text-ink-soft hover:text-ink'
            }`}
          >
            Non-Veg
          </button>
        </div>

        {/* Quick QR Scanner Link */}
        <Link href="/customer/scan" title="Scan Table QR">
          <Button variant="ghost" size="sm" className="!p-2 border border-line bg-bg hover:bg-bg-alt rounded-lg">
            <QrCode className="w-4.5 h-4.5 text-ink-soft" />
          </Button>
        </Link>
      </div>

      {/* Stories tray */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
          Recent Stories
        </h3>
        <StoryTray />
      </div>

      {/* Posts Feed list */}
      <div className="space-y-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <FeedCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-16 bg-bg-card border border-line rounded-lg p-8">
            <div className="bg-bg-alt w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Utensils className="w-5 h-5 text-ink-soft" />
            </div>
            <h3 className="text-base font-serif font-semibold text-ink">No feed posts found</h3>
            <p className="text-xs text-ink-soft mt-1 max-w-xs mx-auto">
              There are no dishes or reviews posted in {city} with the selected diet filter.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Nav Simulation link for public guest */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-bg-card border-t border-line lg:hidden flex justify-around items-center h-16 safe-bottom">
        <Link href="/explore" className="flex flex-col items-center justify-center w-full h-full text-primary">
          <Utensils className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-semibold">Feed</span>
        </Link>
        <Link href="/customer/scan" className="flex flex-col items-center justify-center w-full h-full text-ink-soft hover:text-ink">
          <QrCode className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Scan QR</span>
        </Link>
        <Link href="/customer/search" className="flex flex-col items-center justify-center w-full h-full text-ink-soft hover:text-ink">
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Search</span>
        </Link>
      </div>
    </div>
  );
};
