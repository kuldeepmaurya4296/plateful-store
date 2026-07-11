'use client';

import React, { useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useApp } from '@/lib/AppContext';
import { SaaSUpgradeGate } from '@/components/shared/SaaSUpgradeGate';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { 
  User, 
  Clock, 
  Coins, 
  CreditCard, 
  Calculator, 
  AlertTriangle, 
  CheckCircle,
  LogOut,
  Sparkles
} from 'lucide-react';

export default function ManagerAccountPage() {
  const { user, logout } = useAuth();
  const { bills, restaurants } = useApp();
  const { toast } = useToast();

  const userRestaurant = restaurants.find(r => r.id === user?.restaurantId);
  const currentPlan = (userRestaurant?.subscriptionPlan || 'Basic') as 'Basic' | 'Premium' | 'Enterprise';

  const [physicalCashInput, setPhysicalCashInput] = useState('');
  const [reconciliationNotes, setReconciliationNotes] = useState('');
  const [isReconciled, setIsReconciled] = useState(false);

  // Financial calculations
  // Get all bills settled by current user or defaults for demo
  const tenantBills = bills.filter(b => b.restaurantId === user?.restaurantId);

  const expectedCash = tenantBills
    .filter(b => b.paymentMode === 'Cash')
    .reduce((sum, b) => sum + b.grandTotal, 0) || 5400; // mock default fallback if empty

  const expectedDigital = tenantBills
    .filter(b => b.paymentMode === 'UPI' || b.paymentMode === 'Card')
    .reduce((sum, b) => sum + b.grandTotal, 0) || 12800; // mock default fallback if empty

  const expectedTotal = expectedCash + expectedDigital;

  const physicalCash = parseFloat(physicalCashInput) || 0;
  const cashDiscrepancy = physicalCash - expectedCash;

  const handleReconcile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!physicalCashInput) {
      toast({
        type: 'error',
        title: 'Input Required',
        description: 'Please count the physical drawer cash and enter the amount.'
      });
      return;
    }

    setIsReconciled(true);
    
    if (cashDiscrepancy === 0) {
      toast({
        type: 'success',
        title: 'Reconciliation Successful',
        description: 'Shift registers match expected cash totals exactly.'
      });
    } else {
      toast({
        type: 'warning',
        title: 'Discrepancy Registered',
        description: `Cash register mismatch of ₹${Math.abs(cashDiscrepancy)}. Handover recorded.`
      });
    }
  };

  const handleShiftHandover = () => {
    toast({
      type: 'success',
      title: 'Shift Closed Successfully',
      description: 'Handover report printed. Logging out...'
    });
    
    setTimeout(() => {
      logout();
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile & Shift Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-ink">Account & Shift Handover</h1>
          <p className="text-xs text-ink-soft font-medium mt-0.5">Review shift earnings, audit registers, and validate cash drawer matching.</p>
        </div>
        
        <Badge variant="primary" className="py-1 px-3 self-start sm:self-auto flex gap-1.5 items-center">
          <Clock className="w-3.5 h-3.5" />
          <span>Shift Started: 9:00 AM</span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <Card className="md:col-span-1 flex flex-col items-center text-center space-y-4 justify-center">
          <div className="w-16 h-16 rounded-full bg-primary-soft text-primary font-bold text-xl flex items-center justify-center border border-primary/20">
            {user?.avatar || 'VM'}
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-ink">{user?.name}</h3>
            <p className="text-xs text-ink-soft mt-0.5 capitalize font-medium">Role: {user?.role}</p>
            <p className="text-[10px] text-primary font-mono mt-1 font-semibold">Terminal #01</p>
          </div>
          <div className="w-full pt-4 border-t border-line/60">
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 w-full px-3 py-2 border border-line rounded-md text-xs font-semibold text-ink-soft hover:text-danger hover:border-danger/30 hover:bg-danger-bg/25 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Off Duty</span>
            </button>
          </div>
        </Card>

        {/* Financial Shift Stats */}
        <Card className="md:col-span-2 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">Expected Shift Revenue</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-bg border border-line rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-ink-soft flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-accent" />
                  Expected Cash
                </span>
                <Badge variant="neutral">Drawer</Badge>
              </div>
              <p className="text-xl font-bold text-ink">₹{expectedCash.toLocaleString()}</p>
            </div>

            <div className="bg-bg border border-line rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-ink-soft flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-info" />
                  Expected Digital
                </span>
                <Badge variant="neutral">UPI / Card</Badge>
              </div>
              <p className="text-xl font-bold text-ink">₹{expectedDigital.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex justify-between items-center bg-bg-alt/30 p-3 rounded-lg border border-line/60 text-xs">
            <span className="font-bold text-ink">Total Shift Sales Expected</span>
            <span className="text-sm font-bold text-primary">₹{expectedTotal.toLocaleString()}</span>
          </div>
        </Card>
      </div>

      {/* Cash drawer reconciliation panel */}
      <SaaSUpgradeGate
        currentPlan={currentPlan}
        requiredPlan="Enterprise"
        featureName="Cash Drawer Reconciliation & Audits"
      >
        <Card className="space-y-4">
          <div className="flex items-center gap-1.5 border-b border-line pb-3">
            <Calculator className="w-4.5 h-4.5 text-primary" />
            <h3 className="text-sm font-serif font-bold text-ink">Cash reconciliation</h3>
          </div>

          <form onSubmit={handleReconcile} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <Input
                label="Counted Physical Cash (₹)"
                type="number"
                value={physicalCashInput}
                onChange={e => {
                  setPhysicalCashInput(e.target.value);
                  setIsReconciled(false);
                }}
                required
                placeholder="Enter counted notes total"
                className="text-xs"
              />
              <Button type="submit" variant="outline" className="h-10 text-xs flex justify-center items-center gap-1">
                <span>Calculate Discrepancy</span>
              </Button>
            </div>

            {/* Real-time disparity calculator feedback */}
            {physicalCashInput && (
              <div className="pt-2">
                {cashDiscrepancy === 0 ? (
                  <div className="border border-success/20 bg-success-bg p-4 rounded-lg flex items-center gap-3 text-success">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <div className="text-xs font-semibold">
                      Drawer matches expected figures. Registers balanced (₹{expectedCash.toLocaleString()}).
                    </div>
                  </div>
                ) : (
                  <div className={`border p-4 rounded-lg flex items-start gap-3 ${
                    cashDiscrepancy > 0 
                      ? 'border-warning/20 bg-warning-bg text-warning' 
                      : 'border-danger/20 bg-danger-bg text-danger'
                  }`}>
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <span className="font-bold">
                        {cashDiscrepancy > 0 ? 'Cash Overage Detected' : 'Cash Shortage Detected'}
                      </span>
                      <p className="leading-relaxed font-medium">
                        Physical cash is {cashDiscrepancy > 0 ? 'over' : 'short'} by <span className="font-bold">₹{Math.abs(cashDiscrepancy)}</span> compared to expected logs. Difference must be audited.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">
                Handover notes / Auditing justification
              </label>
              <textarea
                value={reconciliationNotes}
                onChange={e => setReconciliationNotes(e.target.value)}
                placeholder="Explain any register shortages, tips collections, or petty cash withdraws..."
                className="text-xs min-h-[80px] resize-none border border-line rounded p-2 bg-bg-card text-ink"
                maxLength={200}
              />
            </div>

            {isReconciled && (
              <div className="pt-4 border-t border-line/60 flex flex-col sm:flex-row gap-3 justify-end items-center">
                <span className="text-[10px] text-ink-soft font-semibold italic text-center sm:text-left">
                  Shift reconciliated. Click Handover to close cashier register.
                </span>
                <Button variant="primary" className="w-full sm:w-auto py-2.5 flex items-center justify-center gap-2" onClick={handleShiftHandover}>
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Report & Log Off</span>
                </Button>
              </div>
            )}
          </form>
        </Card>
      </SaaSUpgradeGate>
    </div>
  );
}
