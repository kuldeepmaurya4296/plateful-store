import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Read .env file directly if process.env.MONGODB_URI is not pre-loaded
if (!process.env.MONGODB_URI) {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    for (const line of envConfig.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          process.env[key.trim()] = valueParts.join('=').trim();
        }
      }
    }
  }
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not set in .env');
  process.exit(1);
}

// Import models
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
} from '../lib/db/models';

// Import seed fixtures
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
} from './seedFixtures';

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB Atlas at:', MONGODB_URI?.replace(/:([^@]+)@/, ':****@'));
    await mongoose.connect(MONGODB_URI!);
    console.log('Successfully connected to MongoDB.');

    const defaultPasswordHash = await bcrypt.hash('123456', 10);

    // 1. Seed Users
    const usersWithHash = usersData.map((u: any) => ({
      ...u,
      passwordHash: defaultPasswordHash
    }));
    await User.deleteMany({});
    await User.insertMany(usersWithHash);
    console.log(`✓ Seeded ${usersWithHash.length} Users`);

    // 2. Seed Restaurants
    await Restaurant.deleteMany({});
    await Restaurant.insertMany(restaurantsData);
    console.log(`✓ Seeded ${restaurantsData.length} Restaurants`);

    // 3. Seed MenuItems
    await MenuItem.deleteMany({});
    await MenuItem.insertMany(menuItemsData);
    console.log(`✓ Seeded ${menuItemsData.length} MenuItems`);

    // 4. Seed Tables
    await Table.deleteMany({});
    await Table.insertMany(tablesData);
    console.log(`✓ Seeded ${tablesData.length} Tables`);

    // 5. Seed Orders
    await Order.deleteMany({});
    await Order.insertMany(ordersData);
    console.log(`✓ Seeded ${ordersData.length} Orders`);

    // 6. Seed Bills
    await Bill.deleteMany({});
    await Bill.insertMany(billsData);
    console.log(`✓ Seeded ${billsData.length} Bills`);

    // 7. Seed Expenses
    await Expense.deleteMany({});
    await Expense.insertMany(expensesData);
    console.log(`✓ Seeded ${expensesData.length} Expenses`);

    // 8. Seed ForecastItems
    await ForecastItem.deleteMany({});
    await ForecastItem.insertMany(forecastData);
    console.log(`✓ Seeded ${forecastData.length} ForecastItems`);

    // 9. Seed Bookings
    await Booking.deleteMany({});
    await Booking.insertMany(bookingsData);
    console.log(`✓ Seeded ${bookingsData.length} Bookings`);

    // 10. Seed Reviews
    await Review.deleteMany({});
    await Review.insertMany(reviewsData);
    console.log(`✓ Seeded ${reviewsData.length} Reviews`);

    // 11. Seed Stories
    await Story.deleteMany({});
    await Story.insertMany(storiesData);
    console.log(`✓ Seeded ${storiesData.length} Stories`);

    // 12. Seed Posts
    await Post.deleteMany({});
    await Post.insertMany(postsData);
    console.log(`✓ Seeded ${postsData.length} Posts`);

    // 13. Seed Messages
    await Message.deleteMany({});
    await Message.insertMany(messagesData);
    console.log(`✓ Seeded ${messagesData.length} Messages`);

    // 14. Seed Counters
    await Counter.deleteMany({});
    await Counter.insertMany(countersData);
    console.log(`✓ Seeded ${countersData.length} Counters`);

    // 15. Seed Visits
    await Visit.deleteMany({});
    await Visit.insertMany(visitsData);
    console.log(`✓ Seeded ${visitsData.length} Visits`);

    // 16. Seed Notifications
    await Notification.deleteMany({});
    await Notification.insertMany(notificationsData);
    console.log(`✓ Seeded ${notificationsData.length} Notifications`);

    console.log('\n🎉 All 16 collections successfully seeded into MongoDB Atlas database!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
