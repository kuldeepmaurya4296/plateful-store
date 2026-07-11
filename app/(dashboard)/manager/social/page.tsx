'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { SaaSUpgradeGate } from '@/components/shared/SaaSUpgradeGate';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { hoverScale, staggerContainer, listItem } from '@/lib/animations';
import { 
  Share2, 
  Plus, 
  Sparkles, 
  Clock, 
  Tag, 
  Star, 
  Layout, 
  Trash2, 
  Tv,
  Check
} from 'lucide-react';
import { FileUpload } from '@/components/ui/FileUpload';
import { putBlob } from '@/lib/indexedDb';

export default function ManagerSocialPage() {
  const { user } = useAuth();
  const { stories, addStory, toggleStoryPermanent, menuItems, tables, addTable, restaurants } = useApp();
  const { toast } = useToast();

  const userRestaurant = restaurants.find(r => r.id === user?.restaurantId);
  const currentPlan = (userRestaurant?.subscriptionPlan || 'Basic') as 'Basic' | 'Premium' | 'Enterprise';

  // Story state
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [storyTitle, setStoryTitle] = useState('');
  const [storyIsPermanent, setStoryIsPermanent] = useState(false);
  const [storyFile, setStoryFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Discount campaign state
  const [discountPercent, setDiscountPercent] = useState('15');
  const [discountCategory, setDiscountCategory] = useState('Starters');

  // Today's special state
  const [specialItemId, setSpecialItemId] = useState('m1');

  // Table editor state
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const [tableCapacity, setTableCapacity] = useState('4');

  const currentStories = stories.filter(s => s.restaurantId === user?.restaurantId);
  const items = menuItems.filter(m => m.restaurantId === user?.restaurantId);
  const tenantTables = tables.filter(t => t.restaurantId === user?.restaurantId);
  const selectedSpecial = items.find(i => i.id === specialItemId) || items[0];

  const handlePostStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTitle.trim()) {
      toast({
        type: 'error',
        title: 'Title Required',
        description: 'Please enter a story title.'
      });
      return;
    }

    if (!storyFile) {
      toast({
        type: 'error',
        title: 'Media Required',
        description: 'Please select a story image or video file to publish.'
      });
      return;
    }

    setIsUploading(true);
    const mediaKey = `story_${Date.now()}`;
    let mediaUrl = '/images/story-tikka.jpg'; // default fallback

    try {
      await putBlob(mediaKey, storyFile);
      mediaUrl = `indexeddb://${mediaKey}`;
    } catch (e) {
      console.error('Failed to store story media', e);
      toast({
        type: 'error',
        title: 'Upload Failed',
        description: 'Could not save story media locally.'
      });
      setIsUploading(false);
      return;
    }

    const newStory = {
      id: `s_dyn_${Date.now()}`,
      restaurantId: user?.restaurantId || 'r1',
      mediaUrl: mediaUrl,
      caption: storyTitle, // stories data uses caption for title
      isPermanent: storyIsPermanent,
      views: 0,
      createdAt: new Date().toISOString(),
      expiresAt: storyIsPermanent ? null : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    addStory(newStory);
    setShowStoryModal(false);
    setStoryTitle('');
    setStoryFile(null);
    setIsUploading(false);
    toast({
      type: 'success',
      title: 'Story Published',
      description: `"${storyTitle}" is now live on the customer discover feed.`
    });
  };

  const handleToggleStoryMode = (storyId: string, title: string, currentVal: boolean) => {
    toggleStoryPermanent(storyId);
    toast({
      type: 'info',
      title: 'Story Settings Updated',
      description: `"${title}" has been set to ${!currentVal ? 'Featured (Permanent)' : '24-hour Expiration'}.`
    });
  };

  const handleLaunchDiscount = () => {
    toast({
      type: 'success',
      title: 'Discount Campaign Active',
      description: `Launched ${discountPercent}% discount code for all items in "${discountCategory}".`
    });
  };

  const handleSetSpecial = (itemId: string) => {
    setSpecialItemId(itemId);
    const item = items.find(i => i.id === itemId);
    toast({
      type: 'success',
      title: "Today's Special Set",
      description: `"${item?.name}" has been highlighted as today's culinary specialty.`
    });
  };

  const handleAddTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(tableNumber);
    if (isNaN(num) || num <= 0) {
      toast({
        type: 'error',
        title: 'Invalid Table Number',
        description: 'Please enter a positive number.'
      });
      return;
    }

    // Check if table number already exists
    const duplicate = tables.find(t => t.number === num);
    if (duplicate) {
      toast({
        type: 'error',
        title: 'Duplicate Table',
        description: `Table ${num} already exists on the floor plan.`
      });
      return;
    }

    const newTable = {
      id: `t${num}`,
      number: num,
      capacity: parseInt(tableCapacity),
      status: 'available' as const,
      counterId: num <= 8 ? 'c1' : 'c2',
      restaurantId: user?.restaurantId || 'r1',
      qrToken: `qr_t${num}`,
      activeSession: null
    };

    addTable(newTable);
    setShowTableModal(false);
    setTableNumber('');
    toast({
      type: 'success',
      title: 'Floor Plan Updated',
      description: `Table ${num} (Capacity: ${tableCapacity}) has been added to the floor layout.`
    });
  };

  // Suggest next table number
  const getNextTableSuggestion = () => {
    const maxNum = tables.reduce((max, t) => t.number > max ? t.number : max, 0);
    return maxNum + 1;
  };

  const handleOpenAddTable = () => {
    setTableNumber(getNextTableSuggestion().toString());
    setTableCapacity('4');
    setShowTableModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-serif font-bold text-ink">Manage social & marketing</h1>
        <p className="text-xs text-ink-soft font-medium mt-0.5">Post customer stories, launch discount coupons, highlight today's special, and arrange the floor plan.</p>
      </div>

      <SaaSUpgradeGate
        currentPlan={currentPlan}
        requiredPlan="Premium"
        featureName="Social Media & Floor Map Panel"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Stories & Promos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stories Management */}
          <Card className="space-y-4">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <div className="flex items-center gap-1.5">
                <Tv className="w-4.5 h-4.5 text-primary" />
                <h3 className="text-sm font-serif font-bold text-ink">Active Stories Feed</h3>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowStoryModal(true)} className="flex gap-1 items-center bg-bg border-line">
                <Plus className="w-3.5 h-3.5" />
                <span>Post Story</span>
              </Button>
            </div>

            <div className="space-y-3">
              {currentStories.map(story => (
                <div key={story.id} className="flex justify-between items-center p-3 bg-bg border border-line rounded-lg">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-ink">{story.caption || story.title}</h4>
                    <div className="flex items-center gap-2 text-[9px] text-ink-soft font-medium">
                      <span>{story.views} views</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        {story.isPermanent ? 'Permanent feature' : '24h Expiry'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleStoryMode(story.id, story.caption || story.title || '', story.isPermanent)}
                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                      story.isPermanent 
                        ? 'bg-secondary text-bg border-secondary' 
                        : 'bg-bg-card border-line text-ink hover:bg-bg-alt'
                    }`}
                  >
                    {story.isPermanent ? 'Featured' : '24h Story'}
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Marketing campaigns (Coupons/Discounts & Specials) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Discount Campaign */}
            <Card className="space-y-4">
              <div className="flex items-center gap-1.5 border-b border-line pb-3">
                <Tag className="w-4.5 h-4.5 text-primary" />
                <h3 className="text-sm font-serif font-bold text-ink">Campaign Coupons</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Discount Percent</label>
                  <select 
                    value={discountPercent} 
                    onChange={e => setDiscountPercent(e.target.value)}
                    className="text-xs border border-line rounded p-2 bg-bg-card text-ink"
                  >
                    <option value="10">10% Off</option>
                    <option value="15">15% Off (Default)</option>
                    <option value="20">20% Off</option>
                    <option value="25">25% Off</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Applicable Category</label>
                  <select 
                    value={discountCategory} 
                    onChange={e => setDiscountCategory(e.target.value)}
                    className="text-xs border border-line rounded p-2 bg-bg-card text-ink"
                  >
                    <option value="Starters">Starters</option>
                    <option value="Mains">Mains</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                    <option value="All Items">All Menu Items</option>
                  </select>
                </div>

                <Button variant="primary" fullWidth className="py-2.5 flex items-center justify-center gap-1.5" onClick={handleLaunchDiscount}>
                  <Sparkles className="w-4 h-4" />
                  <span>Launch Discount Coupon</span>
                </Button>
              </div>
            </Card>

            {/* Today's Special Selector */}
            <Card className="space-y-4">
              <div className="flex items-center gap-1.5 border-b border-line pb-3">
                <Star className="w-4.5 h-4.5 text-primary" />
                <h3 className="text-sm font-serif font-bold text-ink">Today's Special</h3>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Select Dish</label>
                  <select 
                    value={specialItemId} 
                    onChange={e => handleSetSpecial(e.target.value)}
                    className="text-xs border border-line rounded p-2 bg-bg-card text-ink"
                  >
                    {items.map(item => (
                      <option key={item.id} value={item.id}>{item.name} (₹{item.price})</option>
                    ))}
                  </select>
                </div>

                {selectedSpecial && (
                  <div className="bg-primary-soft/30 border border-primary/10 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-ink">{selectedSpecial.name}</span>
                      <Badge variant="primary">Featured</Badge>
                    </div>
                    <p className="text-[10px] text-ink-soft italic leading-normal">
                      "Plating: {selectedSpecial.presentationNote || 'Standard kitchen guidelines.'}"
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column: Visual Table Floor Layout Editor */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="space-y-4">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <div className="flex items-center gap-1.5">
                <Layout className="w-4.5 h-4.5 text-primary" />
                <h3 className="text-sm font-serif font-bold text-ink">Table Floor Layout</h3>
              </div>
              <Button variant="outline" size="sm" onClick={handleOpenAddTable} className="flex gap-1 items-center bg-bg border-line">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Table</span>
              </Button>
            </div>

            <p className="text-[10px] text-ink-soft leading-normal font-medium">
              Rearrange table layout. Adding tables here updates the manager Table Grid and Captain terminal grid in real-time.
            </p>

            <div className="grid grid-cols-3 gap-2.5 p-3 bg-bg rounded-lg border border-line">
              {tenantTables.map(table => (
                <div 
                  key={table.id}
                  className="bg-bg-card border border-line rounded-lg py-3 px-1 text-center flex flex-col justify-center items-center shadow-sm select-none"
                >
                  <span className="text-xs font-bold text-ink font-serif">T{table.number}</span>
                  <span className="text-[9px] text-ink-soft mt-0.5">Cap: {table.capacity}</span>
                  <Badge variant={table.status === 'available' ? 'success' : (table.status === 'occupied' ? 'danger' : 'warning')} className="scale-80 mt-1">
                    {table.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </SaaSUpgradeGate>

      {/* Post Story Modal */}
      <Modal
        isOpen={showStoryModal}
        onClose={() => setShowStoryModal(false)}
        title="Post Video/Image Story"
      >
        <form onSubmit={handlePostStory} className="space-y-4">
          <Input
            label="Story Title / Headline"
            type="text"
            value={storyTitle}
            onChange={e => setStoryTitle(e.target.value)}
            required
            placeholder="e.g. Try our sizzling Galouti Dream!"
          />

          <FileUpload 
            onChange={setStoryFile}
            aspectRatio="9:16"
            label="Story Photo or Video (9:16)"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Expiration Settings</label>
            <div className="flex flex-col sm:flex-row gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs text-ink cursor-pointer font-medium">
                <input 
                  type="radio" 
                  name="story_expiry" 
                  checked={!storyIsPermanent} 
                  onChange={() => setStoryIsPermanent(false)}
                  className="cursor-pointer"
                />
                <span>Delete after 24 hours (Promo story)</span>
              </label>
              
              <label className="flex items-center gap-2 text-xs text-ink cursor-pointer font-medium">
                <input 
                  type="radio" 
                  name="story_expiry" 
                  checked={storyIsPermanent} 
                  onChange={() => setStoryIsPermanent(true)}
                  className="cursor-pointer"
                />
                <span>Pin to Featured (Permanent story)</span>
              </label>
            </div>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            disabled={isUploading}
            className="py-2.5 flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span>{isUploading ? 'Publishing...' : 'Publish Story'}</span>
          </Button>
        </form>
      </Modal>

      {/* Add Table Modal */}
      <Modal
        isOpen={showTableModal}
        onClose={() => setShowTableModal(false)}
        title="Add Floor Table Layout"
      >
        <form onSubmit={handleAddTableSubmit} className="space-y-4">
          <Input
            label="Table Number"
            type="number"
            value={tableNumber}
            onChange={e => setTableNumber(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Capacity (Guests)</label>
            <select
              value={tableCapacity}
              onChange={e => setTableCapacity(e.target.value)}
              className="text-xs border border-line rounded p-2 bg-bg-card text-ink"
            >
              <option value="2">2 guests (Cafe size)</option>
              <option value="4">4 guests (Standard family)</option>
              <option value="6">6 guests (Large table)</option>
              <option value="8">8 guests (Group/Party table)</option>
            </select>
          </div>

          <Button type="submit" variant="primary" fullWidth className="py-2.5 flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>Confirm Add to Floor Plan</span>
          </Button>
        </form>
      </Modal>
    </div>
  );
}
