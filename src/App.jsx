import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CVProvider } from './contexts/CVContext';
import Navbar from './components/Navbar';
import OfflineIndicator from './components/OfflineIndicator';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CVForm from './pages/CVForm';
import TemplateSelection from './pages/TemplateSelection';
import CVPreview from './pages/CVPreview';
import Subscription from './pages/Subscription';
import AdminPanel from './pages/AdminPanel';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Admin Route component
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CVProvider>
          <Router>
            <div className="App">
              <Navbar />
              <OfflineIndicator />
              <main className="main-content">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/cv-form" 
                    element={
                      <ProtectedRoute>
                        <CVForm />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/templates" 
                    element={
                      <ProtectedRoute>
                        <TemplateSelection />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/preview" 
                    element={
                      <ProtectedRoute>
                        <CVPreview />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/subscription" 
                    element={
                      <ProtectedRoute>
                        <Subscription />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin" 
                    element={
                      <AdminRoute>
                        <AdminPanel />
                      </AdminRoute>
                    } 
                  />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
              </main>
            </div>
          </Router>
        </CVProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
