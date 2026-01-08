#!/bin/bash

# WriteFlow AI - One-Click Launch Script
# Usage: ./scripts/launch.sh

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║           WriteFlow AI - One-Click Launch                     ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✓ npm found: $(npm --version)"

# Install dependencies if not present
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo ""
    echo "⚙️  No .env file found. Running setup wizard..."
    echo ""
    node scripts/setup.js
fi

# Check if .env exists after setup
if [ ! -f ".env" ]; then
    echo "❌ Setup was not completed. Please run 'npm run setup' manually."
    exit 1
fi

# Generate Prisma client
echo ""
echo "🔧 Generating Prisma client..."
npx prisma generate

# Initialize database
echo ""
echo "🗄️  Initializing database..."
npx prisma db push

# Start the application
echo ""
echo "🚀 Starting WriteFlow AI..."
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  Your platform will be available at: http://localhost:3000"
echo "═══════════════════════════════════════════════════════════════"
echo ""

npm run dev
