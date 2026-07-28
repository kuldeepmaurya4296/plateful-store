'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { useAuth } from '@/features/auth/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { Calendar, Clock, Check, X } from 'lucide-react';

export const BookingsQueueView: React.FC = () => {
  const { user } = useAuth();
  const { bookings, tables, updateBookingStatus } = useApp();
  const { toast } = useToast();

  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [assignTableNum, setAssignTableNum] = useState<string>('1');

  const restaurantBookings = bookings.filter(b => b.restaurantId === user?.restaurantId);
  const pendingBookings = restaurantBookings.filter(b => b.status === 'pending');
  const activeBookings = restaurantBookings.filter(b => b.status === 'confirmed');

  const handleOpenAccept = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setAssignTableNum('1');
  };

  const handleConfirmAccept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId) return;

    updateBookingStatus(selectedBookingId, 'confirmed', parseInt(assignTableNum));
    setSelectedBookingId(null);
    toast({
      type: 'success',
      title: 'Reservation Confirmed',
      description: `Table ${assignTableNum} has been locked for this guest.`
    });
  };

  const handleDecline = (bookingId: string) => {
    updateBookingStatus(bookingId, 'declined');
    toast({
      type: 'warning',
      title: 'Reservation Declined',
      description: 'The booking request has been marked as declined.'
    });
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-20 space-y-6">
      {/* Pending Reservations Header */}
      <div>
        <h1 className="text-xl font-serif font-bold text-ink">Table Bookings</h1>
        <p className="text-xs text-ink-soft mt-0.5">Manage reservations, verify prepayments, and assign dine-in tables.</p>
      </div>

      {/* Pending Queue Section */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">Pending Requests ({pendingBookings.length})</span>
        {pendingBookings.map(booking => (
          <Card key={booking.id} className="p-4 border-line/60 space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary-soft text-primary font-bold text-xs flex items-center justify-center">
                  {booking.userName.substring(0,2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-ink text-xs leading-none">{booking.userName}</h4>
                  <p className="text-[9px] text-ink-soft mt-1 flex items-center gap-0.5">
                    <Calendar className="w-3 h-3 text-primary" />
                    {booking.date} · {booking.timeSlot}
                  </p>
                </div>
              </div>
              <Badge variant="warning">Prepaid ₹{booking.advancePaid}</Badge>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-ink-soft">Guests: <span className="font-bold text-ink">{booking.partySize} People</span></span>
              {booking.specialRequest && (
                <span className="text-[9px] text-primary italic max-w-[60%] truncate">
                  "{booking.specialRequest}"
                </span>
              )}
            </div>

            <div className="flex gap-2 pt-1 border-t border-line/50">
              <Button 
                variant="outline" 
                size="sm" 
                fullWidth
                onClick={() => handleDecline(booking.id)}
                className="border-danger/20 text-danger hover:bg-danger-bg/25 text-[10px]"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                <span>Decline</span>
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                fullWidth
                onClick={() => handleOpenAccept(booking.id)}
                className="text-[10px]"
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                <span>Accept & Seat</span>
              </Button>
            </div>
          </Card>
        ))}
        {pendingBookings.length === 0 && (
          <p className="text-xs text-ink-soft text-center py-4 italic">No pending reservation requests.</p>
        )}
      </div>

      {/* Confirmed / Seated Queue Section */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">Confirmed reservations ({activeBookings.length})</span>
        {activeBookings.map(booking => (
          <Card key={booking.id} className="p-4 border-line/60 flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-xs font-bold text-ink">{booking.userName}</span>
              <div className="flex items-center gap-2 text-[10px] text-ink-soft">
                <Clock className="w-3.5 h-3.5" />
                <span>{booking.timeSlot} · {booking.partySize} guests · Table {booking.tableNumber}</span>
              </div>
            </div>
            <Badge variant="success">Confirmed</Badge>
          </Card>
        ))}
        {activeBookings.length === 0 && (
          <p className="text-xs text-ink-soft text-center py-4 italic">No confirmed reservations for this shift.</p>
        )}
      </div>

      {/* Table Assign Modal */}
      <Modal
        isOpen={selectedBookingId !== null}
        onClose={() => setSelectedBookingId(null)}
        title="Assign Dine-in Table"
      >
        <form onSubmit={handleConfirmAccept} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-ink-soft uppercase tracking-wider">Select Table number</label>
            <select
              value={assignTableNum}
              onChange={e => setAssignTableNum(e.target.value)}
              className="text-xs border border-line rounded p-2 bg-bg-card text-ink"
            >
              {tables
                .filter(t => t.restaurantId === user?.restaurantId && t.status === 'available')
                .map(t => (
                  <option key={t.id} value={t.number}>
                    Table {t.number} (Capacity: {t.capacity} guests)
                  </option>
                ))}
              {tables.filter(t => t.restaurantId === user?.restaurantId && t.status === 'available').length === 0 && (
                <option value="1">Table 1 (Force Override)</option>
              )}
            </select>
          </div>
          <Button type="submit" variant="primary" fullWidth className="py-2.5">
            Confirm Assignment & Notify Guest
          </Button>
        </form>
      </Modal>
    </div>
  );
};
