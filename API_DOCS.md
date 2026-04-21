# API Documentation

Base URL: `http://localhost:5000` (Development)

---

## Authentication Endpoints

### Register User
**POST** `/register`

Creates a new user account in the database.

**Request Body:**
```json
{
  "username": "johndoe",
  "displayName": "John Doe",
  "email": "john@example.com",
  "avatar": "https://example.com/avatar.jpg", // Optional
  "phone": "+1234567890" // Optional
}
```

**Response:** (200 OK)
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "username": "johndoe",
  "displayName": "John Doe",
  "email": "john@example.com",
  "avatar": "https://ui-avatars.com/api/?name=John+Doe",
  "phone": "",
  "joinedDate": "2024-01-15T10:30:00.000Z"
}
```

**Notes:**
- If user with email already exists, returns existing user
- Avatar auto-generated if not provided
- Firebase authentication should be done on frontend first

---

### Get Logged In User
**GET** `/loggedinuser?email={email}`

Retrieves user information by email.

**Query Parameters:**
- `email` (required): User's email address

**Response:** (200 OK)
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "username": "johndoe",
  "displayName": "John Doe",
  "email": "john@example.com",
  "avatar": "https://example.com/avatar.jpg",
  "coverImage": "https://example.com/cover.jpg",
  "bio": "Software developer",
  "location": "San Francisco",
  "website": "https://johndoe.com",
  "joinedDate": "2024-01-15T10:30:00.000Z"
}
```

---

### Update User Profile
**PATCH** `/userupdate/:email`

Updates user profile information.

**URL Parameters:**
- `email`: User's email address

**Request Body:** (partial update supported)
```json
{
  "displayName": "John Smith",
  "bio": "Full-stack developer",
  "location": "New York",
  "website": "https://johnsmith.com",
  "avatar": "https://example.com/new-avatar.jpg",
  "coverImage": "https://example.com/new-cover.jpg"
}
```

**Response:** (200 OK)
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "username": "johndoe",
  "displayName": "John Smith",
  "email": "john@example.com",
  "bio": "Full-stack developer",
  "location": "New York",
  "website": "https://johnsmith.com",
  "avatar": "https://example.com/new-avatar.jpg",
  "coverImage": "https://example.com/new-cover.jpg",
  "joinedDate": "2024-01-15T10:30:00.000Z"
}
```

**Error Response:** (404 Not Found)
```json
{
  "error": "User not found"
}
```

---

## Tweet Endpoints

### Create Tweet
**POST** `/post`

Creates a new tweet.

**Request Body:**
```json
{
  "author": "60f7b3b3b3b3b3b3b3b3b3b3", // User ID
  "content": "Hello Twitter!",
  "image": "https://example.com/image.jpg", // Optional
  "audio": "https://example.com/audio.mp3" // Optional
}
```

**Response:** (200 OK)
```json
{
  "_id": "60f7b4c4c4c4c4c4c4c4c4c4",
  "author": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "johndoe",
    "displayName": "John Doe",
    "avatar": "https://example.com/avatar.jpg"
  },
  "content": "Hello Twitter!",
  "image": null,
  "audio": null,
  "likes": 0,
  "retweets": 0,
  "comments": 0,
  "likedBy": [],
  "retweetedBy": [],
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

**Notes:**
- Author is populated with full user object in response
- Either content, image, or audio is required
- Content can be empty if image or audio is provided

---

### Get All Tweets
**GET** `/post`

Retrieves all tweets, sorted by most recent first.

**Response:** (200 OK)
```json
[
  {
    "_id": "60f7b4c4c4c4c4c4c4c4c4c4",
    "author": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "username": "johndoe",
      "displayName": "John Doe",
      "avatar": "https://example.com/avatar.jpg"
    },
    "content": "Hello Twitter!",
    "image": null,
    "audio": null,
    "likes": 5,
    "retweets": 2,
    "comments": 0,
    "likedBy": ["60f7b3b3b3b3b3b3b3b3b3b3"],
    "retweetedBy": [],
    "timestamp": "2024-01-15T11:00:00.000Z"
  }
]
```

---

### Like/Unlike Tweet
**POST** `/like/:id`

Toggles like status for a tweet. If already liked, removes like. If not liked, adds like.

**URL Parameters:**
- `id`: Tweet ID

**Request Body:**
```json
{
  "userId": "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

**Response:** (200 OK)
```json
{
  "_id": "60f7b4c4c4c4c4c4c4c4c4c4",
  "author": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "johndoe",
    "displayName": "John Doe",
    "avatar": "https://example.com/avatar.jpg"
  },
  "content": "Hello Twitter!",
  "likes": 6,
  "likedBy": ["60f7b3b3b3b3b3b3b3b3b3b3"],
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

**Notes:**
- Returns updated tweet with new like count
- Like count increments/decrements automatically
- User ID is added/removed from likedBy array

---

### Retweet/Unretweet Tweet
**POST** `/retweet/:id`

Toggles retweet status for a tweet.

**URL Parameters:**
- `id`: Tweet ID

**Request Body:**
```json
{
  "userId": "60f7b3b3b3b3b3b3b3b3b3b3"
}
```

**Response:** (200 OK)
```json
{
  "_id": "60f7b4c4c4c4c4c4c4c4c4c4",
  "author": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "johndoe",
    "displayName": "John Doe",
    "avatar": "https://example.com/avatar.jpg"
  },
  "content": "Hello Twitter!",
  "retweets": 3,
  "retweetedBy": ["60f7b3b3b3b3b3b3b3b3b3b3"],
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

---

## OTP Endpoints

### Send OTP via Email
**POST** `/otp/send`

Sends a 6-digit OTP to the provided email address.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** (200 OK)
```json
{
  "message": "OTP sent"
}
```

**Error Response:** (400 Bad Request)
```json
{
  "error": "Email required"
}
```

**Notes:**
- OTP is valid for single use
- OTP is stored in memory (resets on server restart)
- Requires EMAIL_USER and EMAIL_PASS in .env

---

### Verify OTP
**POST** `/otp/verify`

Verifies the OTP sent to an email address.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Success Response:** (200 OK)
```json
{
  "verified": true
}
```

**Error Response:** (400 Bad Request)
```json
{
  "verified": false
}
```

**Notes:**
- OTP is deleted after successful verification
- Each OTP can only be used once

---

## Audio Tweet Endpoints

**Base Path:** `/audio-tweet`

See `backend/routes/audioTweet.js` for implementation details.

Features:
- Upload audio files
- Associate audio with tweets
- Stream audio playback

---

## Password Reset Endpoints

**Base Path:** `/forgot-password`

See `backend/routes/forgotPassword.js` for implementation details.

Features:
- Request password reset
- Verify reset token
- Update password

---

## Error Responses

All endpoints may return these error responses:

**500 Internal Server Error**
```json
{
  "error": "Operation failed"
}
```

**400 Bad Request**
```json
{
  "error": "Invalid request parameters"
}
```

**404 Not Found**
```json
{
  "error": "Resource not found"
}
```

---

## CORS Configuration

Allowed origins:
- `http://localhost:3000` (Development)
- `https://twitter-clone-swart-delta.vercel.app`
- `https://twitter-clone-s0gjf53d6-tanmay-ghules-projects.vercel.app`

Credentials are enabled for cross-origin requests.

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding:
- Login attempt limits
- OTP request limits
- Post creation limits

See `express-rate-limit` package in dependencies.

---

## File Uploads

Static file serving is enabled:
- Path: `/uploads`
- Directory: `backend/uploads/`

Example: `http://localhost:5000/uploads/image.jpg`

---

## Database Models

### User Schema
```javascript
{
  username: String,
  displayName: String,
  avatar: String,
  coverImage: String,
  email: String (unique),
  password: String,
  phone: String,
  bio: String,
  location: String,
  website: String,
  joinedDate: Date (default: now),
  otpHash: String,
  otpExpiry: Date,
  otpAttempts: Number (default: 0),
  resetToken: String,
  resetTokenExpiry: Date,
  lastPasswordResetRequest: Date
}
```

### Tweet Schema
```javascript
{
  author: ObjectId (ref: User, required),
  content: String,
  audio: String,
  likes: Number (default: 0),
  retweets: Number (default: 0),
  comments: Number (default: 0),
  likedBy: [ObjectId] (ref: User),
  retweetedBy: [ObjectId] (ref: User),
  image: String,
  timestamp: Date (default: now)
}
```

---

## Development Tips

### Testing Endpoints with curl

**Register user:**
```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","displayName":"Test User","email":"test@example.com"}'
```

**Get user:**
```bash
curl http://localhost:5000/loggedinuser?email=test@example.com
```

**Create tweet:**
```bash
curl -X POST http://localhost:5000/post \
  -H "Content-Type: application/json" \
  -d '{"author":"USER_ID","content":"Hello World!"}'
```

### Using Postman

Import the following collection structure:
1. Set base URL variable: `{{base_url}} = http://localhost:5000`
2. Create folders for each endpoint category
3. Add requests with saved examples

---

**Last Updated:** 2024-01-15
