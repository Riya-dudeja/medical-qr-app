import 'dotenv/config';
import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import medicalRoutes from './routes/medicalRoutes.js';
import medsafeRoutes from './routes/medsafeRoutes.js';
import authRoutes from "./routes/authRoutes.js";
import sosRoutes from "./routes/sosRoutes.js";
import insuranceRoutes from './routes/insuranceRoutes.js'
import userRoutes from "./routes/userRoutes.js";
import pushRoutes from "./routes/pushRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: function(origin, callback) {
    console.log('🌍 CORS Origin:', origin); // Debug log
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost and any IP in development
    if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.match(/^http:\/\/192\.168\.\d+\.\d+:\d+$/)) {
      return callback(null, true);
    }
    
    // Allow your specific Vercel domain
    if (origin === 'https://medical-qr-app.vercel.app') {
      return callback(null, true);
    }
    
    // Allow other Vercel domains (for preview deployments)
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Allow in production mode
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

app.use(json());

// Manual CORS headers as fallback
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (origin.includes('vercel.app') || origin.includes('localhost'))) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');
  res.header('Access-Control-Allow-Credentials', true);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'MediQR API is running' });
});

// CORS test endpoint
app.get('/api/test-cors', (req, res) => {
  res.status(200).json({ 
    message: 'CORS is working!', 
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint for API info
app.get('/', (req, res) => {
  res.json({ 
    message: 'MediQR API Server', 
    status: 'Running',
    frontend: 'https://medical-qr-app.vercel.app',
    health: '/api/health'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/', sosRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use("/api/users", userRoutes);
app.use('/api/push', pushRoutes);
app.use('/api/medsafe', medsafeRoutes);
app.use('/uploads', (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static('uploads'));

// API-only mode - no static file serving needed (frontend is on Vercel)

connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
