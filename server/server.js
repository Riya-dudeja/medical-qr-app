import 'dotenv/config';
import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import medicalRoutes from './routes/medicalRoutes.js';
import authRoutes from "./routes/authRoutes.js";
import sosRoutes from "./routes/sosRoutes.js";
import insuranceRoutes from './routes/insuranceRoutes.js'
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://192.168.83.128:5173"],
  credentials: true,
  methods: 'GET,POST,PUT,DELETE'
}));

app.use(json());
app.use('/api/auth', authRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/', sosRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use("/api/users", userRoutes);
app.use('/uploads', (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static('uploads'));

connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
