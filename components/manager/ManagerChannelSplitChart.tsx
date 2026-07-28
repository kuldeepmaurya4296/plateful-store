'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface ManagerChannelSplitChartProps {
  orderTypeData: Array<{ name: string; value: number; color: string }>;
}

export const ManagerChannelSplitChart: React.FC<ManagerChannelSplitChartProps> = ({ orderTypeData }) => {
  return (
    <Card className="flex flex-col justify-between space-y-4">
      <div>
        <h3 className="text-sm font-serif font-bold text-ink">Order Type Breakdown</h3>
        <p className="text-[10px] text-ink-soft">Channel distribution across dine-in, online & takeaway</p>
      </div>

      <div className="h-48 w-full flex flex-col justify-center items-center relative">
        <ResponsiveContainer width="100%" height="85%">
          <PieChart>
            <Pie
              data={orderTypeData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={4}
              dataKey="value"
            >
              {orderTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Custom Legend */}
        <div className="flex justify-around w-full text-[10px] font-bold text-ink-soft pt-2 border-t border-line/60">
          {orderTypeData.map(entry => (
            <div key={entry.name} className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span>{entry.name} ({entry.value}%)</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
