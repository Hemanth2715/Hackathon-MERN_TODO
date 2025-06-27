/* eslint-disable react/prop-types */
//App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {  Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import LoadingSpinner from './components/LoadingSpinner';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/TasksPage';
import CreateTaskPage from './pages/CreateTaskPage';
import ProfilePage from './pages/ProfilePage';

// Layout wrapper component
const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {user && <Navbar />}
      <main className={user ? 'pt-16' : ''}>
        {children}
      </main>
    </div>
  );
};

// App content component
const AppContent = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            user ? <Navigate to="/dashboard" replace /> : <LoginPage />
          }
        />
        <Route
          path="/register"
          element={
            user ? <Navigate to="/dashboard" replace /> : <RegisterPage />
          }
        />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/tasks" element={
          <ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
        } />

        <Route path="/tasks/new" element={
          <ProtectedRoute>
            <CreateTaskPage />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />

        {/* Default redirects */}
        <Route
          path="/"
          element={
            <Navigate to={user ? "/dashboard" : "/login"} replace />
          }
        />

        {/* 404 page */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
              <p className="text-gray-600 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
              <Navigate to={user ? "/dashboard" : "/login"} replace />
            </div>
          </div>
        } />
      </Routes>
    </Layout>
  );
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <Toaster
          position="top-center"
          reverseOrder={false}
        />      </Router>
    </AuthProvider>
  );
}

export default App;
