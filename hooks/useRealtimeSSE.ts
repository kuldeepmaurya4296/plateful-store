'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import type { SSEEventType } from '@/lib/realtime/sseManager';

interface SSEHookOptions {
  /** The restaurant ID to subscribe to */
  restaurantId: string;
  /** Whether the connection is enabled (e.g., only when authenticated) */
  enabled?: boolean;
  /** Callback for each event type */
  onEvent?: (type: SSEEventType, data: Record<string, unknown>) => void;
  /** Callback specifically for new orders */
  onNewOrder?: (data: Record<string, unknown>) => void;
  /** Callback specifically for table status updates */
  onTableUpdate?: (data: Record<string, unknown>) => void;
  /** Callback specifically for order status changes */
  onOrderStatus?: (data: Record<string, unknown>) => void;
  /** Callback specifically for new notifications */
  onNotification?: (data: Record<string, unknown>) => void;
  /** Callback specifically for new bookings */
  onBookingUpdate?: (data: Record<string, unknown>) => void;
}

interface SSEState {
  connected: boolean;
  clientId: string | null;
  lastEventAt: string | null;
  reconnectCount: number;
}

/**
 * React hook for consuming Server-Sent Events from the /api/realtime/stream endpoint.
 * 
 * Handles automatic reconnection with exponential backoff, heartbeat monitoring,
 * and clean disconnection on unmount.
 * 
 * @example
 * ```tsx
 * const { connected } = useRealtimeSSE({
 *   restaurantId: 'r1',
 *   enabled: true,
 *   onNewOrder: (data) => {
 *     toast.info(`New order from Table ${data.tableNumber}`);
 *     refetchOrders();
 *   },
 *   onTableUpdate: (data) => {
 *     refetchTables();
 *   }
 * });
 * ```
 */
export function useRealtimeSSE(options: SSEHookOptions): SSEState {
  const {
    restaurantId,
    enabled = true,
    onEvent,
    onNewOrder,
    onTableUpdate,
    onOrderStatus,
    onNotification,
    onBookingUpdate
  } = options;

  const [state, setState] = useState<SSEState>({
    connected: false,
    clientId: null,
    lastEventAt: null,
    reconnectCount: 0
  });

  // Store callbacks in refs to avoid reconnecting on callback changes
  const callbacksRef = useRef({
    onEvent,
    onNewOrder,
    onTableUpdate,
    onOrderStatus,
    onNotification,
    onBookingUpdate
  });

  useEffect(() => {
    callbacksRef.current = {
      onEvent,
      onNewOrder,
      onTableUpdate,
      onOrderStatus,
      onNotification,
      onBookingUpdate
    };
  }, [onEvent, onNewOrder, onTableUpdate, onOrderStatus, onNotification, onBookingUpdate]);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectCountRef = useRef(0);

  const connect = useCallback(() => {
    if (!restaurantId || !enabled) return;

    // Close any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const url = `/api/realtime/stream?restaurantId=${encodeURIComponent(restaurantId)}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    // Connection opened
    es.addEventListener('connected', (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      reconnectCountRef.current = 0;
      setState({
        connected: true,
        clientId: data.clientId,
        lastEventAt: data.connectedAt,
        reconnectCount: 0
      });
      console.log('[SSE] Connected:', data.clientId);
    });

    // Heartbeat
    es.addEventListener('ping', (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      setState(prev => ({ ...prev, lastEventAt: data.timestamp }));
    });

    // Business events
    const eventTypes: SSEEventType[] = [
      'order:new',
      'order:status',
      'table:status',
      'notification:new',
      'story:new',
      'booking:update'
    ];

    for (const type of eventTypes) {
      es.addEventListener(type, (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        setState(prev => ({ ...prev, lastEventAt: new Date().toISOString() }));

        // Fire generic handler
        callbacksRef.current.onEvent?.(type, data);

        // Fire specific handlers
        switch (type) {
          case 'order:new':
            callbacksRef.current.onNewOrder?.(data);
            break;
          case 'order:status':
            callbacksRef.current.onOrderStatus?.(data);
            break;
          case 'table:status':
            callbacksRef.current.onTableUpdate?.(data);
            break;
          case 'notification:new':
            callbacksRef.current.onNotification?.(data);
            break;
          case 'booking:update':
            callbacksRef.current.onBookingUpdate?.(data);
            break;
        }
      });
    }

    // Error / disconnect → auto-reconnect with exponential backoff
    es.onerror = () => {
      es.close();
      setState(prev => ({ ...prev, connected: false }));

      reconnectCountRef.current += 1;
      const delay = Math.min(1000 * Math.pow(2, reconnectCountRef.current), 30000);
      console.log(`[SSE] Disconnected. Reconnecting in ${delay}ms (attempt ${reconnectCountRef.current})`);

      setState(prev => ({ ...prev, reconnectCount: reconnectCountRef.current }));
      reconnectTimeoutRef.current = setTimeout(connect, delay);
    };
  }, [restaurantId, enabled]);

  useEffect(() => {
    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  return state;
}
