import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const { token, user } = useAuth();
  const socket = useSocket();

  const API_URL = 'http://localhost:5000/api/tasks';

  const fetchTasks = async () => {
    if (!token) return;
    setLoadingTasks(true);
    try {
      const res = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchUsersList = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // Fetch tasks and users list when user logs in
  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchUsersList();
    } else {
      setTasks([]);
      setUsersList([]);
    }
  }, [token]);

  // Handle real-time WebSockets synchronization
  useEffect(() => {
    if (!socket) return;

    const handleTaskCreated = (newTask) => {
      setTasks((prev) => {
        // Prevent duplicate if this client already updated it locally
        if (prev.some((t) => t.id === newTask.id)) return prev;
        return [newTask, ...prev];
      });
    };

    const handleTaskUpdated = (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    };

    const handleTaskDeleted = ({ id }) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    socket.on('task:created', handleTaskCreated);
    socket.on('task:updated', handleTaskUpdated);
    socket.on('task:deleted', handleTaskDeleted);

    return () => {
      socket.off('task:created', handleTaskCreated);
      socket.off('task:updated', handleTaskUpdated);
      socket.off('task:deleted', handleTaskDeleted);
    };
  }, [socket]);

  const addTask = async (taskData) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create task');

      // Update local state (WebSocket event is also emitted by server, 
      // but updating locally first gives instant response)
      setTasks((prev) => {
        if (prev.some((t) => t.id === data.id)) return prev;
        return [data, ...prev];
      });
      
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      const res = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update task');

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? data : t))
      );
      
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateTaskStatusOnly = async (taskId, newStatus) => {
    // Optimistic Update for Drag & Drop
    const originalTasks = [...tasks];
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    setTasks(prev =>
      prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
    );

    try {
      const res = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: targetTask.title,
          description: targetTask.description,
          status: newStatus,
          priority: targetTask.priority,
          due_date: targetTask.due_date,
          assigned_to: targetTask.assigned_to
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update status');
      
      // Update with final data from server
      setTasks(prev =>
        prev.map(t => t.id === taskId ? data : t)
      );
    } catch (err) {
      console.error(err);
      // Rollback on failure
      setTasks(originalTasks);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const res = await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete task');

      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      usersList,
      loadingTasks,
      fetchTasks,
      addTask,
      updateTask,
      updateTaskStatusOnly,
      deleteTask
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
