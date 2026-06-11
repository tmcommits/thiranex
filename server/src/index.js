import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Configure CORS
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: clientUrl,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Parsers
app.use(express.json());

// Set up Socket.io
const io = new Server(server, {
  cors: {
    origin: clientUrl,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Attach Socket.io to request object for use in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.io event handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Base route for sanity check
app.get('/', (req, res) => {
  res.json({ status: 'API is running successfully.' });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Initialize Database then Start Server
const startServer = async () => {
  try {
    await initDb();
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
