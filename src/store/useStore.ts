import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export type UserRole = 'citizen' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type ReportStatus = 'pending' | 'in-progress' | 'resolved';
export type ReportCategory = 'infrastructure' | 'environment' | 'safety' | 'other';

export interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  citizenId: string;
  citizenName: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface AppState {
  user: User | null;
  reports: Report[];
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  addReport: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateReportStatus: (reportId: string, status: ReportStatus) => Promise<void>;
  initializeAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Convert Firestore timestamp to Date
const timestampToDate = (timestamp: Timestamp) => timestamp.toDate();

// Convert Date to Firestore timestamp
const dateToTimestamp = (date: Date) => Timestamp.fromDate(date);

export const useStore = create<AppState>((set, get) => ({
  user: null,
  reports: [],
  loading: true,
  error: null,

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),

  initializeAuth: () => {
    set({ loading: true });
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user role from Firestore
        const userDoc = await getDocs(query(
          collection(db, 'users'),
          where('uid', '==', firebaseUser.uid)
        ));

        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          const user: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || userData.name,
            email: firebaseUser.email!,
            role: userData.role
          };
          set({ user, loading: false });
        } else {
          set({ user: null, loading: false });
        }
      } else {
        set({ user: null, loading: false });
      }
    });
  },

  login: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  register: async (name: string, email: string, password: string, role: UserRole) => {
    try {
      set({ loading: true, error: null });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update display name
      await updateProfile(userCredential.user, { displayName: name });

      // Save user role to Firestore
      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        name,
        email,
        role,
        createdAt: dateToTimestamp(new Date())
      });

      return true;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, reports: [] });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  addReport: async (reportData) => {
    try {
      set({ error: null });
      const user = get().user;
      if (!user) throw new Error('User not authenticated');

      const docRef = await addDoc(collection(db, 'reports'), {
        ...reportData,
        createdAt: dateToTimestamp(new Date()),
        updatedAt: dateToTimestamp(new Date())
      });

      // Add to local state immediately for optimistic updates
      const newReport: Report = {
        ...reportData,
        id: docRef.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      set((state) => ({ reports: [...state.reports, newReport] }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  updateReportStatus: async (reportId: string, status: ReportStatus) => {
    try {
      set({ error: null });
      await updateDoc(doc(db, 'reports', reportId), {
        status,
        updatedAt: dateToTimestamp(new Date())
      });

      // Update local state
      set((state) => ({
        reports: state.reports.map((report) =>
          report.id === reportId
            ? { ...report, status, updatedAt: new Date() }
            : report
        )
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  }
}));

// Initialize auth listener and reports subscription
const store = useStore.getState();
store.initializeAuth();

// Subscribe to reports collection
onSnapshot(
  query(collection(db, 'reports'), orderBy('createdAt', 'desc')),
  (snapshot) => {
    const reports: Report[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: timestampToDate(doc.data().createdAt),
      updatedAt: timestampToDate(doc.data().updatedAt)
    })) as Report[];

    useStore.setState({ reports });
  },
  (error) => {
    console.error('Error listening to reports:', error);
    useStore.setState({ error: error.message });
  }
);
