#!/bin/bash

echo "🚀 Twitter Clone Quick Start Script"
echo "===================================="
echo ""

# Check if MongoDB is running
echo "📦 Checking MongoDB connection..."
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB or use MongoDB Atlas."
    echo "   Visit: https://www.mongodb.com/try/download/community"
    echo ""
fi

# Check Node.js version
echo "🔍 Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "   Node.js version: $NODE_VERSION"
echo ""

# Backend setup
echo "🔧 Setting up Backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "❌ .env file not found in backend/"
    echo "   Please configure backend/.env with your credentials"
    exit 1
fi

echo "   Installing backend dependencies..."
npm install --silent

echo "   ✅ Backend setup complete!"
echo ""

# Frontend setup
echo "🎨 Setting up Frontend..."
cd ../twitter

if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found in twitter/"
    echo "   Please configure twitter/.env.local"
    exit 1
fi

echo "   Installing frontend dependencies..."
npm install --silent

echo "   ✅ Frontend setup complete!"
echo ""

# Instructions
echo "📝 Next Steps:"
echo "===================================="
echo ""
echo "1. Configure your environment variables:"
echo "   - backend/.env (MongoDB, Firebase, etc.)"
echo "   - twitter/.env.local (Backend URL)"
echo ""
echo "2. Start the backend:"
echo "   cd backend && npm run dev"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   cd twitter && npm run dev"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "🎉 Happy coding!"
