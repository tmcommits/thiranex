import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  longDescription: String,
  techStack: [String],
  liveUrl: String,
  githubUrl: String,
  imageUrl: String,
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Project', ProjectSchema);
