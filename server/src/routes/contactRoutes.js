import express from 'express';
import Message from '../models/Message.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/', async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const msg = new Message(req.body);
      await msg.save();
      return res.status(201).json({ success: true });
    } catch (err) {
      return res.status(400).json({ error: 'Failed to save message' });
    }
  }

  // Fallback when DB is not connected — accept request but do not persist
  console.warn('DB not connected — contact message not persisted:', req.body?.email || 'unknown');
  return res.status(201).json({ success: true, persisted: false });
});

export default router;
