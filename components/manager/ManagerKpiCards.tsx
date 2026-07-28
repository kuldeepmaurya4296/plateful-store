'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { TrendingUp, TrendingDown, DollarSign, Wallet, ShoppingBag } from 'lucide-react';

interface ManagerKpiCardsProps {
  todaySales: number;
  monthlyRevenue: number;
  totalExpenses: number;
  ordersCount: number;
}

export const ManagerKpiCards: React.FC<ManagerKpiCardsProps> = ({
  todaySales,
  monthlyRevenue,
  totalExpenses,
  ordersCount
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <Card className="flex items-center gap-4">
        <div className="bg-primary/10 text-primary p-3 rounded-lg">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Today's Total Sales</p>
          <h3 className="text-lg font-bold text-ink mt-0.5">₹{todaySales.toLocaleString()}</h3>
          <span className="text-[10px] text-success font-bold flex items-center gap-0.5 mt-0.5">
            <TrendingUp className="w-3 h-3" /> +12.5% vs yesterday
          </span>
        </div>
      </Card>

      <Card className="flex items-center gap-4">
        <div className="bg-secondary/10 text-secondary p-3 rounded-lg">
          <Wallet className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Monthly Revenue</p>
          <h3 className="text-lg font-bold text-ink mt-0.5">₹{monthlyRevenue.toLocaleString()}</h3>
          <span className="text-[10px] text-success font-bold flex items-center gap-0.5 mt-0.5">
            <TrendingUp className="w-3 h-3" /> On track for target
          </span>
        </div>
      </Card>

      <Card className="flex items-center gap-4">
        <div className="bg-amber-accent/10 text-amber-accent p-3 rounded-lg">
          <Wallet className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Total Expenses</p>
          <h3 className="text-lg font-bold text-ink mt-0.5">₹{totalExpenses.toLocaleString()}</h3>
          <span className="text-[10px] text-danger font-bold flex items-center gap-0.5 mt-0.5">
            <TrendingDown className="w-3 h-3" /> 18.2% cost ratio
          </span>
        </div>
      </Card>

      <Card className="flex items-center gap-4">
        <div className="bg-info-bg text-info p-3 rounded-lg">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] text-ink-soft font-bold uppercase tracking-wider">Completed Orders</p>
          <h3 className="text-lg font-bold text-ink mt-0.5">{ordersCount}</h3>
          <p className="text-[10px] text-ink-soft font-medium mt-0.5">Dine-in + Online</p>
        </div>
      </Card>
    </div>
  );
};
