# 🚀 Railway Deployment Guide

## Quick Railway Setup

1. **Go to [railway.app](https://railway.app)** and sign up/login
2. **Click "Deploy from GitHub repo"**
3. **Select your medical-qr-app repository**
4. **Railway will auto-detect your Node.js app**

## Environment Variables Setup

In Railway dashboard, add these environment variables:

```
MONGO_URI=your_actual_mongodb_atlas_connection_string
JWT_SECRET=your_generated_jwt_secret
NODE_ENV=production
PORT=3000
```

**Security Note:** Never put real secrets in code - only in Railway's environment variables!

## Build Configuration

Railway should auto-detect, but if needed:
- **Build Command:** `cd client && npm install && npm run build && cd ../server && npm install`
- **Start Command:** `cd server && npm start`

## Getting Your MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Add to Railway environment variables

## Generating JWT Secret

Run this in terminal to generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Add the output to Railway environment variables.

## Cost

- Railway: $5/month free credits (resets monthly)
- MongoDB Atlas: Free tier available
- Total: $0/month for small apps

## After Deployment

Your app will be available at: `https://your-app-name.up.railway.app`

Both frontend and backend will be served from this single URL!