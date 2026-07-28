'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '@/lib/AppContext';
import { StoryTray } from '@/features/feed/components/StoryTray';
import { FeedCard } from '@/features/feed/components/FeedCard';
import { Button } from '@/components/ui/Button';
import { MapPin, QrCode, Search, Utensils, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Post } from '@/lib/types';

export const ExploreFeedView: React.FC = () => {
  const { posts: initialContextPosts } = useApp();
  const [city, setCity] = useState('Mumbai');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [showCitySelector, setShowCitySelector] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = useCallback(async (currentCursor: string | null = null, isInitial = false) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const isVegParam = dietFilter === 'all' ? '' : dietFilter === 'veg' ? 'true' : 'false';
      const url = `/api/posts?city=${city}&limit=5${isVegParam ? `&isVeg=${isVegParam}` : ''}${currentCursor ? `&cursor=${currentCursor}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();

      const fetchedPosts: Post[] = Array.isArray(data) ? data : data.posts || [];
      const cursorVal = data.nextCursor || null;

      setPosts(prev => isInitial ? fetchedPosts : [...prev, ...fetchedPosts]);
      setNextCursor(cursorVal);
      setHasMore(Boolean(cursorVal));
    } catch (err) {
      console.error('Error fetching posts:', err);
      if (isInitial && initialContextPosts.length > 0) {
        setPosts(initialContextPosts);
        setHasMore(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [city, dietFilter, initialContextPosts, isLoading]);

  useEffect(() => {
    fetchPosts(null, true);
  }, [city, dietFilter]);

  // Infinite scroll intersection observer
  useEffect(() => {
    if (!observerRef.current || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchPosts(nextCursor);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [nextCursor, hasMore, isLoading, fetchPosts]);

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
        {posts.length > 0 ? (
          posts.map(post => (
            <FeedCard key={post.id} post={post} />
          ))
        ) : !isLoading ? (
          <div className="text-center py-16 bg-bg-card border border-line rounded-lg p-8">
            <div className="bg-bg-alt w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Utensils className="w-5 h-5 text-ink-soft" />
            </div>
            <h3 className="text-base font-serif font-semibold text-ink">No feed posts found</h3>
            <p className="text-xs text-ink-soft mt-1 max-w-xs mx-auto">
              There are no dishes or reviews posted in {city} with the selected diet filter.
            </p>
          </div>
        ) : null}

        {/* Infinite Scroll Trigger & Spinner */}
        <div ref={observerRef} className="py-4 text-center">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-xs text-ink-soft">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Loading more dishes...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
