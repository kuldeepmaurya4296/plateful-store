'use client';

import { useAuth } from '@/features/auth/context/AuthContext';
import { useApp } from '@/lib/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useScopedAccess() {
  const { user } = useAuth();
  const { tables, orders, bills } = useApp();
  const router = useRouter();

  const checkTableAccess = (tableId: string): { isAuthorized: boolean; table: any } => {
    if (!user) return { isAuthorized: false, table: null };
    
    const table = tables.find(t => t.id === tableId);
    if (!table) return { isAuthorized: false, table: null };

    // SuperAdmin has full access
    if (user.role === 'superadmin') return { isAuthorized: true, table };

    // Managers/Owners must belong to the same restaurant
    if (user.role === 'owner' || user.role === 'manager') {
      const authorized = table.restaurantId === user.restaurantId;
      return { isAuthorized: authorized, table };
    }

    // Captains must belong to the same restaurant and have the table in assignedTables
    if (user.role === 'captain') {
      const isSameRestaurant = table.restaurantId === user.restaurantId;
      // Check if captain counter maps to table counter
      const isAssigned = table.counterId === user.counterId || user.assignedTables?.includes(table.id);
      return { isAuthorized: isSameRestaurant && !!isAssigned, table };
    }

    // Customers must match table session or restaurant?
    // In demo, customer scan page sets table status, so they have read access if same restaurant
    if (user.role === 'customer') {
      return { isAuthorized: table.restaurantId === 'r1', table }; // Default to same restaurant in demo
    }

    return { isAuthorized: false, table: null };
  };

  const checkOrderAccess = (orderId: string): { isAuthorized: boolean; order: any } => {
    if (!user) return { isAuthorized: false, order: null };

    const order = orders.find(o => o.id === orderId);
    if (!order) return { isAuthorized: false, order: null };

    if (user.role === 'superadmin') return { isAuthorized: true, order };

    if (user.role === 'owner' || user.role === 'manager' || user.role === 'captain') {
      return { isAuthorized: order.restaurantId === user.restaurantId, order };
    }

    if (user.role === 'customer') {
      // In demo, customer has access to their own phone orders
      const authorized = order.customerPhone === user.phone || order.customerName === user.name;
      return { isAuthorized: authorized, order };
    }

    return { isAuthorized: false, order: null };
  };

  const checkBillAccess = (billId: string): { isAuthorized: boolean; bill: any } => {
    if (!user) return { isAuthorized: false, bill: null };

    const bill = bills.find(b => b.id === billId);
    if (!bill) return { isAuthorized: false, bill: null };

    if (user.role === 'superadmin') return { isAuthorized: true, bill };

    if (user.role === 'owner' || user.role === 'manager' || user.role === 'captain') {
      return { isAuthorized: bill.restaurantId === user.restaurantId, bill };
    }

    if (user.role === 'customer') {
      const authorized = bill.customerPhone === user.phone || bill.customerName === user.name;
      return { isAuthorized: authorized, bill };
    }

    return { isAuthorized: false, bill: null };
  };

  return {
    checkTableAccess,
    checkOrderAccess,
    checkBillAccess
  };
}
