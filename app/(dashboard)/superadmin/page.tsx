'use client';

import React from 'react';
import { useApp } from '@/lib/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  ShieldAlert, 
  ArrowRight,
  Sparkles,
  Users
} from 'lucide-react';
import Link from 'next/link';

export default function SuperadminDashboardPage() {
  const { restaurants, bills, stories } = useApp();

  // SaaS Calculations
  const activeTenants = restaurants.filter(r => r.subscriptionStatus === 'Active').length;
  
  // Calculate MRR: Basic (1999), Premium (4999), Enterprise (9999)
  const getPlanPrice = (plan: string) => {
    if (plan === 'Enterprise') return 9999;
    if (plan === 'Premium') return 4999;
    return 1999;
  };

  const mrr = restaurants
    .filter(r => r.subscriptionStatus === 'Active')
    .reduce((sum, r) => sum + getPlanPrice(r.subscriptionPlan), 0);

  const arr = mrr * 12;

  // Pie chart data
  const basicCount = restaurants.filter(r => r.subscriptionPlan === 'Basic').length;
  const premiumCount = restaurants.filter(r => r.subscriptionPlan === 'Premium').length;
  const enterpriseCount = restaurants.filter(r => r.subscriptionPlan === 'Enterprise').length;

  const planData = [
    { name: 'Basic', value: basicCount, color: '#6E7456' },
    { name: 'Premium', value: premiumCount, color: '#B8862E' },
    { name: 'Enterprise', value: enterpriseCount, color: '#C1502E' }
  ].filter(d => d.value > 0);

  // Platform total sales
  const platformSales = bills.reduce((sum, b) => sum + b.grandTotal, 0) || 452000;

  // Platform recent events feed
  const platformEvents = [
    { id: 1, type: 'billing', message: 'Spice Route settled Table 4 bill #B-1043 via UPI', time: '5m ago' },
    { id: 2, type: 'story', message: 'Grill House posted a new permanent promotional story', time: '14m ago' },
    { id: 3, type: 'subscription', message: 'Cafe Mocha requested Premium plan upgrade', time: '1h ago' },
    { id: 4, type: 'tenant', message: 'Spice Route added a new Table #13 (Capacity 4) to floor layout', time: '3h ago' },
    { id: 5, type: 'billing', message: 'Grill House settled Table 2 bill #B-9831 via Cash', time: '5h ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Title & Info */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-ink">SaaS Platform Overview</h1>
        <p className="text-xs text-ink-soft mt-0.5 font-medium">Global analytics, subscription health, and multi-tenant activity ticker.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary p-3 rounded-lg">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Annual Recurring Revenue (ARR)</p>
            <h3 className="text-lg font-bold text-ink mt-0.5">₹{(arr).toLocaleString()}</h3>
            <span className="text-[10px] text-success font-bold flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" /> +15.4% ARR Growth
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="bg-secondary/10 text-secondary p-3 rounded-lg">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Active Tenant Outlets</p>
            <h3 className="text-lg font-bold text-ink mt-0.5">{activeTenants} / {restaurants.length}</h3>
            <p className="text-[10px] text-ink-soft mt-0.5 font-medium">100% platform uptime</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="bg-amber-accent/10 text-amber-accent p-3 rounded-lg">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Platform Gross Volume</p>
            <h3 className="text-lg font-bold text-ink mt-0.5">₹{platformSales.toLocaleString()}</h3>
            <p className="text-[10px] text-ink-soft mt-0.5 font-medium">Combined merchant invoices</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="bg-info-bg text-info p-3 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Monthly MRR Total</p>
            <h3 className="text-lg font-bold text-ink mt-0.5">₹{mrr.toLocaleString()}</h3>
            <span className="text-[10px] text-success font-bold flex items-center gap-0.5 mt-0.5">
              <Sparkles className="w-3 h-3" /> Recurring SaaS income
            </span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscription splits */}
        <Card className="flex flex-col justify-between space-y-4">
          <h3 className="text-sm font-serif font-bold text-ink">Subscription Packages</h3>
          
          <div className="h-48 w-full flex flex-col justify-center items-center relative">
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={planData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {planData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <div className="flex gap-4 text-[10px] font-bold text-ink-soft">
              {planData.map(entry => (
                <div key={entry.name} className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
                  <span>{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Live Platform Logs */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-serif font-bold text-ink flex gap-1.5 items-center">
              <Activity className="w-4 h-4 text-primary animate-pulse" />
              <span>Multi-Tenant Live Ticker</span>
            </h3>
            <Badge variant="success">Online</Badge>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {platformEvents.map(evt => (
              <div key={evt.id} className="flex justify-between items-start text-xs border-b border-line pb-2.5 last:border-0 last:pb-0">
                <div className="space-y-0.5">
                  <span className="font-semibold text-ink leading-normal block">{evt.message}</span>
                  <div className="flex items-center gap-1.5">
                    <Badge variant={evt.type === 'billing' ? 'success' : (evt.type === 'subscription' ? 'primary' : 'neutral')} className="scale-75 origin-left">
                      {evt.type}
                    </Badge>
                  </div>
                </div>
                <span className="text-[10px] text-ink-soft font-semibold">{evt.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
