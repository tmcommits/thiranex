import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Project from './models/Project.js';

dotenv.config();

const samples = [
  {
    title: 'Portfolio Website',
    description: 'A personal portfolio built with React and Express',
    longDescription: 'Full-stack portfolio demonstrating projects and contact form.',
    techStack: ['React', 'Vite', 'Node.js', 'Express', 'MongoDB'],
    liveUrl: '',
    githubUrl: '',
    imageUrl: '',
    featured: true,
    order: 1
  },
  {
    title: 'Task Manager API',
    description: 'REST API for managing tasks',
    techStack: ['Node.js', 'Express', 'MongoDB'],
    order: 2
  },
  {
    title: 'Chat App (Demo)',
    description: 'Realtime chat demo using WebSockets',
    techStack: ['Socket.IO', 'Node.js', 'React'],
    order: 3
  },
  {
    title: 'Design System',
    description: 'Reusable UI components and tokens',
    techStack: ['React', 'CSS'],
    order: 4
  }
];

const run = async () => {
  await connectDB();
  try {
    await Project.deleteMany({});
    await Project.insertMany(samples);
    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
