import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  googleProvider,
  ADMIN_EMAIL,
  isFirebaseConfigured,
  testFirebaseConnection,
} from '../lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from 'firebase/auth';

export { ADMIN_EMAIL };

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  loading: boolean;
  isAdmin: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  clearError: () => void;
  isFirebaseConnected: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(isFirebaseConfigured);

  useEffect(() => {
    // Test initial connection probe
    testFirebaseConnection().then((res) => {
      setIsFirebaseConnected(res.connected);
    });

    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const userEmail = fbUser.email?.toLowerCase();
        if (userEmail === ADMIN_EMAIL.toLowerCase()) {
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
          });
          setError(null);
        } else {
          // Immediately sign out unauthorized users
          firebaseSignOut(auth);
          setUser(null);
          setError(`Unauthorized access attempt from ${userEmail}. Only ${ADMIN_EMAIL} is authorized.`);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setError(null);

    if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      const msg = `Unauthorized email address. Only ${ADMIN_EMAIL} can access the administrative dashboard.`;
      setError(msg);
      return { success: false, error: msg };
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (cred.user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        await firebaseSignOut(auth);
        const msg = `Unauthorized account. Access is reserved strictly for ${ADMIN_EMAIL}.`;
        setError(msg);
        return { success: false, error: msg };
      }

      setUser({
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
        photoURL: cred.user.photoURL,
      });
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      // Format friendly Firebase errors
      let friendlyMsg = msg;
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password')) {
        friendlyMsg = 'Invalid administrator password. If you have not created an email/password account yet in Firebase Console, use "Sign In with Google" or create the password in Firebase Auth.';
      } else if (msg.includes('auth/user-not-found')) {
        friendlyMsg = 'User not found in Firebase. Please sign in with Google or add this email in Firebase Console.';
      }
      setError(friendlyMsg);
      return { success: false, error: friendlyMsg };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = result.user.email?.toLowerCase();

      if (userEmail !== ADMIN_EMAIL.toLowerCase()) {
        await firebaseSignOut(auth);
        const msg = `Access Denied: Google account (${userEmail || 'unknown'}) is not authorized. Only ${ADMIN_EMAIL} is permitted.`;
        setError(msg);
        return { success: false, error: msg };
      }

      setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      });
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in was cancelled or encountered an error';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('Signout warning:', err);
    }
    setUser(null);
  };

  const clearError = () => setError(null);

  const isAdmin = Boolean(user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        error,
        login,
        loginWithGoogle,
        logout,
        clearError,
        isFirebaseConnected,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
