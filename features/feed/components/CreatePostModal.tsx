'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { X, Sparkles, Image, Check, Heart, Camera, Sliders, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Gallery Images with beautiful gradients representing foods
const MOCK_GALLERY = [
  { id: 'mg1', name: 'Paneer Tikka Platter', style: 'from-amber-500 to-red-600', isVeg: true, category: 'Mains' },
  { id: 'mg2', name: 'Truffle Butter Naan', style: 'from-yellow-100 to-amber-300', isVeg: true, category: 'Sides' },
  { id: 'mg3', name: 'Signature Lamb Chops', style: 'from-red-800 to-amber-950', isVeg: false, category: 'Mains' },
  { id: 'mg4', name: 'Galouti Kabab Dream', style: 'from-orange-800 to-yellow-900', isVeg: false, category: 'Starters' },
  { id: 'mg5', name: 'Rosewater Kulfi Sundae', style: 'from-pink-300 to-amber-200', isVeg: true, category: 'Desserts' },
  { id: 'mg6', name: 'Smoky Cocktails Blend', style: 'from-red-500 via-purple-600 to-blue-700', isVeg: true, category: 'Beverages' }
];

// Instagram CSS filters
const FILTER_PRESETS = [
  { id: 'normal', name: 'Normal', filterClass: '' },
  { id: 'clarendon', name: 'Clarendon', filterClass: 'contrast-[1.2] saturate-[1.35] brightness-[1.05]' },
  { id: 'juno', name: 'Juno', filterClass: 'sepia-[0.15] contrast-[1.15] saturate-[1.4] hue-rotate-[-5deg]' },
  { id: 'lark', name: 'Lark', filterClass: 'contrast-[0.95] saturate-[1.1] brightness-[1.12]' },
  { id: 'vintage', name: 'Vintage', filterClass: 'sepia-[0.4] contrast-[0.88] brightness-[0.95]' },
  { id: 'grayscale', name: 'Noir', filterClass: 'grayscale-[1] contrast-[1.1]' }
];

export const CreatePostModal: React.FC = () => {
  const { isCreatePostOpen, setCreatePostOpen, addPost, restaurants } = useApp();
  const { user } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [selectedMockId, setSelectedMockId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('normal');
  
  // Post Details state
  const [caption, setCaption] = useState('');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('r1');
  const [isVeg, setIsVeg] = useState(true);
  const [platingRating, setPlatingRating] = useState(5);
  const [tasteRating, setTasteRating] = useState(5);
  const [ambianceRating, setAmbianceRating] = useState(4);

  if (!isCreatePostOpen) return null;

  const handleClose = () => {
    setCreatePostOpen(false);
    setStep(1);
    setSelectedMedia([]);
    setSelectedMockId(null);
    setActiveFilter('normal');
    setCaption('');
  };

  const handleSelectMock = (mock: typeof MOCK_GALLERY[0]) => {
    setSelectedMockId(mock.id);
    // Simulate image array
    setSelectedMedia([mock.name]);
    setIsVeg(mock.isVeg);
    setCaption(`Trying the amazing ${mock.name}! Superb flavors and outstanding presentation. #foodie #recommended`);
  };

  const handleNext = () => {
    if (selectedMedia.length === 0) {
      toast({
        type: 'error',
        title: 'Media Required',
        description: 'Please select a dish from the gallery to continue.'
      });
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handlePublish = () => {
    const restaurant = restaurants.find(r => r.id === selectedRestaurantId);
    
    // Average ratings
    const avgRating = parseFloat(((platingRating + tasteRating + ambianceRating) / 3).toFixed(1));

    const newPost = {
      id: `p_dyn_${Date.now()}`,
      authorType: 'customer',
      authorId: user?.id || 'u1',
      authorName: user?.name || 'Riya Kapoor',
      authorAvatar: user?.avatar || 'RK',
      restaurantId: selectedRestaurantId,
      restaurantName: restaurant?.name || 'Spice Route',
      city: user?.preferences?.city || 'Mumbai',
      photoUrl: '', // simulated
      isMockGradient: true,
      mockGradientStyle: MOCK_GALLERY.find(g => g.id === selectedMockId)?.style || 'from-primary to-amber-accent',
      filterClass: FILTER_PRESETS.find(f => f.id === activeFilter)?.filterClass || '',
      caption: caption,
      isVeg: isVeg,
      rating: avgRating,
      likesCount: 1,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      detailedRatings: {
        plating: platingRating,
        taste: tasteRating,
        ambiance: ambianceRating
      },
      galleryNames: selectedMedia,
      commentsList: []
    };

    addPost(newPost);
    toast({
      type: 'success',
      title: 'Post Published Successfully!',
      description: 'Your dish plating photo is now live on the community feed.'
    });
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-bg-card border border-line rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col h-[560px] max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-line">
          <button onClick={handleClose} className="p-1 rounded-full hover:bg-bg-alt text-ink-soft cursor-pointer">
            <X className="w-5 h-5" />
          </button>
          <span className="font-serif font-bold text-base text-ink">
            {step === 1 && 'Create New Post'}
            {step === 2 && 'Apply Filter'}
            {step === 3 && 'Details & Publish'}
          </span>
          <div>
            {step < 3 ? (
              <Button size="sm" onClick={handleNext} className="text-xs">Next</Button>
            ) : (
              <Button size="sm" variant="primary" onClick={handlePublish} className="text-xs flex gap-1 items-center">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Share</span>
              </Button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Step 1: Select Food Image */}
          {step === 1 && (
            <div className="space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Select Food from Device Gallery</label>
                <div className="grid grid-cols-3 gap-3">
                  {MOCK_GALLERY.map(mock => {
                    const isSelected = selectedMockId === mock.id;
                    return (
                      <div
                        key={mock.id}
                        onClick={() => handleSelectMock(mock)}
                        className={`aspect-square rounded-xl bg-gradient-to-tr ${mock.style} relative cursor-pointer border-2 transition-all hover:scale-102 flex flex-col justify-end p-2 text-white ${
                          isSelected ? 'border-primary ring-2 ring-primary-soft' : 'border-transparent'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 bg-primary rounded-full p-0.5 z-10">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <span className="text-[9px] font-semibold bg-black/40 px-1 py-0.5 rounded backdrop-blur-xs truncate w-full">
                          {mock.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Upload alternative */}
              <div className="border border-dashed border-line rounded-xl p-8 text-center bg-bg/20 hover:bg-bg/40 transition-all cursor-pointer">
                <Camera className="w-8 h-8 text-ink-soft mx-auto mb-2" />
                <span className="text-xs font-semibold text-ink">Upload your own plating photo</span>
                <p className="text-[10px] text-ink-soft mt-1">Supports JPEG, PNG up to 10MB</p>
              </div>

              {selectedMedia.length > 0 && (
                <div className="bg-success-bg/30 border border-success/15 rounded-lg p-3 text-success text-xs font-medium flex items-center justify-between">
                  <span>Selected: {selectedMedia[0]}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wide">Ready</span>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Filters */}
          {step === 2 && (
            <div className="space-y-6 flex flex-col justify-between h-full">
              {/* Filtered Preview Box */}
              <div className="flex-1 max-h-56 aspect-video bg-bg-alt/25 rounded-xl border border-line flex items-center justify-center relative overflow-hidden">
                {selectedMockId ? (
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-tr ${
                    MOCK_GALLERY.find(g => g.id === selectedMockId)?.style
                  } ${
                    FILTER_PRESETS.find(f => f.id === activeFilter)?.filterClass
                  }`} />
                ) : (
                  <Image className="w-12 h-12 text-ink-soft" />
                )}
                <span className="absolute bottom-3 left-3 text-[10px] bg-black/55 text-white font-medium px-2 py-0.5 rounded uppercase tracking-wider backdrop-blur-xs">
                  Filter: {activeFilter}
                </span>
              </div>

              {/* Filter Options slider list */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Select Style Filter</label>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {FILTER_PRESETS.map(filter => (
                    <div
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className="flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer"
                    >
                      <div className={`w-14 h-14 rounded-lg bg-gradient-to-tr ${
                        selectedMockId ? MOCK_GALLERY.find(g => g.id === selectedMockId)?.style : 'from-primary to-amber-accent'
                      } ${filter.filterClass} border-2 ${
                        activeFilter === filter.id ? 'border-primary ring-1 ring-primary' : 'border-line'
                      }`} />
                      <span className="text-[9px] font-semibold text-ink-soft">{filter.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center gap-4">
                <Button variant="outline" size="sm" onClick={handleBack} className="w-24 text-xs">Back</Button>
                <Button variant="primary" size="sm" onClick={handleNext} className="flex-1 text-xs">Apply & Continue</Button>
              </div>
            </div>
          )}

          {/* Step 3: Metadata detail inputs */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Caption */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Write Caption / Hashtags</label>
                <textarea
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  placeholder="Share details about the plating decoration, flavors, textures..."
                  className="w-full text-xs min-h-[60px] resize-none border border-line rounded p-2"
                  maxLength={300}
                />
              </div>

              {/* Location selection */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Tag Restaurant</label>
                  <select
                    value={selectedRestaurantId}
                    onChange={e => setSelectedRestaurantId(e.target.value)}
                    className="text-xs border border-line rounded p-2 bg-bg-card text-ink"
                  >
                    {restaurants.map(r => (
                      <option key={r.id} value={r.id}>{r.name} ({r.city})</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Dietary Class</label>
                  <div className="grid grid-cols-2 gap-2 h-9">
                    <button
                      type="button"
                      onClick={() => setIsVeg(true)}
                      className={`text-xs font-bold border rounded-md cursor-pointer ${
                        isVeg ? 'bg-success-bg text-success border-success/30' : 'bg-bg border-line text-ink-soft'
                      }`}
                    >
                      Veg
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsVeg(false)}
                      className={`text-xs font-bold border rounded-md cursor-pointer ${
                        !isVeg ? 'bg-danger-bg text-danger border-danger/30' : 'bg-bg border-line text-ink-soft'
                      }`}
                    >
                      Non-Veg
                    </button>
                  </div>
                </div>
              </div>

              {/* Slider ratings */}
              <div className="bg-bg-alt/30 border border-line rounded-xl p-3 space-y-2">
                <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-primary" />
                  Rate Plating & dining Experience
                </span>

                <div className="space-y-1.5 text-xs">
                  {/* Plating presentation */}
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-medium text-ink-soft w-28">Plating Design</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={platingRating}
                      onChange={e => setPlatingRating(parseFloat(e.target.value))}
                      className="flex-1 accent-primary cursor-pointer h-1.5 bg-line rounded-lg appearance-none"
                    />
                    <span className="font-bold text-primary w-10 text-right">{platingRating} ★</span>
                  </div>

                  {/* Food taste */}
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-medium text-ink-soft w-28">Food Taste</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={tasteRating}
                      onChange={e => setTasteRating(parseFloat(e.target.value))}
                      className="flex-1 accent-primary cursor-pointer h-1.5 bg-line rounded-lg appearance-none"
                    />
                    <span className="font-bold text-primary w-10 text-right">{tasteRating} ★</span>
                  </div>

                  {/* Ambiance */}
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-medium text-ink-soft w-28">Restaurant Decor</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={ambianceRating}
                      onChange={e => setAmbianceRating(parseFloat(e.target.value))}
                      className="flex-1 accent-primary cursor-pointer h-1.5 bg-line rounded-lg appearance-none"
                    />
                    <span className="font-bold text-primary w-10 text-right">{ambianceRating} ★</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center gap-4 pt-2">
                <Button variant="outline" size="sm" onClick={handleBack} className="w-24 text-xs">Back</Button>
                <Button variant="primary" size="sm" onClick={handlePublish} className="flex-1 text-xs py-2.5 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Post</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
