import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  adminName: string;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Function to check if email exists in admins collection - called AFTER user is authenticated
const getAdminData = async (email: string): Promise<{ isAdmin: boolean; name: string }> => {
  try {
    if (!isFirebaseConfigured) {
      console.error('Firebase is not configured');
      return { isAdmin: false, name: '' };
    }
    
    const adminDocRef = doc(db, 'admins', email.toLowerCase());
    const adminDoc = await getDoc(adminDocRef);
    
    if (adminDoc.exists()) {
      const data = adminDoc.data();
      if (data?.role === 'admin') {
        return { 
          isAdmin: true, 
          name: data?.name || email.split('@')[0]
        };
      }
    }
    return { isAdmin: false, name: '' };
  } catch (error: any) {
    console.error('Error checking admin status:', error?.code || error?.message || error);
    return { isAdmin: false, name: '' };
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Auth state changed:', currentUser?.email || 'No user');
      setUser(currentUser);
      
      if (currentUser && currentUser.email) {
        // User is authenticated - NOW we can check Firestore
        console.log('Checking admin status for:', currentUser.email);
        const adminData = await getAdminData(currentUser.email);
        console.log('Admin data result:', adminData);
        setIsAdmin(adminData.isAdmin);
        setAdminName(adminData.name);
      } else {
        setIsAdmin(false);
        setAdminName('');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    // This triggers onAuthStateChanged which then checks admin status
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setIsAdmin(false);
    setAdminName('');
  };

  const value = {
    user,
    isAdmin,
    adminName,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
