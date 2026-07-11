'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Heart, MessageSquare, Share2, Bookmark, Music, Volume2, VolumeX, Sparkles, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Reels Data
const MOCK_REELS = [
  {
    id: 'r1',
    authorName: 'Spice Route',
    avatar: 'SR',
    caption: 'Pouring hot clarified butter on our legendary dry-ice Paneer Tikka! 🔥 Plating rating: 4.9/5. #platingart #gastronomy #mumbai',
    musicName: 'Original Audio - Spice Route',
    gradientStyle: 'from-amber-600 via-orange-500 to-red-700',
    likesCount: 345,
    commentsCount: 24,
    commentsList: [
      { id: 'rc1', name: 'Riya Kapoor', avatar: 'RK', text: 'This presentation was out of this world!' },
      { id: 'rc2', name: 'Karan Malhotra', avatar: 'KM', text: 'Stunning smoke effects!' }
    ]
  },
  {
    id: 'r2',
    authorName: 'Riya Kapoor',
    avatar: 'RK',
    caption: 'Wait for that chocolate dome collapse! Pure bliss. 🍫 Rosewater Kulfi Sundae special! @Spice Route #chocolatedome #desserts',
    musicName: 'Sunset Melodies - Lofi Beats',
    gradientStyle: 'from-pink-400 via-purple-500 to-amber-300',
    likesCount: 289,
    commentsCount: 18,
    commentsList: [
      { id: 'rc3', name: 'Rahul Sharma', avatar: 'RS', text: 'My sweet tooth is tingling!' },
      { id: 'rc4', name: 'Nisha Sen', avatar: 'NS', text: 'Is this gluten-free?' }
    ]
  },
  {
    id: 'r3',
    authorName: 'Grill House',
    avatar: 'GH',
    caption: 'Hickory-smoke leaking from under the cloche! Juicy lamb chops cooked to medium-rare. 🍖 #smoked #lambchops #foodblogger',
    musicName: 'Rock Steady - Jazz Band',
    gradientStyle: 'from-red-800 via-yellow-900 to-stone-900',
    likesCount: 412,
    commentsCount: 37,
    commentsList: [
      { id: 'rc5', name: 'Karan Malhotra', avatar: 'KM', text: 'Smoked lamb chops are a must try!' },
      { id: 'rc6', name: 'Aman Joshi', avatar: 'AJ', text: 'Smell is incredible!' }
    ]
  }
];

export default function CustomerReelsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [reels, setReels] = useState(MOCK_REELS);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  
  // Slide up Comments Drawer
  const [activeCommentsReelId, setActiveCommentsReelId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Double tap like animation
  const [showHeartPop, setShowHeartPop] = useState(false);

  const activeReel = reels[activeReelIndex];
  const commentsList = activeCommentsReelId 
    ? (reels.find(r => r.id === activeCommentsReelId)?.commentsList || []) 
    : [];

  const handleLike = (idx: number) => {
    setReels(prev => prev.map((reel, rIdx) => {
      if (rIdx === idx) {
        return {
          ...reel,
          likesCount: reel.likesCount + 1
        };
      }
      return reel;
    }));
  };

  const handleDoubleTap = (idx: number) => {
    handleLike(idx);
    setShowHeartPop(true);
    setTimeout(() => {
      setShowHeartPop(false);
    }, 800);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeCommentsReelId) return;

    const newComment = {
      id: `rc_dyn_${Date.now()}`,
      name: user?.name || 'Riya Kapoor',
      avatar: user?.avatar || 'RK',
      text: newCommentText
    };

    setReels(prev => prev.map(reel => {
      if (reel.id === activeCommentsReelId) {
        return {
          ...reel,
          commentsCount: reel.commentsCount + 1,
          commentsList: [...reel.commentsList, newComment]
        };
      }
      return reel;
    }));

    setNewCommentText('');
    toast({
      type: 'success',
      title: 'Comment added',
      description: 'Your comment was posted to the reel.'
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const height = e.currentTarget.clientHeight;
    const index = Math.round(scrollTop / height);
    if (index !== activeReelIndex && index >= 0 && index < reels.length) {
      setActiveReelIndex(index);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-20 space-y-4">
      {/* Reels Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-serif font-bold text-ink">Plating shorts</h1>
          <p className="text-xs text-ink-soft font-medium mt-0.5">Scroll vertically to discover verified cooking & plating reels.</p>
        </div>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 border border-line bg-bg-card hover:bg-bg-alt rounded-full cursor-pointer text-ink-soft"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Snap Scroll Viewport */}
      <div 
        onScroll={handleScroll}
        className="w-full h-[580px] bg-black rounded-2xl overflow-y-scroll snap-y snap-mandatory relative scrollbar-none border border-line"
      >
        {reels.map((reel, idx) => {
          const isCurrent = idx === activeReelIndex;
          
          return (
            <div 
              key={reel.id}
              className="w-full h-full snap-start snap-always relative flex items-center justify-center overflow-hidden"
              onDoubleClick={() => handleDoubleTap(idx)}
            >
              {/* Looping Premium Background Gradient (Simulating Reels video content) */}
              <div className={`absolute inset-0 bg-gradient-to-tr ${reel.gradientStyle} opacity-90 flex flex-col justify-center items-center`}>
                {/* Audio pulse graphic */}
                <div className={`w-28 h-28 rounded-full border-4 border-white/20 flex items-center justify-center ${isCurrent && !isMuted ? 'animate-pulse scale-105' : ''} transition-all`}>
                  <Sparkles className="w-12 h-12 text-white/70" />
                </div>
              </div>

              {/* Black gradient mask at bottom for details readability */}
              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 via-black/45 to-transparent pointer-events-none" />

              {/* Bottom details overlay */}
              <div className="absolute bottom-5 left-4 right-16 text-white text-left space-y-2 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 text-white font-bold text-xs flex items-center justify-center border border-white/30 backdrop-blur-md">
                    {reel.avatar}
                  </div>
                  <span className="text-xs font-bold">{reel.authorName}</span>
                  <button className="text-[10px] font-bold bg-primary text-bg px-2.5 py-0.5 rounded-full hover:bg-primary-hover">
                    Follow
                  </button>
                </div>
                <p className="text-xs text-white/90 leading-relaxed max-w-sm line-clamp-2">
                  {reel.caption}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-white/70">
                  <Music className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>{reel.musicName}</span>
                </div>
              </div>

              {/* Side Right Hand Control Buttons */}
              <div className="absolute right-3 bottom-5 flex flex-col items-center gap-4 z-10">
                {/* Like Button */}
                <button
                  onClick={() => handleLike(idx)}
                  className="flex flex-col items-center text-white gap-1 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60">
                    <Heart className="w-4.5 h-4.5 text-white fill-white" />
                  </div>
                  <span className="text-[10px] font-bold">{reel.likesCount}</span>
                </button>

                {/* Comment Button */}
                <button
                  onClick={() => setActiveCommentsReelId(reel.id)}
                  className="flex flex-col items-center text-white gap-1 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60">
                    <MessageSquare className="w-4.5 h-4.5 text-white fill-white" />
                  </div>
                  <span className="text-[10px] font-bold">{reel.commentsCount}</span>
                </button>

                {/* Share Button */}
                <button 
                  onClick={() => toast({ type: 'success', title: 'Link copied', description: 'Reel link copied to clipboard.' })}
                  className="flex flex-col items-center text-white gap-1 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60">
                    <Share2 className="w-4.5 h-4.5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold">Share</span>
                </button>

                {/* Bookmark Button */}
                <button 
                  onClick={() => toast({ type: 'success', title: 'Bookmarked', description: 'Saved to your Plateful collection.' })}
                  className="flex flex-col items-center text-white gap-1 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60">
                    <Bookmark className="w-4.5 h-4.5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold">Save</span>
                </button>

                {/* Spinning music vinyl disc mockup */}
                <div className="w-7 h-7 rounded-full border-2 border-white/50 bg-stone-900 animate-spin flex items-center justify-center" style={{ animationDuration: '4s' }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                </div>
              </div>

              {/* Heart Pop Animation overlay on double tap */}
              <AnimatePresence>
                {showHeartPop && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute z-20 pointer-events-none"
                  >
                    <Heart className="w-20 h-20 text-red-500 fill-current drop-shadow-xl" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Slide up Comments Drawer Backdrop & Body */}
      <AnimatePresence>
        {activeCommentsReelId && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCommentsReelId(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />

            {/* Comment Body Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative bg-bg-card border-t border-line rounded-t-2xl w-full max-w-xl h-[380px] z-10 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-4 border-b border-line flex justify-between items-center">
                <span className="font-bold text-sm text-ink">Reel Comments ({commentsList.length})</span>
                <button
                  onClick={() => setActiveCommentsReelId(null)}
                  className="p-1 rounded-full hover:bg-bg-alt text-ink-soft cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Comments scroll area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {commentsList.length > 0 ? (
                  commentsList.map(c => (
                    <div key={c.id} className="flex gap-2.5 text-xs text-ink items-start text-left">
                      <div className="w-7 h-7 rounded-full bg-secondary-soft text-secondary font-bold text-[10px] flex items-center justify-center border border-secondary/15 flex-shrink-0">
                        {c.avatar}
                      </div>
                      <div className="space-y-0.5">
                        <p className="leading-relaxed">
                          <span className="font-semibold mr-1.5">{c.name}</span>
                          <span className="text-ink-soft">{c.text}</span>
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-ink-soft italic text-xs">
                    No comments yet. Write a comment to share your review!
                  </div>
                )}
              </div>

              {/* Form Input footer */}
              <form onSubmit={handlePostComment} className="p-3 border-t border-line bg-bg/15 flex gap-2 items-center">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={e => setNewCommentText(e.target.value)}
                  placeholder="Reply to reel..."
                  className="flex-1 text-xs border border-line rounded px-2.5 py-2"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="p-2 rounded-full hover:bg-primary-soft text-primary disabled:opacity-30 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
