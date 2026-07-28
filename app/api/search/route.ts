import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import { Restaurant } from '@/lib/db/models/Restaurant';
import { MenuItem } from '@/lib/db/models/MenuItem';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const city = searchParams.get('city');
    const cuisine = searchParams.get('cuisine');
    const minRating = searchParams.get('minRating');

    const filter: any = {};
    if (city && city !== 'All') {
      filter.city = new RegExp(city, 'i');
    }
    if (cuisine) {
      filter.cuisine = new RegExp(cuisine, 'i');
    }
    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }
    if (query) {
      filter.$or = [
        { name: new RegExp(query, 'i') },
        { cuisine: new RegExp(query, 'i') },
        { city: new RegExp(query, 'i') },
        { description: new RegExp(query, 'i') }
      ];
    }

    const restaurants = await Restaurant.find(filter).sort({ rating: -1 }).limit(20).lean();

    // Optionally search menu items if query provided
    let matchingDishes: any[] = [];
    if (query.trim().length > 1) {
      matchingDishes = await MenuItem.find({
        $or: [
          { name: new RegExp(query, 'i') },
          { category: new RegExp(query, 'i') },
          { description: new RegExp(query, 'i') }
        ]
      }).limit(10).lean();
    }

    return NextResponse.json({
      success: true,
      query,
      restaurants,
      dishes: matchingDishes
    });
  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: error.message || 'Search failed' }, { status: 500 });
  }
}
