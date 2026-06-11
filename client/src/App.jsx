import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { TaskProvider } from './context/TaskContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { Loader2 } from 'lucide-react';
import './App.css';

const MainApp = () => {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          gap: '1rem',
          background: '#070913',
          color: 'white'
        }}
      >
        <Loader2 className="animate-spin" size={36} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
        <p style={{ fontSize: '0.9rem', color: '#9CA3AF', letterSpacing: '0.5px' }}>Loading Workspace...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  return <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <TaskProvider>
          <MainApp />
        </TaskProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
