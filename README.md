# Twitter/X Clone - Full Stack Application

A full-featured Twitter/X clone built with Next.js, TypeScript, Express, and MongoDB.

## 🚀 Features

- ✅ User authentication (Email/Password & Google Sign-In) via Firebase
- ✅ Create, like, and retweet posts
- ✅ User profiles with customizable avatars and cover images
- ✅ Real-time feed updates
- ✅ Responsive design with Tailwind CSS
- ✅ Audio tweets support
- ✅ Password reset functionality
- ✅ OTP verification for phone numbers
- ✅ Profile editing
- ✅ Image uploads

## 📋 Tech Stack

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Firebase Auth** - Authentication
- **Axios** - API calls

### Backend
- **Node.js & Express** - Server
- **MongoDB & Mongoose** - Database
- **Firebase Admin** - Auth verification
- **Multer** - File uploads
- **Nodemailer** - Email OTP
- **Twilio** - SMS OTP (optional)
- **Google Cloud Storage** - File storage (optional)

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Firebase account
- Git

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd twitter-clone-main
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Configure Backend Environment Variables

Edit the `backend/.env` file with your credentials:

**Required:**
```env
PORT=5000
MONGODB_URL=mongodb://localhost:27017/twitter-clone
```

**For Firebase Admin (required):**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create one)
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Copy the values to your `.env` file:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

**Optional Features:**

For email OTP (Gmail):
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
```

To get Gmail app password:
1. Enable 2FA on your Google account
2. Go to Google Account > Security > 2-Step Verification
3. Scroll to "App passwords" and generate one

For SMS OTP (Twilio):
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_phone_number
```

### 3. Frontend Setup

```bash
cd ../twitter
npm install
```

#### Configure Frontend Environment Variables

The `twitter/.env.local` file is already set up for local development:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

**For production**, update to your deployed backend URL:
```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
```

#### Firebase Configuration (Frontend)

The Firebase config is already present in `twitter/context/firebase.tsx`. If you want to use your own Firebase project:

1. Go to Firebase Console > Project Settings
2. Scroll to "Your apps" and select Web app
3. Copy the config and replace in `twitter/context/firebase.tsx`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.firebasestorage.app",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 4. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB locally and start the service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URL` in `backend/.env`:
```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/twitter-clone
```

## 🚀 Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

### Start Frontend (Terminal 2)

```bash
cd twitter
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
twitter-clone-main/
├── backend/
│   ├── modals/              # Mongoose models
│   │   ├── user.js
│   │   └── tweet.js
│   ├── routes/              # API routes
│   │   ├── otp.js
│   │   ├── audioTweet.js
│   │   └── forgotPassword.js
│   ├── utils/               # Utility functions
│   ├── index.js             # Main server file
│   ├── package.json
│   └── .env                 # Environment variables
│
└── twitter/
    ├── app/                 # Next.js app directory
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
    ├── components/          # React components
    │   ├── AuthModel.tsx
    │   ├── Feed.tsx
    │   ├── TweetCard.tsx
    │   ├── TweetComposer.tsx
    │   ├── ProfilePage.tsx
    │   └── ...
    ├── context/             # React context
    │   ├── AuthContext.tsx
    │   └── firebase.tsx
    ├── lib/                 # Utilities
    │   └── axiosInstance.js
    ├── package.json
    └── .env.local           # Environment variables
```

## 🔌 API Endpoints

### Authentication
- `POST /register` - Register new user
- `GET /loggedinuser?email=` - Get user by email

### Posts
- `POST /post` - Create new tweet
- `GET /post` - Get all tweets
- `POST /like/:id` - Like/unlike tweet
- `POST /retweet/:id` - Retweet/unretweet

### User
- `PATCH /userupdate/:email` - Update user profile

### Additional Routes
- `POST /otp/send` - Send OTP via email
- `POST /otp/verify` - Verify OTP
- `POST /audio-tweet/*` - Audio tweet routes
- `POST /forgot-password/*` - Password reset routes

## 🐛 Common Issues & Solutions

### "Cannot connect to MongoDB"
- Ensure MongoDB is running locally or Atlas connection string is correct
- Check firewall settings for MongoDB port (27017)

### "Firebase auth errors"
- Verify Firebase credentials in both frontend and backend
- Check Firebase Console for enabled authentication methods

### "CORS errors"
- Ensure backend URL in frontend `.env.local` matches running backend
- Check CORS configuration in `backend/index.js`

### "Module not found"
- Run `npm install` in both backend and twitter directories
- Delete `node_modules` and `package-lock.json`, then reinstall

## 📦 Deployment

### Backend (Render / Railway / Heroku)
1. Push code to GitHub
2. Connect to your deployment platform
3. Set environment variables
4. Deploy

### Frontend (Vercel)
1. Push code to GitHub
2. Connect to Vercel
3. Set `NEXT_PUBLIC_BACKEND_URL` to your deployed backend URL
4. Deploy

## 🔒 Security Notes

- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- Enable Firebase security rules
- Use MongoDB user authentication in production
- Implement rate limiting for API endpoints

## 📄 License

This project is for educational purposes.

## 🤝 Contributing

Feel free to submit issues and pull requests.

## 📧 Support

For issues or questions, please create an issue in the repository.

---

**Happy Coding! 🚀**
