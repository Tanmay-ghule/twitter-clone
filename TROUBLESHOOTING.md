# 🔧 Troubleshooting Guide

Common issues and solutions for the Twitter Clone project.

---

## 📋 Quick Diagnostics

### Health Check Commands

```bash
# Check Node.js version
node -v  # Should be v18+

# Check npm version
npm -v

# Check if MongoDB is running (local)
mongosh  # Should connect

# Check backend is running
curl http://localhost:5000  # Should return success message

# Check frontend is running
curl http://localhost:3000  # Should return HTML
```

---

## 🚨 Installation Issues

### ❌ "npm install" fails

**Error:** Package installation fails with errors

**Solutions:**

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Update npm:**
   ```bash
   npm install -g npm@latest
   ```

3. **Check Node.js version:**
   ```bash
   node -v  # Should be v18+
   nvm install 18  # If using nvm
   nvm use 18
   ```

4. **Permission issues (Mac/Linux):**
   ```bash
   sudo chown -R $USER /usr/local/lib/node_modules
   ```

### ❌ "Cannot find module" errors

**Error:** Import errors after installation

**Solutions:**

1. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check import paths:**
   - Ensure `@/` alias is configured in `tsconfig.json`
   - Verify file extensions (.tsx, .ts, .js)

3. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

---

## 🗄️ MongoDB Issues

### ❌ "Cannot connect to MongoDB"

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solutions:**

1. **Check MongoDB is running:**
   ```bash
   # Mac
   brew services list
   brew services start mongodb-community
   
   # Linux
   sudo systemctl status mongod
   sudo systemctl start mongod
   
   # Windows
   # Services → MongoDB → Start
   ```

2. **Verify connection string:**
   ```env
   # Local
   MONGODB_URL=mongodb://localhost:27017/twitter-clone
   
   # Atlas
   MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/twitter-clone
   ```

3. **Check MongoDB port:**
   ```bash
   lsof -i :27017  # Should show mongod
   ```

4. **Test connection:**
   ```bash
   mongosh
   show dbs
   ```

### ❌ MongoDB Atlas connection fails

**Error:** Network timeout or authentication failed

**Solutions:**

1. **Check Network Access:**
   - Atlas → Network Access
   - Add IP: `0.0.0.0/0` (allows all)
   - Or add your specific IP

2. **Verify credentials:**
   - Username and password correct
   - No special characters unescaped in connection string
   - Escape special chars: `!` → `%21`, `@` → `%40`

3. **Check cluster status:**
   - Ensure cluster is running (not paused)
   - Check cluster region (connection might be slow)

4. **Test connection string:**
   ```bash
   mongosh "mongodb+srv://user:pass@cluster.mongodb.net/twitter-clone"
   ```

---

## 🔥 Firebase Issues

### ❌ Firebase authentication not working

**Error:** Auth errors in console, can't sign up/login

**Solutions:**

1. **Check Firebase config:**
   - Verify `firebase.tsx` has correct config
   - Ensure all keys are present (apiKey, authDomain, etc.)

2. **Enable authentication methods:**
   - Firebase Console → Authentication → Sign-in method
   - Enable Email/Password
   - Enable Google (if using)

3. **Check authorized domains:**
   - Firebase Console → Authentication → Settings
   - Authorized domains includes:
     - `localhost`
     - Your deployment domain

4. **Verify Firebase Admin SDK:**
   ```env
   # Backend .env - check these exist
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
   ```

### ❌ "Firebase: Error (auth/...)" codes

**Common Firebase auth errors:**

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `auth/email-already-in-use` | Email registered | Use login instead |
| `auth/wrong-password` | Incorrect password | Check password |
| `auth/user-not-found` | Email not registered | Sign up first |
| `auth/weak-password` | Password < 6 chars | Use stronger password |
| `auth/invalid-email` | Bad email format | Check email format |
| `auth/network-request-failed` | No internet | Check connection |
| `auth/popup-closed-by-user` | Google popup closed | Try again |
| `auth/unauthorized-domain` | Domain not authorized | Add domain in Firebase |

**Solution:**
- Check the specific error in browser console
- Implement better error messages in UI
- See Firebase docs for error code

---

## 🌐 Backend Issues

### ❌ Backend won't start

**Error:** Server crashes on startup

**Solutions:**

1. **Check .env file exists:**
   ```bash
   ls backend/.env  # Should exist
   ```

2. **Verify .env format:**
   ```env
   PORT=5000
   MONGODB_URL=mongodb://localhost:27017/twitter-clone
   # No spaces around =
   # No quotes unless needed
   ```

3. **Check for syntax errors:**
   ```bash
   cd backend
   node index.js  # Will show specific error
   ```

4. **Port already in use:**
   ```bash
   # Mac/Linux
   lsof -ti:5000 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

### ❌ CORS errors

**Error:** `Access-Control-Allow-Origin` errors in console

**Solutions:**

1. **Check CORS configuration:**
   ```javascript
   // backend/index.js
   app.use(cors({
     origin: [
       "http://localhost:3000",
       "https://your-deployment.vercel.app"  // Add your URL
     ],
     credentials: true
   }));
   ```

2. **Restart backend after changes**

3. **Check frontend URL:**
   ```env
   # twitter/.env.local
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   ```

4. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

### ❌ API returns 500 errors

**Error:** All API calls fail with 500

**Solutions:**

1. **Check backend logs:**
   ```bash
   cd backend
   npm run dev  # Watch for errors
   ```

2. **Common causes:**
   - MongoDB connection failed
   - Invalid data in request
   - Missing environment variables

3. **Test endpoints with curl:**
   ```bash
   curl http://localhost:5000
   curl http://localhost:5000/post
   ```

4. **Check error handling:**
   - Add try-catch blocks
   - Log errors: `console.error(err)`

---

## 💻 Frontend Issues

### ❌ Frontend won't start

**Error:** Next.js fails to start

**Solutions:**

1. **Clear .next directory:**
   ```bash
   cd twitter
   rm -rf .next
   npm run dev
   ```

2. **Check for TypeScript errors:**
   ```bash
   npm run lint
   ```

3. **Verify .env.local:**
   ```bash
   cat twitter/.env.local
   # Should have NEXT_PUBLIC_BACKEND_URL
   ```

4. **Port 3000 in use:**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   
   # Or use different port
   PORT=3001 npm run dev
   ```

### ❌ "Cannot read property of undefined"

**Error:** Runtime errors accessing data

**Solutions:**

1. **Add null checks:**
   ```typescript
   // Before
   user.displayName
   
   // After
   user?.displayName
   ```

2. **Check API response:**
   ```typescript
   console.log('API response:', response.data);
   ```

3. **Verify data structure:**
   - Check what backend returns
   - Ensure frontend expects correct format

### ❌ Images not displaying

**Error:** Broken image icons

**Solutions:**

1. **Check image URLs:**
   - Must be HTTPS
   - Must be accessible publicly
   - Check browser network tab

2. **Configure Next.js Image domains:**
   ```typescript
   // next.config.ts
   images: {
     remotePatterns: [
       {
         protocol: 'https',
         hostname: '**',
       },
     ],
   }
   ```

3. **Use regular img tag:**
   ```tsx
   <img src={user.avatar} alt="Avatar" />
   ```

### ❌ "Hydration failed" errors

**Error:** React hydration mismatch

**Solutions:**

1. **Check localStorage usage:**
   ```typescript
   // Only access localStorage in useEffect
   useEffect(() => {
     const data = localStorage.getItem('key');
   }, []);
   ```

2. **Ensure consistent rendering:**
   - Server and client render same HTML
   - Don't use random values without seed
   - Check date formatting

3. **Suppress warning (temporary):**
   ```tsx
   <div suppressHydrationWarning>
   ```

---

## 🔐 Authentication Issues

### ❌ Can't sign up new users

**Solutions:**

1. **Check Firebase email/password is enabled**

2. **Verify backend registration endpoint:**
   ```bash
   curl -X POST http://localhost:5000/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","username":"test","displayName":"Test User"}'
   ```

3. **Check browser console for errors**

4. **Verify MongoDB connection**

### ❌ Users can't log in

**Solutions:**

1. **Check credentials:**
   - Email correct
   - Password correct (case-sensitive)

2. **Check if user exists in database:**
   ```bash
   mongosh
   use twitter-clone
   db.users.findOne({email: "user@example.com"})
   ```

3. **Clear browser cache and cookies**

4. **Try password reset flow**

### ❌ Logged in but user data not loading

**Solutions:**

1. **Check browser console:**
   - Look for API errors
   - Check network tab

2. **Verify backend returns user:**
   ```bash
   curl "http://localhost:5000/loggedinuser?email=user@example.com"
   ```

3. **Check AuthContext:**
   - Add console.logs
   - Verify user state updates

4. **Clear localStorage:**
   ```javascript
   localStorage.clear();
   ```

---

## 🐛 Build Issues

### ❌ Frontend build fails

**Error:** `npm run build` fails

**Solutions:**

1. **Check TypeScript errors:**
   ```bash
   npm run lint
   ```

2. **Fix type errors:**
   ```typescript
   // Add proper types
   const [user, setUser] = useState<User | null>(null);
   ```

3. **Check environment variables:**
   ```bash
   # Ensure .env.local exists
   cat .env.local
   ```

4. **Clear and rebuild:**
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

### ❌ "Module not found" in build

**Solutions:**

1. **Check import paths:**
   ```typescript
   // Use relative or alias paths
   import Component from '@/components/Component';
   ```

2. **Verify tsconfig.json:**
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./*"]
       }
     }
   }
   ```

---

## 📱 Runtime Issues

### ❌ Tweets not appearing

**Solutions:**

1. **Check if tweets exist:**
   ```bash
   mongosh
   use twitter-clone
   db.tweets.find()
   ```

2. **Verify API call:**
   ```typescript
   console.log('Fetching tweets...');
   const res = await axiosInstance.get('/post');
   console.log('Tweets:', res.data);
   ```

3. **Check network tab:**
   - Verify API call succeeds
   - Check response data

### ❌ Like/Retweet not working

**Solutions:**

1. **Check if user is logged in:**
   ```typescript
   console.log('User:', user);
   ```

2. **Verify tweet ID:**
   ```typescript
   console.log('Tweet ID:', tweetId);
   ```

3. **Check API response:**
   ```typescript
   console.log('Like response:', response.data);
   ```

4. **Verify backend endpoint:**
   ```bash
   curl -X POST http://localhost:5000/like/TWEET_ID \
     -H "Content-Type: application/json" \
     -d '{"userId":"USER_ID"}'
   ```

---

## 🚀 Deployment Issues

### ❌ Deployed app not working

**Solutions:**

1. **Check environment variables:**
   - Verify all required vars set
   - Check for typos

2. **Check build logs:**
   - Vercel/Render dashboard
   - Look for build errors

3. **Verify backend URL:**
   ```env
   NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
   ```

4. **Test backend separately:**
   ```bash
   curl https://your-backend.onrender.com
   ```

### ❌ CORS errors in production

**Solutions:**

1. **Update backend CORS:**
   ```javascript
   origin: [
     "https://your-app.vercel.app"
   ]
   ```

2. **Redeploy backend after changes**

3. **Check Firebase authorized domains**

---

## 🔍 Debugging Tips

### Enable verbose logging

**Backend:**
```javascript
// Add to routes
console.log('Request body:', req.body);
console.log('User:', user);
console.log('Tweet:', tweet);
```

**Frontend:**
```typescript
// Add to components
console.log('Props:', props);
console.log('State:', state);
console.log('API response:', response);
```

### Use browser DevTools

1. **Console:** View errors and logs
2. **Network:** Check API calls
3. **Application:** View localStorage
4. **React DevTools:** Inspect component state

### Check database directly

```bash
mongosh
use twitter-clone
db.users.find().pretty()
db.tweets.find().pretty()
```

---

## 📞 Getting Help

If you're still stuck:

1. **Check error message carefully:**
   - Read full error
   - Google the exact error message

2. **Search existing issues:**
   - GitHub Issues
   - Stack Overflow

3. **Create minimal reproduction:**
   - Isolate the problem
   - Create simple test case

4. **Ask for help:**
   - Provide error message
   - Share relevant code
   - Describe what you tried

---

## 📝 Best Practices

### Prevent issues

✅ **Do:**
- Keep dependencies updated
- Use TypeScript for type safety
- Add error handling everywhere
- Test locally before deploying
- Commit working code
- Document changes

❌ **Don't:**
- Ignore warnings
- Skip error handling
- Deploy untested code
- Commit sensitive data
- Make breaking changes without backup

---

**Still having issues? Create a GitHub issue with:**
- Error message
- Steps to reproduce
- Environment (OS, Node version, etc.)
- What you've tried

Good luck! 🚀
