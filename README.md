# Twitter 2.0 Clone 🚀

A full-stack Twitter (X) style social media application where users can post tweets, like, retweet, upload media, and manage their profile.

---

## ✨ Features

* 🔐 Firebase authentication
* 🐦 Create and view tweets
* ❤️ Like and unlike tweets
* 🔁 Retweet functionality
* 🖼️ Image upload support
* 🎧 Audio tweet upload
* 📱 Responsive layout
* 🔑 OTP verification (Twilio)
* 👤 User profile update

---

## 🚀 Live Demo

Frontend: *To be deployed on Vercel*
Backend: *To be deployed on Render*

---

## 📂 Project Structure

```
root
├── app/
├── components/
├── context/
├── lib/
├── public/
├── backend/
│   ├── modals/
│   ├── routes/
│   ├── utils/
│   └── index.js
```

---

## ⚙️ Environment Variables

### Frontend (`.env.local`)

```
NEXT_PUBLIC_BACKEND_URL=
NEXT_PUBLIC_IMGBB_KEY=
```

---

### Backend (`backend/.env`)

```
MONGODB_URL=
PORT=5000

EMAIL_USER=
EMAIL_PASS=

TWILIO_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

---

## 🧑‍💻 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/tanmay-ghule/twitter-2.0.git
cd twitter-2.0
```

---

### 2. Install dependencies

#### Frontend

```bash
npm install
```

#### Backend

```bash
cd backend
npm install
```

---

### 3. Configure environment variables

Create the required env files and add your credentials:

* `.env.local`
* `backend/.env`

---

### 4. Run backend server

```bash
cd backend
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

### 5. Run frontend

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🔐 Security

Sensitive files are excluded using `.gitignore`, including:

* `.env` files
* Firebase service keys
* `node_modules`
* upload folders

Never commit secrets to the repository.

---

## 🚀 Deployment Plan

* **Frontend:** Vercel
* **Backend:** Render

Update environment variables on the hosting platforms before deploying.

---

## 🛠️ Future Improvements

* Comments on tweets
* Follow system
* Bookmarks
* Real-time updates
* Improved notifications

---

⭐ If you found this project useful, consider giving it a star.
