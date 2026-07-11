'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Volume2, ArrowLeft, ArrowRight, Heart, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/Button';


export const StoryTray: React.FC = () => {
  const { stories, restaurants } = useApp();
  const [activeStoryRestaurant, setActiveStoryRestaurant] = useState<string | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  // Group stories by restaurant
  const restaurantStories = stories.reduce((acc: { [key: string]: any[] }, story) => {
    if (!acc[story.restaurantId]) {
      acc[story.restaurantId] = [];
    }
    acc[story.restaurantId].push(story);
    return acc;
  }, {});

  const activeStories = activeStoryRestaurant ? restaurantStories[activeStoryRestaurant] : [];
  const currentStory = activeStories ? activeStories[activeStoryIndex] : null;

  const handleRestaurantClick = (restaurantId: string) => {
    setActiveStoryRestaurant(restaurantId);
    setActiveStoryIndex(0);
  };

  const handleNext = () => {
    if (activeStoryIndex < activeStories.length - 1) {
      setActiveStoryIndex(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(prev => prev - 1);
    }
  };

  const handleClose = () => {
    setActiveStoryRestaurant(null);
    setActiveStoryIndex(0);
  };

  return (
    <div className="w-full">
      {/* Story Tray horizontal list */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        {Object.keys(restaurantStories).map((restId) => {
          const rest = restaurants.find(r => r.id === restId);
          if (!rest) return null;

          return (
            <div
              key={restId}
              onClick={() => handleRestaurantClick(restId)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-primary to-amber-accent flex items-center justify-center hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-bg-card flex items-center justify-center font-serif font-bold text-sm text-primary border border-line">
                  {rest.avatar}
                </div>
              </div>
              <span className="text-[10px] font-semibold text-ink-soft max-w-[70px] truncate text-center">
                {rest.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Full screen Story Viewer */}
      <AnimatePresence>
        {activeStoryRestaurant && currentStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 backdrop-blur-md">
            {/* Story Viewer Panel */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md h-[100vh] sm:h-[85vh] sm:rounded-xl overflow-hidden flex flex-col bg-ink text-bg"
            >
              {/* Segmented Progress Bar */}
              <div className="absolute top-4 left-4 right-4 z-20 flex gap-1.5">
                {activeStories.map((_, idx) => (
                  <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: idx < activeStoryIndex ? '100%' : (idx === activeStoryIndex ? '100%' : '0%')
                      }}
                      transition={{
                        duration: idx === activeStoryIndex ? 5 : 0,
                        ease: 'linear'
                      }}
                      onAnimationComplete={() => {
                        if (idx === activeStoryIndex) {
                          handleNext();
                        }
                      }}
                      className="h-full bg-white"
                    />
                  </div>
                ))}
              </div>

              {/* Story Header */}
              <div className="absolute top-8 left-4 right-4 z-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center border border-primary/20">
                    {restaurants.find(r => r.id === activeStoryRestaurant)?.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-none">
                      {restaurants.find(r => r.id === activeStoryRestaurant)?.name}
                    </p>
                    <p className="text-[10px] text-white/60 mt-1 font-medium">Active story</p>
                  </div>
                </div>
                <button onClick={handleClose} className="p-1 rounded-full bg-black/40 hover:bg-black/60 cursor-pointer">
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Story Content Image Placeholder */}
              <div className="flex-1 bg-ink flex items-center justify-center relative p-8">
                {/* Simulated photo layout */}
                <div className="w-full h-full rounded-lg border border-white/10 bg-bg-alt/10 flex flex-col justify-between items-center py-20 px-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                    <Utensils className="w-10 h-10" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-serif font-bold text-white">
                      {currentStory.caption}
                    </h3>
                    <p className="text-xs text-white/50">
                      Posted recently · Expiring in 24h
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation overlays */}
              <button
                onClick={handlePrev}
                disabled={activeStoryIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 disabled:opacity-0 cursor-pointer z-20"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 cursor-pointer z-20"
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </button>

              {/* Story Footer Input */}
              <div className="p-4 bg-gradient-to-t from-black/80 to-transparent z-10 flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Reply to story..."
                  className="flex-1 bg-white/10 border-white/20 text-white text-xs py-2 px-3 focus:border-white focus:ring-white/10"
                />
                <Button variant="ghost" size="sm" className="!p-2 text-white hover:bg-white/10">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
