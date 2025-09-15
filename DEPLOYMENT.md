# MediQR Deployment Guide

## Full-Stack Deployment (Both Frontend + Backend)

### Option 1: Railway (Recommended for Full-Stack)
Railway can host both your frontend and backend together:

1. **Create account** at [railway.app](https://railway.app)
2. **Import GitHub repo** (entire project)
3. **Railway will auto-detect both client and server**
4. **Configure build settings:**
   - Root Directory: `/`
   - Build Command: `cd client && npm install && npm run build && cd ../server && npm install`
   - Start Command: `cd server && npm start`
   - Port: `5000`
5. **Add Environment Variables:**
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secret_key
   NODE_ENV=production
   PORT=5000
   ```
6. **Configure static file serving** in your server to serve the built frontend

### Option 2: Render (Full-Stack)
Similar to Railway, Render can host both:
- Create Web Service
- Build Command: `cd client && npm install && npm run build && cd ../server && npm install`
- Start Command: `cd server && npm start`

## Frontend Deployment (Client Only)

### Option 1: Vercel (Recommended for Frontend Only)
1. **Push to GitHub** (if not already done)
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repo
   - Set build settings:
     - Framework: Vite
     - Root Directory: `client`
     - Build Command: `npm run build`
     - Output Directory: `dist`

### Option 2: Netlify
1. **Build locally:** `cd client && npm run build`
2. **Deploy the `dist` folder:**
   - Go to [netlify.com](https://netlify.com)
   - Drag & drop your `client/dist` folder
   - Or connect to GitHub repo

### Option 3: Static Hosting
- Upload the `client/dist` folder contents to any web host
- Ensure your server supports SPA routing (serve `index.html` for all routes)

## Backend Deployment (Server)

### Option 1: Render (Free tier available)
1. **Create account** at [render.com](https://render.com)
2. **Create new Web Service:**
   - Connect GitHub repo
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
3. **Add Environment Variables:**
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secret_key
   NODE_ENV=production
   PORT=10000
   ```

### Option 2: Railway
1. **Connect to Railway:**
   - Go to [railway.app](https://railway.app)
   - Import GitHub repo
   - Set root directory to `server`
2. **Add Environment Variables**

### Option 3: Heroku
```bash
# Install Heroku CLI first
cd server
heroku create your-mediqr-backend
heroku config:set MONGODB_URI=your_connection_string
heroku config:set JWT_SECRET=your_secret
git subtree push --prefix server heroku main
```

## Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas account** (free tier available)
2. **Create cluster and database**
3. **Whitelist your deployment IPs:**
   - Add `0.0.0.0/0` for all IPs (or specific deployment IPs)
4. **Get connection string** and add to backend environment variables

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mediqr
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
PORT=5000
```

### Frontend (if needed)
```env
VITE_API_URL=https://your-backend-url.com
```

## Final Steps

1. **Deploy Backend first** → Get backend URL
2. **Update frontend API calls** to use production backend URL
3. **Deploy Frontend** → Get frontend URL
4. **Test everything works together**

## Quick Deploy Commands

```bash
# Build frontend
cd client
npm run build

# The dist/ folder is ready for deployment!

# For backend, just push to your chosen platform
cd ../server
# Deploy to Render/Railway/Heroku
```

## Troubleshooting

- **CORS errors:** Add your frontend URL to backend CORS configuration
- **API calls failing:** Check if frontend is calling the correct backend URL
- **MongoDB connection:** Ensure IP whitelist includes deployment servers
- **Environment variables:** Double-check all required vars are set on deployment platform

---

Your app is now ready for production! 🚀