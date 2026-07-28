import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { sseManager } from '@/lib/realtime/sseManager';

/**
 * GET /api/realtime/stream?restaurantId=xxx
 * 
 * Server-Sent Events endpoint. Clients keep a long-lived connection
 * open and receive events as they happen.
 * 
 * Used by: Manager console, Captain app, Customer app (if needed).
 */
export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const restaurantId = searchParams.get('restaurantId') || (token.restaurantId as string) || '';
  const role = (token.role as string) || 'customer';
  const clientId = `${role}_${token.sub || Date.now()}`;

  if (!restaurantId) {
    return new Response('Missing restaurantId parameter', { status: 400 });
  }

  const stream = new ReadableStream({
    start(controller) {
      const client = {
        controller,
        clientId,
        role,
        connectedAt: new Date()
      };

      // Register the client
      sseManager.addClient(restaurantId, client);

      // Send initial connection confirmation
      const encoder = new TextEncoder();
      controller.enqueue(
        encoder.encode(
          `event: connected\ndata: ${JSON.stringify({ 
            clientId, 
            restaurantId, 
            role,
            connectedAt: new Date().toISOString() 
          })}\n\n`
        )
      );

      // Heartbeat every 30 seconds to keep the connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(
            encoder.encode(
              `event: ping\ndata: ${JSON.stringify({ timestamp: new Date().toISOString() })}\n\n`
            )
          );
        } catch {
          // Client disconnected
          clearInterval(heartbeat);
          sseManager.removeClient(restaurantId, client);
        }
      }, 30000);

      // Cleanup when the request is aborted (client navigates away)
      req.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        sseManager.removeClient(restaurantId, client);
        try {
          controller.close();
        } catch {
          // Already closed
        }
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable Nginx buffering
    },
  });
}
