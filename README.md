# Kisan Sanjal – Frontend (Vite + React + Tailwind)

A complete **frontend-only** marketplace application for connecting farmers directly with buyers in Nepal.
Built with React, Tailwind CSS, and React Router. Data is stored in localStorage (no backend required).

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

## 👤 Demo Accounts

| Role    | Email              | Password |
|---------|-------------------|----------|
| Buyer   | buyer@demo.com    | 123456   |
| Farmer  | farmer@demo.com   | 123456   |
| Admin   | admin@demo.com    | 123456   |

## 📍 Routes

### Public Routes
| Route        | Description                    |
|--------------|--------------------------------|
| `/`          | Redirects to login             |
| `/login`     | Login page                     |
| `/register`  | Registration (Farmer/Buyer)    |

### Authenticated Routes (all under `/app`)
| Route                    | Role     | Description                        |
|--------------------------|----------|-----------------------------------|
| `/app`                   | All      | Marketplace - browse all listings |
| `/app/listing/:id`       | All      | Product detail page               |
| `/app/trends`            | All      | Price trend charts                |
| `/app/resources`         | All      | Farming resources & guides        |
| `/app/chat`              | All      | Messaging between users           |

### Farmer Routes
| Route                    | Description                        |
|--------------------------|-----------------------------------|
| `/app/farmer`            | Farmer dashboard                  |
| `/app/farmer/new`        | Create new listing                |
| `/app/farmer/edit/:id`   | Edit existing listing             |

### Buyer Routes
| Route                    | Description                        |
|--------------------------|-----------------------------------|
| `/app/buyer`             | Buyer dashboard                   |
| `/app/buyer/cart`        | Shopping cart                     |
| `/app/buyer/checkout`    | Checkout with payment options     |
| `/app/buyer/orders`      | Order tracking with timeline      |

### Admin Routes
| Route                    | Description                        |
|--------------------------|-----------------------------------|
| `/app/admin`             | Admin dashboard with analytics    |
| `/app/admin/verify`      | User verification                 |
| `/app/admin/listings`    | Manage/moderate listings          |

## ✨ Features

### For Farmers
- Create and manage crop listings (vegetables, fruits, crops)
- Set price, quantity, quality grade, harvest date
- Add location with map support
- View and update order status (Confirmed → In Transit → Delivered)
- View ratings and reviews from buyers
- Dashboard with stats (revenue, orders, ratings)

### For Buyers
- Browse marketplace with search and filters
- Filter by crop type, location, price range
- View product details with farmer info and reviews
- Add to cart and checkout
- Multiple payment options (eSewa, Khalti, Card, COD)
- Track orders with visual timeline
- Leave reviews after delivery

### For Admins
- Dashboard with analytics (users, listings, orders, revenue)
- Verify/approve farmer and buyer accounts
- Manage and moderate product listings
- View platform-wide order activity
- Reset demo data

### General Features
- In-app chat between farmers and buyers
- Price trend charts for crops
- Farming resources and guides
- Mobile-responsive design
- Toast notifications
- Confirmation modals

## 🎨 Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router v7** - Routing
- **localStorage** - Data persistence (mock DB)

## 📁 Project Structure

```
src/
├── assets/           # Images and static files
├── components/       # Reusable UI components
│   ├── ui.jsx        # Card, Button, Input, etc.
│   ├── Modal.jsx     # Modal and ConfirmModal
│   ├── Toast.jsx     # Toast notifications
│   └── LineChart.jsx # Simple chart component
├── context/          # React context providers
│   ├── AuthContext.jsx   # Authentication state
│   └── StoreContext.jsx  # App data (listings, orders, etc.)
├── data/             # Data layer
│   ├── seed.js       # Initial demo data
│   └── storage.js    # localStorage utilities
├── layouts/          # Layout components
│   └── AppLayout.jsx # Main app layout with nav
├── pages/            # Page components
│   ├── auth/         # Login, Register
│   ├── admin/        # Admin pages
│   ├── buyer/        # Buyer pages
│   ├── farmer/       # Farmer pages
│   ├── marketplace/  # Marketplace, ProductDetail
│   ├── chat/         # Chat page
│   ├── dashboard/    # Price trends
│   └── resources/    # Resources page
├── routes/           # Route protection
│   └── ProtectedRoute.jsx
└── utils/            # Utility functions
    └── format.js     # money(), uid(), avgRating()
```

## 💾 Data Storage

All data is stored in `localStorage` with the key `kisanSanjalDB_v1`.
The database structure includes:
- `users` - All user accounts
- `listings` - Product listings
- `orders` - Order records
- `reviews` - Product/farmer reviews
- `messages` - Chat messages
- `priceTrends` - Price data for charts
- `resources` - Farming guides

Use the **Admin Dashboard → Reset Demo Data** button to restore initial data.

## 🔧 Configuration

For future backend integration, set the environment variable:
```
VITE_API_BASE_URL=https://your-api.com
```

## 📝 License

MIT
