# Perla's Restaurant - Full Stack Application

A modern restaurant website with a complete backend API, featuring menu browsing, table booking, order management, and user authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- npm or yarn

### Backend Setup

1. **Run the setup script**:
   ```bash
   ./setup-backend.sh
   ```

2. **Or manually setup**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   npm run db:generate
   npm run db:push
   npm run db:seed
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env
   # Edit .env with your API URL
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

## 🏗️ Architecture

### Backend (Node.js + Express + TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with role-based access control
- **API**: RESTful endpoints with comprehensive validation
- **Security**: Rate limiting, CORS, input validation, password hashing

### Frontend (React + Vite + Tailwind CSS)
- **Framework**: React 19 with modern hooks
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Context API with custom hooks
- **API Integration**: Axios-based service layer

## 📁 Project Structure

```
perlas-restaurant/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Auth & validation middleware
│   │   └── index.ts        # Main server file
│   ├── prisma/             # Database schema & migrations
│   ├── Dockerfile          # Container configuration
│   └── docker-compose.yml  # Multi-service setup
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   └── services/          # API service layer
└── public/                # Static assets
```

## 🔧 Features

### 🍽️ Menu Management
- Dynamic menu loading from database
- Category filtering and search
- Real-time availability updates
- Featured items highlighting

### 📅 Table Booking System
- Date/time slot selection
- Party size management
- Special requests handling
- Booking confirmation and management

### 🛒 Order Management
- Shopping cart functionality
- Order placement and tracking
- Order history and status updates
- Payment method selection

### 👥 User Management
- User registration and authentication
- Profile management
- Role-based access control (Customer, Staff, Admin)
- Password management

### 🔐 Security Features
- JWT token authentication
- Password hashing with bcrypt
- Rate limiting and CORS protection
- Input validation and sanitization
- SQL injection protection

## 🚀 Deployment

### Using Docker

```bash
# Start all services
cd backend
docker-compose up -d

# View logs
docker-compose logs -f
```

### Manual Deployment

1. **Backend**:
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Frontend**:
   ```bash
   npm run build
   # Deploy dist/ folder to your hosting service
   ```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Menu
- `GET /api/menu` - Get menu items
- `GET /api/menu/:id` - Get menu item by ID
- `GET /api/menu/categories/list` - Get categories

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `PUT /api/bookings/:id` - Update booking
- `PATCH /api/bookings/:id/cancel` - Cancel booking

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/cancel` - Cancel order

## 🧪 Testing

### Backend API
```bash
# Health check
curl http://localhost:5000/health

# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@example.com","password":"customer123"}'
```

### Test Credentials
- **Admin**: `admin@perlas.com` / `admin123`
- **Customer**: `customer@example.com` / `customer123`

## 🛠️ Development

### Backend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes
- `npm run db:seed` - Seed database
- `npm run db:studio` - Open Prisma Studio

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/perlas_restaurant"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

#### Frontend (.env)
```env
VITE_API_URL="http://localhost:5000/api"
```

## 📚 Documentation

- [Backend API Documentation](backend/README.md)
- [Database Schema](backend/prisma/schema.prisma)
- [Frontend Components](src/components/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

---

**Perla's Restaurant** - Bringing delicious food and modern technology together! 🍽️✨