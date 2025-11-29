import { 
  collection, 
  addDoc, 
  getDocs, 
  Timestamp, 
  query, 
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submittedAt: Timestamp;
  status: 'new' | 'read' | 'resolved';
}

const CONTACTS_COLLECTION = 'contact_submissions';

export const submitContact = async (data: Omit<ContactSubmission, 'submittedAt' | 'status' | 'id'>) => {
  try {
    const contactData: Omit<ContactSubmission, 'id'> = {
      ...data,
      status: 'new',
      submittedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, CONTACTS_COLLECTION), contactData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error submitting contact:', error);
    throw error;
  }
};

export const getAllContacts = async () => {
  try {
    const q = query(collection(db, CONTACTS_COLLECTION), orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ContactSubmission[];
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};

// Real-time listener for contacts
export const onContactsChange = (
  callback: (contacts: ContactSubmission[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, CONTACTS_COLLECTION),
    orderBy('submittedAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const contacts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ContactSubmission[];
    callback(contacts);
  }, (error) => {
    console.error('Error in contacts listener:', error);
  });
};

// Update contact status
export const updateContactStatus = async (
  contactId: string, 
  status: 'new' | 'read' | 'resolved'
) => {
  try {
    const docRef = doc(db, CONTACTS_COLLECTION, contactId);
    await updateDoc(docRef, { 
      status,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating contact status:', error);
    throw error;
  }
};
