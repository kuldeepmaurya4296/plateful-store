'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import { hoverScale, staggerContainer, listItem } from '@/lib/animations';
import { 
  Building2, 
  Plus, 
  Search, 
  Sliders, 
  ToggleLeft, 
  ToggleRight, 
  MapPin, 
  Coffee,
  Check
} from 'lucide-react';

export default function SuperadminTenantsPage() {
  const { restaurants, updateTenantSubscription, toggleTenantStatus, addTenantRestaurant } = useApp();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New tenant form state
  const [tenantName, setTenantName] = useState('');
  const [tenantCity, setTenantCity] = useState('Mumbai');
  const [tenantCuisine, setTenantCuisine] = useState('');
  const [tenantPlan, setTenantPlan] = useState('Basic');
  const [tenantEmail, setTenantEmail] = useState('');

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName.trim() || !tenantCuisine.trim()) {
      toast({
        type: 'error',
        title: 'Fields Required',
        description: 'Please enter tenant restaurant name and cuisine type.'
      });
      return;
    }

    const newId = `r${restaurants.length + 1}`;
    const newTenant = {
      id: newId,
      name: tenantName,
      city: tenantCity,
      cuisine: tenantCuisine,
      rating: 5.0,
      reviewCount: 0,
      avatar: tenantName.substring(0, 2).toUpperCase(),
      description: `Delicious ${tenantCuisine} served hot. Scanned menu ready.`,
      phone: '+91-9000088888',
      email: tenantEmail || `contact@${tenantName.toLowerCase().replace(/\s+/g, '')}.com`,
      features: ['Veg', 'Dine-in'],
      coverImage: '/images/placeholder.jpg',
      subscriptionPlan: tenantPlan,
      subscriptionStatus: 'Active'
    };

    addTenantRestaurant(newTenant);
    setShowAddModal(false);
    
    // Clear states
    setTenantName('');
    setTenantCuisine('');
    setTenantEmail('');

    toast({
      type: 'success',
      title: 'Tenant Registered',
      description: `"${tenantName}" has been successfully added to Plateful SaaS platform on ${tenantPlan} plan.`
    });
  };

  const handlePlanChange = (restaurantId: string, name: string, plan: string) => {
    updateTenantSubscription(restaurantId, plan);
    toast({
      type: 'success',
      title: 'Subscription Changed',
      description: `"${name}" subscription updated to ${plan} Plan.`
    });
  };

  const handleToggleStatus = (restaurantId: string, name: string, currentStatus: string) => {
    toggleTenantStatus(restaurantId);
    toast({
      type: 'info',
      title: currentStatus === 'Active' ? 'Tenant Suspended' : 'Tenant Activated',
      description: `"${name}" billing access is now ${currentStatus === 'Active' ? 'Suspended' : 'Active'}.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-ink">Manage restaurant tenants</h1>
          <p className="text-xs text-ink-soft font-medium mt-0.5">Edit tenant subscription packages, audit billing status, and provision new outlets.</p>
        </div>
        
        <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)} className="flex gap-1.5 items-center">
          <Plus className="w-4 h-4" />
          <span>Provision Tenant</span>
        </Button>
      </div>

      {/* Filter panel */}
      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
        <div className="flex-1 max-w-sm relative">
          <Input
            placeholder="Search tenant name, cuisine..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
          <Search className="w-4 h-4 text-ink-soft absolute left-3 top-3.5" />
        </div>
      </Card>

      {/* Tenants Table Grid */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <AnimatePresence mode="popLayout">
          {filteredRestaurants.map(r => (
            <motion.div key={r.id} variants={listItem} layout className="group">
              <Card hoverEffect className="h-full flex flex-col justify-between border-line">
                <div className="space-y-3">
                  <div className="flex justify-between items-start border-b border-line pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-soft text-primary font-bold text-sm flex items-center justify-center border border-primary/10">
                        {r.avatar}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-ink leading-tight">{r.name}</h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-ink-soft mt-1.5 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <span>{r.city}</span>
                          <span>·</span>
                          <span className="font-semibold text-secondary">{r.cuisine}</span>
                        </div>
                      </div>
                    </div>

                    <Badge variant={r.subscriptionStatus === 'Active' ? 'success' : 'neutral'}>
                      {r.subscriptionStatus}
                    </Badge>
                  </div>

                  {/* Plan dropdown selectors & toggle actions */}
                  <div className="space-y-3 pt-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-ink-soft">Billing Package</span>
                      <select
                        value={r.subscriptionPlan || 'Basic'}
                        onChange={e => handlePlanChange(r.id, r.name, e.target.value)}
                        className="text-[11px] border border-line rounded px-2 py-1 bg-bg-card font-semibold text-ink"
                      >
                        <option value="Basic">Basic Plan</option>
                        <option value="Premium">Premium Plan</option>
                        <option value="Enterprise">Enterprise Plan</option>
                      </select>
                    </div>

                    <div className="flex justify-between items-center text-xs border-t border-line/60 pt-2.5">
                      <span className="font-semibold text-ink-soft">Access Status</span>
                      
                      <button
                        onClick={() => handleToggleStatus(r.id, r.name, r.subscriptionStatus)}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-ink-soft hover:text-ink cursor-pointer"
                      >
                        {r.subscriptionStatus === 'Active' ? (
                          <ToggleRight className="w-5.5 h-5.5 text-success" />
                        ) : (
                          <ToggleLeft className="w-5.5 h-5.5 text-ink-soft/40" />
                        )}
                        <span>{r.subscriptionStatus === 'Active' ? 'Enabled' : 'Suspended'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Provision Tenant Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Provision SaaS Restaurant Tenant"
      >
        <form onSubmit={handleCreateTenant} className="space-y-4">
          <Input
            label="Restaurant Name"
            type="text"
            value={tenantName}
            onChange={e => setTenantName(e.target.value)}
            required
            placeholder="e.g. Pizza Palace"
          />

          <Input
            label="Cuisine Category"
            type="text"
            value={tenantCuisine}
            onChange={e => setTenantCuisine(e.target.value)}
            required
            placeholder="e.g. Italian & Pizzas"
          />

          <Input
            label="Owner / Contact Email"
            type="email"
            value={tenantEmail}
            onChange={e => setTenantEmail(e.target.value)}
            placeholder="e.g. owner@pizzapalace.com"
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">City Location</label>
              <select
                value={tenantCity}
                onChange={e => setTenantCity(e.target.value)}
                className="text-xs border border-line rounded p-2 bg-bg-card text-ink"
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Pune">Pune</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">SaaS Tier Plan</label>
              <select
                value={tenantPlan}
                onChange={e => setTenantPlan(e.target.value)}
                className="text-xs border border-line rounded p-2 bg-bg-card text-ink"
              >
                <option value="Basic">Basic Plan</option>
                <option value="Premium">Premium Plan</option>
                <option value="Enterprise">Enterprise Plan</option>
              </select>
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth className="py-2.5 flex justify-center items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>Create Tenant Workspace</span>
          </Button>
        </form>
      </Modal>
    </div>
  );
}
