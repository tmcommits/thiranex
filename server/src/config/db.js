import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('MONGO_URI not provided — running without MongoDB.');
    return;
  }

  // Basic validation: require proper mongodb scheme, otherwise skip connecting
  if (!(uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'))) {
    console.warn('MONGO_URI appears invalid — skipping DB connection.');
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.warn('Continuing without DB connection — routes will use fallback data.');
  }
};

export default connectDB;
