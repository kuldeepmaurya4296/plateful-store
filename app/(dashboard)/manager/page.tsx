'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Star, 
  Receipt,
  Utensils
} from 'lucide-react';

export default function ManagerDashboardPage() {
  const { user } = useAuth();
  const { bills, expenses, reviews } = useApp();
  const [period, setPeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');

  const [analytics, setAnalytics] = useState<{
    todaySales: number;
    monthlyRevenue: number;
    salesData: Array<{ name: string; sales: number }>;
    orderTypeData: Array<{ name: string; value: number; color: string }>;
  }>({
    todaySales: 18400,
    monthlyRevenue: 420000,
    salesData: [
      { name: 'Jan', sales: 320000 },
      { name: 'Feb', sales: 298000 },
      { name: 'Mar', sales: 410000 },
      { name: 'Apr', sales: 385000 },
      { name: 'May', sales: 402000 },
      { name: 'Jun', sales: 420000 }
    ],
    orderTypeData: [
      { name: 'Dine-in', value: 58, color: '#C1502E' },
      { name: 'Online', value: 27, color: '#6E7456' },
      { name: 'Takeaway', value: 15, color: '#B8862E' }
    ]
  });

  useEffect(() => {
    fetch(`/api/analytics/sales?restaurantId=${user?.restaurantId || 'r1'}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setAnalytics(data);
        }
      })
      .catch(err => console.error('Error fetching analytics:', err));
  }, [user?.restaurantId]);

  const salesData = analytics.salesData;
  const orderTypeData = analytics.orderTypeData;

  const tenantBills = bills.filter(b => b.restaurantId === user?.restaurantId);
  const tenantExpenses = expenses.filter(e => e.restaurantId === user?.restaurantId);
  const tenantReviews = reviews.filter(r => r.restaurantId === user?.restaurantId);

  const todaySales = analytics.todaySales;
  const totalExpenses = tenantExpenses.reduce((acc, curr) => acc + curr.cost, 0);

  const avgFood = tenantReviews.length > 0 ? (tenantReviews.reduce((acc, curr) => acc + curr.foodRating, 0) / tenantReviews.length).toFixed(1) : '4.7';
  const avgPlating = tenantReviews.length > 0 ? (tenantReviews.reduce((acc, curr) => acc + curr.presentationRating, 0) / tenantReviews.length).toFixed(1) : '4.5';
  const avgAmbiance = tenantReviews.length > 0 ? (tenantReviews.reduce((acc, curr) => acc + curr.ambianceRating, 0) / tenantReviews.length).toFixed(1) : '4.4';

  return (
    <div className="space-y-6">
      {/* Period Toggle & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-ink">Dashboard Analytics</h1>
          <p className="text-xs text-ink-soft mt-0.5 font-medium">Real-time revenue, profit tracking, and plating reports.</p>
        </div>
        
        {/* Toggle */}
        <div className="flex bg-bg-alt p-0.5 rounded-lg border border-line text-xs font-semibold self-start sm:self-auto">
          {(['daily', 'monthly', 'yearly'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-md capitalize transition-all cursor-pointer ${
                period === p
                  ? 'bg-bg-card text-ink shadow-sm'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary p-3 rounded-lg">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-ink-soft font-semibold uppercase tracking-wider">Today's Sales</p>
            <h3 className="text-xl font-bold text-ink mt-0.5">₹{todaySales.toLocaleString()}</h3>
            <span className="text-[10px] text-success font-bold flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" /> +12% from yesterday
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="bg-secondary/10 text-secondary p-3 rounded-lg">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-ink-soft font-semibold uppercase tracking-wider">Monthly Revenue</p>
            <h3 className="text-xl font-bold text-ink mt-0.5">₹4.2L</h3>
            <span className="text-[10px] text-success font-bold flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" /> +8% vs last month
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="bg-amber-accent/10 text-amber-accent p-3 rounded-lg">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-ink-soft font-semibold uppercase tracking-wider">Logged Expenses</p>
            <h3 className="text-xl font-bold text-ink mt-0.5">₹{totalExpenses.toLocaleString()}</h3>
            <p className="text-[10px] text-ink-soft mt-0.5 font-medium">Sales and expenses are tracked independently</p>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sales Chart (Bar) */}
        <Card className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-serif font-bold text-ink">Monthly Sales Trend</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#6B6256" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B6256" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip formatter={(value) => [value !== undefined && value !== null ? `₹${value.toLocaleString()}` : '₹0', 'Sales']} />
                <Bar dataKey="sales" fill="#C1502E" radius={[4, 4, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Order split Chart (Pie) */}
        <Card className="space-y-4">
          <h3 className="text-sm font-serif font-bold text-ink">Sales Split by Channel</h3>
          <div className="h-64 w-full flex flex-col justify-center items-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={orderTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {orderTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => v !== undefined && v !== null ? `${v}%` : '0%'} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <div className="flex gap-4 text-xs font-semibold text-ink-soft">
              {orderTypeData.map(entry => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
                  <span>{entry.name} {entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Review summary (Food Taste, Presentation, Ambiance) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="space-y-4 lg:col-span-2">
          <h3 className="text-sm font-serif font-bold text-ink">Plating & Taste feedback</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-bg p-4 rounded-lg text-center space-y-2 border border-line">
              <span className="text-xs font-bold text-ink-soft block uppercase tracking-wide">Food Taste</span>
              <p className="text-2xl font-bold text-ink">{avgFood}</p>
              <div className="flex justify-center">
                <StarRating rating={Math.round(parseFloat(avgFood))} size="sm" />
              </div>
            </div>
            
            <div className="bg-bg p-4 rounded-lg text-center space-y-2 border border-line">
              <span className="text-xs font-bold text-ink-soft block uppercase tracking-wide">Presentation</span>
              <p className="text-2xl font-bold text-ink">{avgPlating}</p>
              <div className="flex justify-center">
                <StarRating rating={Math.round(parseFloat(avgPlating))} size="sm" />
              </div>
            </div>

            <div className="bg-bg p-4 rounded-lg text-center space-y-2 border border-line">
              <span className="text-xs font-bold text-ink-soft block uppercase tracking-wide">Ambiance</span>
              <p className="text-2xl font-bold text-ink">{avgAmbiance}</p>
              <div className="flex justify-center">
                <StarRating rating={Math.round(parseFloat(avgAmbiance))} size="sm" />
              </div>
            </div>
          </div>
        </Card>

        {/* Top-selling dish teaser */}
        <Card className="space-y-4">
          <h3 className="text-sm font-serif font-bold text-ink">Top-Selling Dishes</h3>
          <div className="space-y-3 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-ink flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" /> Volcano paneer tikka
              </span>
              <span className="text-ink-soft">42 orders</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-ink flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary" /> Truffle butter naan
              </span>
              <span className="text-ink-soft">35 orders</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-ink flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-accent" /> Galouti dream
              </span>
              <span className="text-ink-soft">29 orders</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
