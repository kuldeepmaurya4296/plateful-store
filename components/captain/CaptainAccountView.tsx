'use client';

import React, { useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useApp } from '@/lib/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { Clock, LogOut, ShieldAlert, UserCheck, Sliders } from 'lucide-react';

export const CaptainAccountView: React.FC = () => {
  const { user, logout } = useAuth();
  const { counters } = useApp();
  const { toast } = useToast();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibeEnabled, setVibeEnabled] = useState(true);
  const [appLang, setAppLang] = useState('English');
  const [autoLock, setAutoLock] = useState('5 min');

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

      {/* Terminal Preferences settings card */}
      <Card className="space-y-4 text-left text-xs text-ink">
        <div className="flex items-center gap-1.5 border-b border-line pb-2.5">
          <Sliders className="w-4 h-4 text-primary" />
          <h3 className="font-serif font-bold text-ink">Terminal Preferences</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-line/60">
            <span className="font-semibold text-ink-soft">Order Sound Alerts</span>
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                toast({
                  type: 'info',
                  title: 'Alert Settings Changed',
                  description: `New order sound alerts ${!soundEnabled ? 'enabled' : 'muted'}.`
                });
              }}
              className={`px-3 py-1 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                soundEnabled 
                  ? 'bg-success-bg text-success border-success/20' 
                  : 'bg-bg-alt/30 border-line text-ink-soft'
              }`}
            >
              {soundEnabled ? 'Enabled' : 'Muted'}
            </button>
          </div>

          <div className="flex items-center justify-between pb-1.5 border-b border-line/60">
            <span className="font-semibold text-ink-soft">Haptic Vibration on tickets</span>
            <button
              onClick={() => {
                setVibeEnabled(!vibeEnabled);
                toast({
                  type: 'info',
                  title: 'Haptic Settings Changed',
                  description: `Ticket vibration feedback ${!vibeEnabled ? 'activated' : 'deactivated'}.`
                });
              }}
              className={`px-3 py-1 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                vibeEnabled 
                  ? 'bg-success-bg text-success border-success/20' 
                  : 'bg-bg-alt/30 border-line text-ink-soft'
              }`}
            >
              {vibeEnabled ? 'Active' : 'Disabled'}
            </button>
          </div>

          <div className="flex items-center justify-between pb-1.5 border-b border-line/60">
            <span className="font-semibold text-ink-soft">Console Language</span>
            <select
              value={appLang}
              onChange={e => {
                setAppLang(e.target.value);
                toast({
                  type: 'success',
                  title: 'Language Updated',
                  description: `Console translated to ${e.target.value}.`
                });
              }}
              className="text-[10px] font-bold p-1 px-2 border border-line rounded bg-bg-card text-ink"
            >
              <option value="English">English (EN)</option>
              <option value="Hindi">Hindi (HI)</option>
              <option value="Marathi">Marathi (MR)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-ink-soft">Inactivity Auto-Lock</span>
            <select
              value={autoLock}
              onChange={e => {
                setAutoLock(e.target.value);
                toast({
                  type: 'info',
                  title: 'Security Settings Updated',
                  description: `Screen auto-lock timer configured to ${e.target.value}.`
                });
              }}
              className="text-[10px] font-bold p-1 px-2 border border-line rounded bg-bg-card text-ink"
            >
              <option value="2 min">2 Minutes</option>
              <option value="5 min">5 Minutes</option>
              <option value="never">Never Lock</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Handover Notice */}
      <Card className="bg-bg-alt/30 space-y-2 text-left">
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
          className="flex items-center gap-2 justify-center py-3 text-danger border-danger/20 hover:bg-danger-bg/25 hover:border-danger/30 cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Clock Out & Log Off</span>
        </Button>
      </div>
    </div>
  );
};
