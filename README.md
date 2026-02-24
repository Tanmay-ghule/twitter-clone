# Twitter 2.0 Clone 🚀

A full-stack Twitter (X) style social media application where users can create tweets, upload media, interact with posts, and manage their profiles.

---

## ✨ Features

### Authentication

* Firebase Google login
* OTP verification using Twilio

### Core Functionality

* Create tweets
* Like / Unlike tweets
* Retweet tweets
* Home feed timeline
* User profile update

### Media Support

* Image upload (ImgBB)
* Audio tweet upload

### UI

* Responsive design for different screen sizes

---

## 🚀 Deployment Targets

* **Frontend:** Vercel
* **Backend:** Render

---

## 📂 Project Structure

```
root
├── app/                 # Next.js app router
├── components/          # UI components
├── context/             # Auth & global state
├── lib/                 # Axios & utilities
├── public/
├── backend/
│   ├── modals/
│   ├── routes/
│   ├── utils/
│   ├── firebaseAdmin.js
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

## 🧑‍💻 Local Development Setup

### 1️⃣ Clone repository

```bash
git clone https://github.com/Tanmay-ghule/twitter-2.0.git
cd twitter-2.0
```

---

### 2️⃣ Install dependencies

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

### 3️⃣ Configure environment variables

Create and fill:

* `.env.local`
* `backend/.env`

---

### 4️⃣ Run backend

```bash
cd backend
npm start
```

Backend runs on:

```
http://localhost:5000
```

---

### 5️⃣ Run frontend

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🔐 Security Notes

The following are ignored via `.gitignore`:

* `.env` files
* Firebase service account keys
* `node_modules`
* upload folders

**Never commit secrets to GitHub.**

---

## 🛠️ Future Improvements

* Comments on tweets
* Follow system
* Bookmarks
* Real-time updates

---

⭐ If you found this project helpful, consider giving it a star.
