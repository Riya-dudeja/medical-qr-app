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
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost and any IP in development
    if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.match(/^http:\/\/192\.168\.\d+\.\d+:\d+$/)) {
      return callback(null, true);
    }
    
    // In production, you can be more restrictive
    return callback(null, true);
  },
  credentials: true,
  methods: 'GET,POST,PUT,DELETE'
}));

app.use(json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'MediQR API is running' });
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

// Serve static files from React app (for production deployment)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // Handle React routing - return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
