export const usersData = [
  {
    "id": "u1",
    "name": "Riya Kapoor",
    "email": "riya@example.com",
    "phone": "+91-9876543210",
    "role": "customer",
    "avatar": "RK",
    "username": "riya.eats",
    "preferences": { "dietFilter": "veg", "city": "Mumbai" },
    "followedRestaurants": ["r1", "r2"],
    "wishlist": ["r1"]
  },
  {
    "id": "u_rahul",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "phone": "+91-9811122233",
    "role": "customer",
    "avatar": "RS",
    "username": "rahul.foodie",
    "preferences": { "dietFilter": "both", "city": "Mumbai" },
    "followedRestaurants": ["r1"],
    "wishlist": []
  },
  {
    "id": "u2",
    "name": "Vikram Mehta",
    "role": "owner",
    "username": "vikram.owner",
    "restaurantId": "r1",
    "avatar": "VM"
  },
  {
    "id": "u3",
    "name": "Priya Nair",
    "role": "manager",
    "username": "priya.manager",
    "restaurantId": "r1",
    "avatar": "PN"
  },
  {
    "id": "u4",
    "name": "Aman Joshi",
    "role": "captain",
    "username": "aman.captain",
    "restaurantId": "r1",
    "counterId": "c1",
    "assignedTables": ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8"],
    "avatar": "AJ"
  },
  {
    "id": "u5",
    "name": "Rohit Verma",
    "role": "captain",
    "username": "rohit.captain",
    "restaurantId": "r1",
    "counterId": "c2",
    "assignedTables": ["t9", "t10", "t11", "t12"],
    "avatar": "RV"
  },
  {
    "id": "u_super",
    "name": "SaaS Platform Admin",
    "role": "superadmin",
    "username": "admin.saas",
    "avatar": "SA"
  }
];

export const restaurantsData = [
  {
    "id": "r1",
    "name": "Spice Route",
    "city": "Mumbai",
    "address": "Bandra West, Mumbai",
    "cuisine": "North Indian",
    "rating": 4.6,
    "reviewCount": 128,
    "avatar": "SR",
    "description": "Authentic North Indian cuisines featuring traditional tandoor items and artisanal curries.",
    "phone": "+91-9988776655",
    "email": "contact@spiceroute.com",
    "features": ["Veg", "Non-Veg", "Dine-in", "Pre-book"],
    "coverImage": "/images/spice-route.jpg",
    "subscriptionPlan": "Enterprise",
    "subscriptionStatus": "Active"
  },
  {
    "id": "r2",
    "name": "Grill House",
    "city": "Mumbai",
    "address": "Andheri West, Mumbai",
    "cuisine": "BBQ & Grills",
    "rating": 4.3,
    "reviewCount": 89,
    "avatar": "GH",
    "description": "Smoked grills, barbecued kebabs, and a live grill table experience.",
    "phone": "+91-9988776644",
    "email": "contact@grillhouse.com",
    "features": ["Non-Veg", "Dine-in", "Bar"],
    "coverImage": "/images/grill-house.jpg",
    "subscriptionPlan": "Premium",
    "subscriptionStatus": "Active"
  },
  {
    "id": "r3",
    "name": "Cafe Mocha",
    "city": "Mumbai",
    "address": "Powai, Mumbai",
    "cuisine": "Cafe & Desserts",
    "rating": 4.5,
    "reviewCount": 215,
    "avatar": "CM",
    "description": "Artisanal coffees, hand-crafted chocolates, and high-quality desserts in an ambient setting.",
    "phone": "+91-9988776633",
    "email": "hello@cafemocha.com",
    "features": ["Veg", "Dine-in", "Desserts"],
    "coverImage": "/images/cafe-mocha.jpg",
    "subscriptionPlan": "Basic",
    "subscriptionStatus": "Active"
  }
];

export const menuItemsData = [
  {
    "id": "m1",
    "restaurantId": "r1",
    "name": "Volcano paneer tikka",
    "price": 320,
    "category": "Starters",
    "isVeg": true,
    "isAvailable": true,
    "description": "Smoky cottage cheese skewers marinated in hot spices, served with mint dip.",
    "presentationNote": "Served hot on slate, garnished with micro-greens and dry-ice smoke effect.",
    "image": "/images/paneer-tikka.jpg"
  },
  {
    "id": "m2",
    "restaurantId": "r1",
    "name": "Galouti dream",
    "price": 450,
    "category": "Mains",
    "isVeg": false,
    "isAvailable": true,
    "description": "Melt-in-mouth minced mutton patties spiced with house blend, served with saffron mini-naan.",
    "presentationNote": "Plated with silver foil wrap, edible flower, and fresh rose petals.",
    "image": "/images/galouti.jpg"
  },
  {
    "id": "m3",
    "restaurantId": "r1",
    "name": "Truffle butter naan",
    "price": 120,
    "category": "Starters",
    "isVeg": true,
    "isAvailable": true,
    "description": "Leavened flatbread baked in clay tandoor, brushed with truffle butter and fresh herbs.",
    "presentationNote": "Folded into triangles, served in a warm canvas pouch.",
    "image": "/images/truffle-naan.jpg"
  },
  {
    "id": "m4",
    "restaurantId": "r1",
    "name": "Midnight cocoa cloud",
    "price": 250,
    "category": "Desserts",
    "isVeg": true,
    "isAvailable": true,
    "description": "Rich 70% dark chocolate mousse resting on a flourless sponge, topped with cocoa dust.",
    "presentationNote": "Presented inside a glass dome filled with cold cherry-smoke vapor.",
    "image": "/images/cocoa-cloud.jpg"
  },
  {
    "id": "m5",
    "restaurantId": "r1",
    "name": "Dahi ke sholey",
    "price": 280,
    "category": "Starters",
    "isVeg": true,
    "isAvailable": true,
    "description": "Crispy bread rolls stuffed with spiced hung curd and fresh bell peppers.",
    "presentationNote": "Sliced diagonally, served on a long ceramic dish with sweet chili dip.",
    "image": "/images/dahi-sholey.jpg"
  },
  {
    "id": "m6",
    "restaurantId": "r1",
    "name": "Murg malai kebab",
    "price": 380,
    "category": "Starters",
    "isVeg": false,
    "isAvailable": true,
    "description": "Boneless chicken cubes marinated in cardamom-spiced cream and grilled to perfection.",
    "presentationNote": "Threaded on brass skewers, served with onion rings and lemon wedges.",
    "image": "/images/murgh-malai.jpg"
  },
  {
    "id": "m7",
    "restaurantId": "r2",
    "name": "Smoked lamb chops",
    "price": 550,
    "category": "Starters",
    "isVeg": false,
    "isAvailable": true,
    "description": "Hickory-smoked prime lamb chops brushed with a spicy BBQ glaze.",
    "presentationNote": "Arranged upright, garnished with toasted sesame seeds and fresh chives.",
    "image": "/images/lamb-chops.jpg"
  },
  {
    "id": "m8",
    "restaurantId": "r3",
    "name": "Hot Fudge Affogato",
    "price": 180,
    "category": "Desserts",
    "isVeg": true,
    "isAvailable": true,
    "description": "Double shot of hot espresso poured over Madagascar vanilla bean gelato.",
    "presentationNote": "Served in a crystal cup with chocolate chip cookie on the side.",
    "image": "/images/affogato.jpg"
  }
];

export const tablesData = [
  { "id": "t1", "number": 1, "capacity": 4, "status": "available", "counterId": "c1", "restaurantId": "r1", "qrToken": "qr_t1", "activeSession": null },
  { "id": "t2", "number": 2, "capacity": 2, "status": "occupied", "counterId": "c1", "restaurantId": "r1", "qrToken": "qr_t2", "activeSession": { "customerName": "Rahul Sharma", "customerPhone": "+91-9811122233", "startedBy": "u4", "startedAt": "2026-07-11T17:30:00+05:30", "items": [{ "menuItemId": "m2", "quantity": 1, "name": "Galouti dream", "price": 450 }], "total": 450, "preparationNote": "Make it spice level medium please" } },
  { "id": "t3", "number": 3, "capacity": 6, "status": "billing", "counterId": "c1", "restaurantId": "r1", "qrToken": "qr_t3", "activeSession": { "customerName": "Preeti Sinha", "customerPhone": "+91-9822233344", "startedBy": "u4", "startedAt": "2026-07-11T17:15:00+05:30", "items": [{ "menuItemId": "m1", "quantity": 1, "name": "Volcano paneer tikka", "price": 320 }, { "menuItemId": "m3", "quantity": 2, "name": "Truffle butter naan", "price": 120 }], "total": 560, "preparationNote": "" } },
  { "id": "t4", "number": 4, "capacity": 4, "status": "occupied", "counterId": "c1", "restaurantId": "r1", "qrToken": "qr_t4", "activeSession": { "customerName": "Karan Johar", "customerPhone": "+91-9833344455", "startedBy": "u4", "startedAt": "2026-07-11T17:40:00+05:30", "items": [{ "menuItemId": "m1", "quantity": 1, "name": "Volcano paneer tikka", "price": 320 }, { "menuItemId": "m3", "quantity": 2, "name": "Truffle butter naan", "price": 120 }, { "menuItemId": "m4", "quantity": 1, "name": "Midnight cocoa cloud", "price": 250 }], "total": 810, "preparationNote": "No onions in the garnish" } },
  { "id": "t5", "number": 5, "capacity": 4, "status": "available", "counterId": "c1", "restaurantId": "r1", "qrToken": "qr_t5", "activeSession": null },
  { "id": "t6", "number": 6, "capacity": 8, "status": "available", "counterId": "c1", "restaurantId": "r1", "qrToken": "qr_t6", "activeSession": null },
  { "id": "t7", "number": 7, "capacity": 4, "status": "occupied", "counterId": "c1", "restaurantId": "r1", "qrToken": "qr_t7", "activeSession": { "customerName": "Anil Kapoor", "customerPhone": "+91-9844455566", "startedBy": "u4", "startedAt": "2026-07-11T17:50:00+05:30", "items": [{ "menuItemId": "m5", "quantity": 2, "name": "Dahi ke sholey", "price": 280 }], "total": 560, "preparationNote": "" } },
  { "id": "t8", "number": 8, "capacity": 6, "status": "billing", "counterId": "c1", "restaurantId": "r1", "qrToken": "qr_t8", "activeSession": { "customerName": "Sunil Dutt", "customerPhone": "+91-9855566677", "startedBy": "u4", "startedAt": "2026-07-11T17:10:00+05:30", "items": [{ "menuItemId": "m2", "quantity": 2, "name": "Galouti dream", "price": 450 }, { "menuItemId": "m4", "quantity": 2, "name": "Midnight cocoa cloud", "price": 250 }], "total": 1400, "preparationNote": "" } },
  { "id": "t9", "number": 9, "capacity": 4, "status": "occupied", "counterId": "c2", "restaurantId": "r1", "qrToken": "qr_t9", "activeSession": { "customerName": "Ayesha Roy", "customerPhone": "+91-9866677788", "startedBy": "u5", "startedAt": "2026-07-11T17:45:00+05:30", "items": [{ "menuItemId": "m6", "quantity": 1, "name": "Murg malai kebab", "price": 380 }], "total": 380, "preparationNote": "Serve as soon as ready" } },
  { "id": "t10", "number": 10, "capacity": 2, "status": "available", "counterId": "c2", "restaurantId": "r1", "qrToken": "qr_t10", "activeSession": null },
  { "id": "t11", "number": 11, "capacity": 4, "status": "available", "counterId": "c2", "restaurantId": "r1", "qrToken": "qr_t11", "activeSession": null },
  { "id": "t12", "number": 12, "capacity": 6, "status": "available", "counterId": "c2", "restaurantId": "r1", "qrToken": "qr_t12", "activeSession": null }
];

export const ordersData = [
  { "id": "o1042", "restaurantId": "r1", "type": "online", "items": [{ "menuItemId": "m1", "quantity": 2, "name": "Volcano paneer tikka", "price": 270 }], "total": 540, "status": "pending", "createdAt": "2026-07-11T18:05:00+05:30", "customerName": "Suresh Gupta", "customerPhone": "+91-9922334455", "deliveryAddress": "Flat 302, Sea Breeze, Bandra West" },
  { "id": "o1041", "restaurantId": "r1", "type": "online", "items": [{ "menuItemId": "m2", "quantity": 1, "name": "Galouti dream", "price": 450 }, { "menuItemId": "m3", "quantity": 2, "name": "Truffle butter naan", "price": 85 }], "total": 620, "status": "preparing", "createdAt": "2026-07-11T17:55:00+05:30", "customerName": "Amit Trivedi", "customerPhone": "+91-9933445566", "deliveryAddress": "Bunglow 12, Pali Hill, Bandra West" },
  { "id": "o1040", "restaurantId": "r1", "type": "online", "items": [{ "menuItemId": "m4", "quantity": 3, "name": "Midnight cocoa cloud", "price": 250 }], "total": 750, "status": "ready", "createdAt": "2026-07-11T17:40:00+05:30", "customerName": "Neha Kakkar", "customerPhone": "+91-9944556677", "deliveryAddress": "Silver Sands, Carter Road" },
  { "id": "o1", "restaurantId": "r1", "type": "dine-in", "tableId": "t4", "items": [{ "menuItemId": "m1", "quantity": 1, "name": "Volcano paneer tikka", "price": 320 }, { "menuItemId": "m3", "quantity": 2, "name": "Truffle butter naan", "price": 120 }, { "menuItemId": "m4", "quantity": 1, "name": "Midnight cocoa cloud", "price": 250 }], "total": 810, "status": "preparing", "createdAt": "2026-07-11T17:40:00+05:30", "customerName": "Karan Johar", "customerPhone": "+91-9833344455" }
];

export const billsData = [
  { "id": "B-2291", "tableNumber": 6, "restaurantId": "r1", "customerName": "Siddharth Malhotra", "customerPhone": "+91-9877788899", "paymentMode": "UPI", "total": 1240, "tax": 100, "discount": 0, "grandTotal": 1240, "startedBy": "u3", "settledBy": "u3", "createdAt": "2026-07-10T21:42:00+05:30", "items": [{ "name": "Galouti dream", "quantity": 2, "price": 450 }, { "name": "Truffle butter naan", "quantity": 2, "price": 120 }, { "name": "Midnight cocoa cloud", "quantity": 1, "price": 250 }] },
  { "id": "B-2290", "tableNumber": 2, "restaurantId": "r1", "customerName": "Varun Dhawan", "customerPhone": "+91-9888899900", "paymentMode": "Cash", "total": 860, "tax": 60, "discount": 0, "grandTotal": 860, "startedBy": "u4", "settledBy": "u4", "createdAt": "2026-07-10T21:05:00+05:30", "items": [{ "name": "Volcano paneer tikka", "quantity": 2, "price": 320 }, { "name": "Truffle butter naan", "quantity": 2, "price": 110 }] },
  { "id": "B-2289", "tableNumber": 9, "restaurantId": "r1", "customerName": "Alia Bhatt", "customerPhone": "+91-9899900011", "paymentMode": "Card", "total": 2140, "tax": 180, "discount": 100, "grandTotal": 2140, "startedBy": "u5", "settledBy": "u3", "createdAt": "2026-07-10T20:38:00+05:30", "items": [{ "name": "Galouti dream", "quantity": 3, "price": 450 }, { "name": "Murg malai kebab", "quantity": 1, "price": 380 }, { "name": "Midnight cocoa cloud", "quantity": 2, "price": 250 }] },
  { "id": "B-2288", "tableNumber": 3, "restaurantId": "r1", "customerName": "Rajkumar Rao", "customerPhone": "+91-9900011122", "paymentMode": "UPI", "total": 540, "tax": 40, "discount": 0, "grandTotal": 540, "startedBy": "u4", "settledBy": "u4", "createdAt": "2026-07-10T20:02:00+05:30", "items": [{ "name": "Volcano paneer tikka", "quantity": 1, "price": 320 }, { "name": "Truffle butter naan", "quantity": 2, "price": 110 }] }
];

export const expensesData = [
  { "id": "e1", "restaurantId": "r1", "itemName": "Basmati rice", "quantity": "25 kg", "cost": 2150, "category": "Raw Material", "date": "2026-07-10", "notes": "Premium long grain" },
  { "id": "e2", "restaurantId": "r1", "itemName": "Paneer", "quantity": "18 kg", "cost": 4320, "category": "Raw Material", "date": "2026-07-10", "notes": "Fresh cottage cheese" },
  { "id": "e3", "restaurantId": "r1", "itemName": "LPG cylinder refill", "quantity": "1 unit", "cost": 1100, "category": "Utilities", "date": "2026-07-09", "notes": "Kitchen fuel" },
  { "id": "e4", "restaurantId": "r1", "itemName": "Mutton", "quantity": "12 kg", "cost": 6840, "category": "Raw Material", "date": "2026-07-09", "notes": "For Galouti Kebab" }
];

export const forecastData = [
  { "id": "f1", "restaurantId": "r1", "itemName": "Basmati rice", "quantityNeeded": "20 kg", "estimatedCost": 1800, "isPurchased": false },
  { "id": "f2", "restaurantId": "r1", "itemName": "Paneer", "quantityNeeded": "15 kg", "estimatedCost": 3600, "isPurchased": false },
  { "id": "f3", "restaurantId": "r1", "itemName": "Tomatoes", "quantityNeeded": "10 kg", "estimatedCost": 400, "isPurchased": false }
];

export const bookingsData = [
  { "id": "b1", "userId": "u1", "userName": "Riya Kapoor", "restaurantId": "r1", "restaurantName": "Spice Route", "date": "2026-07-12", "timeSlot": "7:30 PM", "partySize": 2, "specialRequest": "Window table if possible", "status": "confirmed", "advancePaid": 100, "tableNumber": 2, "createdAt": "2026-07-11T12:00:00+05:30" },
  { "id": "b2", "userId": "u_rahul", "userName": "Rahul Sharma", "restaurantId": "r1", "restaurantName": "Spice Route", "date": "2026-07-13", "timeSlot": "8:30 PM", "partySize": 4, "specialRequest": "", "status": "pending", "advancePaid": 100, "createdAt": "2026-07-11T16:30:00+05:30" }
];

export const reviewsData = [
  { "id": "rv1", "visitId": "v1", "restaurantId": "r1", "userId": "u1", "userName": "Riya Kapoor", "foodRating": 5, "presentationRating": 4, "ambianceRating": 5, "text": "The Truffle butter naan was delicious, fresh off the tawa! The Volcano paneer tikka presentation was visually stunning.", "createdAt": "2026-07-11T18:10:00+05:30" },
  { "id": "rv2", "visitId": "v2", "restaurantId": "r1", "userId": "u_rahul", "userName": "Rahul Sharma", "foodRating": 4, "presentationRating": 5, "ambianceRating": 4, "text": "Galouti dream was super soft and melted in my mouth. Excellent presentation with silver foil.", "createdAt": "2026-07-11T17:45:00+05:30" }
];

export const storiesData = [
  { "id": "s1", "restaurantId": "r1", "mediaUrl": "/images/story-tikka.jpg", "caption": "Fresh off the tandoor: spicy Volcano paneer tikka!", "isPermanent": false, "createdAt": "2026-07-11T16:00:00+05:30", "expiresAt": "2026-07-12T16:00:00+05:30" },
  { "id": "s2", "restaurantId": "r1", "mediaUrl": "/images/story-naan.jpg", "caption": "Truffle butter naan, standard plating with cold-pressed garlic ghee.", "isPermanent": true, "createdAt": "2026-07-11T12:00:00+05:30", "expiresAt": null },
  { "id": "s3", "restaurantId": "r2", "mediaUrl": "/images/story-ribs.jpg", "caption": "Sunday BBQ special starts at 7 PM!", "isPermanent": false, "createdAt": "2026-07-11T15:30:00+05:30", "expiresAt": "2026-07-12T15:30:00+05:30" }
];

export const postsData = [
  { "id": "p1", "authorType": "restaurant", "authorId": "r1", "authorName": "Spice Route", "authorAvatar": "SR", "city": "Mumbai", "photoUrl": "/images/post-naan.jpg", "caption": "Hot and fluffy Truffle Butter Naan, baked fresh to order in our clay oven! #foodie #mumbai", "isVeg": true, "rating": 4.6, "likesCount": 124, "commentsCount": 8, "createdAt": "2026-07-11T14:20:00+05:30" },
  { "id": "p2", "authorType": "customer", "authorId": "u1", "authorName": "Riya Kapoor", "authorAvatar": "RK", "restaurantId": "r1", "restaurantName": "Spice Route, Bandra", "city": "Mumbai", "photoUrl": "/images/post-tikka.jpg", "caption": "Look at that dry-ice plating! Volcano Paneer Tikka was super smoky and soft. Perfect flavor balance! @Spice Route", "isVeg": true, "rating": 4.6, "likesCount": 89, "commentsCount": 5, "createdAt": "2026-07-11T13:10:00+05:30" },
  { "id": "p3", "authorType": "restaurant", "authorId": "r2", "authorName": "Grill House", "authorAvatar": "GH", "city": "Mumbai", "photoUrl": "/images/post-lamb.jpg", "caption": "Our signature Hickory-smoked lamb chops brushed with honey BBQ glaze. Perfect for your Sunday dinner! #grills #bbq", "isVeg": false, "rating": 4.3, "likesCount": 95, "commentsCount": 12, "createdAt": "2026-07-11T12:00:00+05:30" }
];

export const messagesData = [
  { "id": "msg1", "restaurantId": "r1", "userId": "u1", "sender": "customer", "text": "Hi, do you have any gluten-free bread options available?", "createdAt": "2026-07-11T14:30:00+05:30" },
  { "id": "msg2", "restaurantId": "r1", "userId": "u1", "sender": "restaurant", "text": "Hello! Yes, we have gluten-free rotis and can customize certain gravies for you. Please let your captain know when you scan the QR code!", "createdAt": "2026-07-11T14:35:00+05:30" }
];

export const countersData = [
  { "id": "c1", "name": "Counter 1", "restaurantId": "r1", "tableRange": "Tables 1-8", "captainId": "u4", "captainName": "Aman Joshi" },
  { "id": "c2", "name": "Counter 2", "restaurantId": "r1", "tableRange": "Tables 9-12", "captainId": "u5", "captainName": "Rohit Verma" }
];

export const visitsData = [
  { "id": "v1", "userId": "u1", "restaurantId": "r1", "tableId": "t6", "paymentConfirmedAt": "2026-07-11T18:10:00+05:30", "reviewWindowOpensAt": "2026-07-11T18:10:00+05:30", "reviewWindowClosesAt": "2026-07-11T18:20:00+05:30", "isReviewed": true, "billId": "B-2291" },
  { "id": "v2", "userId": "u_rahul", "restaurantId": "r1", "tableId": "t2", "paymentConfirmedAt": "2026-07-11T17:40:00+05:30", "reviewWindowOpensAt": "2026-07-11T17:40:00+05:30", "reviewWindowClosesAt": "2026-07-11T17:50:00+05:30", "isReviewed": true, "billId": "B-2290" },
  { "id": "v_active", "userId": "u1", "restaurantId": "r1", "tableId": "t4", "paymentConfirmedAt": "2026-07-11T18:15:00+05:30", "reviewWindowOpensAt": "2026-07-11T18:15:00+05:30", "reviewWindowClosesAt": "2026-07-11T18:25:00+05:30", "isReviewed": false, "billId": "B-2292" }
];

export const notificationsData = [
  { "id": "n1", "userId": "u1", "type": "booking_confirmed", "title": "Booking Confirmed", "message": "Spice Route confirmed your 7:30 PM reservation for 2", "isRead": false, "createdAt": "2026-07-11T12:05:00+05:30", "link": "/customer/bookings" }
];
