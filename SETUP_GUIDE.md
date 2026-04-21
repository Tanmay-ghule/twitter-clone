# 🚀 Complete Setup Guide - Twitter Clone

This guide will walk you through setting up the Twitter clone project from scratch.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Setup (5 minutes)](#quick-setup)
3. [Detailed Setup](#detailed-setup)
4. [Common Issues](#common-issues)
5. [Running the Application](#running-the-application)

---

## Prerequisites

Before you begin, make sure you have:

✅ **Node.js** (v18 or higher) - [Download](https://nodejs.org/)  
✅ **Git** - [Download](https://git-scm.com/)  
✅ **MongoDB** - One of these options:
   - Local installation - [Download MongoDB Community](https://www.mongodb.com/try/download/community)
   - MongoDB Atlas (Free Cloud) - [Sign up](https://www.mongodb.com/cloud/atlas)  
✅ **Firebase Account** - [Sign up](https://firebase.google.com/)  
✅ **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

---

## Quick Setup (5 minutes)

If you just want to get it running quickly:

### 1. Install Dependencies
```bash
# In project root
cd backend
npm install

cd ../twitter
npm install
```

### 2. Set Minimum Configuration

**Backend** (`backend/.env`):
```env
PORT=5000
MONGODB_URL=mongodb://localhost:27017/twitter-clone
```

**Frontend** (`twitter/.env.local`):
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### 3. Start MongoDB
```bash
# If installed locally
mongod
```

### 4. Run the Application

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd twitter
npm run dev
```

✨ Open `http://localhost:3000`

> **Note:** Firebase auth won't work yet. Continue with detailed setup for full functionality.

---

## Detailed Setup

### Step 1: Firebase Setup (Required for Authentication)

#### A. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Enter project name (e.g., "twitter-clone")
4. Disable Google Analytics (optional)
5. Click **"Create Project"**

#### B. Enable Authentication Methods

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable:
   - **Email/Password** (Click Enable → Save)
   - **Google** (Click Enable → Configure → Save)

#### C. Get Firebase Config (Frontend)

1. In Firebase Console, go to **Project Settings** (⚙️ icon)
2. Scroll to **"Your apps"** section
3. Click **Web icon** (</>) to create a web app
4. Register app with nickname (e.g., "twitter-web")
5. Copy the `firebaseConfig` object
6. Replace in `twitter/context/firebase.tsx`:

```typescript
const firebaseConfig = {
  apiKey: "AIza...",              // ← Copy these values
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.firebasestorage.app",
  messagingSenderId: "123456",
  appId: "1:123456:web:abcd"
};
```

#### D. Get Firebase Admin SDK (Backend)

1. In Firebase Console, go to **Project Settings** → **Service Accounts**
2. Click **"Generate New Private Key"**
3. Download the JSON file
4. Open the file and copy these values to `backend/.env`:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_FULL_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

> **Important:** The private key must be on ONE line with `\n` for newlines

---

### Step 2: MongoDB Setup

Choose one option:

#### Option A: Local MongoDB (Recommended for Development)

1. **Install MongoDB:**
   - **Windows:** [Download MSI Installer](https://www.mongodb.com/try/download/community)
   - **Mac:** `brew install mongodb-community`
   - **Linux:** [Follow official guide](https://www.mongodb.com/docs/manual/administration/install-on-linux/)

2. **Start MongoDB:**
   ```bash
   # Windows (run as service, or):
   mongod
   
   # Mac
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. **Verify it's running:**
   ```bash
   mongosh
   # Should connect successfully
   ```

4. **Update backend/.env:**
   ```env
   MONGODB_URL=mongodb://localhost:27017/twitter-clone
   ```

#### Option B: MongoDB Atlas (Cloud - Free Tier)

1. **Create Account:** Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create Free Cluster:**
   - Select **M0 Sandbox** (Free tier)
   - Choose cloud provider & region
   - Click **"Create Cluster"**

3. **Setup Database Access:**
   - Go to **Database Access** → **Add New User**
   - Create username & password (save these!)
   - Set role to **"Read and write to any database"**

4. **Setup Network Access:**
   - Go to **Network Access** → **Add IP Address**
   - Click **"Allow Access from Anywhere"** (for development)
   - Or add your specific IP

5. **Get Connection String:**
   - Go to **Database** → **Connect**
   - Choose **"Connect your application"**
   - Copy connection string
   - Replace `<password>` with your user password
   - Update `backend/.env`:
   ```env
   MONGODB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/twitter-clone?retryWrites=true&w=majority
   ```

---

### Step 3: Optional Features Setup

#### A. Email OTP (for phone verification alternative)

Uses Gmail to send OTP codes.

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Google Account → Security → 2-Step Verification
   - Scroll to **"App passwords"**
   - Select **"Mail"** and **"Other"** (name it "Twitter Clone")
   - Copy the 16-character password

3. **Update backend/.env:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx  # 16-char app password
   ```

#### B. SMS OTP (via Twilio)

For sending OTP via SMS.

1. **Sign up:** [Twilio Console](https://www.twilio.com/try-twilio)
2. **Get Credentials:**
   - Account SID
   - Auth Token
   - Twilio Phone Number

3. **Update backend/.env:**
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

---

### Step 4: Environment Files Checklist

#### Backend `.env` (Minimum Required)
```env
PORT=5000
MONGODB_URL=mongodb://localhost:27017/twitter-clone
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

#### Frontend `.env.local`
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

---

## Running the Application

### Start Backend
```bash
cd backend
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on 5000
```

### Start Frontend (New Terminal)
```bash
cd twitter
npm run dev
```

You should see:
```
▲ Next.js 16.1.1
- Local: http://localhost:3000
```

### Access the Application

Open: **http://localhost:3000**

---

## Common Issues

### ❌ "Cannot connect to MongoDB"

**Solution 1:** Check if MongoDB is running
```bash
mongosh  # Should connect
```

**Solution 2:** Check your connection string in `.env`
- Local: `mongodb://localhost:27017/twitter-clone`
- Atlas: `mongodb+srv://user:pass@cluster.mongodb.net/twitter-clone`

**Solution 3:** For Atlas, check Network Access allows your IP

---

### ❌ "Firebase auth error"

**Check:**
1. Firebase config in `twitter/context/firebase.tsx` is correct
2. Backend `.env` has all three Firebase variables
3. Email/Password auth is enabled in Firebase Console
4. Private key has `\n` escaped properly (not actual newlines)

**Test:** Try to sign up a new user. Check browser console for specific error.

---

### ❌ "CORS error when calling API"

**Check:**
1. Backend is running on port 5000
2. Frontend `.env.local` has `NEXT_PUBLIC_BACKEND_URL=http://localhost:5000`
3. Restart frontend after changing `.env.local`

---

### ❌ "Port 5000 already in use"

**Solution:**
```bash
# Kill process on port 5000
# Mac/Linux:
lsof -ti:5000 | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Or change port in `backend/.env`:
```env
PORT=5001
```
And update frontend `.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
```

---

### ❌ "Module not found" errors

**Solution:**
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Testing the Setup

### 1. Check Backend API
Visit: `http://localhost:5000`  
Should see: `"Twitter backend is running successfully 🚀"`

### 2. Test User Registration
1. Open `http://localhost:3000`
2. Click "Sign Up"
3. Enter email, password, username, display name
4. Should create account and log in

### 3. Test Creating a Tweet
1. After login, type a tweet in the composer
2. Click "Post"
3. Should appear in the feed

---

## Development Tips

### Hot Reload
Both frontend and backend support hot reload. Changes are reflected automatically.

### View Database
```bash
# Connect to local MongoDB
mongosh
use twitter-clone
db.users.find()      # View users
db.tweets.find()     # View tweets
```

### Clear Local Storage
If having auth issues:
1. Open browser DevTools (F12)
2. Application → Local Storage
3. Clear all items

---

## Next Steps

✅ Project is running  
✅ Can create users and posts  
✅ Authentication works  

**Now you can:**
- Customize the UI
- Add new features
- Deploy to production

---

## Need Help?

1. Check the [README.md](README.md) for API documentation
2. Review error messages carefully
3. Check browser console for frontend errors
4. Check terminal for backend errors

**Happy Coding! 🚀**
