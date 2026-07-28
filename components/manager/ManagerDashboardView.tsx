'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { ManagerKpiCards } from './ManagerKpiCards';
import { ManagerSalesChart } from './ManagerSalesChart';
import { ManagerChannelSplitChart } from './ManagerChannelSplitChart';

export const ManagerDashboardView: React.FC = () => {
  const { user } = useAuth();
  const { bills, expenses, reviews, orders } = useApp();
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

  const tenantExpenses = expenses.filter(e => e.restaurantId === user?.restaurantId);
  const tenantReviews = reviews.filter(r => r.restaurantId === user?.restaurantId);

  const totalExpenses = tenantExpenses.reduce((acc, curr) => acc + curr.cost, 0);

  const avgFood = tenantReviews.length > 0 
    ? (tenantReviews.reduce((acc, curr) => acc + curr.foodRating, 0) / tenantReviews.length).toFixed(1) 
    : '4.7';
  const avgPlating = tenantReviews.length > 0 
    ? (tenantReviews.reduce((acc, curr) => acc + curr.presentationRating, 0) / tenantReviews.length).toFixed(1) 
    : '4.5';
  const avgAmbiance = tenantReviews.length > 0 
    ? (tenantReviews.reduce((acc, curr) => acc + curr.ambianceRating, 0) / tenantReviews.length).toFixed(1) 
    : '4.4';

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-ink">Manager Console</h1>
        <p className="text-xs text-ink-soft mt-0.5 font-medium">Real-time outlet performance, channel breakdown, and feedback analysis.</p>
      </div>

      {/* KPI Cards */}
      <ManagerKpiCards
        todaySales={analytics.todaySales}
        monthlyRevenue={analytics.monthlyRevenue}
        totalExpenses={totalExpenses}
        ordersCount={orders.length}
      />

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ManagerSalesChart
          salesData={analytics.salesData}
          period={period}
          onPeriodChange={setPeriod}
        />

        <ManagerChannelSplitChart
          orderTypeData={analytics.orderTypeData}
        />
      </div>

      {/* Ratings Breakdown Card */}
      <Card className="space-y-4">
        <div className="flex justify-between items-center border-b border-line pb-3">
          <div>
            <h3 className="text-sm font-serif font-bold text-ink">Customer Satisfaction Index</h3>
            <p className="text-[10px] text-ink-soft">Calculated from verified post-payment review ratings</p>
          </div>
          <Badge variant="primary">Updated Live</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-bg p-4 rounded-xl border border-line space-y-1">
            <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider block">Food Taste & Quality</span>
            <div className="flex justify-center items-center gap-2">
              <span className="text-2xl font-serif font-bold text-ink">{avgFood}</span>
              <StarRating rating={Number(avgFood)} size="sm" />
            </div>
          </div>

          <div className="bg-bg p-4 rounded-xl border border-line space-y-1">
            <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Visual Plating & Presentation</span>
            <div className="flex justify-center items-center gap-2">
              <span className="text-2xl font-serif font-bold text-ink">{avgPlating}</span>
              <StarRating rating={Number(avgPlating)} size="sm" />
            </div>
          </div>

          <div className="bg-bg p-4 rounded-xl border border-line space-y-1">
            <span className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Ambiance & Seating Comfort</span>
            <div className="flex justify-center items-center gap-2">
              <span className="text-2xl font-serif font-bold text-ink">{avgAmbiance}</span>
              <StarRating rating={Number(avgAmbiance)} size="sm" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
