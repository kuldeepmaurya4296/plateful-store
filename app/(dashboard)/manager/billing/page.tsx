'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Receipt, Search, Printer, RotateCcw, Download } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function ManagerBillingPage() {
  const { user } = useAuth();
  const { bills } = useApp();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPaymentMode, setFilterPaymentMode] = useState<string>('all');

  const tenantBills = bills.filter(b => b.restaurantId === user?.restaurantId);
  const filteredBills = tenantBills.filter(bill => {
    // Search query matches bill id or table number or customer name
    const matchesSearch = 
      bill.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bill.tableNumber !== undefined && bill.tableNumber.toString().includes(searchQuery)) ||
      bill.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    // Payment mode matches
    const matchesPaymentMode = 
      filterPaymentMode === 'all' || 
      bill.paymentMode.toLowerCase() === filterPaymentMode.toLowerCase();

    return matchesSearch && matchesPaymentMode;
  });

  const handleReprint = (billId: string) => {
    toast({
      type: 'success',
      title: 'Receipt Printed',
      description: `Bill #${billId} has been sent to receipt printer.`
    });
  };

  const handleRefund = (billId: string) => {
    toast({
      type: 'warning',
      title: 'Refund Initiated',
      description: `Refund request for Bill #${billId} submitted to bank gateway.`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-serif font-bold text-ink">Billing history</h1>
        <p className="text-xs text-ink-soft font-medium mt-0.5">Search and view past transaction receipts and cashier attributions.</p>
      </div>

      {/* Filters */}
      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
        {/* Search */}
        <div className="flex-1 max-w-sm relative">
          <Input
            placeholder="Search bill no, table, name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
          <Search className="w-4 h-4 text-ink-soft absolute left-3 top-3" />
        </div>

        {/* Payment mode filter tabs */}
        <div className="flex bg-bg-alt p-0.5 rounded-lg border border-line text-xs font-semibold self-start md:self-auto">
          {['all', 'UPI', 'Cash', 'Card'].map(mode => (
            <button
              key={mode}
              onClick={() => setFilterPaymentMode(mode)}
              className={`px-3.5 py-1.5 rounded-md capitalize transition-all cursor-pointer ${
                filterPaymentMode === mode
                  ? 'bg-bg-card text-ink shadow-sm'
                  : 'text-ink-soft hover:text-ink'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </Card>

      {/* Billing list */}
      <div className="space-y-4">
        {filteredBills.length > 0 ? (
          filteredBills.map(bill => (
            <Card key={bill.id} className="!p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-line pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink">#{bill.id}</span>
                    <Badge variant="neutral">Table {bill.tableNumber}</Badge>
                  </div>
                  <div className="text-[10px] text-ink-soft font-semibold">
                    Settled at: {new Date(bill.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Badge variant="info">{bill.paymentMode}</Badge>
                  <span className="text-sm font-bold text-primary">₹{bill.grandTotal}</span>
                </div>
              </div>

              {/* Items listing & Staff details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pr-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">Cashier details</span>
                  <div className="space-y-0.5 leading-tight font-medium text-ink">
                    <div>Opened by: <span className="font-semibold text-ink-soft">{bill.startedBy === 'u4' ? 'Aman Joshi' : (bill.startedBy === 'u3' ? 'Priya Nair' : 'Vikram Mehta')}</span></div>
                    <div className="mt-1">Closed by: <span className="font-semibold text-ink-soft">{bill.settledBy}</span></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">Customer details</span>
                  <p className="font-semibold text-ink leading-tight">{bill.customerName}</p>
                  {bill.customerPhone && <p className="text-ink-soft mt-0.5">{bill.customerPhone}</p>}
                </div>

                <div className="space-y-1.5 max-h-24 overflow-y-auto">
                  <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">Items</span>
                  {bill.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between font-medium">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="text-ink-soft">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill actions */}
              <div className="flex gap-2 justify-end pt-3 border-t border-line">
                <Button variant="ghost" size="sm" onClick={() => handleRefund(bill.id)} className="flex gap-1.5 items-center text-xs text-danger hover:bg-danger-bg/25">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Refund</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleReprint(bill.id)} className="flex gap-1.5 items-center text-xs border-line bg-bg">
                  <Printer className="w-3.5 h-3.5 text-ink-soft" />
                  <span>Print Receipt</span>
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-16 bg-bg-card border border-line rounded-lg">
            <Receipt className="w-8 h-8 text-line mx-auto mb-3" />
            <h3 className="text-base font-serif font-semibold text-ink">No bills found</h3>
            <p className="text-xs text-ink-soft mt-1.5">No invoices match your search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
