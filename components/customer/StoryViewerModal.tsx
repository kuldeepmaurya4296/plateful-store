'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, ChevronLeft, ChevronRight, Heart, Send, Sparkles } from 'lucide-react';
import { Story } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';

interface StoryViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stories: Story[];
  restaurantName?: string;
  restaurantAvatar?: string;
  initialIndex?: number;
  onReply?: (storyId: string, text: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  isOpen,
  onClose,
  stories,
  restaurantName = 'Restaurant',
  restaurantAvatar = 'R',
  initialIndex = 0,
  onReply
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();

  const currentStory = stories[currentIndex];
  const DURATION_MS = 5000; // 5 seconds per story

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [initialIndex, isOpen]);

  // Auto-advance progress timer
  useEffect(() => {
    if (!isOpen || stories.length === 0 || isPaused) return;

    const interval = 50; // update every 50ms
    const step = (interval / DURATION_MS) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Advance to next story or close
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(c => c + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isOpen, currentIndex, stories.length, isPaused, onClose]);

  if (!isOpen || !currentStory) return null;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    if (onReply) {
      onReply(currentStory.id, replyText);
    }

    toast({
      type: 'success',
      title: 'Reply Sent',
      description: `Your message was sent to ${restaurantName}`
    });
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-0 sm:p-4 select-none">
      <div 
        className="relative w-full max-w-md h-full sm:h-[680px] bg-bg-alt sm:rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Story Media Background */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${currentStory.mediaUrl})` }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        </div>

        {/* Top Header & Segmented Progress Bar */}
        <div className="relative z-10 p-4 space-y-3">
          {/* Segmented Progress Bars */}
          <div className="flex gap-1.5 w-full">
            {stories.map((s, idx) => {
              let barWidth = '0%';
              if (idx < currentIndex) barWidth = '100%';
              else if (idx === currentIndex) barWidth = `${progress}%`;

              return (
                <div key={s.id || idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-75 ease-linear"
                    style={{ width: barWidth }}
                  />
                </div>
              );
            })}
          </div>

          {/* Restaurant Avatar & Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs shadow-md">
                {restaurantAvatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-none drop-shadow">{restaurantName}</p>
                <p className="text-[10px] text-white/80 font-medium">
                  {currentStory.isPermanent ? 'Permanent Story' : '24h Story'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tap Navigation Zones (Left / Right) */}
        <div className="absolute inset-0 z-0 flex">
          <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
          <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
        </div>

        {/* Bottom Area: Caption & Reply Input */}
        <div className="relative z-10 p-4 space-y-3">
          {currentStory.caption && (
            <p className="text-sm text-white font-medium bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10 drop-shadow">
              {currentStory.caption}
            </p>
          )}

          {/* Reply Form */}
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <Input
              type="text"
              placeholder={`Reply to ${restaurantName}...`}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              className="flex-1 bg-black/50 border-white/20 text-white placeholder:text-white/50 text-xs h-10 rounded-full px-4 focus:ring-white/40"
            />
            <button
              type="button"
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2.5 rounded-full transition-transform active:scale-90 ${
                isLiked ? 'text-accent fill-accent' : 'text-white/80 hover:text-white'
              }`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-accent text-accent' : ''}`} />
            </button>
            <Button
              type="submit"
              size="sm"
              disabled={!replyText.trim()}
              className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-primary hover:bg-primary-dark"
            >
              <Send className="w-4 h-4 text-white" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
