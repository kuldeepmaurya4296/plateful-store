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
  const { likePost, setActiveDetailedPostId } = useApp();
  const [activeMediaIndex, setActiveMediaIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isMuted, setIsMuted] = React.useState(true);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    likePost(post.id);
  };

  const handleOpenDetails = () => {
    setActiveDetailedPostId(post.id);
  };

  const isRestaurant = post.authorType === 'restaurant';
  
  // Custom media mockups
  const postMedia = (post as any).galleryNames || [post.caption.split('#')[0]];
  const isVideo = post.authorType === 'restaurant' && post.id === 'p1'; // mock post p1 as video

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

      {/* Main Post Media (Carousel / Video / Gradient Mock) */}
      <div 
        onClick={handleOpenDetails}
        className="bg-bg-alt/20 aspect-video w-full border-y border-line flex flex-col justify-center items-center relative overflow-hidden cursor-pointer group"
      >
        {/* Render media content */}
        {(post as any).isMockGradient ? (
          <div className={`w-full h-full bg-gradient-to-tr ${(post as any).mockGradientStyle} ${(post as any).filterClass} flex flex-col justify-center items-center text-center p-8 text-white relative`}>
            <Badge variant={post.isVeg ? 'success' : 'danger'} size="sm" className="absolute top-4 left-4 shadow-sm">
              {post.isVeg ? 'Veg' : 'Non-Veg'}
            </Badge>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
              <UtensilsIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-serif font-semibold max-w-sm px-4">
              {postMedia[activeMediaIndex]}
            </span>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center p-8 text-center relative bg-bg-alt/25">
            <Badge variant={post.isVeg ? 'success' : 'danger'} size="sm" className="absolute top-4 left-4 shadow-sm">
              {post.isVeg ? 'Veg' : 'Non-Veg'}
            </Badge>
            
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <UtensilsIcon className="w-7 h-7" />
            </div>

            <span className="text-xs font-serif font-semibold text-ink max-w-sm px-4">
              {postMedia[activeMediaIndex]}
            </span>

            {/* Video Overlays */}
            {isVideo && (
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                {isPlaying ? (
                  <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all">
                    <span>⏸</span>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white scale-100 opacity-100">
                    <span>▶</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Video mute/play controllers */}
        {isVideo && (
          <div className="absolute bottom-3 right-3 z-10 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="w-7 h-7 rounded-full bg-black/45 backdrop-blur-xs text-white text-xs flex items-center justify-center hover:bg-black/65 cursor-pointer"
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
              }}
              className="w-7 h-7 rounded-full bg-black/45 backdrop-blur-xs text-white text-xs flex items-center justify-center hover:bg-black/65 cursor-pointer"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>
        )}

        {/* Carousel indicator & dots */}
        {postMedia.length > 1 && (
          <>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1 z-10">
              {postMedia.map((_: any, idx: number) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === activeMediaIndex ? 'bg-primary w-3.5' : 'bg-black/30'
                  }`}
                />
              ))}
            </div>

            {/* Left and Right navigation buttons */}
            {activeMediaIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMediaIndex(prev => prev - 1);
                }}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/25 text-white flex items-center justify-center hover:bg-black/45 text-xs font-bold cursor-pointer"
              >
                ‹
              </button>
            )}
            {activeMediaIndex < postMedia.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMediaIndex(prev => prev + 1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/25 text-white flex items-center justify-center hover:bg-black/45 text-xs font-bold cursor-pointer"
              >
                ›
              </button>
            )}
          </>
        )}
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
          <button 
            onClick={handleOpenDetails}
            className="flex items-center gap-1.5 text-xs text-ink-soft hover:text-primary transition-all cursor-pointer"
          >
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
