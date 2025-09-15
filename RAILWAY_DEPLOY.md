# 🚀 Deploy to Railway (Full-Stack)

## Quick Railway Deployment

Railway can host your **entire MediQR app** (frontend + backend) in one deployment!

### Step 1: Prepare Your Code
```bash
# Make sure your latest changes are committed
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### Step 2: Deploy to Railway
1. **Go to [railway.app](https://railway.app)**
2. **Sign up/Login** with GitHub
3. **Click "Deploy from GitHub repo"**
4. **Select your `medical-qr-app` repository**
5. **Railway will automatically detect your project**

### Step 3: Configure Environment Variables
In Railway dashboard, add these variables:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mediqr
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
PORT=3000
```

### Step 4: Set Build Configuration
Railway should auto-detect, but if needed:
- **Build Command:** `cd client && npm install && npm run build && cd ../server && npm install`
- **Start Command:** `cd server && npm start`
- **Port:** `3000` (or whatever Railway assigns)

### Step 5: Deploy!
- Railway will automatically build and deploy
- You'll get a URL like: `https://your-app-name.up.railway.app`
- Both your frontend and backend will be served from this single URL

## What Happens During Deployment

1. **Railway builds your frontend** (`client/dist/`)
2. **Railway installs server dependencies**
3. **Your server serves the built React app** + API routes
4. **Everything works together** at one URL! 🎉

## API Routes
- Frontend: `https://your-app.railway.app/`
- API: `https://your-app.railway.app/api/...`
- Health Check: `https://your-app.railway.app/api/health`

## Cost
- **Railway gives you $5/month credit for free**
- Your app should easily fit within the free tier
- Only pay if you exceed usage

---

That's it! Railway handles everything - building, hosting, and scaling your full-stack MediQR app! 🚄✨