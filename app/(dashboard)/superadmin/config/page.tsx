'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { 
  Wallet, 
  HelpCircle, 
  Check, 
  Lock, 
  Globe, 
  AlertTriangle,
  Flame,
  ShieldCheck
} from 'lucide-react';

export default function SuperadminConfigPage() {
  const { toast } = useToast();

  const [basicPrice, setBasicPrice] = useState('1,999');
  const [premiumPrice, setPremiumPrice] = useState('4,999');
  const [enterprisePrice, setEnterprisePrice] = useState('9,999');

  const [commissionRate, setCommissionRate] = useState('1.5');
  const [systemUptime, setSystemUptime] = useState('99.98%');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      type: 'success',
      title: 'Pricing Config Updated',
      description: 'SaaS pricing matrices saved and synchronized globally.'
    });
  };

  const handleSavePlatform = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      type: 'success',
      title: 'Platform Config Updated',
      description: 'Commission rules and service flags updated.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-serif font-bold text-ink">SaaS pricing & configuration</h1>
        <p className="text-xs text-ink-soft font-medium mt-0.5">Control pricing tiers, commission cuts, and system maintenance flags.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: SaaS Pricing Tiers */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-1.5 border-b border-line pb-3">
            <Wallet className="w-4.5 h-4.5 text-primary" />
            <h3 className="text-sm font-serif font-bold text-ink">Subscription Plan Matrix</h3>
          </div>

          <form onSubmit={handleSavePricing} className="space-y-6">
            <div className="space-y-4">
              {/* Basic Plan row */}
              <div className="border border-line rounded-lg p-4 bg-bg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink">Basic Plan</span>
                    <Badge variant="neutral">Entry</Badge>
                  </div>
                  <p className="text-[10px] text-ink-soft leading-normal">Allows table management, basic orders, and invoicing.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Price (₹/mo)</span>
                  <Input 
                    type="text" 
                    value={basicPrice} 
                    onChange={e => setBasicPrice(e.target.value)} 
                    className="w-24 text-right text-xs p-1 h-8 font-serif" 
                  />
                </div>
              </div>

              {/* Premium Plan row */}
              <div className="border border-line rounded-lg p-4 bg-bg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink">Premium Plan</span>
                    <Badge variant="primary">Popular</Badge>
                  </div>
                  <p className="text-[10px] text-ink-soft leading-normal">Adds visual pre-bookings, table layout editor, and promotional stories.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Price (₹/mo)</span>
                  <Input 
                    type="text" 
                    value={premiumPrice} 
                    onChange={e => setPremiumPrice(e.target.value)} 
                    className="w-24 text-right text-xs p-1 h-8 font-serif" 
                  />
                </div>
              </div>

              {/* Enterprise Plan row */}
              <div className="border border-line rounded-lg p-4 bg-bg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink">Enterprise Plan</span>
                    <Badge variant="danger">Scale</Badge>
                  </div>
                  <p className="text-[10px] text-ink-soft leading-normal">Adds inventory material forecasting and shift audits.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Price (₹/mo)</span>
                  <Input 
                    type="text" 
                    value={enterprisePrice} 
                    onChange={e => setEnterprisePrice(e.target.value)} 
                    className="w-24 text-right text-xs p-1 h-8 font-serif" 
                  />
                </div>
              </div>
            </div>

            <Button type="submit" variant="primary" size="sm" className="flex items-center gap-1">
              <Check className="w-4 h-4" />
              <span>Update Pricing Tier</span>
            </Button>
          </form>
        </Card>

        {/* Right Column: Platform settings */}
        <div className="space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center gap-1.5 border-b border-line pb-3">
              <Globe className="w-4.5 h-4.5 text-primary" />
              <h3 className="text-sm font-serif font-bold text-ink">Platform Parameters</h3>
            </div>

            <form onSubmit={handleSavePlatform} className="space-y-4 text-xs">
              <Input
                label="Gateway Commission Fee (%)"
                type="number"
                step="0.1"
                value={commissionRate}
                onChange={e => setCommissionRate(e.target.value)}
                className="text-xs"
              />

              <div className="flex justify-between items-center bg-bg p-3 rounded-lg border border-line">
                <div className="space-y-0.5">
                  <span className="font-bold text-ink">System Status</span>
                  <span className="text-[10px] text-ink-soft block">Reported platform health</span>
                </div>
                <Badge variant="success">Healthy</Badge>
              </div>

              <div className="flex justify-between items-center bg-bg p-3 rounded-lg border border-line">
                <div className="space-y-0.5">
                  <span className="font-bold text-danger">Maintenance Mode</span>
                  <span className="text-[10px] text-ink-soft block">Blocks portal login access</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMaintenanceMode(!maintenanceMode);
                    toast({
                      type: 'info',
                      title: 'Maintenance Mode Toggled',
                      description: `Maintenance mode is now ${!maintenanceMode ? 'ACTIVE' : 'INACTIVE'}`
                    });
                  }}
                  className="font-bold text-primary hover:underline cursor-pointer"
                >
                  {maintenanceMode ? 'Disable' : 'Enable'}
                </button>
              </div>

              <Button type="submit" variant="outline" fullWidth className="py-2 flex items-center justify-center gap-1.5 border-line bg-bg">
                <ShieldCheck className="w-4 h-4" />
                <span>Save Platform Rules</span>
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
