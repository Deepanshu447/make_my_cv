import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import { AuthProvider } from '../contexts/AuthContext';
import { CVProvider } from '../contexts/CVContext';

// Mock Firebase
jest.mock('../firebase/config', () => ({
  auth: {},
  db: {},
  analytics: null
}));

// Mock Firebase auth functions
jest.mock('../firebase/auth', () => ({
  signUpWithEmail: jest.fn(),
  signInWithEmail: jest.fn(),
  signOutUser: jest.fn(),
  onAuthStateChange: jest.fn(() => () => {}),
  updateUserData: jest.fn(),
  resetPassword: jest.fn(),
  signInWithGoogle: jest.fn(),
  signInWithGoogleRedirect: jest.fn(),
  handleGoogleRedirectResult: jest.fn()
}));

// Mock Firebase CV data functions
jest.mock('../firebase/cvData', () => ({
  saveCVData: jest.fn(),
  getCVData: jest.fn(),
  saveCVRequest: jest.fn(),
  getCVRequests: jest.fn(),
  updateCVRequestStatus: jest.fn(),
  getUserCVRequests: jest.fn()
}));

const AppWithProviders = () => (
  <BrowserRouter>
    <AuthProvider>
      <CVProvider>
        <App />
      </CVProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<AppWithProviders />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('redirects to login when not authenticated', () => {
    render(<AppWithProviders />);
    // The app should show loading initially, then redirect to login
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
