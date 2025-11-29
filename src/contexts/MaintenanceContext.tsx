import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';

interface MaintenanceContextType {
  isMaintenanceMode: boolean;
  maintenanceMessage: string;
  loading: boolean;
  setMaintenanceMode: (enabled: boolean, message?: string) => Promise<void>;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error('useMaintenance must be used within MaintenanceProvider');
  }
  return context;
};

interface MaintenanceProviderProps {
  children: ReactNode;
}

export const MaintenanceProvider = ({ children }: MaintenanceProviderProps) => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      console.warn('Firebase not configured, maintenance mode disabled');
      setLoading(false);
      return;
    }

    // Listen to settings/site document for maintenance mode
    const settingsRef = doc(db, 'settings', 'site');
    
    const unsubscribe = onSnapshot(
      settingsRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setIsMaintenanceMode(data.maintenanceMode || false);
          setMaintenanceMessage(data.maintenanceMessage || '');
        } else {
          // Document doesn't exist, maintenance mode is off
          setIsMaintenanceMode(false);
          setMaintenanceMessage('');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to maintenance status:', error);
        setIsMaintenanceMode(false);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const setMaintenanceMode = async (enabled: boolean, message?: string) => {
    if (!isFirebaseConfigured) {
      console.error('Firebase not configured');
      return;
    }

    try {
      const settingsRef = doc(db, 'settings', 'site');
      await setDoc(settingsRef, {
        maintenanceMode: enabled,
        maintenanceMessage: message || '',
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating maintenance mode:', error);
      throw error;
    }
  };

  return (
    <MaintenanceContext.Provider value={{
      isMaintenanceMode,
      maintenanceMessage,
      loading,
      setMaintenanceMode
    }}>
      {children}
    </MaintenanceContext.Provider>
  );
};
