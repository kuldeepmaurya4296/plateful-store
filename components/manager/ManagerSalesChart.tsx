'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface ManagerSalesChartProps {
  salesData: Array<{ name: string; sales: number }>;
  period: 'daily' | 'monthly' | 'yearly';
  onPeriodChange: (p: 'daily' | 'monthly' | 'yearly') => void;
}

export const ManagerSalesChart: React.FC<ManagerSalesChartProps> = ({
  salesData,
  period,
  onPeriodChange
}) => {
  return (
    <Card className="lg:col-span-2 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-serif font-bold text-ink">Sales Revenue Trend</h3>
          <p className="text-[10px] text-ink-soft">Real-time revenue metrics synced from MongoDB Atlas</p>
        </div>
        
        {/* Period Selector Tabs */}
        <div className="flex bg-bg-alt p-1 rounded-md text-[10px] font-semibold border border-line">
          {(['daily', 'monthly', 'yearly'] as const).map(p => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={`px-2.5 py-1 capitalize rounded transition-all cursor-pointer ${
                period === p
                  ? 'bg-bg-card text-primary shadow-sm font-bold'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B6256' }} axisLine={{ stroke: '#E3D9C8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#6B6256' }} axisLine={{ stroke: '#E3D9C8' }} tickFormatter={val => `₹${val/1000}k`} />
            <Tooltip 
              formatter={(val: any) => [`₹${val.toLocaleString()}`, 'Revenue']}
              contentStyle={{ backgroundColor: '#FAF7F2', borderRadius: '8px', borderColor: '#E3D9C8', fontSize: '12px' }}
            />
            <Bar dataKey="sales" fill="#C1502E" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
