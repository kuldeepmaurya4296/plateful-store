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

export const TableGridConsoleView: React.FC = () => {
  const { user } = useAuth();
  const { tables, settleTableBill, updateTableStatus } = useApp();
  const { toast } = useToast();

  const tenantTables = tables.filter(t => t.restaurantId === user?.restaurantId);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(tenantTables[0]?.id || null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrTableNumber, setQrTableNumber] = useState<number | null>(null);
  const [settlingPaymentMode, setSettlingPaymentMode] = useState<'Cash' | 'Card' | 'UPI'>('UPI');
  const [showSettleModal, setShowSettleModal] = useState(false);

  const [qrAccentColor, setQrAccentColor] = useState('#C1502E');
  const [qrFrameText, setQrFrameText] = useState('Scan to Order Table {X}');
  const [qrLogoType, setQrLogoType] = useState<'sparkles' | 'chef' | 'none'>('sparkles');
  const [qrDarkTheme, setQrDarkTheme] = useState(false);

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
      title: 'Floor Layout Editor',
      description: 'Add new table functionality is enabled.'
    });
  };

  const handleSettleComplete = async () => {
    if (!selectedTable) return;
    
    const bill = await settleTableBill(selectedTable.id, settlingPaymentMode, 'Vikram Mehta');
    
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
      {/* Left Grid Panel */}
      <div className="flex-1 space-y-4 flex flex-col min-h-0">
        <div className="flex justify-between items-center flex-shrink-0">
          <div>
            <h1 className="text-xl font-serif font-bold text-ink">Floor Table Console</h1>
            <p className="text-xs text-ink-soft font-medium">Real-time table occupancy, QR generator & bill settlement.</p>
          </div>
          <Button variant="primary" size="sm" onClick={handleAddTable} className="flex gap-1 items-center text-xs">
            <Plus className="w-4 h-4" />
            <span>Add Table</span>
          </Button>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto pr-1 flex-1">
          {tenantTables.map(table => (
            <Card
              key={table.id}
              onClick={() => handleTableClick(table.id)}
              className={`cursor-pointer transition-all border-2 flex flex-col justify-between p-4 ${
                selectedTableId === table.id
                  ? 'border-primary ring-2 ring-primary/20 shadow-md'
                  : 'border-line hover:border-line-dark'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="font-serif font-bold text-lg text-ink">T-{table.number}</span>
                <Badge variant={getStatusColor(table.status) as any} className="capitalize text-[10px]">
                  {table.status}
                </Badge>
              </div>

              <div className="my-3 space-y-1">
                <p className="text-xs text-ink-soft">Capacity: <span className="font-semibold text-ink">{table.capacity} seats</span></p>
                {table.activeSession ? (
                  <p className="text-xs font-semibold text-primary truncate">
                    {table.activeSession.customerName}
                  </p>
                ) : (
                  <p className="text-xs text-ink-soft italic">No active session</p>
                )}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-line/60">
                <span className="text-[10px] text-ink-soft font-mono">Counter {table.counterId.toUpperCase()}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrintQR(table.number);
                  }}
                  className="p-1.5 hover:bg-bg-alt rounded text-ink-soft hover:text-primary transition-colors"
                  title="Print QR Flyer"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Right Sidebar Detail Panel */}
      <div className="w-full lg:w-96 flex-shrink-0">
        <Card className="h-full flex flex-col justify-between space-y-4">
          {selectedTable ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start border-b border-line pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-ink">Table {selectedTable.number} Details</h3>
                    <p className="text-xs text-ink-soft">Floor ID: {selectedTable.id}</p>
                  </div>
                  <Badge variant={getStatusColor(selectedTable.status) as any} className="capitalize">
                    {selectedTable.status}
                  </Badge>
                </div>

                {/* Session Details */}
                <div className="mt-4 space-y-3">
                  {selectedTable.activeSession ? (
                    <>
                      <div className="bg-bg p-3 rounded-lg border border-line space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-ink-soft">Guest Name:</span>
                          <span className="font-bold text-ink">{selectedTable.activeSession.customerName}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-ink-soft">Phone Number:</span>
                          <span className="font-mono text-ink">{selectedTable.activeSession.customerPhone}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-ink-soft">Started At:</span>
                          <span className="text-ink-soft">{new Date(selectedTable.activeSession.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      {/* Items List */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-2">Ordered Items</h4>
                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {selectedTable.activeSession.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-line/40 last:border-0">
                              <span className="text-ink">{item.quantity}x {item.name}</span>
                              <span className="font-mono text-ink">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total calculation */}
                      <div className="border-t border-line pt-3 flex justify-between items-center text-sm font-bold">
                        <span className="text-ink">Current Total</span>
                        <span className="text-primary font-mono text-base">₹{selectedTable.activeSession.total}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 space-y-2">
                      <Grid className="w-8 h-8 text-ink-soft/40 mx-auto" />
                      <p className="text-xs text-ink-soft">This table is currently available for walk-ins or reservations.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-line">
                {selectedTable.status === 'billing' && (
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => setShowSettleModal(true)}
                    className="flex gap-2 justify-center items-center py-2.5"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>Complete Bill Settlement</span>
                  </Button>
                )}

                {selectedTable.status === 'occupied' && (
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => updateTableStatus(selectedTable.id, 'billing')}
                    className="flex gap-2 justify-center items-center py-2"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>Move to Billing Status</span>
                  </Button>
                )}

                {selectedTable.status === 'available' && (
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => {
                      updateTableStatus(selectedTable.id, 'occupied', {
                        customerName: 'Walk-in Guest',
                        customerPhone: '+91-9000000000',
                        startedBy: user?.name || 'Manager',
                        startedAt: new Date().toISOString(),
                        items: [],
                        total: 0
                      });
                    }}
                    className="flex gap-2 justify-center items-center py-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Occupy Table for Guest</span>
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-ink-soft text-xs">
              Select a table from the floor layout to inspect status & settle bills.
            </div>
          )}
        </Card>
      </div>

      {/* Settlement Modal */}
      <Modal
        isOpen={showSettleModal}
        onClose={() => setShowSettleModal(false)}
        title={`Settle Bill - Table ${selectedTable?.number}`}
      >
        <div className="space-y-4">
          <div className="bg-bg p-3 rounded-lg border border-line text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-ink-soft">Guest:</span>
              <span className="font-bold text-ink">{selectedTable?.activeSession?.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Subtotal:</span>
              <span className="font-mono text-ink">₹{selectedTable?.activeSession?.total}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-primary pt-1 border-t border-line">
              <span>Grand Total (incl. 5% GST):</span>
              <span>₹{Math.round((selectedTable?.activeSession?.total || 0) * 1.05)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-ink-soft">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {(['UPI', 'Card', 'Cash'] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSettlingPaymentMode(mode)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    settlingPaymentMode === mode
                      ? 'border-primary bg-primary-soft text-primary font-bold'
                      : 'border-line bg-bg text-ink-soft hover:text-ink'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <Button variant="primary" fullWidth onClick={handleSettleComplete} className="py-2.5">
            Confirm & Issue Invoice
          </Button>
        </div>
      </Modal>

      {/* Printable QR Flyer Modal */}
      <Modal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title={`Table ${qrTableNumber} — Digital QR Menu Flyer`}
      >
        <div className="space-y-4 text-center">
          <div className="p-6 bg-gradient-to-b from-bg-card to-bg-alt border-2 border-primary/30 rounded-2xl max-w-xs mx-auto space-y-4 shadow-xl">
            <div className="inline-flex bg-primary/10 text-primary p-2 rounded-xl">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-xl text-ink">Spice Route</h4>
              <p className="text-xs font-bold text-primary uppercase tracking-wider">Table {qrTableNumber}</p>
            </div>

            {/* High-res Simulated QR Code Frame */}
            <div className="w-44 h-44 bg-white border-4 border-ink rounded-xl p-3 flex flex-col items-center justify-center mx-auto shadow-inner relative overflow-hidden">
              {/* QR Pattern visual elements */}
              <div className="grid grid-cols-5 gap-1.5 w-full h-full p-1 bg-ink/5 rounded">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-xs ${
                      i % 2 === 0 || i % 5 === 0 || i === 12 || i === 24
                        ? 'bg-ink'
                        : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-[11px] font-semibold text-ink-soft leading-tight">
              Scan with phone camera or Plateful scanner to view visual plating guides & place self-orders.
            </p>

            <span className="text-[10px] font-mono text-ink-soft/70 block border-t border-line/60 pt-2">
              URL: http://localhost:3000/menu/t{qrTableNumber}
            </span>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/menu/t${qrTableNumber}`}
              target="_blank"
              className="flex-1 py-2.5 px-3 bg-bg-alt border border-line hover:border-primary/40 rounded-lg text-xs font-bold text-ink transition-all flex items-center justify-center gap-1.5"
            >
              <Smartphone className="w-4 h-4 text-primary" />
              <span>Test Menu Link</span>
            </Link>
            <Button variant="primary" className="flex-1" onClick={() => window.print()}>
              Print QR Sticker
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
