'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/lib/AppContext';
import { Heart, MessageSquare, MapPin, Star, User } from 'lucide-react';
import Link from 'next/link';

interface FeedCardProps {
  post: {
    id: string;
    authorType: 'restaurant' | 'customer';
    authorId: string;
    authorName: string;
    authorAvatar: string;
    city: string;
    photoUrl: string;
    caption: string;
    isVeg: boolean;
    rating: number;
    likesCount: number;
    commentsCount: number;
    restaurantId?: string;
    restaurantName?: string;
    createdAt: string;
  };
}

export const FeedCard: React.FC<FeedCardProps> = ({ post }) => {
  const { likePost } = useApp();

  const handleLike = () => {
    likePost(post.id);
  };

  const isRestaurant = post.authorType === 'restaurant';

  return (
    <Card hoverEffect className="w-full flex flex-col gap-4 overflow-hidden !p-0">
      {/* Feed Header */}
      <div className="flex items-center justify-between p-4 pb-0">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border ${
            isRestaurant 
              ? 'bg-primary-soft text-primary border-primary/20' 
              : 'bg-secondary-soft text-secondary border-secondary/20'
          }`}>
            {post.authorAvatar}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-ink leading-none">
                {post.authorName}
              </span>
              {!isRestaurant && post.restaurantName && (
                <span className="text-xs text-ink-soft">
                  at <Link href={`/restaurant/${post.restaurantId}`} className="text-primary hover:underline font-medium">{post.restaurantName}</Link>
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-ink-soft mt-1">
              <MapPin className="w-3 h-3" />
              <span>{post.city}</span>
            </div>
          </div>
        </div>

        {/* Rating Badge */}
        <Badge variant={isRestaurant ? 'primary' : 'secondary'} size="sm">
          <div className="flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-current" />
            <span>{post.rating}</span>
          </div>
        </Badge>
      </div>

      {/* Main Post Media (Simulated with design wrapper) */}
      <div className="bg-bg-alt/20 aspect-video w-full border-y border-line flex flex-col justify-center items-center p-8 text-center relative overflow-hidden">
        {/* Dynamic image mockup */}
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
          <UtensilsIcon className="w-8 h-8" />
        </div>
        <Badge variant={post.isVeg ? 'success' : 'danger'} size="sm" className="absolute top-4 left-4 shadow-sm">
          {post.isVeg ? 'Veg' : 'Non-Veg'}
        </Badge>
        <span className="text-xs font-serif font-semibold text-ink max-w-sm px-4">
          {post.caption.split('#')[0]}
        </span>
      </div>

      {/* Post Actions & Text details */}
      <div className="px-4 pb-4 space-y-2">
        {/* Interactive icons */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 text-xs text-ink-soft hover:text-danger hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Heart className="w-4 h-4" />
            <span className="font-semibold">{post.likesCount}</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs text-ink-soft hover:text-primary transition-all cursor-pointer">
            <MessageSquare className="w-4 h-4" />
            <span className="font-semibold">{post.commentsCount}</span>
          </button>
        </div>

        {/* Caption */}
        <p className="text-xs text-ink pr-2 leading-relaxed">
          <span className="font-semibold mr-1.5">{post.authorName}</span>
          <span className="text-ink-soft">{post.caption}</span>
        </p>
      </div>
    </Card>
  );
};

// Simple helper icon
const UtensilsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z" />
    <path d="M19 15v7" />
  </svg>
);
