# 👨‍🍳 ChefCaterPro — MERN Stack

> **Premium Catering Platform + NGO Food Donation System**

A full-stack MERN application where customers can book professional chefs for events, and surplus food from those events is donated to NGO partners to feed the underprivileged.

---

## 🌟 Key Features

### 🍽️ Catering Platform
- Browse chefs and catering packages by category (Wedding, Birthday, Corporate, Festival, Private Dining, Social)
- Filter by cuisine type, price per head, and guest count
- Detailed service pages with chef profiles
- 3-step booking flow with real-time cost calculation

### 🌱 NGO Food Donation System
- Customers opt-in during booking to donate surplus food
- Auto-estimates surplus food based on guest count (~15%)
- Choose from verified NGO partners in your city
- Real-time donation tracking and status updates
- Impact report: kg donated → people fed calculation
- Donation certificate for tax benefits

### 👥 Multi-Role Access
| Role | Capabilities |
|------|-------------|
| **Customer** | Browse, book, manage bookings, opt-in donations, track impact |
| **Chef** | Manage services, confirm/reject bookings, track donation events |
| **Admin** | Manage all users, verify chefs/NGOs, view platform stats |
| **NGO** | View assigned donations, update pickup status, send feedback |

---

## 🛠️ Tech Stack

**Frontend (React)**
- React 18 + React Router v6
- Axios for API calls
- React Hot Toast for notifications
- Custom CSS (no UI framework — fully handcrafted)
- Context API for auth state

**Backend (Node.js + Express)**
- Express.js REST API
- JWT Authentication (bcrypt hashed passwords)
- Mongoose ODM for MongoDB
- Multer for file uploads

**Database (MongoDB)**
- Users, Services, Bookings, Donations, Menu, NGO collections
- Aggregation pipelines for impact stats

---

## 📁 Project Structure

```
chefcatering/
├── server/
│   ├── models/
│   │   ├── User.js          # Customer/Chef/Admin/NGO
│   │   ├── Service.js       # Catering service packages
│   │   ├── Booking.js       # Event bookings + donation consent
│   │   ├── Donation.js      # NGO food donation records
│   │   ├── Menu.js          # Individual menu items
│   │   └── NGO.js           # NGO partner profiles
│   ├── routes/
│   │   ├── auth.js          # Register, Login, Profile
│   │   ├── services.js      # CRUD for catering services
│   │   ├── bookings.js      # Booking management + donation consent
│   │   ├── donations.js     # Donation lifecycle + impact stats
│   │   ├── menu.js          # Menu items
│   │   └── ngos.js          # NGO partner management
│   ├── middleware/
│   │   └── auth.js          # JWT protect + role authorize
│   └── index.js             # Express app entry
│
└── client/
    └── src/
        ├── context/
        │   └── AuthContext.js    # Global auth state
        ├── components/
        │   ├── Navbar.js
        │   └── Footer.js
        └── pages/
            ├── HomePage.js       # Landing with stats
            ├── ServicesPage.js   # Browse + filter chefs
            ├── BookingPage.js    # 3-step booking + donation opt-in
            ├── DashboardPage.js  # Customer dashboard
            ├── ChefDashboard.js  # Chef management panel
            ├── AdminDashboard.js # Admin overview
            ├── MenuPage.js       # Full menu browser
            ├── NGOsPage.js       # NGO partner showcase
            └── ImpactPage.js     # Food donation impact tracker
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd chefcatering

# Install all dependencies
npm run install-all

# Setup environment variables
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI and JWT secret
```

### Running the App

```bash
# Run both frontend and backend concurrently
npm run dev

# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

### Demo Accounts (seed these in MongoDB)
```
Customer: customer@demo.com / demo123
Chef:     chef@demo.com / demo123
Admin:    admin@demo.com / demo123
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/profile | Update profile |

### Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/services | Get all services (with filters) |
| GET | /api/services/:id | Get single service |
| POST | /api/services | Create service (Chef only) |
| PUT | /api/services/:id | Update service |
| DELETE | /api/services/:id | Delete service |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/bookings | Get user's bookings |
| POST | /api/bookings | Create booking |
| PUT | /api/bookings/:id/status | Update status (Chef) |
| PUT | /api/bookings/:id/donation-consent | Set donation preference |

### Donations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/donations | Get user's donations |
| GET | /api/donations/stats | Get platform impact stats |
| POST | /api/donations | Create donation from booking |
| PUT | /api/donations/:id/status | Update pickup/delivery status |

### NGOs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/ngos | List verified NGOs |
| GET | /api/ngos/:id | Get NGO details |
| POST | /api/ngos | Add NGO (Admin only) |

---

## 🌱 Food Donation Flow

```
Event Booked → Customer Opts In → NGO Selected
       ↓
Event Happens → Food Packed → NGO Notified
       ↓
NGO Picks Up → Food Delivered → Impact Logged
       ↓
Customer Gets Report: "Your event fed 87 people!"
```

---

## 💡 Future Enhancements
- Real-time WhatsApp/SMS notifications for NGO pickup
- Google Maps integration for donation pickup routes
- Stripe payment gateway integration
- Chef rating & review system
- Admin analytics dashboard with charts
- Mobile app (React Native)

---

*Built with ❤️ to fight hunger, one event at a time.*
