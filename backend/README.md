# Perla's Restaurant Backend API

A comprehensive backend API for Perla's Restaurant built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with role-based access control
- 🍽️ **Menu Management** - CRUD operations for menu items with categories
- 📅 **Table Booking System** - Restaurant reservation management
- 🛒 **Order Management** - Complete order processing workflow
- 👥 **User Management** - Customer and admin user management
- 📊 **Admin Dashboard** - Comprehensive admin controls
- 🔒 **Security** - Rate limiting, CORS, input validation
- 📝 **API Documentation** - Well-documented RESTful endpoints

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 13+
- npm or yarn

### Installation

1. **Clone and setup**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Database setup**:
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Seed the database
   npm run db:seed
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

### Using Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get menu item by ID
- `GET /api/menu/categories/list` - Get menu categories
- `POST /api/menu` - Create menu item (Admin)
- `PUT /api/menu/:id` - Update menu item (Admin)
- `DELETE /api/menu/:id` - Delete menu item (Admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id` - Update booking
- `PATCH /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings` - Get all bookings (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id` - Update order status (Admin)
- `PATCH /api/orders/:id/cancel` - Cancel order
- `GET /api/orders` - Get all orders (Admin)

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID (Admin)
- `PATCH /api/users/:id/role` - Update user role (Admin)
- `PATCH /api/users/:id/toggle-active` - Toggle user status (Admin)
- `GET /api/users/stats/overview` - Get user statistics (Admin)

## Database Schema

### Users
- Customer, Staff, Admin roles
- Email/password authentication
- Profile information

### Menu Items
- Categories: Starters, Breakfast, Lunch, Desserts, Beverages
- Pricing and availability
- Featured items

### Bookings
- Date/time reservations
- Party size and special requests
- Status tracking

### Orders
- Order items with quantities
- Payment and delivery information
- Status workflow

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/perlas_restaurant"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# CORS
FRONTEND_URL="http://localhost:5173"
```

## Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

### Testing the API

Use the provided test credentials:
- **Admin**: `admin@perlas.com` / `admin123`
- **Customer**: `customer@example.com` / `customer123`

### Health Check

```bash
curl http://localhost:5000/health
```

## Production Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Build and start the application
5. Set up reverse proxy (nginx)
6. Configure SSL certificates

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Input validation with Zod
- SQL injection protection via Prisma
- Helmet.js security headers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details