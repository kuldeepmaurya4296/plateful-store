import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Table } from '@/lib/db/models/Table';
import { validateTableTransition } from '@/lib/tableStateMachine';
import { sseManager } from '@/lib/realtime/sseManager';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const { status, activeSession } = body;

    const table = await Table.findOne({ id });
    if (!table) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    }

    const { isValid, errorMessage } = validateTableTransition(table.status, status);
    if (!isValid) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    table.status = status;
    if (status === 'available') {
      table.activeSession = null;
    } else if (activeSession !== undefined) {
      table.activeSession = activeSession;
    }

    await table.save();

    if (table.restaurantId) {
      sseManager.broadcast(table.restaurantId, {
        type: 'table:status',
        data: table.toObject ? table.toObject() : table,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(table);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
