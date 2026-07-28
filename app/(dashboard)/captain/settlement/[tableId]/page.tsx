'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { ArrowLeft, CreditCard, DollarSign, Camera, CheckCircle } from 'lucide-react';
import Link from 'next/link';

import { useScopedAccess } from '@/lib/hooks/useScopedAccess';
import { useEffect } from 'react';

export default function CaptainSettlementPage() {
  const params = useParams();
  const router = useRouter();
  const tableId = params.tableId as string;

  const { user } = useAuth();
  const { tables, settleTableBill } = useApp();
  const { toast } = useToast();
  const { checkTableAccess } = useScopedAccess();

  const { isAuthorized, table } = checkTableAccess(tableId);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Online'>('Online');
  const [screenshotAttached, setScreenshotAttached] = useState(false);
  const [isSettling, setIsSettling] = useState(false);

  useEffect(() => {
    if (table && !isAuthorized) {
      toast({
        type: 'error',
        title: 'Access Denied',
        description: 'You are not authorized to view or manage this table.'
      });
      router.replace('/captain');
    }
  }, [isAuthorized, table, router, toast]);

  if (!table || !isAuthorized || !table.activeSession) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 text-center">
        <h3 className="text-sm font-serif font-bold text-ink">Access Denied / No Active Order for Settlement</h3>
        <Link href="/captain">
          <Button variant="primary" className="mt-4">Back to Grid</Button>
        </Link>
      </div>
    );
  }

  const handleSettle = async () => {
    if (paymentMode === 'Online' && !screenshotAttached) {
      toast({
        type: 'error',
        title: 'Screenshot Required',
        description: 'For Online payments, captains must capture a success screenshot.'
      });
      return;
    }

    setIsSettling(true);

    // Settle table
    const settledBill = await settleTableBill(
      table.id,
      paymentMode,
      user?.name || 'Aman Joshi',
      paymentMode === 'Online' ? '/images/mock-screenshot.jpg' : undefined
    );

    if (settledBill) {
      toast({
        type: 'success',
        title: 'Table Settled',
        description: `Table ${table.number} has been settled. Bill: ${settledBill.id}.`
      });
      router.push('/captain');
    } else {
      setIsSettling(false);
      toast({
        type: 'error',
        title: 'Settlement Failed',
        description: 'Error closing table session.'
      });
    }
  };

  const total = table.activeSession.total;
  const gst = Math.round(total * 0.05);
  const grandTotal = total + gst;

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-20 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-line">
        <Link href={`/captain/order/${table.id}`}>
          <Button variant="ghost" size="sm" className="!p-1.5 rounded-full border border-line bg-bg">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-base font-serif font-bold text-ink leading-tight">
            Table {table.number} · Settlement
          </h2>
          <p className="text-[10px] text-ink-soft mt-0.5 font-medium">Session Total: ₹{grandTotal}</p>
        </div>
      </div>

      {/* Bill summary details */}
      <Card className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">Order Summary</h3>
        <div className="space-y-2 border-b border-line pb-3">
          {table.activeSession.items.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center text-xs text-ink">
              <span>{item.name} × {item.quantity}</span>
              <span className="font-medium text-ink-soft">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="space-y-1.5 text-xs text-ink-soft">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (5%)</span>
            <span>₹{gst}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-ink pt-1 border-t border-line">
            <span>Grand Total</span>
            <span className="text-primary">₹{grandTotal}</span>
          </div>
        </div>
      </Card>

      {/* Payment Selector (FR-C.5.1) */}
      <Card className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">Payment Mode</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setPaymentMode('Online')}
            className={`py-3 px-4 border rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
              paymentMode === 'Online'
                ? 'bg-primary text-bg border-primary'
                : 'bg-bg-card border-line text-ink hover:bg-bg-alt'
            }`}
          >
            <CreditCard className="w-4.5 h-4.5" />
            <span>Online</span>
          </button>

          <button
            onClick={() => setPaymentMode('Cash')}
            className={`py-3 px-4 border rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
              paymentMode === 'Cash'
                ? 'bg-primary text-bg border-primary'
                : 'bg-bg-card border-line text-ink hover:bg-bg-alt'
            }`}
          >
            <DollarSign className="w-4.5 h-4.5" />
            <span>Cash</span>
          </button>
        </div>

        {/* Screenshot capture for Online payment */}
        {paymentMode === 'Online' && (
          <div className="space-y-3 pt-2">
            <span className="text-xs font-semibold text-ink-soft block">Capture Screenshot</span>
            {screenshotAttached ? (
              <div className="border border-success/30 bg-success-bg p-4 rounded-lg flex items-center gap-3 justify-center text-success">
                <CheckCircle className="w-5 h-5" />
                <span className="text-xs font-bold">Screenshot Attached Successfully</span>
                <button
                  onClick={() => setScreenshotAttached(false)}
                  className="text-[10px] text-danger hover:underline font-bold ml-2 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div
                onClick={() => setScreenshotAttached(true)}
                className="border-1.5 border-dashed border-line rounded-lg p-6 text-center cursor-pointer hover:bg-bg-alt/25 transition-all space-y-2"
              >
                <Camera className="w-6 h-6 text-ink-soft mx-auto" />
                <div>
                  <span className="text-xs font-bold text-ink block">Upload Payment Success Screen</span>
                  <span className="text-[10px] text-ink-soft block mt-0.5">Capture client UPI or Card success window</span>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Settle button */}
      <div className="pt-2">
        <Button
          variant="primary"
          fullWidth
          className="py-3 font-serif font-bold tracking-wide text-base flex justify-center items-center gap-2"
          onClick={handleSettle}
          disabled={isSettling}
        >
          <span>Complete Settlement</span>
        </Button>
      </div>
    </div>
  );
}
