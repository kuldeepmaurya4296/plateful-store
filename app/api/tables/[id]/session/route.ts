import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Table } from '@/lib/db/models/Table';
import { sseManager } from '@/lib/realtime/sseManager';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const table = await Table.findOne({ $or: [{ id }, { qrToken: id }] }).lean();
    if (!table) {
      return NextResponse.json({ error: 'Table not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      tableId: table.id,
      tableNumber: table.number,
      activeSession: table.activeSession || null,
      tableSession: {
        sessionId: table.activeSession?.customerName ? `sess_${table.id}` : `sess_${Date.now()}`,
        adminName: table.activeSession?.customerName || 'Host',
        participantsCount: table.activeSession ? 1 : 0,
        isJoinAllowed: true
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const { action, participantName, participantPhone, requestId, accepted } = body;

    const table = await Table.findOne({ $or: [{ id }, { qrToken: id }] });
    if (!table) {
      return NextResponse.json({ error: 'Table not found.' }, { status: 404 });
    }

    if (action === 'create_session') {
      table.status = 'occupied';
      table.activeSession = {
        customerName: participantName || 'Guest Admin',
        customerPhone: participantPhone || '',
        startedBy: 'customer',
        startedAt: new Date().toISOString(),
        total: 0,
        items: []
      };
      await table.save();

      sseManager.broadcast(table.restaurantId, {
        type: 'table:status',
        data: { tableId: table.id, status: 'occupied', activeSession: table.activeSession },
        timestamp: new Date().toISOString()
      });

      return NextResponse.json({ success: true, action: 'session_created', session: table.activeSession }, { status: 201 });
    }

    if (action === 'request_join') {
      const joinReqId = requestId || `req_${Date.now()}`;
      sseManager.broadcast(table.restaurantId, {
        type: 'table:join_request',
        data: {
          tableId: table.id,
          tableNumber: table.number,
          requestId: joinReqId,
          participantName: participantName || 'Guest User',
          participantPhone: participantPhone || ''
        },
        timestamp: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        action: 'join_requested',
        requestId: joinReqId,
        message: 'Join request broadcast to table admin.'
      });
    }

    if (action === 'respond_join') {
      sseManager.broadcast(table.restaurantId, {
        type: 'table:join_response',
        data: {
          tableId: table.id,
          requestId,
          accepted: Boolean(accepted),
          adminName: table.activeSession?.customerName || 'Admin'
        },
        timestamp: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        action: 'join_responded',
        accepted: Boolean(accepted)
      });
    }

    return NextResponse.json({ success: true, message: `Action '${action}' recorded.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

