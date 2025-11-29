import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface Notification {
  id: string;
  type: 'application' | 'contact';
  title: string;
  message: string;
  timestamp: Date;
}

interface NotificationContextType {
  newApplicationsCount: number;
  newContactsCount: number;
  totalCount: number;
  recentNotifications: Notification[];
  loading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const { user, isAdmin } = useAuth();
  const [newApplicationsCount, setNewApplicationsCount] = useState(0);
  const [newContactsCount, setNewContactsCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only set up listeners if user is authenticated admin and Firebase is configured
    if (!isFirebaseConfigured || !user || !isAdmin) {
      setLoading(false);
      return;
    }

    // Listen to pending loan applications
    const applicationsQuery = query(
      collection(db, 'loan_applications'),
      where('status', '==', 'pending'),
      orderBy('submittedAt', 'desc'),
      limit(10)
    );

    const unsubApps = onSnapshot(
      applicationsQuery,
      (snapshot) => {
        setNewApplicationsCount(snapshot.size);
        
        const appNotifications: Notification[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            type: 'application' as const,
            title: 'New Loan Application',
            message: `${data.fullName || 'Someone'} applied for ${data.loanType || 'a loan'}`,
            timestamp: data.submittedAt?.toDate() || new Date()
          };
        });
        
        setRecentNotifications(prev => {
          const contacts = prev.filter(n => n.type === 'contact');
          return [...appNotifications, ...contacts]
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 10);
        });
        
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to applications:', error);
        setLoading(false);
      }
    );

    // Listen to new contact submissions
    const contactsQuery = query(
      collection(db, 'contact_submissions'),
      where('status', '==', 'new'),
      orderBy('submittedAt', 'desc'),
      limit(10)
    );

    const unsubContacts = onSnapshot(
      contactsQuery,
      (snapshot) => {
        setNewContactsCount(snapshot.size);
        
        const contactNotifications: Notification[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            type: 'contact' as const,
            title: 'New Contact Message',
            message: `${data.name || 'Someone'}: ${data.subject || 'New message'}`,
            timestamp: data.submittedAt?.toDate() || new Date()
          };
        });
        
        setRecentNotifications(prev => {
          const apps = prev.filter(n => n.type === 'application');
          return [...apps, ...contactNotifications]
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, 10);
        });
      },
      (error) => {
        console.error('Error listening to contacts:', error);
      }
    );

    return () => {
      unsubApps();
      unsubContacts();
    };
  }, [user, isAdmin]);

  return (
    <NotificationContext.Provider value={{
      newApplicationsCount,
      newContactsCount,
      totalCount: newApplicationsCount + newContactsCount,
      recentNotifications,
      loading
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
