# 🚀 Deployment Guide

Complete guide for deploying the Twitter clone to production.

---

## 📋 Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Alternative Platforms](#alternative-platforms)
5. [Post-Deployment](#post-deployment)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Pre-Deployment Checklist

### ✅ Before You Deploy

- [ ] All features work locally
- [ ] Environment variables documented
- [ ] MongoDB Atlas configured (not local MongoDB)
- [ ] Firebase production settings configured
- [ ] Code pushed to GitHub repository
- [ ] `.env` files NOT committed
- [ ] Frontend builds successfully (`cd twitter && npm run build`)
- [ ] Backend starts without errors
- [ ] CORS origins include production URLs

### 📝 Required Credentials

Gather these before starting:
- MongoDB Atlas connection string
- Firebase Admin SDK credentials
- Firebase web config
- Email credentials (if using email OTP)
- Twilio credentials (if using SMS OTP)

---

## Backend Deployment (Render)

### Why Render?
- ✅ Free tier available
- ✅ Easy deployment from GitHub
- ✅ Automatic deployments on push
- ✅ Environment variables support
- ✅ Custom domains

### Step 1: Prepare Backend

1. **Ensure MongoDB Atlas is ready:**
   - Using cloud MongoDB Atlas (not local)
   - Network access allows all IPs (0.0.0.0/0)
   - Database user created

2. **Update CORS in `backend/index.js`:**
   ```javascript
   app.use(
     cors({
       origin: [
         "http://localhost:3000",
         "https://your-frontend-app.vercel.app", // ← Add your Vercel URL
       ],
       credentials: true,
     }),
   );
   ```

3. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 2: Deploy to Render

1. **Sign up/Login:**
   - Go to [Render.com](https://render.com/)
   - Sign up with GitHub

2. **Create New Web Service:**
   - Dashboard → "New" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service:**
   - **Name:** `twitter-clone-backend` (or your choice)
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

4. **Add Environment Variables:**

   Click "Advanced" → "Add Environment Variable":

   ```
   PORT = 5000
   MONGODB_URL = mongodb+srv://user:pass@cluster.mongodb.net/twitter-clone
   FIREBASE_PROJECT_ID = your-project-id
   FIREBASE_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----\nYour-Key\n-----END PRIVATE KEY-----\n
   FIREBASE_CLIENT_EMAIL = firebase-adminsdk@your-project.iam.gserviceaccount.com
   EMAIL_USER = your-email@gmail.com (optional)
   EMAIL_PASS = your-app-password (optional)
   ```

   ⚠️ **Important:** Copy FIREBASE_PRIVATE_KEY exactly as it appears in your local `.env`, with `\n` for newlines

5. **Create Web Service:**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)

6. **Get Backend URL:**
   - After deployment, copy your URL: `https://twitter-clone-backend.onrender.com`
   - Test it: Visit `https://your-app.onrender.com` → Should see success message

### Step 3: Update CORS After Frontend Deployment

Once frontend is deployed, update CORS:
1. Edit `backend/index.js` on GitHub
2. Add frontend URL to origins array
3. Render will auto-deploy

---

## Frontend Deployment (Vercel)

### Why Vercel?
- ✅ Made for Next.js
- ✅ Free tier generous
- ✅ Automatic deployments
- ✅ Edge network (fast globally)
- ✅ Preview deployments

### Step 1: Prepare Frontend

1. **Update `.env.local` with production backend URL:**
   ```env
   NEXT_PUBLIC_BACKEND_URL=https://twitter-clone-backend.onrender.com
   ```

2. **Test build locally:**
   ```bash
   cd twitter
   npm run build
   ```
   Should complete without errors.

3. **Commit changes:**
   ```bash
   git add .
   git commit -m "Update backend URL for production"
   git push origin main
   ```

### Step 2: Deploy to Vercel

1. **Sign up/Login:**
   - Go to [Vercel.com](https://vercel.com/)
   - Sign up with GitHub

2. **Import Project:**
   - Dashboard → "Add New" → "Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `twitter`
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

4. **Environment Variables:**

   Click "Environment Variables" and add:

   ```
   NEXT_PUBLIC_BACKEND_URL = https://twitter-clone-backend.onrender.com
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get your URL: `https://your-app.vercel.app`

### Step 3: Update Backend CORS

1. Go to your backend GitHub repo
2. Edit `backend/index.js`
3. Add Vercel URL to CORS origins:
   ```javascript
   origin: [
     "http://localhost:3000",
     "https://your-app.vercel.app", // ← Add this
   ]
   ```
4. Commit → Render auto-deploys

### Step 4: Update Firebase Authorized Domains

1. Firebase Console → Authentication → Settings
2. Scroll to "Authorized domains"
3. Click "Add domain"
4. Add: `your-app.vercel.app`
5. Save

---

## Alternative Platforms

### Backend Alternatives

#### Railway
- Similar to Render
- Free tier available
- [Railway.app](https://railway.app/)

**Deploy:**
1. Connect GitHub repo
2. Set root directory to `backend`
3. Add environment variables
4. Deploy

#### Heroku
- Paid (no free tier anymore)
- Still reliable
- [Heroku.com](https://heroku.com/)

#### DigitalOcean App Platform
- Free tier available
- More complex setup
- [DigitalOcean.com](https://www.digitalocean.com/products/app-platform)

### Frontend Alternatives

#### Netlify
- Similar to Vercel
- Good for Next.js
- [Netlify.com](https://netlify.com/)

**Deploy:**
1. Connect GitHub repo
2. Set base directory to `twitter`
3. Build: `npm run build`
4. Publish: `.next`
5. Add environment variables

#### Cloudflare Pages
- Free tier generous
- Global CDN
- [pages.cloudflare.com](https://pages.cloudflare.com/)

---

## Post-Deployment

### ✅ Verification Checklist

Test your deployed application:

- [ ] Backend health check works
- [ ] Frontend loads without errors
- [ ] Can sign up new user
- [ ] Can log in
- [ ] Can create tweet
- [ ] Tweets appear in feed
- [ ] Can like/retweet
- [ ] Profile page works
- [ ] Can edit profile
- [ ] Images upload correctly
- [ ] No CORS errors in console
- [ ] Mobile responsive

### 🔧 Common Post-Deployment Issues

#### CORS Errors
**Problem:** API calls fail with CORS error

**Solution:**
1. Check backend CORS includes frontend URL
2. Ensure `credentials: true` in CORS config
3. Restart backend after CORS changes

#### Firebase Auth Not Working
**Problem:** Can't log in or sign up

**Solution:**
1. Check Firebase authorized domains includes deployment URL
2. Verify Firebase config in frontend is correct
3. Check Firebase Admin credentials in backend

#### Images Not Loading
**Problem:** Uploaded images return 404

**Solution:**
1. Implement cloud storage (Google Cloud Storage, AWS S3)
2. Or use external image hosting (Cloudinary, imgbb)
3. Update upload logic to use cloud URLs

#### Slow Cold Starts (Render Free Tier)
**Problem:** First request takes 30+ seconds

**This is normal for Render free tier:**
- App "sleeps" after 15 minutes of inactivity
- First request wakes it up (slow)
- Subsequent requests are fast

**Solutions:**
- Upgrade to paid tier
- Use UptimeRobot to ping every 14 minutes (keep alive)
- Accept the limitation for free tier

---

## Custom Domain Setup

### For Vercel (Frontend)

1. **Add Domain:**
   - Project Settings → Domains
   - Enter your domain (e.g., `mytwitter.com`)
   - Follow DNS instructions

2. **Update DNS:**
   - Add CNAME record pointing to Vercel
   - Wait for propagation (up to 48 hours)

3. **SSL:**
   - Automatic with Vercel

### For Render (Backend)

1. **Add Custom Domain:**
   - Service Settings → Custom Domains
   - Enter subdomain (e.g., `api.mytwitter.com`)

2. **Update DNS:**
   - Add CNAME record
   - Point to Render

3. **Update Frontend:**
   - Change `NEXT_PUBLIC_BACKEND_URL` in Vercel
   - Redeploy

---

## Environment Variables Reference

### Backend (Render)

```env
# Required
PORT=5000
MONGODB_URL=mongodb+srv://...
FIREBASE_PROJECT_ID=your-project
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...

# Optional
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
RESEND_API_KEY=re_...
```

### Frontend (Vercel)

```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
```

---

## Monitoring & Maintenance

### Monitor Backend

**Render Dashboard:**
- View logs
- Monitor CPU/Memory
- Track deployments

**Set up logging:**
- Add error tracking (Sentry)
- Monitor API response times
- Track MongoDB performance

### Monitor Frontend

**Vercel Analytics:**
- Free with deployment
- Track page views
- Monitor Core Web Vitals

**Vercel Logs:**
- View build logs
- Runtime logs
- Error tracking

### Database Monitoring

**MongoDB Atlas:**
- Monitor connections
- Track queries
- Set up alerts
- Review performance

### Automated Monitoring

**UptimeRobot (Free):**
1. Create account
2. Add monitors:
   - Backend: `https://your-backend.onrender.com`
   - Frontend: `https://your-app.vercel.app`
3. Get alerts via email if down

---

## Continuous Deployment

### Automatic Deployments

Both Render and Vercel support automatic deployments:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Auto-Deploy:**
   - Backend: Render detects push → builds → deploys
   - Frontend: Vercel detects push → builds → deploys

3. **Preview Deployments (Vercel):**
   - Create branch → push
   - Vercel creates preview URL
   - Test before merging to main

---

## Scaling Considerations

### When to Upgrade

**Consider upgrading when:**
- More than 1000 daily active users
- Slow response times
- Running out of free tier limits
- Need better uptime guarantees

### Scaling Options

**Backend:**
- Render: Upgrade to Starter ($7/mo)
- Use Redis for caching
- Implement CDN for static files
- Database read replicas

**Frontend:**
- Vercel Pro ($20/mo)
- Image optimization
- Edge caching
- ISR (Incremental Static Regeneration)

**Database:**
- MongoDB Atlas: Upgrade cluster
- Add indexes for queries
- Implement database sharding

---

## Security Best Practices

### Production Security

✅ **Do:**
- Use environment variables for secrets
- Enable HTTPS everywhere
- Implement rate limiting
- Validate all inputs
- Use strong Firebase rules
- Keep dependencies updated
- Enable MongoDB authentication
- Use CSP headers

❌ **Don't:**
- Commit `.env` files
- Expose API keys in client code
- Allow unlimited requests
- Trust user input
- Use weak passwords
- Ignore security warnings

### Rate Limiting

Add to `backend/index.js`:
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

---

## Backup & Recovery

### Database Backups

**MongoDB Atlas:**
1. Cluster → Backup
2. Enable Cloud Backup
3. Set retention policy
4. Test restore process

### Code Backups

- GitHub is your backup
- Use branches for experiments
- Tag releases: `git tag v1.0.0`

---

## Cost Estimate

### Free Tier (Starter)
- **Render:** Free tier (with sleep)
- **Vercel:** Free tier
- **MongoDB Atlas:** Free M0 cluster
- **Firebase:** Free Spark plan
- **Total:** $0/month

### Paid Tier (Growing)
- **Render Starter:** $7/month
- **Vercel Pro:** $20/month
- **MongoDB M10:** $57/month
- **Firebase Blaze:** Pay as you go (~$5-20)
- **Total:** ~$89-106/month

---

## Support Resources

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Firebase Docs](https://firebase.google.com/docs)

---

**Ready to Deploy! 🚀**

Follow the steps in order, and you'll have a production Twitter clone running in under an hour!
