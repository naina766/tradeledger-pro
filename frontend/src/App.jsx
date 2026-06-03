import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Trades from './pages/Trades';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

// Shimmer Loader for Route Transitions
const RouteSpinner = () => (
  <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center flex-col gap-4">
    <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
    <span className="text-sm text-slate-500 font-semibold">Loading session security...</span>
  </div>
);

// Protected routes for general logged-in user
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <RouteSpinner />;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin only route protector
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <RouteSpinner />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Redirect logged in users away from login/signup
const AuthRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <RouteSpinner />;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public marketing route */}
          <Route path="/" element={<Landing />} />

          {/* Authentication gates */}
          <Route 
            path="/login" 
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <AuthRoute>
                <Register />
              </AuthRoute>
            } 
          />

          {/* User Protected Dashboard Area */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/trades" 
            element={
              <PrivateRoute>
                <Trades />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />

          {/* Admin Protected Dashboard Area */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />

          {/* Fallback Catch-all redirect to Landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Dynamic Global Toast Popups Configuration */}
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f172a',
              color: '#fff',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '12px 16px',
              fontWeight: 500,
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }} 
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
