import express from 'express';
import path from 'path';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import rateLimiter from './middleware/rateLimit.js';
import errorHandler from './middleware/error.js';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import appointmentRoutes from './routes/appointments.js';
import chatRoutes from './routes/chat.js';
import prescriptionRoutes from './routes/prescriptions.js';
import userRoutes from './routes/users.js';
import doctorRoutes from './routes/doctor.js';
import doctorsRoutes from './routes/doctors.js';
import adminRoutes from './routes/admin.js';
import { registerSocketHandlers } from './controllers/chatController.js';

dotenv.config();
const app = express();
const server = http.createServer(app);

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map(o => o.trim());

const io = new SocketIOServer(server, {
  cors: { origin: allowedOrigins, credentials: true }
});

// DB
await connectDB(process.env.MONGO_URI);

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter);

// Static: serve generated prescription PDFs
app.use('/uploads', express.static(path.join(process.cwd(), 'server', 'uploads')));

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

// Socket.IO
registerSocketHandlers(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
