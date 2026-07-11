'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { CalendarCheck, ShieldAlert, Sparkles, User, Info, Check } from 'lucide-react';
import Link from 'next/link';

export default function CustomerBookingsPage() {
  const { tables, addBookingRequest } = useApp();
  const { toast: fullToast } = useToast();

  const [partySize, setPartySize] = useState(2);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('2026-07-12');
  const [selectedTime, setSelectedTime] = useState('7:30 PM');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const dates = [
    { label: 'Today', value: '2026-07-11' },
    { label: 'Tomorrow', value: '2026-07-12' },
    { label: '13 Jul', value: '2026-07-13' },
    { label: '14 Jul', value: '2026-07-14' }
  ];

  const timeSlots = ['7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'];

  // Table classification logic (FR-A.5.2 & FR-A.5.3)
  const getTableStatus = (table: any) => {
    if (table.status === 'occupied' || table.status === 'billing') {
      return 'booked'; // Yellow in seat map context
    }
    
    if (table.capacity < partySize) {
      return 'locked'; // Too small
    }

    // Capacity tier logic: Only allow exact match or next tier up.
    // Tiers typically: 2, 4, 6, 8
    const tiers = [2, 4, 6, 8];
    const userTierIdx = tiers.findIndex(t => t >= partySize);
    const tableTierIdx = tiers.findIndex(t => t >= table.capacity);
    
    // Lock table if it is larger than the next allowed tier (more than 1 tier jump)
    if (tableTierIdx > userTierIdx + 1) {
      return 'locked'; 
    }

    return 'bookable'; // Green
  };

  const handleTableClick = (table: any) => {
    const status = getTableStatus(table);
    if (status === 'locked') {
      fullToast({
        type: 'warning',
        title: 'Table Locked',
        description: `This table capacity is not suited for a party size of ${partySize}.`
      });
      return;
    }
    if (status === 'booked') {
      fullToast({
        type: 'warning',
        title: 'Table Unavailable',
        description: 'This table has already been booked for this slot.'
      });
      return;
    }
    setSelectedTable(table.id);
  };

  const handleConfirmBooking = () => {
    if (!selectedTable) {
      fullToast({
        type: 'error',
        title: 'Select a Table',
        description: 'Please tap a green table on the seat map to proceed.'
      });
      return;
    }

    const tableObj = tables.find(t => t.id === selectedTable);
    const newBooking = {
      id: `b_dyn_${Date.now()}`,
      userId: 'u1',
      userName: 'Riya Kapoor',
      restaurantId: 'r1',
      restaurantName: 'Spice Route',
      date: selectedDate,
      timeSlot: selectedTime,
      partySize,
      specialRequest: 'Dine-in booking via interactive seat map',
      status: 'confirmed' as const, // auto confirmed for demonstration
      advancePaid: 100,
      tableNumber: tableObj?.number || 1,
      createdAt: new Date().toISOString()
    };

    addBookingRequest(newBooking);
    setBookingConfirmed(true);
    fullToast({
      type: 'success',
      title: 'Booking Confirmed',
      description: `Table ${tableObj?.number} has been reserved. ₹100 credited.`
    });
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-20 space-y-6">
      {/* Step 1: Select Party Size */}
      <Card className="space-y-4">
        <h3 className="text-sm font-serif font-bold text-ink">1. Reserve Table Details</h3>
        
        {/* Date picker */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-ink-soft">Select Date</span>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {dates.map(d => (
              <button
                key={d.value}
                onClick={() => setSelectedDate(d.value)}
                className={`px-4 py-2 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                  selectedDate === d.value
                    ? 'bg-primary text-bg border-primary'
                    : 'bg-bg-card border-line text-ink hover:bg-bg-alt'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time slot picker */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-ink-soft">Select Time Slot</span>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`py-2 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                  selectedTime === t
                    ? 'bg-primary text-bg border-primary'
                    : 'bg-bg-card border-line text-ink hover:bg-bg-alt'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Party size stepper */}
        <div className="flex justify-between items-center pt-2">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-ink-soft">Party Size</span>
            <p className="text-[10px] text-ink-soft leading-normal">Allows filtering matching table capacities</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="!p-1.5 rounded-full"
              disabled={partySize <= 1}
              onClick={() => {
                setPartySize(prev => prev - 1);
                setSelectedTable(null);
              }}
            >
              -
            </Button>
            <span className="text-sm font-bold text-ink w-4 text-center">{partySize}</span>
            <Button
              variant="outline"
              size="sm"
              className="!p-1.5 rounded-full"
              disabled={partySize >= 8}
              onClick={() => {
                setPartySize(prev => prev + 1);
                setSelectedTable(null);
              }}
            >
              +
            </Button>
          </div>
        </div>
      </Card>

      {/* Step 2: Interactive Seat Map (A.5) */}
      <Card className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-serif font-bold text-ink">2. Interactive Floor Layout</h3>
          <p className="text-[10px] text-ink-soft leading-normal">
            Select a table matching your party of {partySize}. Grey tables are locked to preserve larger-party capacity.
          </p>
        </div>

        {/* Legend */}
        <div className="flex gap-4 text-[10px] font-semibold text-ink-soft">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-success rounded" />
            <span>Bookable</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-warning rounded" />
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-bg-alt border border-line rounded" />
            <span>Locked</span>
          </div>
        </div>

        {/* Seat Grid Map layout */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-bg rounded-lg border border-line">
          {tables.map(table => {
            const status = getTableStatus(table);
            const isSelected = selectedTable === table.id;

            const bgClasses = {
              bookable: isSelected 
                ? 'bg-primary text-bg ring-2 ring-primary-soft border-primary' 
                : 'bg-success-bg text-success border-success/30 hover:scale-103',
              booked: 'bg-warning-bg text-warning border-warning/30 opacity-70 cursor-not-allowed',
              locked: 'bg-bg-alt text-ink-soft/40 border-line/60 cursor-not-allowed opacity-50'
            };

            return (
              <button
                key={table.id}
                onClick={() => handleTableClick(table)}
                className={`py-4 px-2 border rounded-lg flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${bgClasses[status]}`}
              >
                <span className="text-sm font-bold">T{table.number}</span>
                <span className="text-[9px] font-semibold">Cap {table.capacity}</span>
              </button>
            );
          })}
        </div>

        {/* Booking Confirmation checkout */}
        {selectedTable && (
          <div className="pt-2">
            <Button
              variant="primary"
              fullWidth
              className="py-3 flex items-center justify-center gap-2 font-serif font-bold tracking-wide"
              onClick={handleConfirmBooking}
            >
              <Sparkles className="w-4.5 h-4.5" />
              <span>Pay ₹100 Advance & Confirm</span>
            </Button>
            <p className="text-[10px] text-ink-soft text-center mt-2">
              Advance payment of ₹100 is non-refundable and will be credited toward your final bill.
            </p>
          </div>
        )}
      </Card>

      {/* Confirmation State overlay */}
      {bookingConfirmed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink/40 backdrop-blur-sm">
          <Card className="text-center max-w-sm space-y-4">
            <div className="w-12 h-12 bg-success-bg text-success rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-ink">Booking Confirmed!</h3>
              <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                Your dine-in booking request for {selectedTime} on {selectedDate} has been confirmed. Enjoy your visual menu experience!
              </p>
            </div>
            <div className="pt-2">
              <Link href="/customer/account">
                <Button variant="primary" size="sm" onClick={() => setBookingConfirmed(false)}>
                  Go to Profile
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
