'use client';

import React from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  User, 
  ShieldAlert, 
  LogOut, 
  Clock, 
  Lock, 
  Activity,
  Terminal
} from 'lucide-react';

export default function SuperadminAccountPage() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-serif font-bold text-ink">Platform Administrator Account</h1>
        <p className="text-xs text-ink-soft font-medium mt-0.5">Control administrative credentials and view active master session logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1 space-y-4">
          <div className="text-center py-6 space-y-3">
            <div className="w-20 h-20 bg-primary-soft text-primary font-bold text-2xl rounded-full flex items-center justify-center mx-auto border border-primary/20">
              {user?.avatar || 'SA'}
            </div>
            
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-ink">{user?.name || 'SaaS Admin'}</h3>
              <div className="flex justify-center gap-1.5">
                <Badge variant="primary" className="uppercase tracking-wider text-[9px] font-bold py-0.5 px-2">
                  System Admin
                </Badge>
                <Badge variant="success" className="uppercase tracking-wider text-[9px] font-bold py-0.5 px-2">
                  Root Access
                </Badge>
              </div>
            </div>
          </div>

          <div className="border-t border-line/60 pt-4 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-ink-soft">Master Username</span>
              <span className="font-mono text-ink bg-bg px-2 py-0.5 rounded border border-line">{user?.username || 'admin.saas'}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-semibold text-ink-soft">Role Clearance</span>
              <span className="font-bold text-ink capitalize">{user?.role || 'superadmin'}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-line/60">
            <Button 
              variant="danger" 
              fullWidth 
              className="py-2.5 flex items-center justify-center gap-2" 
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span>Log Off SaaS Session</span>
            </Button>
          </div>
        </Card>

        {/* Audit Logs */}
        <Card className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-1.5 border-b border-line pb-3">
            <Terminal className="w-4.5 h-4.5 text-primary" />
            <h3 className="text-sm font-serif font-bold text-ink">Administrative Audits</h3>
          </div>

          <p className="text-[10px] text-ink-soft leading-relaxed max-w-md font-medium">
            Recent security and master overrides logged from your browser instance. Overrides are timestamped and permanent.
          </p>

          <div className="space-y-3 font-mono text-[10px] bg-bg p-4 rounded-lg border border-line max-h-56 overflow-y-auto">
            <div className="text-ink-soft leading-normal">
              <span className="text-success">[2026-07-11 18:31:02]</span> Root session initiated for admin.saas
            </div>
            <div className="text-ink-soft leading-normal">
              <span className="text-success">[2026-07-11 18:33:14]</span> Loaded 3 active tenant partitions (r1, r2, r3)
            </div>
            <div className="text-ink-soft leading-normal">
              <span className="text-success">[2026-07-11 18:35:45]</span> Handshake connection success with local node
            </div>
            <div className="text-ink-soft leading-normal">
              <span className="text-primary">[2026-07-11 18:44:00]</span> Provisioned workspace r4 (Pizza Palace) - initialized Basic plan
            </div>
            <div className="text-ink-soft leading-normal">
              <span className="text-warning">[2026-07-11 18:45:10]</span> Upgraded tenant r3 (Cafe Mocha) to Premium subscription
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
