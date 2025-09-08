#!/bin/bash

# Perla's Restaurant Backend Setup Script
echo "🍽️ Setting up Perla's Restaurant Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 13+ first."
    echo "   On Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "   On macOS: brew install postgresql"
    echo "   On Windows: Download from https://www.postgresql.org/download/"
    exit 1
fi

echo "✅ PostgreSQL detected"

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your database credentials before continuing."
    echo "   Default database URL: postgresql://username:password@localhost:5432/perlas_restaurant"
    read -p "Press Enter after updating .env file..."
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Check if database exists and is accessible
echo "🔍 Checking database connection..."
if npm run db:push --dry-run &> /dev/null; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed. Please check your .env file and ensure PostgreSQL is running."
    echo "   Make sure the database 'perlas_restaurant' exists."
    echo "   You can create it with: createdb perlas_restaurant"
    exit 1
fi

# Run database migrations
echo "🗄️  Running database migrations..."
npm run db:push

# Seed the database
echo "🌱 Seeding database with sample data..."
npm run db:seed

echo ""
echo "🎉 Backend setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start the backend server: cd backend && npm run dev"
echo "2. The API will be available at http://localhost:5000"
echo "3. Test the API: curl http://localhost:5000/health"
echo ""
echo "🔑 Test credentials:"
echo "   Admin: admin@perlas.com / admin123"
echo "   Customer: customer@example.com / customer123"
echo ""
echo "📚 API Documentation: See backend/README.md"