const sampleProjects = [
  {
    _id: 'sample1',
    title: 'Portfolio Website',
    description: 'A personal portfolio built with React and Express',
    longDescription: 'Full-stack portfolio demonstrating projects and contact form.',
    techStack: ['React', 'Vite', 'Node.js', 'Express', 'MongoDB'],
    liveUrl: '',
    githubUrl: '',
    imageUrl: '',
    featured: true,
    order: 1,
    createdAt: new Date()
  },
  {
    _id: 'sample2',
    title: 'Task Manager API',
    description: 'REST API for managing tasks',
    techStack: ['Node.js', 'Express', 'MongoDB'],
    order: 2,
    createdAt: new Date()
  },
  {
    _id: 'sample3',
    title: 'Chat App (Demo)',
    description: 'Realtime chat demo using WebSockets',
    techStack: ['Socket.IO', 'Node.js', 'React'],
    order: 3,
    createdAt: new Date()
  },
  {
    _id: 'sample4',
    title: 'Design System',
    description: 'Reusable UI components and tokens',
    techStack: ['React', 'CSS'],
    order: 4,
    createdAt: new Date()
  }
];

export default sampleProjects;
