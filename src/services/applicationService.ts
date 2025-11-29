import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  Timestamp, 
  onSnapshot,
  doc,
  updateDoc,
  orderBy,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ApplicationData {
  id?: string;
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  
  // Loan Details
  loanProduct: string;
  loanAmount: string;
  loanTenure: string;
  
  // Employment & Income
  employmentType: string;
  monthlyIncome: string;
  companyName?: string;
  
  // Metadata
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Timestamp;
  userId?: string;
}

const APPLICATIONS_COLLECTION = 'loan_applications';

export const submitApplication = async (data: Omit<ApplicationData, 'status' | 'submittedAt' | 'id'>) => {
  try {
    const applicationData: Omit<ApplicationData, 'id'> = {
      ...data,
      status: 'pending',
      submittedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, APPLICATIONS_COLLECTION), applicationData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
};

export const getApplicationsByUser = async (userId: string) => {
  try {
    const q = query(
      collection(db, APPLICATIONS_COLLECTION),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ApplicationData[];
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

export const getAllApplications = async () => {
  try {
    const q = query(
      collection(db, APPLICATIONS_COLLECTION),
      orderBy('submittedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ApplicationData[];
  } catch (error) {
    console.error('Error fetching all applications:', error);
    throw error;
  }
};

// Real-time listener for applications
export const onApplicationsChange = (
  callback: (applications: ApplicationData[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, APPLICATIONS_COLLECTION),
    orderBy('submittedAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const applications = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ApplicationData[];
    callback(applications);
  }, (error) => {
    console.error('Error in applications listener:', error);
  });
};

// Update application status
export const updateApplicationStatus = async (
  applicationId: string, 
  status: 'pending' | 'approved' | 'rejected'
) => {
  try {
    const docRef = doc(db, APPLICATIONS_COLLECTION, applicationId);
    await updateDoc(docRef, { 
      status,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};
