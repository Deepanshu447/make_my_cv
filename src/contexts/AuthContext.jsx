import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signUpWithEmail, 
  signInWithEmail, 
  signOutUser, 
  onAuthStateChange,
  updateUserData,
  resetPassword,
  signInWithGoogle,
  signInWithGoogleRedirect,
  handleGoogleRedirectResult
} from '../firebase/auth';
import { trackUserRegistration, trackUserLogin } from '../services/analyticsService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((authData) => {
      if (authData) {
        setUser({
          uid: authData.user.uid,
          email: authData.user.email,
          name: authData.userData?.name || authData.user.displayName || 'User',
          subscription: authData.userData?.subscription || 'free',
          role: authData.userData?.role || 'user',
          ...authData.userData
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmail(email, password);
      if (result.success) {
        // Track successful login
        trackUserLogin('email', email);
      }
      return result; // Return result immediately
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const result = await signUpWithEmail(email, password, { name });
      if (result.success) {
        // Track successful registration
        trackUserRegistration('email', email);
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOutUser();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData) => {
    if (!user?.uid) return { success: false, error: 'No user logged in' };
    
    try {
      const result = await updateUserData(user.uid, userData);
      if (result.success) {
        setUser(prev => ({ ...prev, ...userData }));
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const resetUserPassword = async (email) => {
    try {
      const result = await resetPassword(email);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      return result; // Return result immediately
    } catch (error) {
      // Handle popup-closed-by-user error gracefully
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'popup-closed-by-user' };
      }
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogleRedirect = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogleRedirect();
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleGoogleRedirect = async () => {
    try {
      const result = await handleGoogleRedirectResult();
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    resetPassword: resetUserPassword,
    loginWithGoogle,
    loginWithGoogleRedirect,
    handleGoogleRedirect,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};