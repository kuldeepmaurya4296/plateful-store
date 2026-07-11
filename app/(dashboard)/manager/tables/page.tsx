'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { Grid, QrCode, Plus, Receipt, User, Smartphone, Sparkles, Check } from 'lucide-react';
import Link from 'next/link';

export default function ManagerTablesPage() {
  const { user } = useAuth();
  const { tables, settleTableBill, updateTableStatus } = useApp();
  const { toast } = useToast();

  const tenantTables = tables.filter(t => t.restaurantId === user?.restaurantId);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(tenantTables[0]?.id || null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrTableNumber, setQrTableNumber] = useState<number | null>(null);
  const [settlingPaymentMode, setSettlingPaymentMode] = useState<'Cash' | 'Card' | 'UPI'>('UPI');
  const [showSettleModal, setShowSettleModal] = useState(false);

  const selectedTable = tenantTables.find(t => t.id === selectedTableId);

  const getStatusColor = (status: string) => {
    if (status === 'available') return 'success';
    if (status === 'occupied') return 'danger';
    return 'warning';
  };

  const handleTableClick = (tableId: string) => {
    setSelectedTableId(tableId);
  };

  const handlePrintQR = (tableNum: number) => {
    setQrTableNumber(tableNum);
    setShowQRModal(true);
  };

  const handleAddTable = () => {
    toast({
      type: 'info',
      title: 'Feature Simulated',
      description: 'Dynamic table layout editor is available on the Manage Social Page.'
    });
  };

  const handleOpenSettle = () => {
    if (!selectedTable || !selectedTable.activeSession) return;
    setShowSettleModal(true);
  };

  const handleSettleComplete = () => {
    if (!selectedTable) return;
    
    const bill = settleTableBill(selectedTable.id, settlingPaymentMode, 'Vikram Mehta');
    
    if (bill) {
      toast({
        type: 'success',
        title: 'Bill Settled',
        description: `Bill ${bill.id} generated. Table ${selectedTable.number} is now Available.`
      });
      setShowSettleModal(false);
      setSelectedTableId(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem)] min-h-[480px]">
      {/* Table Grid ¾ width */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-serif font-bold text-ink">Table management</h1>
            <p className="text-xs text-ink-soft font-medium mt-0.5">Floor layout grid of Spice Route dine-in tables.</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAddTable} className="flex gap-1.5 items-center">
              <Plus className="w-4 h-4" />
              <span>Add table</span>
            </Button>
          </div>
        </div>

        {/* The Grid layout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-bg rounded-lg border border-line">
          {tenantTables.map(table => {
            const isSelected = selectedTableId === table.id;
            const status = table.status;
            
            let bgStyles = 'bg-success-bg border-success/20 text-success';
            if (status === 'occupied') bgStyles = 'bg-danger-bg border-danger/20 text-danger';
            if (status === 'billing') bgStyles = 'bg-warning-bg border-warning/20 text-warning';

            return (
              <div
                key={table.id}
                onClick={() => handleTableClick(table.id)}
                className={`border rounded-lg p-4 text-center cursor-pointer flex flex-col justify-between h-28 transition-all hover:scale-102 ${bgStyles} ${
                  isSelected ? 'ring-2 ring-primary-hover border-primary-hover' : ''
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-base font-serif font-bold">T{table.number}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrintQR(table.number);
                    }}
                    className="p-1 rounded hover:bg-black/5"
                    title="Print QR Menu"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[10px] mt-2">
                  {status}
                </div>
                <div className="text-[10px] opacity-80 mt-1 font-medium">
                  {table.activeSession ? `₹${table.activeSession.total}` : `Cap: ${table.capacity}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Panel ¼ width */}
      <div className="w-full lg:w-80 flex-shrink-0 bg-bg-card border border-line rounded-lg p-5 flex flex-col justify-between shadow-sm">
        {selectedTable ? (
          <div className="flex flex-col h-full justify-between gap-5">
            {/* Header info */}
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b border-line pb-3">
                <div>
                  <h3 className="text-base font-serif font-bold text-ink">Table {selectedTable.number}</h3>
                  <p className="text-[10px] text-ink-soft uppercase tracking-wider font-bold mt-1">
                    Status: {selectedTable.status}
                  </p>
                </div>
                <Badge variant={getStatusColor(selectedTable.status)}>
                  {selectedTable.status}
                </Badge>
              </div>

              {selectedTable.activeSession ? (
                <div className="space-y-4">
                  {/* Guest attributes */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-ink-soft" />
                      <span className="font-semibold">{selectedTable.activeSession.customerName || 'Walk-in'}</span>
                    </div>
                    {selectedTable.activeSession.customerPhone && (
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-3.5 h-3.5 text-ink-soft" />
                        <span>{selectedTable.activeSession.customerPhone}</span>
                      </div>
                    )}
                  </div>

                  {/* List of items ordered */}
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">Items Ordered</span>
                    {selectedTable.activeSession.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-xs text-ink">
                        <span className="truncate max-w-[150px]">{item.name} × {item.quantity}</span>
                        <span className="font-medium">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Prep note */}
                  {selectedTable.activeSession.preparationNote && (
                    <div className="bg-bg p-2.5 rounded border border-line text-[11px] text-ink-soft italic leading-relaxed">
                      "Note: {selectedTable.activeSession.preparationNote}"
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 space-y-2">
                  <User className="w-8 h-8 text-line mx-auto" />
                  <p className="text-xs text-ink-soft italic">No active session at this table.</p>
                </div>
              )}
            </div>

            {/* Total & Action */}
            {selectedTable.activeSession && (
              <div className="border-t border-line pt-4 space-y-4">
                <div className="flex justify-between items-center text-sm font-bold text-ink">
                  <span>Running Total:</span>
                  <span className="text-primary text-base">₹{selectedTable.activeSession.total}</span>
                </div>
                <Button variant="primary" fullWidth className="py-2.5 flex justify-center items-center gap-1.5" onClick={handleOpenSettle}>
                  <Receipt className="w-4 h-4" />
                  <span>Settle Bill</span>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-2 py-20 text-ink-soft">
            <Grid className="w-8 h-8 text-line" />
            <p className="text-xs italic">Select a table on the floor layout to load order details and billing panel.</p>
          </div>
        )}
      </div>

      {/* QR Code Modal (FR-B.2.6) */}
      <Modal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title={`Table ${qrTableNumber} QR Menu Code`}
      >
        <div className="text-center space-y-4 py-3">
          <div className="w-40 h-40 bg-bg border border-line rounded-lg flex items-center justify-center mx-auto shadow-sm">
            <QrCode className="w-28 h-28 text-ink animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-serif font-bold text-ink">Spice Route QR Code</h4>
            <p className="text-xs text-ink-soft leading-normal max-w-xs mx-auto">
              Scan this code at Table {qrTableNumber} to open the visual menu directly on any smartphone.
            </p>
          </div>
          <div className="pt-2">
            <a href={`/menu/t${qrTableNumber}`} target="_blank" rel="noreferrer">
              <Button variant="primary" size="sm">Open Scanned Menu</Button>
            </a>
          </div>
        </div>
      </Modal>

      {/* Settle Bill Modal */}
      <Modal
        isOpen={showSettleModal}
        onClose={() => setShowSettleModal(false)}
        title={`Settle Bill · Table ${selectedTable?.number}`}
      >
        {selectedTable?.activeSession && (
          <div className="space-y-5 py-2">
            <div className="space-y-1.5 text-xs text-ink">
              <div className="flex justify-between font-semibold border-b border-line pb-2 mb-2">
                <span>Subtotal</span>
                <span>₹{selectedTable.activeSession.total}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>GST (5%)</span>
                <span>₹{Math.round(selectedTable.activeSession.total * 0.05)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-primary pt-2 border-t border-line">
                <span>Grand Total</span>
                <span>₹{Math.round(selectedTable.activeSession.total * 1.05)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-ink-soft block uppercase tracking-wider">Payment Mode</span>
              <div className="grid grid-cols-3 gap-2">
                {['UPI', 'Cash', 'Card'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setSettlingPaymentMode(mode as any)}
                    className={`py-2 text-xs font-bold border rounded-md transition-all cursor-pointer ${
                      settlingPaymentMode === mode
                        ? 'bg-primary text-bg border-primary'
                        : 'bg-bg-card border-line text-ink hover:bg-bg-alt'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <Button variant="primary" fullWidth className="py-2.5 flex items-center justify-center gap-1.5" onClick={handleSettleComplete}>
              <Check className="w-4 h-4" />
              <span>Complete Settlement</span>
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
