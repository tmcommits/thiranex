import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import { 
  Plus, LogOut, CheckCircle2, ListTodo, 
  Hourglass, BarChart2, Search, Filter, ShieldAlert 
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { tasks, deleteTask, updateTaskStatusOnly } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Stats calculation
  const totalTasks = tasks.length;
  const todoCount = tasks.filter((t) => t.status === 'todo').length;
  const progressCount = tasks.filter((t) => t.status === 'in_progress' || t.status === 'review').length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
      } catch (err) {
        alert('Failed to delete task: ' + err.message);
      }
    }
  };

  // Drag and Drop Status Change
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    const taskIdStr = e.dataTransfer.getData('text/plain');
    if (!taskIdStr) return;
    const taskId = parseInt(taskIdStr);
    
    await updateTaskStatusOnly(taskId, targetStatus);
  };

  // Quick move to next status for mobile/touch users
  const handleMoveRight = async (task) => {
    const statusOrder = ['todo', 'in_progress', 'review', 'done'];
    const currentIndex = statusOrder.indexOf(task.status);
    if (currentIndex !== -1 && currentIndex < statusOrder.length - 1) {
      const nextStatus = statusOrder[currentIndex + 1];
      await updateTaskStatusOnly(task.id, nextStatus);
    }
  };

  // Filter and search logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    let matchesAssignee = true;
    if (assigneeFilter === 'me') {
      matchesAssignee = task.assigned_to === user.id;
    } else if (assigneeFilter === 'unassigned') {
      matchesAssignee = !task.assigned_to;
    } else if (assigneeFilter !== 'all') {
      matchesAssignee = task.assigned_to === parseInt(assigneeFilter);
    }

    return matchesSearch && matchesPriority && matchesAssignee;
  });

  const columns = [
    { id: 'todo', title: 'To Do', icon: <ListTodo size={18} className="todo" />, colorClass: 'todo' },
    { id: 'in_progress', title: 'In Progress', icon: <Hourglass size={18} className="inprogress" />, colorClass: 'inprogress' },
    { id: 'review', title: 'In Review', icon: <ShieldAlert size={18} className="review" />, colorClass: 'review' },
    { id: 'done', title: 'Done', icon: <CheckCircle2 size={18} className="done" />, colorClass: 'done' }
  ];

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-container">
          <span>Thiranex</span>
        </div>
        <div className="nav-actions">
          <div className="user-badge">
            <div className="user-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span>{user.username}</span>
          </div>
          <button className="logout-btn" onClick={logout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Banner */}
        <div className="header-banner">
          <div className="banner-title">
            <h1>Workspace Dashboard</h1>
            <p>Track progress, manage sprints, and collaborate in real-time.</p>
          </div>
          <button className="primary-btn" onClick={handleOpenCreateModal}>
            <Plus size={18} />
            <span>Create Task</span>
          </button>
        </div>

        {/* Stats Panels */}
        <section className="stats-grid">
          <div className="glass-panel stat-card">
            <div className="stat-icon" style={{ background: 'rgba(124, 58, 237, 0.15)', color: 'var(--primary)' }}>
              <BarChart2 size={24} />
            </div>
            <div className="stat-info">
              <h3>{totalTasks}</h3>
              <p>Total Tasks</p>
            </div>
          </div>

          <div className="glass-panel stat-card">
            <div className="stat-icon" style={{ background: 'rgba(96, 165, 250, 0.15)', color: 'var(--status-todo)' }}>
              <ListTodo size={24} />
            </div>
            <div className="stat-info">
              <h3>{todoCount}</h3>
              <p>To Do</p>
            </div>
          </div>

          <div className="glass-panel stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--status-inprogress)' }}>
              <Hourglass size={24} />
            </div>
            <div className="stat-info">
              <h3>{progressCount}</h3>
              <p>In Work</p>
            </div>
          </div>

          <div className="glass-panel stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--status-done)' }}>
              <CheckCircle2 size={24} />
            </div>
            <div className="stat-info">
              <h3>{doneCount}</h3>
              <p>Completed</p>
            </div>
          </div>
        </section>

        {/* Filter Toolbar */}
        <section className="filter-bar">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search title, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filters-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <Filter size={14} />
              <span>Filter:</span>
            </div>

            <select
              className="filter-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">Priority: All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              className="filter-select"
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
            >
              <option value="all">Assignee: All</option>
              <option value="me">Assigned to Me</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>
        </section>

        {/* Kanban Board Grid */}
        <section className="board-grid">
          {columns.map((col) => {
            const columnTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="board-column"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                <div className={`column-header ${col.colorClass}`}>
                  <div className="column-title-wrapper">
                    {col.icon}
                    <span className="column-title">{col.title}</span>
                  </div>
                  <span className="task-count">{columnTasks.length}</span>
                </div>

                <div className="tasks-container">
                  {columnTasks.length > 0 ? (
                    columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleOpenEditModal}
                        onDelete={handleDeleteTask}
                        onMoveRight={handleMoveRight}
                      />
                    ))
                  ) : (
                    <div className="empty-state">
                      <ListTodo size={28} />
                      <p style={{ fontSize: '0.8rem' }}>No tasks here</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        taskToEdit={editingTask}
      />
    </div>
  );
};

export default Dashboard;
