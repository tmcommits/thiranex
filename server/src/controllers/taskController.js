import { dbRun, dbGet, dbAll } from '../config/db.js';

// Helper to fetch a task with details (creator/assignee name)
const fetchTaskWithDetails = async (taskId) => {
  return await dbGet(`
    SELECT t.*, 
           u1.username as creator_name, 
           u2.username as assignee_name
    FROM tasks t
    LEFT JOIN users u1 ON t.created_by = u1.id
    LEFT JOIN users u2 ON t.assigned_to = u2.id
    WHERE t.id = ?
  `, [taskId]);
};

// GET /api/tasks - Get all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await dbAll(`
      SELECT t.*, 
             u1.username as creator_name, 
             u2.username as assignee_name
      FROM tasks t
      LEFT JOIN users u1 ON t.created_by = u1.id
      LEFT JOIN users u2 ON t.assigned_to = u2.id
      ORDER BY t.created_at DESC
    `);
    res.json(tasks);
  } catch (err) {
    console.error('Get tasks error:', err.message);
    res.status(500).json({ message: 'Server error retrieving tasks' });
  }
};

// POST /api/tasks - Create task
export const createTask = async (req, res) => {
  const { title, description, status, priority, due_date, assigned_to } = req.body;
  const created_by = req.user.id;

  if (!title) {
    return res.status(400).json({ message: 'Task title is required' });
  }

  try {
    const result = await dbRun(`
      INSERT INTO tasks (title, description, status, priority, due_date, assigned_to, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      title,
      description || '',
      status || 'todo',
      priority || 'medium',
      due_date || null,
      assigned_to || null,
      created_by
    ]);

    const newTask = await fetchTaskWithDetails(result.id);

    // Broadcast change via Socket.io
    if (req.io) {
      req.io.emit('task:created', newTask);
    }

    res.status(201).json(newTask);
  } catch (err) {
    console.error('Create task error:', err.message);
    res.status(500).json({ message: 'Server error creating task' });
  }
};

// PUT /api/tasks/:id - Update task
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, due_date, assigned_to } = req.body;

  try {
    // Check if task exists
    const task = await dbGet('SELECT id FROM tasks WHERE id = ?', [id]);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update the task (we can use COALESCE to keep existing values if they are undefined in req.body, but simple query is fine)
    await dbRun(`
      UPDATE tasks 
      SET title = ?, 
          description = ?, 
          status = ?, 
          priority = ?, 
          due_date = ?, 
          assigned_to = ?, 
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      title,
      description,
      status,
      priority,
      due_date || null,
      assigned_to || null,
      id
    ]);

    const updatedTask = await fetchTaskWithDetails(id);

    // Broadcast change via Socket.io
    if (req.io) {
      req.io.emit('task:updated', updatedTask);
    }

    res.json(updatedTask);
  } catch (err) {
    console.error('Update task error:', err.message);
    res.status(500).json({ message: 'Server error updating task' });
  }
};

// DELETE /api/tasks/:id - Delete task
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await dbGet('SELECT id FROM tasks WHERE id = ?', [id]);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await dbRun('DELETE FROM tasks WHERE id = ?', [id]);

    // Broadcast change via Socket.io
    if (req.io) {
      req.io.emit('task:deleted', { id: parseInt(id) });
    }

    res.json({ message: 'Task deleted successfully', id: parseInt(id) });
  } catch (err) {
    console.error('Delete task error:', err.message);
    res.status(500).json({ message: 'Server error deleting task' });
  }
};

// GET /api/users - Get all users (for assignment lists)
export const getUsers = async (req, res) => {
  try {
    const users = await dbAll('SELECT id, username, email FROM users ORDER BY username ASC');
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err.message);
    res.status(500).json({ message: 'Server error retrieving users' });
  }
};
