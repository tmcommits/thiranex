import express from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project.js';
import sampleProjects from '../data/sampleProjects.js';

const router = express.Router();

router.get('/', async (req, res) => {
  // If mongoose is connected, use DB; otherwise fallback to sample data
  if (mongoose.connection.readyState === 1) {
    try {
      const projects = await Project.find().sort({ order: 1 });
      return res.json(projects);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch projects from DB' });
    }
  }

  // fallback
  return res.json(sampleProjects.sort((a, b) => (a.order || 0) - (b.order || 0)));
});

router.post('/', async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const project = new Project(req.body);
      await project.save();
      return res.status(201).json(project);
    } catch (err) {
      return res.status(400).json({ error: 'Failed to create project' });
    }
  }

  // When no DB, echo back the posted project with a fake id
  const fallback = { ...req.body, _id: `local_${Date.now()}`, createdAt: new Date() };
  return res.status(201).json(fallback);
});

export default router;
