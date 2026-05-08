/**
 * ChefCaterPro — Database Seed Script
 * Run: node seed.js
 * Seeds: Users, NGOs, Services, Menu Items, Bookings, Donations
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/chefcatering';

// ── Models ──────────────────────────────────────────────
const User     = require('./models/User');
const Service  = require('./models/Service');
const Booking  = require('./models/Booking');
const Donation = require('./models/Donation');
const Menu     = require('./models/Menu');
const NGO      = require('./models/NGO');

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // ── Clear existing data ──────────────────────────────
    await Promise.all([
      User.deleteMany({}), Service.deleteMany({}),
      Booking.deleteMany({}), Donation.deleteMany({}),
      Menu.deleteMany({}), NGO.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // ── 1. Create Users ──────────────────────────────────
    const hashedPw = await bcrypt.hash('demo123', 12);

    const [admin, chef1, chef2, chef3, customer1, customer2] = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@demo.com',
        password: hashedPw,
        role: 'admin',
        phone: '9999999999',
        address: 'Mumbai, Maharashtra',
        isVerified: true
      },
      {
        name: 'Chef Arjun Kapoor',
        email: 'chef@demo.com',
        password: hashedPw,
        role: 'chef',
        phone: '9876543210',
        address: 'Bandra, Mumbai',
        isVerified: true
      },
      {
        name: 'Chef Meera Shah',
        email: 'meera@demo.com',
        password: hashedPw,
        role: 'chef',
        phone: '9876543211',
        address: 'Andheri, Mumbai',
        isVerified: true
      },
      {
        name: 'Chef Ravi Kumar',
        email: 'ravi@demo.com',
        password: hashedPw,
        role: 'chef',
        phone: '9876543212',
        address: 'Pune, Maharashtra',
        isVerified: true
      },
      {
        name: 'Priya Sharma',
        email: 'customer@demo.com',
        password: hashedPw,
        role: 'customer',
        phone: '9123456789',
        address: 'Juhu, Mumbai',
        isVerified: true
      },
      {
        name: 'Rahul Mehta',
        email: 'rahul@demo.com',
        password: hashedPw,
        role: 'customer',
        phone: '9123456780',
        address: 'Powai, Mumbai',
        isVerified: true
      }
    ]);
    console.log('👥 Created 6 users (admin, 3 chefs, 2 customers)');

    // ── 2. Create NGOs ───────────────────────────────────
    const [ngo1, ngo2, ngo3, ngo4] = await NGO.insertMany([
      {
        name: 'Feeding India',
        registrationNumber: 'NGO-MH-001',
        contactPerson: 'Rahul Singh',
        email: 'contact@feedingindia.org',
        phone: '9800001111',
        address: 'Dharavi, Mumbai',
        city: 'Mumbai',
        operatingAreas: ['Mumbai', 'Thane', 'Navi Mumbai'],
        acceptedFoodTypes: ['Cooked Food', 'Dry Rations', 'Sweets', 'Beverages'],
        capacity: 500,
        isVerified: true,
        isActive: true,
        description: 'India\'s largest food rescue organization, active in 50+ cities across India.',
        totalDonationsReceived: 12000,
        totalPeopleFed: 30000
      },
      {
        name: 'Robin Hood Army',
        registrationNumber: 'NGO-DL-002',
        contactPerson: 'Anita Sharma',
        email: 'contact@robinhoodarmy.com',
        phone: '9800002222',
        address: 'Connaught Place, Delhi',
        city: 'Delhi',
        operatingAreas: ['Delhi', 'Noida', 'Gurugram'],
        acceptedFoodTypes: ['Cooked Food', 'Bakery Items', 'Fruits'],
        capacity: 300,
        isVerified: true,
        isActive: true,
        description: 'Zero-cost volunteer organization distributing surplus food across India.',
        totalDonationsReceived: 8500,
        totalPeopleFed: 21250
      },
      {
        name: 'No Food Waste',
        registrationNumber: 'NGO-KA-003',
        contactPerson: 'Karan Mehta',
        email: 'hello@nofoodwaste.org',
        phone: '9800003333',
        address: 'Koramangala, Bangalore',
        city: 'Bangalore',
        operatingAreas: ['Bangalore', 'Mysore'],
        acceptedFoodTypes: ['All Types of Food'],
        capacity: 400,
        isVerified: true,
        isActive: true,
        description: 'Tech-enabled food surplus redistribution platform.',
        totalDonationsReceived: 6200,
        totalPeopleFed: 15500
      },
      {
        name: 'Roti Bank',
        registrationNumber: 'NGO-GJ-004',
        contactPerson: 'Hetal Patel',
        email: 'rotibank@gmail.com',
        phone: '9800004444',
        address: 'Satellite, Ahmedabad',
        city: 'Ahmedabad',
        operatingAreas: ['Ahmedabad', 'Surat', 'Vadodara'],
        acceptedFoodTypes: ['Cooked Food', 'Dry Rations'],
        capacity: 200,
        isVerified: true,
        isActive: true,
        description: 'Community-driven free meals for daily wage workers and homeless.',
        totalDonationsReceived: 4100,
        totalPeopleFed: 10250
      }
    ]);
    console.log('🏛️  Created 4 NGO partners');

    // ── 3. Create Services ───────────────────────────────
    const [svc1, svc2, svc3, svc4, svc5, svc6] = await Service.insertMany([
      {
        chef: chef1._id,
        title: 'Royal Wedding Package',
        description: 'Luxurious multi-cuisine wedding catering with live counters, dessert stations, cocktail setup and dedicated service staff.',
        category: 'wedding',
        pricePerHead: 1200,
        minGuests: 100,
        maxGuests: 1000,
        cuisineType: ['North Indian', 'Continental', 'Chinese'],
        rating: 4.9,
        totalReviews: 45,
        isActive: true,
        includes: [
          'Welcome Mocktail & Snacks',
          'Starter Buffet (6 items)',
          'Main Course (10 items)',
          'Live Pani Puri & Chaat Counter',
          'Dessert Station (8 items)',
          'Dedicated Service Staff'
        ]
      },
      {
        chef: chef2._id,
        title: 'Corporate Lunch Service',
        description: 'Healthy, hygienic corporate meals with customizable menus, dietary options, and prompt service for office events.',
        category: 'corporate',
        pricePerHead: 350,
        minGuests: 20,
        maxGuests: 300,
        cuisineType: ['South Indian', 'Jain', 'North Indian'],
        rating: 4.7,
        totalReviews: 89,
        isActive: true,
        includes: [
          'Salad Bar',
          'Main Course (5 items)',
          'Dal & Rice',
          'Bread Selection',
          'Dessert',
          'Beverages'
        ]
      },
      {
        chef: chef3._id,
        title: 'Birthday Bash Special',
        description: 'Vibrant birthday catering with themed setups, custom cake arrangements, and crowd-pleasing party snacks for all ages.',
        category: 'birthday',
        pricePerHead: 650,
        minGuests: 30,
        maxGuests: 200,
        cuisineType: ['Mughlai', 'Chinese', 'Italian'],
        rating: 4.8,
        totalReviews: 62,
        isActive: true,
        includes: [
          'Welcome Drinks',
          'Finger Foods & Starters',
          'Main Course Buffet',
          'Birthday Cake Setup',
          'Mocktail Bar',
          'Cleanup Included'
        ]
      },
      {
        chef: chef1._id,
        title: 'Festival Feast Package',
        description: 'Traditional festival cuisines with authentic flavors — from Navratri to Diwali to Eid — prepared fresh on-site.',
        category: 'festival',
        pricePerHead: 480,
        minGuests: 50,
        maxGuests: 500,
        cuisineType: ['Gujarati', 'Rajasthani', 'Maharashtrian'],
        rating: 4.6,
        totalReviews: 33,
        isActive: true,
        includes: [
          'Traditional Thali Setup',
          'Live Tawa Counter',
          'Seasonal Specialties',
          'Mithai Counter',
          'Paan Counter'
        ]
      },
      {
        chef: chef2._id,
        title: 'Private Fine Dining',
        description: 'An intimate private dining experience with custom multi-course meals by a Michelin-inspired chef. Exclusive and unforgettable.',
        category: 'private-dining',
        pricePerHead: 2500,
        minGuests: 6,
        maxGuests: 30,
        cuisineType: ['French', 'Mediterranean', 'Fusion'],
        rating: 5.0,
        totalReviews: 18,
        isActive: true,
        includes: [
          'Welcome Aperitif',
          'Amuse-Bouche',
          '3-Course Custom Menu',
          'Cheese Board',
          'Petit Fours',
          'Personal Chef Service'
        ]
      },
      {
        chef: chef3._id,
        title: 'Social Gathering Special',
        description: 'Crowd-pleasing multi-cuisine spreads for kitty parties, reunions, and get-togethers. Fun food that everyone loves.',
        category: 'social',
        pricePerHead: 550,
        minGuests: 25,
        maxGuests: 250,
        cuisineType: ['Punjabi', 'Chinese', 'Italian', 'Mexican'],
        rating: 4.5,
        totalReviews: 71,
        isActive: true,
        includes: [
          'Snack Stations',
          'Multi-cuisine Buffet',
          'Live Pizza Counter',
          'Dessert Spread',
          'Mocktails & Juices'
        ]
      }
    ]);
    console.log('🍽️  Created 6 catering services');

    // ── 4. Create Menu Items ─────────────────────────────
    await Menu.insertMany([
      // Chef 1 - Arjun
      { chef: chef1._id, name: 'Paneer Tikka', description: 'Marinated cottage cheese grilled to perfection', category: 'starter', cuisine: 'North Indian', pricePerHead: 120, isVeg: true },
      { chef: chef1._id, name: 'Chicken Seekh Kebab', description: 'Minced chicken with aromatic spices on skewers', category: 'starter', cuisine: 'Mughlai', pricePerHead: 180, isVeg: false },
      { chef: chef1._id, name: 'Dal Makhani', description: 'Slow-cooked black lentils in butter and cream', category: 'main-course', cuisine: 'North Indian', pricePerHead: 95, isVeg: true },
      { chef: chef1._id, name: 'Butter Chicken', description: 'Tender chicken in rich tomato-butter gravy', category: 'main-course', cuisine: 'North Indian', pricePerHead: 145, isVeg: false },
      { chef: chef1._id, name: 'Pani Puri Counter', description: 'Live interactive pani puri station', category: 'live-counter', cuisine: 'Street Food', pricePerHead: 85, isVeg: true },
      { chef: chef1._id, name: 'Gulab Jamun', description: 'Soft milk-solid dumplings in rose syrup', category: 'dessert', cuisine: 'Indian', pricePerHead: 65, isVeg: true },

      // Chef 2 - Meera
      { chef: chef2._id, name: 'Masala Dosa', description: 'Crispy rice crepe with spiced potato filling', category: 'main-course', cuisine: 'South Indian', pricePerHead: 75, isVeg: true },
      { chef: chef2._id, name: 'Dum Biryani', description: 'Aromatic long-grain rice with marinated meat', category: 'main-course', cuisine: 'Hyderabadi', pricePerHead: 165, isVeg: false },
      { chef: chef2._id, name: 'Ras Malai', description: 'Spongy cheese patties in sweetened milk', category: 'dessert', cuisine: 'Bengali', pricePerHead: 75, isVeg: true },
      { chef: chef2._id, name: 'Veg Biryani', description: 'Fragrant basmati with seasonal vegetables', category: 'main-course', cuisine: 'Hyderabadi', pricePerHead: 130, isVeg: true },
      { chef: chef2._id, name: 'Masala Chaas', description: 'Spiced buttermilk with mint and cumin', category: 'beverage', cuisine: 'Indian', pricePerHead: 35, isVeg: true },

      // Chef 3 - Ravi
      { chef: chef3._id, name: 'Spring Rolls', description: 'Crispy vegetable spring rolls with dipping sauce', category: 'starter', cuisine: 'Chinese', pricePerHead: 90, isVeg: true },
      { chef: chef3._id, name: 'Pasta Arabiata', description: 'Penne pasta in spicy tomato sauce', category: 'main-course', cuisine: 'Italian', pricePerHead: 110, isVeg: true },
      { chef: chef3._id, name: 'Tiramisu', description: 'Classic Italian coffee-flavored dessert', category: 'dessert', cuisine: 'Italian', pricePerHead: 95, isVeg: true },
      { chef: chef3._id, name: 'Live Tawa Counter', description: 'Fresh rotis, parathas and breads made live', category: 'live-counter', cuisine: 'Indian', pricePerHead: 60, isVeg: true },
    ]);
    console.log('🥘 Created 15 menu items');

    // ── 5. Create Bookings ───────────────────────────────
    const [booking1, booking2, booking3] = await Booking.insertMany([
      {
        customer: customer1._id,
        chef: chef1._id,
        service: svc1._id,
        eventDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        eventType: 'Wedding',
        guestCount: 250,
        venue: 'Taj Hotel, Colaba, Mumbai',
        specialRequests: 'Jain food options for 30 guests. No onion-garlic for select items.',
        totalAmount: 300000,
        advanceAmount: 90000,
        status: 'confirmed',
        paymentStatus: 'partial',
        donationConsent: true,
        donationNgo: ngo1._id,
        estimatedSurplusFood: 37,
        donationStatus: 'pending'
      },
      {
        customer: customer2._id,
        chef: chef2._id,
        service: svc2._id,
        eventDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        eventType: 'Corporate Event',
        guestCount: 80,
        venue: 'Infosys Campus, Pune',
        specialRequests: 'No non-veg items. Include diabetic-friendly options.',
        totalAmount: 28000,
        advanceAmount: 28000,
        status: 'completed',
        paymentStatus: 'paid',
        donationConsent: true,
        donationNgo: ngo3._id,
        estimatedSurplusFood: 12,
        donationStatus: 'completed'
      },
      {
        customer: customer1._id,
        chef: chef3._id,
        service: svc3._id,
        eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        eventType: 'Birthday Party',
        guestCount: 60,
        venue: 'Home, Juhu, Mumbai',
        specialRequests: 'Surprise theme setup. Kids-friendly items needed.',
        totalAmount: 39000,
        advanceAmount: 0,
        status: 'pending',
        paymentStatus: 'unpaid',
        donationConsent: false,
        donationStatus: 'not-applicable'
      }
    ]);
    console.log('📋 Created 3 sample bookings');

    // ── 6. Create a completed Donation ──────────────────
    await Donation.create({
      booking: booking2._id,
      chef: chef2._id,
      customer: customer2._id,
      ngo: ngo3._id,
      foodItems: [
        { name: 'Dal Rice', quantity: '5 kg', quantityKg: 5 },
        { name: 'Sabzi', quantity: '4 kg', quantityKg: 4 },
        { name: 'Roti', quantity: '3 kg', quantityKg: 3 }
      ],
      totalQuantityKg: 12,
      pickupAddress: 'Infosys Campus, Pune',
      pickupDateTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      status: 'delivered',
      ngoFeedback: 'Food was hygienic and well-packed. Fed 30 people at our shelter.',
    });
    console.log('🌱 Created 1 sample donation (delivered)');

    // ── Summary ──────────────────────────────────────────
    console.log('\n═══════════════════════════════════════════════════');
    console.log('✅  DATABASE SEEDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════');
    console.log('\n🔑  LOGIN CREDENTIALS (all passwords: demo123)');
    console.log('─────────────────────────────────────────────────');
    console.log('  👤 Customer  →  customer@demo.com');
    console.log('  👤 Customer2 →  rahul@demo.com');
    console.log('  👨‍🍳 Chef 1    →  chef@demo.com      (Arjun Kapoor)');
    console.log('  👨‍🍳 Chef 2    →  meera@demo.com     (Meera Shah)');
    console.log('  👨‍🍳 Chef 3    →  ravi@demo.com      (Ravi Kumar)');
    console.log('  🔑 Admin     →  admin@demo.com');
    console.log('\n📊  SEEDED DATA');
    console.log('─────────────────────────────────────────────────');
    console.log('  Users      : 6  (1 admin, 3 chefs, 2 customers)');
    console.log('  NGOs       : 4  (Mumbai, Delhi, Bangalore, Ahmedabad)');
    console.log('  Services   : 6  (Wedding, Corporate, Birthday, etc.)');
    console.log('  Menu Items : 15 (across all 3 chefs)');
    console.log('  Bookings   : 3  (confirmed, completed, pending)');
    console.log('  Donations  : 1  (delivered — 12kg, ~10 people fed)');
    console.log('\n🚀  Now run: npm run dev');
    console.log('    Frontend  → http://localhost:3000');
    console.log('    Backend   → http://localhost:5000');
    console.log('═══════════════════════════════════════════════════\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

seed();
