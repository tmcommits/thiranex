import express from 'express';
import { getTasks, createTask, updateTask, deleteTask, getUsers } from '../controllers/taskController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// All task routes require authentication
router.use(authMiddleware);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.get('/users', getUsers);

export default router;
