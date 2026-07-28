import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/connection';
import bcrypt from 'bcryptjs';
import {
  User,
  Restaurant,
  MenuItem,
  Table,
  Order,
  Bill,
  Expense,
  ForecastItem,
  Booking,
  Review,
  Story,
  Post,
  Message,
  Counter,
  Visit,
  Notification
} from '@/lib/db/models';
import {
  usersData,
  restaurantsData,
  menuItemsData,
  tablesData,
  ordersData,
  billsData,
  expensesData,
  forecastData,
  bookingsData,
  reviewsData,
  storiesData,
  postsData,
  messagesData,
  countersData,
  visitsData,
  notificationsData
} from '@/scripts/seedFixtures';

export async function POST() {
  try {
    await dbConnect();

    const defaultPasswordHash = await bcrypt.hash(process.env.DEFAULT_PASSWORD || 'Kuldeep@123', 10);

    const rawUsers = usersData.map((u: any) => ({
      ...u,
      passwordHash: defaultPasswordHash
    }));
    await User.deleteMany({});
    await User.insertMany(rawUsers);

    await Restaurant.deleteMany({});
    await Restaurant.insertMany(restaurantsData);

    await MenuItem.deleteMany({});
    await MenuItem.insertMany(menuItemsData);

    await Table.deleteMany({});
    await Table.insertMany(tablesData);

    await Order.deleteMany({});
    await Order.insertMany(ordersData);

    await Bill.deleteMany({});
    await Bill.insertMany(billsData);

    await Expense.deleteMany({});
    await Expense.insertMany(expensesData);

    await ForecastItem.deleteMany({});
    await ForecastItem.insertMany(forecastData);

    await Booking.deleteMany({});
    await Booking.insertMany(bookingsData);

    await Review.deleteMany({});
    await Review.insertMany(reviewsData);

    await Story.deleteMany({});
    await Story.insertMany(storiesData);

    await Post.deleteMany({});
    await Post.insertMany(postsData);

    await Message.deleteMany({});
    await Message.insertMany(messagesData);

    await Counter.deleteMany({});
    await Counter.insertMany(countersData);

    await Visit.deleteMany({});
    await Visit.insertMany(visitsData);

    await Notification.deleteMany({});
    await Notification.insertMany(notificationsData);

    return NextResponse.json({ success: true, message: 'Database reset and re-seeded successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
