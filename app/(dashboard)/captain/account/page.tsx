'use client';

import React from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useApp } from '@/lib/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Clock, LogOut, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';

export default function CaptainAccountPage() {
  const { user, logout } = useAuth();
  const { counters } = useApp();

  const counter = counters.find(c => c.id === user?.counterId) || counters[0];

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-20 space-y-6">
      {/* Profile Details */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-secondary-soft text-secondary font-bold text-xl flex items-center justify-center border border-secondary/20">
          {user?.avatar || 'AJ'}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-serif font-bold text-ink leading-tight">
            {user?.name || 'Aman Joshi'}
          </h2>
          <p className="text-xs text-ink-soft mt-0.5 font-medium">Role: Captain / Waiter</p>
        </div>
      </div>

      {/* Shift details */}
      <Card className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">Active Shift Details</h3>
        
        <div className="space-y-3 text-xs text-ink pr-2">
          <div className="flex justify-between items-center pb-2 border-b border-line">
            <span className="font-semibold text-ink-soft">Billing Counter</span>
            <Badge variant="primary">{counter?.name || 'Counter 1'}</Badge>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-line">
            <span className="font-semibold text-ink-soft">Assigned Tables</span>
            <span className="font-medium">{counter?.tableRange || 'Tables 1-8'}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-line">
            <span className="font-semibold text-ink-soft">Shift Start Time</span>
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>06:00 PM (Today)</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-ink-soft">Shift Status</span>
            <div className="flex items-center gap-1.5 font-bold text-success">
              <UserCheck className="w-4 h-4 text-success" />
              <span>Clocked In</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Handover Notice */}
      <Card className="bg-bg-alt/30 space-y-2">
        <div className="flex gap-2 items-start">
          <ShieldAlert className="w-4.5 h-4.5 text-ink-soft mt-0.5" />
          <h4 className="text-xs font-semibold text-ink">Shift Handover Notice</h4>
        </div>
        <p className="text-[10px] text-ink-soft leading-normal">
          Logging off will immediately free this terminal for the next captain shift. Any active table sessions you started will keep your name for audit history and billing records.
        </p>
      </Card>

      {/* Logout button */}
      <div>
        <Button
          variant="outline"
          fullWidth
          onClick={logout}
          className="flex items-center gap-2 justify-center py-3 text-danger border-danger/20 hover:bg-danger-bg/25 hover:border-danger/30"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Clock Out & Log Off</span>
        </Button>
      </div>
    </div>
  );
}
