# Development Setup Checklist

Use this checklist to track your setup progress.

## ✅ Prerequisites

- [ ] Node.js v18+ installed (`node -v`)
- [ ] Git installed (`git --version`)
- [ ] MongoDB installed or Atlas account created
- [ ] Firebase account created
- [ ] Code editor (VS Code) installed

## ✅ Backend Setup

- [ ] `cd backend && npm install` completed
- [ ] `.env` file created in `backend/`
- [ ] MongoDB URL added to `.env`
- [ ] Firebase Project ID added to `.env`
- [ ] Firebase Private Key added to `.env`
- [ ] Firebase Client Email added to `.env`
- [ ] MongoDB is running (local or Atlas)
- [ ] Backend starts without errors (`npm run dev`)
- [ ] Can access `http://localhost:5000` and see success message

## ✅ Frontend Setup

- [ ] `cd twitter && npm install` completed
- [ ] `.env.local` file created in `twitter/`
- [ ] `NEXT_PUBLIC_BACKEND_URL` set to `http://localhost:5000`
- [ ] Firebase config updated in `context/firebase.tsx` (optional)
- [ ] Frontend starts without errors (`npm run dev`)
- [ ] Can access `http://localhost:3000`

## ✅ Firebase Configuration

- [ ] Created Firebase project
- [ ] Enabled Email/Password authentication
- [ ] Enabled Google authentication (optional)
- [ ] Generated Firebase Admin SDK key
- [ ] Updated frontend Firebase config (if using own project)
- [ ] Downloaded Service Account JSON

## ✅ Optional Features

- [ ] Email OTP configured (Gmail app password)
- [ ] SMS OTP configured (Twilio credentials)
- [ ] Google Cloud Storage configured (for file uploads)
- [ ] Razorpay configured (for payments)

## ✅ Testing

- [ ] Backend API responds at `http://localhost:5000`
- [ ] Frontend loads at `http://localhost:3000`
- [ ] Can sign up a new user
- [ ] Can log in with email/password
- [ ] Can create a tweet
- [ ] Tweet appears in feed
- [ ] Can like a tweet
- [ ] Can retweet a tweet
- [ ] Profile page loads
- [ ] Can edit profile

## ✅ Deployment Preparation

- [ ] Environment variables documented
- [ ] `.env` files added to `.gitignore`
- [ ] Frontend build works (`cd twitter && npm run build`)
- [ ] Backend ready for production
- [ ] MongoDB Atlas configured for production
- [ ] Firebase production settings configured

## 🚀 Ready to Deploy

- [ ] Choose deployment platform (Vercel, Render, etc.)
- [ ] Set up environment variables on platform
- [ ] Deploy backend
- [ ] Deploy frontend with correct backend URL
- [ ] Test production deployment

---

**Current Status:** ___________________________

**Blocked By:** _______________________________

**Next Step:** _______________________________

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________
