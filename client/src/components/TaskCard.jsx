import React from 'react';
import { Calendar, User, Edit2, Trash2, ArrowRight } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onMoveRight }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const isOverdue = (dateStr) => {
    if (!dateStr || task.status === 'done') return false;
    const dueDate = new Date(dateStr);
    const today = new Date();
    // Clear hours for accurate day-only comparison
    dueDate.setHours(23, 59, 59, 999);
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className="glass-panel task-card"
      draggable
      onDragStart={handleDragStart}
      style={{ borderLeft: `4px solid var(--priority-${task.priority})` }}
    >
      <div className="task-card-header">
        <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
        
        <div className="task-actions">
          <button 
            className="card-action-btn" 
            title="Edit Task"
            onClick={() => onEdit(task)}
          >
            <Edit2 size={13} />
          </button>
          <button 
            className="card-action-btn delete" 
            title="Delete Task"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <h4 className="task-card-title">{task.title}</h4>
      {task.description && <p className="task-card-desc">{task.description}</p>}

      <div className="task-card-footer">
        {task.due_date ? (
          <div className={`due-date ${isOverdue(task.due_date) ? 'overdue' : ''}`}>
            <Calendar size={12} />
            <span>{formatDate(task.due_date)}</span>
          </div>
        ) : (
          <div></div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {task.assignee_name && (
            <div className="assignee" title={`Assigned to ${task.assignee_name}`}>
              <div className="assignee-avatar">
                {getInitials(task.assignee_name)}
              </div>
              <span>{task.assignee_name}</span>
            </div>
          )}

          {/* Quick status transition button for mobile/touch screens */}
          {onMoveRight && task.status !== 'done' && (
            <button
              onClick={() => onMoveRight(task)}
              className="card-action-btn"
              title="Move to next status"
              style={{ marginLeft: '4px' }}
            >
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
