'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, listItem } from '@/lib/animations';
import { 
  ChefHat, 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Info, 
  ToggleLeft, 
  ToggleRight
} from 'lucide-react';

const CATEGORIES = ['Starters', 'Mains', 'Desserts', 'Beverages'];

export const MenuEditorView: React.FC = () => {
  const { user } = useAuth();
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useApp();
  const { toast } = useToast();

  const [activeCategory, setActiveCategory] = useState<string>('Starters');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCategory, setFormCategory] = useState('Starters');
  const [formIsVeg, setFormIsVeg] = useState(true);
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  const [formDescription, setFormDescription] = useState('');
  const [formPresentationNote, setFormPresentationNote] = useState('');

  const currentItems = menuItems.filter(item => item.restaurantId === user?.restaurantId);
  const filteredItems = currentItems.filter(item => {
    const matchesCategory = item.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiet = dietFilter === 'all' || 
                        (dietFilter === 'veg' && item.isVeg) || 
                        (dietFilter === 'non-veg' && !item.isVeg);

    return matchesCategory && matchesSearch && matchesDiet;
  });

  const handleOpenAdd = () => {
    setFormName('');
    setFormPrice('');
    setFormCategory(activeCategory);
    setFormIsVeg(true);
    setFormIsAvailable(true);
    setFormDescription('');
    setFormPresentationNote('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormPrice(item.price.toString());
    setFormCategory(item.category);
    setFormIsVeg(item.isVeg);
    setFormIsAvailable(item.isAvailable);
    setFormDescription(item.description);
    setFormPresentationNote(item.presentationNote || '');
    setShowEditModal(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) {
      toast({
        type: 'error',
        title: 'Validation Failed',
        description: 'Dish name and price are required.'
      });
      return;
    }

    const newItem = {
      id: `m_dyn_${Date.now()}`,
      restaurantId: user?.restaurantId || 'r1',
      name: formName,
      price: parseFloat(formPrice),
      category: formCategory,
      isVeg: formIsVeg,
      isAvailable: formIsAvailable,
      description: formDescription,
      presentationNote: formPresentationNote,
      image: '/images/placeholder.jpg'
    };

    addMenuItem(newItem);
    setShowAddModal(false);
    toast({
      type: 'success',
      title: 'Dish Added',
      description: `"${formName}" has been successfully added to ${formCategory}.`
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!formName.trim() || !formPrice) {
      toast({
        type: 'error',
        title: 'Validation Failed',
        description: 'Dish name and price are required.'
      });
      return;
    }

    const updatedFields = {
      name: formName,
      price: parseFloat(formPrice),
      category: formCategory,
      isVeg: formIsVeg,
      isAvailable: formIsAvailable,
      description: formDescription,
      presentationNote: formPresentationNote
    };

    updateMenuItem(editingItem.id, updatedFields);
    setShowEditModal(false);
    setEditingItem(null);
    toast({
      type: 'success',
      title: 'Dish Updated',
      description: `"${formName}" has been successfully updated.`
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from the menu?`)) {
      deleteMenuItem(id);
      toast({
        type: 'warning',
        title: 'Dish Deleted',
        description: `"${name}" has been removed from the menu.`
      });
    }
  };

  const handleToggleAvailable = (item: any) => {
    updateMenuItem(item.id, { isAvailable: !item.isAvailable });
    toast({
      type: 'info',
      title: 'Availability Changed',
      description: `"${item.name}" is now ${!item.isAvailable ? 'Available' : 'Sold Out'}.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-ink">Menu management</h1>
          <p className="text-xs text-ink-soft font-medium mt-0.5">Manage dish prices, categories, availability, and kitchen presentation notes.</p>
        </div>
        
        <Button variant="primary" size="sm" onClick={handleOpenAdd} className="flex gap-1.5 items-center">
          <Plus className="w-4 h-4" />
          <span>Add Dish</span>
        </Button>
      </div>

      {/* Category Tabs & Subbar filters */}
      <div className="flex flex-col gap-4 border-b border-line pb-4">
        {/* Main Categories Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-1 border-b border-line/50">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 text-xs font-bold font-serif relative transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === category
                  ? 'text-primary'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              {category}
              {activeCategory === category && (
                <motion.div 
                  layoutId="activeCategoryIndicator" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" 
                />
              )}
            </button>
          ))}
        </div>

        {/* Search & Diet Toggle */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Input
              placeholder={`Search in ${activeCategory}...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
            <Search className="w-4 h-4 text-ink-soft absolute left-3 top-3.5" />
          </div>

          <div className="flex bg-bg-alt p-0.5 rounded-lg border border-line text-xs font-semibold self-start md:self-auto">
            {(['all', 'veg', 'non-veg'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDietFilter(d)}
                className={`px-3.5 py-1.5 rounded-md capitalize transition-all cursor-pointer ${
                  dietFilter === d
                    ? 'bg-bg-card text-ink shadow-sm'
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                {d === 'all' ? 'All' : d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dishes grid */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map(item => (
            <motion.div
              key={item.id}
              variants={listItem}
              layout
              className="group"
            >
              <Card hoverEffect className="h-full flex flex-col justify-between !p-0 overflow-hidden relative border-line">
                <div className="bg-bg-alt/30 aspect-video w-full flex flex-col justify-center items-center text-center p-6 border-b border-line relative">
                  <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                    <Badge variant={item.isVeg ? 'success' : 'danger'}>
                      {item.isVeg ? 'Veg' : 'Non-Veg'}
                    </Badge>
                    <Badge variant={item.isAvailable ? 'primary' : 'neutral'}>
                      {item.isAvailable ? 'Available' : 'Sold Out'}
                    </Badge>
                  </div>

                  <ChefHat className="w-8 h-8 text-line mb-1" />
                  <span className="text-[10px] text-ink-soft leading-tight font-medium max-w-[200px]">
                    No custom photo loaded. Plating guide is active.
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-bold text-ink leading-tight">{item.name}</h3>
                      <span className="text-sm font-bold text-primary">₹{item.price}</span>
                    </div>
                    
                    <p className="text-xs text-ink-soft line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {item.presentationNote && (
                      <div className="bg-bg p-2.5 rounded border border-line flex gap-2 items-start text-[10px] text-ink-soft leading-normal">
                        <Info className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-ink uppercase tracking-wider text-[8px] block mb-0.5">Kitchen Plating Guide</span>
                          {item.presentationNote}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-line/60 pt-3 flex justify-between items-center">
                    <button
                      onClick={() => handleToggleAvailable(item)}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-ink-soft hover:text-ink cursor-pointer"
                      title={item.isAvailable ? 'Mark as Sold Out' : 'Mark as Available'}
                    >
                      {item.isAvailable ? (
                        <ToggleRight className="w-5 h-5 text-success" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-ink-soft/40" />
                      )}
                      <span>{item.isAvailable ? 'Available' : 'Sold Out'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="!p-1.5 rounded hover:bg-bg-alt text-ink-soft hover:text-ink"
                        onClick={() => handleOpenEdit(item)}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="!p-1.5 rounded hover:bg-danger-bg/25 text-ink-soft hover:text-danger"
                        onClick={() => handleDelete(item.id, item.name)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="col-span-full py-16 text-center bg-bg-card border border-line rounded-lg">
            <ChefHat className="w-8 h-8 text-line mx-auto mb-3" />
            <h3 className="text-base font-serif font-bold text-ink">No dishes found</h3>
            <p className="text-xs text-ink-soft mt-1.5">There are no dishes matching this selection.</p>
          </div>
        )}
      </motion.div>

      {/* Add Dish Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Menu Item"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Dish Name"
            type="text"
            value={formName}
            onChange={e => setFormName(e.target.value)}
            required
            placeholder="e.g. Volcano Paneer Tikka"
          />

          <Input
            label="Price (₹)"
            type="number"
            value={formPrice}
            onChange={e => setFormPrice(e.target.value)}
            required
            placeholder="e.g. 320"
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">
                Category
              </label>
              <select
                value={formCategory}
                onChange={e => setFormCategory(e.target.value)}
                className="text-xs border border-line rounded p-2 bg-bg-card text-ink"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">
                Dietary Code
              </label>
              <select
                value={formIsVeg ? 'veg' : 'nonveg'}
                onChange={e => setFormIsVeg(e.target.value === 'veg')}
                className="text-xs border border-line rounded p-2 bg-bg-card text-ink"
              >
                <option value="veg">Vegetarian</option>
                <option value="nonveg">Non-Vegetarian</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={formDescription}
              onChange={e => setFormDescription(e.target.value)}
              placeholder="Flavor notes, ingredients info..."
              className="text-xs min-h-[70px] resize-none border border-line rounded p-2 bg-bg-card text-ink"
              maxLength={200}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">
              Plating & Presentation Guide
            </label>
            <textarea
              value={formPresentationNote}
              onChange={e => setFormPresentationNote(e.target.value)}
              placeholder="e.g. Served hot on slate, garnished with micro-greens..."
              className="text-xs min-h-[70px] resize-none border border-line rounded p-2 bg-bg-card text-ink"
              maxLength={200}
            />
          </div>

          <Button type="submit" variant="primary" fullWidth className="py-2.5 flex items-center justify-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Create Dish Record</span>
          </Button>
        </form>
      </Modal>

      {/* Edit Dish Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingItem(null);
        }}
        title="Edit Menu Item"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Dish Name"
            type="text"
            value={formName}
            onChange={e => setFormName(e.target.value)}
            required
          />

          <Input
            label="Price (₹)"
            type="number"
            value={formPrice}
            onChange={e => setFormPrice(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">
                Category
              </label>
              <select
                value={formCategory}
                onChange={e => setFormCategory(e.target.value)}
                className="text-xs border border-line rounded p-2 bg-bg-card text-ink"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">
                Dietary Code
              </label>
              <select
                value={formIsVeg ? 'veg' : 'nonveg'}
                onChange={e => setFormIsVeg(e.target.value === 'veg')}
                className="text-xs border border-line rounded p-2 bg-bg-card text-ink"
              >
                <option value="veg">Vegetarian</option>
                <option value="nonveg">Non-Vegetarian</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={formDescription}
              onChange={e => setFormDescription(e.target.value)}
              className="text-xs min-h-[70px] resize-none border border-line rounded p-2 bg-bg-card text-ink"
              maxLength={200}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">
              Plating & Presentation Guide
            </label>
            <textarea
              value={formPresentationNote}
              onChange={e => setFormPresentationNote(e.target.value)}
              className="text-xs min-h-[70px] resize-none border border-line rounded p-2 bg-bg-card text-ink"
              maxLength={200}
            />
          </div>

          <Button type="submit" variant="primary" fullWidth className="py-2.5 flex items-center justify-center gap-1.5">
            <span>Save Dish Record</span>
          </Button>
        </form>
      </Modal>
    </div>
  );
};
