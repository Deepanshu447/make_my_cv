import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Sign up with email and password
export const signUpWithEmail = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, {
      displayName: userData.name
    });

    // Save additional user data to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      name: userData.name,
      subscription: 'free',
      createdAt: new Date().toISOString(),
      ...userData
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign in with email and password (optimized for speed)
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Return immediately with basic user data (fast)
    const basicUserData = {
      uid: user.uid,
      email: user.email,
      name: user.displayName || 'User',
      subscription: 'free',
      provider: 'email'
    };

    return { success: true, user, userData: basicUserData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign in with Google (Popup method - optimized for speed)
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Return immediately with basic user data (fast)
    const basicUserData = {
      uid: user.uid,
      email: user.email,
      name: user.displayName || 'User',
      photoURL: user.photoURL,
      subscription: 'free',
      provider: 'google'
    };
    
    // Create user document in Firestore in background (non-blocking)
    setDoc(doc(db, 'users', user.uid), {
      ...basicUserData,
      createdAt: new Date().toISOString()
    }, { merge: true }).catch(error => {
      console.warn('Background user creation failed:', error.message);
    });
    
    return { success: true, user, userData: basicUserData };
  } catch (error) {
    // Handle popup-closed-by-user error specifically
    if (error.code === 'auth/popup-closed-by-user') {
      throw error; // Re-throw to be handled by AuthContext
    }
    return { success: false, error: error.message };
  }
};

// Sign in with Google (Redirect method - for mobile)
export const signInWithGoogleRedirect = async () => {
  try {
    await signInWithRedirect(auth, googleProvider);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Handle Google sign-in redirect result
export const handleGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      
      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user document for first-time Google sign-in
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
          provider: 'google',
          subscription: 'free',
          createdAt: new Date().toISOString()
        });
      }
      
      return { success: true, user };
    }
    return { success: false, error: 'No redirect result' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Listen to auth state changes (optimized for speed)
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Provide immediate user data from Firebase Auth (fast)
      const immediateUserData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || 'User',
        subscription: 'free', // Default, will be updated if needed
        provider: user.providerData[0]?.providerId || 'email',
        photoURL: user.photoURL || null
      };
      
      // Call callback immediately with basic user data
      callback({ user, userData: immediateUserData });
      
      // Optionally fetch additional data from Firestore in background (non-blocking)
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const firestoreUserData = userDoc.data();
          // Update with Firestore data if different
          if (firestoreUserData.subscription !== immediateUserData.subscription ||
              firestoreUserData.name !== immediateUserData.name) {
            const updatedUserData = {
              ...immediateUserData,
              ...firestoreUserData
            };
            callback({ user, userData: updatedUserData });
          }
        }
      } catch (error) {
        // Silently handle Firestore errors - user is already signed in
        console.warn('Background Firestore fetch failed:', error.message);
      }
    } else {
      callback(null);
    }
  });
};

// Update user data in Firestore
export const updateUserData = async (uid, userData) => {
  try {
    await setDoc(doc(db, 'users', uid), userData, { merge: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
