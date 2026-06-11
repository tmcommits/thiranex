import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { X, Save } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, taskToEdit }) => {
  const { addTask, updateTask, usersList } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status || 'todo');
      setPriority(taskToEdit.priority || 'medium');
      setDueDate(taskToEdit.due_date || '');
      setAssignedTo(taskToEdit.assigned_to || '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setDueDate('');
      setAssignedTo('');
    }
    setError('');
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    setSubmitting(true);

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      due_date: dueDate || null,
      assigned_to: assignedTo ? parseInt(assignedTo) : null
    };

    try {
      if (taskToEdit) {
        await updateTask(taskToEdit.id, taskData);
      } else {
        await addTask(taskData);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong saving the task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">{taskToEdit ? 'Edit Task' : 'Create Task'}</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="task-title">Task Title *</label>
            <input
              id="task-title"
              type="text"
              className="form-control"
              placeholder="e.g., Implement login form"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              className="form-control"
              placeholder="Describe the task instructions or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-status">Status</label>
              <select
                id="task-status"
                className="filter-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={submitting}
                style={{ width: '100%', height: '42px' }}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                className="filter-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={submitting}
                style={{ width: '100%', height: '42px' }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-due">Due Date</label>
              <input
                id="task-due"
                type="date"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={submitting}
                style={{ height: '42px' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="task-assignee">Assignee</label>
              <select
                id="task-assignee"
                className="filter-select"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                disabled={submitting}
                style={{ width: '100%', height: '42px' }}
              >
                <option value="">Unassigned</option>
                {usersList.map((usr) => (
                  <option key={usr.id} value={usr.id}>
                    {usr.username}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="secondary-btn" 
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="primary-btn"
              disabled={submitting}
            >
              <Save size={16} />
              <span>{submitting ? 'Saving...' : 'Save Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
