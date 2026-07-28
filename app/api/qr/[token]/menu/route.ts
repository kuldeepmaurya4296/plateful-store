import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Table } from '@/lib/db/models/Table';
import { Restaurant } from '@/lib/db/models/Restaurant';
import { MenuItem } from '@/lib/db/models/MenuItem';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    await dbConnect();
    const { token } = await params;

    if (!token) {
      return NextResponse.json({ error: 'QR token is required.' }, { status: 400 });
    }

    const table = await Table.findOne({ qrToken: token }).lean();
    if (!table) {
      return NextResponse.json({ error: 'Invalid or expired QR code.' }, { status: 404 });
    }

    const restaurant = await Restaurant.findOne({ id: table.restaurantId }).lean();
    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found for this QR token.' }, { status: 404 });
    }

    const menuItems = await MenuItem.find({ restaurantId: table.restaurantId }).lean();

    return NextResponse.json({
      success: true,
      table: {
        id: table.id,
        number: table.number,
        capacity: table.capacity,
        status: table.status,
        activeSession: table.activeSession
      },
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        city: restaurant.city,
        address: restaurant.address,
        cuisine: restaurant.cuisine,
        avatar: restaurant.avatar,
        coverImage: restaurant.coverImage,
        rating: restaurant.rating
      },
      menu: menuItems
    });
  } catch (error: any) {
    console.error('QR menu resolution error:', error);
    return NextResponse.json({ error: error.message || 'Failed to resolve QR token' }, { status: 500 });
  }
}
