import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { signInWithEmail, signUpWithEmail } from '../firebase/auth';

// Mock Firebase auth functions
jest.mock('../firebase/auth', () => ({
  signInWithEmail: jest.fn(),
  signUpWithEmail: jest.fn(),
  signOutUser: jest.fn(),
  onAuthStateChange: jest.fn(() => () => {}),
  updateUserData: jest.fn(),
  resetPassword: jest.fn(),
  signInWithGoogle: jest.fn(),
  signInWithGoogleRedirect: jest.fn(),
  handleGoogleRedirectResult: jest.fn()
}));

// Mock analytics
jest.mock('../services/analyticsService', () => ({
  trackUserRegistration: jest.fn(),
  trackUserLogin: jest.fn()
}));

// Test component that uses AuthContext
const TestComponent = () => {
  const { user, login, register, logout, loading } = useAuth();

  return (
    <div>
      <div data-testid="user">{user ? user.email : 'No user'}</div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not loading'}</div>
      <button onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button onClick={() => register('Test User', 'test@example.com', 'password')}>
        Register
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('provides initial state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading');
  });

  test('handles successful login', async () => {
    signInWithEmail.mockResolvedValue({
      success: true,
      user: { email: 'test@example.com' },
      userData: { email: 'test@example.com', name: 'Test User' }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(signInWithEmail).toHaveBeenCalledWith('test@example.com', 'password');
    });
  });

  test('handles successful registration', async () => {
    signUpWithEmail.mockResolvedValue({
      success: true,
      user: { email: 'test@example.com' }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => {
      expect(signUpWithEmail).toHaveBeenCalledWith(
        'test@example.com',
        'password',
        { name: 'Test User' }
      );
    });
  });

  test('handles login error', async () => {
    signInWithEmail.mockResolvedValue({
      success: false,
      error: 'Invalid credentials'
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(signInWithEmail).toHaveBeenCalledWith('test@example.com', 'password');
    });
  });
});
