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

  // QR Code Flyer Generator state
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

      {/* QR Code Modal (FR-B.2.6) - Flyer Poster Generator */}
      <Modal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title={`Print Flyer & QR Code · Table ${qrTableNumber}`}
      >
        <div className="flex flex-col md:flex-row gap-6 py-2 text-left">
          {/* Left Panel: Live Flyer Preview */}
          <div className="flex-1 flex justify-center items-center bg-bg p-4 rounded-xl border border-line">
            <div 
              style={{
                backgroundColor: qrDarkTheme ? '#221E18' : '#FFFFFF',
                borderColor: qrAccentColor,
                color: qrDarkTheme ? '#FAF7F2' : '#221E18'
              }}
              className="w-56 border-4 rounded-2xl p-5 shadow-lg text-center flex flex-col justify-between items-center h-80 transition-all select-none"
            >
              <div className="space-y-0.5">
                <span className="font-serif font-extrabold text-sm tracking-wide block">Spice Route</span>
                <span className="text-[8px] uppercase tracking-widest opacity-80 block">Table T{qrTableNumber}</span>
              </div>

              {/* Styled QR Code Box with dynamic color */}
              <div className="w-28 h-28 bg-white border border-stone-200 rounded-lg p-2.5 flex items-center justify-center relative shadow-inner">
                <QrCode style={{ color: qrAccentColor }} className="w-full h-full animate-pulse" />
                
                {/* Center Logo Overlay */}
                {qrLogoType === 'sparkles' && (
                  <div className="absolute w-6 h-6 rounded-full bg-white border border-stone-100 flex items-center justify-center shadow">
                    <Sparkles style={{ color: qrAccentColor }} className="w-3.5 h-3.5" />
                  </div>
                )}
                {qrLogoType === 'chef' && (
                  <div className="absolute w-6 h-6 rounded-full bg-white border border-stone-100 flex items-center justify-center shadow">
                    <span className="text-[10px]">👨‍🍳</span>
                  </div>
                )}
              </div>

              {/* Dynamic Frame text */}
              <div className="space-y-1">
                <p className="text-[9px] font-bold leading-tight max-w-[150px] mx-auto uppercase tracking-wide">
                  {qrFrameText.replace('{X}', `T${qrTableNumber}`)}
                </p>
                <p className="text-[7px] opacity-60 leading-none">Powered by Plateful</p>
              </div>
            </div>
          </div>

          {/* Right Panel: Customize Controls */}
          <div className="w-full md:w-60 flex flex-col justify-between gap-4">
            <div className="space-y-3.5 text-xs text-ink">
              
              {/* Color accent selection */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">Accent Border Color</span>
                <div className="flex gap-2">
                  {[
                    { hex: '#C1502E', name: 'Terracotta' },
                    { hex: '#6E7456', name: 'Sage' },
                    { hex: '#B8862E', name: 'Gold' },
                    { hex: '#3B6EC1', name: 'Indigo' },
                    { hex: '#221E18', name: 'Espresso' }
                  ].map(color => (
                    <button
                      key={color.hex}
                      onClick={() => setQrAccentColor(color.hex)}
                      style={{ backgroundColor: color.hex }}
                      className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all ${
                        qrAccentColor === color.hex ? 'border-primary ring-2 ring-primary-soft scale-110' : 'border-white'
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Frame text templates */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Poster Frame Text</label>
                <select
                  value={qrFrameText}
                  onChange={e => setQrFrameText(e.target.value)}
                  className="text-[11px] border border-line rounded p-1.5 bg-bg-card"
                >
                  <option value="Scan to Order Table {X}">Scan to Order Table {"{X}"}</option>
                  <option value="Visual Menu & Reviews at Table {X}">Visual Menu at Table {"{X}"}</option>
                  <option value="Review Us on Plateful Table {X}">Review Us on Plateful Table {"{X}"}</option>
                </select>
              </div>

              {/* Center Logo style */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Center Brand Logo</label>
                <select
                  value={qrLogoType}
                  onChange={e => setQrLogoType(e.target.value as any)}
                  className="text-[11px] border border-line rounded p-1.5 bg-bg-card"
                >
                  <option value="sparkles">Plateful Sparkles Logo</option>
                  <option value="chef">Chef Tandoor Icon</option>
                  <option value="none">No logo (Solid QR center)</option>
                </select>
              </div>

              {/* Dark mode poster toggle */}
              <label className="flex items-center gap-2 cursor-pointer font-semibold py-1">
                <input
                  type="checkbox"
                  checked={qrDarkTheme}
                  onChange={e => setQrDarkTheme(e.target.checked)}
                  className="cursor-pointer"
                />
                <span className="text-[11px]">Dark Theme Poster Flyer</span>
              </label>

            </div>

            {/* Print and Download Actions */}
            <div className="space-y-2 pt-2 border-t border-line">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={() => toast({ type: 'success', title: 'PDF Compiled', description: 'Table flyer PDF downloaded successfully.' })}
                  variant="outline" 
                  size="sm" 
                  className="text-[10px] py-1.5"
                >
                  Download PDF
                </Button>
                <Button 
                  onClick={() => toast({ type: 'info', title: 'Print Spooling', description: 'Table card sent to local receipt printer.' })}
                  variant="outline" 
                  size="sm" 
                  className="text-[10px] py-1.5"
                >
                  Send to Print
                </Button>
              </div>
              
              <a href={`/menu/t${qrTableNumber}`} target="_blank" rel="noreferrer" className="block w-full">
                <Button variant="primary" size="sm" className="w-full text-xs py-2 flex items-center justify-center gap-1">
                  <span>Launch Scanned Menu</span>
                </Button>
              </a>
            </div>
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
