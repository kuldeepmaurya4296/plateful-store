/**
 * Server-Sent Events (SSE) Connection Manager
 * 
 * Maintains in-memory connections per restaurant channel.
 * Clients subscribe to a restaurant's event stream and receive
 * real-time updates for: orders, table status, notifications.
 * 
 * Architecture:
 * - Each restaurant has a Set of writable controllers
 * - When an event fires (e.g., new order), broadcast() pushes
 *   the event to every client watching that restaurant
 * - Connections are cleaned up when the client disconnects
 */

export type SSEEventType = 
  | 'order:new'
  | 'order:status'
  | 'table:status'
  | 'table:join_request'
  | 'table:join_response'
  | 'notification:new'
  | 'story:new'
  | 'booking:update'
  | 'ping';

export interface SSEEvent {
  type: SSEEventType;
  data: Record<string, unknown>;
  timestamp: string;
}

interface SSEClient {
  controller: ReadableStreamDefaultController;
  clientId: string;
  role: string;
  connectedAt: Date;
}

class SSEManager {
  private channels: Map<string, Set<SSEClient>> = new Map();

  /**
   * Register a new client connection for a restaurant channel.
   */
  addClient(restaurantId: string, client: SSEClient): void {
    if (!this.channels.has(restaurantId)) {
      this.channels.set(restaurantId, new Set());
    }
    this.channels.get(restaurantId)!.add(client);
    console.log(
      `[SSE] Client ${client.clientId} (${client.role}) connected to restaurant ${restaurantId}. ` +
      `Total clients: ${this.channels.get(restaurantId)!.size}`
    );
  }

  /**
   * Remove a client when they disconnect.
   */
  removeClient(restaurantId: string, client: SSEClient): void {
    const channel = this.channels.get(restaurantId);
    if (channel) {
      channel.delete(client);
      if (channel.size === 0) {
        this.channels.delete(restaurantId);
      }
      console.log(
        `[SSE] Client ${client.clientId} disconnected from restaurant ${restaurantId}. ` +
        `Remaining clients: ${channel.size}`
      );
    }
  }

  /**
   * Broadcast an event to all clients watching a restaurant.
   */
  broadcast(restaurantId: string, event: SSEEvent): void {
    const channel = this.channels.get(restaurantId);
    if (!channel || channel.size === 0) return;

    const payload = `event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`;
    const encoder = new TextEncoder();
    const encoded = encoder.encode(payload);

    const deadClients: SSEClient[] = [];

    for (const client of channel) {
      try {
        client.controller.enqueue(encoded);
      } catch {
        // Client disconnected — mark for cleanup
        deadClients.push(client);
      }
    }

    // Clean up dead connections
    for (const dead of deadClients) {
      this.removeClient(restaurantId, dead);
    }
  }

  /**
   * Broadcast to all clients regardless of restaurant (platform-wide).
   */
  broadcastAll(event: SSEEvent): void {
    for (const [restaurantId] of this.channels) {
      this.broadcast(restaurantId, event);
    }
  }

  /**
   * Get the number of connected clients for a restaurant.
   */
  getClientCount(restaurantId: string): number {
    return this.channels.get(restaurantId)?.size ?? 0;
  }

  /**
   * Get total connected clients across all restaurants.
   */
  getTotalClientCount(): number {
    let total = 0;
    for (const channel of this.channels.values()) {
      total += channel.size;
    }
    return total;
  }
}

// Singleton — survives across API route invocations in the same server process
const globalForSSE = globalThis as typeof globalThis & { sseManager?: SSEManager };
export const sseManager = globalForSSE.sseManager ?? new SSEManager();
if (process.env.NODE_ENV !== 'production') {
  globalForSSE.sseManager = sseManager;
}
