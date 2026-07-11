'use client';

import React from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useApp } from '@/lib/AppContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ChevronRight, Grid, User, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function CaptainDashboardPage() {
  const { user } = useAuth();
  const { tables, counters } = useApp();

  // Find assigned counter
  const counter = counters.find(c => c.id === user?.counterId) || counters[0];
  
  // Filter tables assigned to this captain/counter
  const assignedTables = tables.filter(t => t.counterId === counter?.id);

  const getStatusColor = (status: string) => {
    if (status === 'available') return 'success';
    if (status === 'occupied') return 'danger';
    return 'warning';
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-20 space-y-6">
      {/* Captain Profile Banner */}
      <div className="bg-bg-card border border-line rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary-soft text-secondary font-bold text-sm flex items-center justify-center border border-secondary/15">
            {user?.avatar}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink leading-tight">{user?.name}</h3>
            <p className="text-[10px] text-ink-soft mt-0.5 font-medium">
              Counter: {counter?.name || 'Counter 1'} ({counter?.tableRange || 'Tables 1-8'})
            </p>
          </div>
        </div>
        <Badge variant="success">Active Shift</Badge>
      </div>

      {/* Grid Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <Grid className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
            Assigned Table Grid
          </h3>
        </div>

        {/* Table Cells */}
        <div className="grid grid-cols-2 gap-4">
          {assignedTables.map(table => (
            <Link key={table.id} href={`/captain/order/${table.id}`}>
              <Card hoverEffect className={`!p-4 flex flex-col justify-between h-32 border-l-4 ${
                table.status === 'available' ? 'border-l-success' : (table.status === 'occupied' ? 'border-l-danger' : 'border-l-warning')
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-serif font-bold text-ink">Table {table.number}</h4>
                    <p className="text-[10px] text-ink-soft mt-0.5">Capacity: {table.capacity}</p>
                  </div>
                  <Badge variant={getStatusColor(table.status)}>
                    {table.status}
                  </Badge>
                </div>
                
                {/* Active Session Snippet */}
                {table.activeSession ? (
                  <div className="flex justify-between items-center text-[10px] text-ink-soft">
                    <span className="truncate max-w-[90px]">{table.activeSession.customerName}</span>
                    <span className="font-bold text-primary">₹{table.activeSession.total}</span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center text-[10px] text-ink-soft italic">
                    <span>Ready for guests</span>
                    <ChevronRight className="w-3.5 h-3.5 text-line" />
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
