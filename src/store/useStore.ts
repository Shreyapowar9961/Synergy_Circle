import { create } from 'zustand';

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
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  addReport: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateReportStatus: (reportId: string, status: ReportStatus) => void;
}

// Mock data
const mockReports: Report[] = [
 
];

export const useStore = create<AppState>((set) => ({
  user: null,
  reports: mockReports,
  
  login: (email: string, password: string) => {
    // Mock authentication
    if (email === 'admin@gmail.com' && password === 'adm12') {
      set({ 
        user: { 
          id: 'admin1', 
          name: 'Admin User', 
          email, 
          role: 'admin' 
        } 
      });
      return true;
    } else if (email === 'citizen@gmail.com' && password === 'cit12') {
      set({ 
        user: { 
          id: 'user1', 
          name: 'Citizen', 
          email, 
          role: 'citizen' 
        } 
      });
      return true;
    }
    return false;
  },
  
  register: (name: string, email: string, password: string, role: UserRole) => {
    // Mock registration
    const newUser: User = {
      id: `user${Date.now()}`,
      name,
      email,
      role
    };
    set({ user: newUser });
    return true;
  },
  
  logout: () => set({ user: null }),
  
  addReport: (reportData) => {
    const newReport: Report = {
      ...reportData,
      id: `report${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    set((state) => ({ reports: [...state.reports, newReport] }));
  },
  
  updateReportStatus: (reportId: string, status: ReportStatus) => {
    set((state) => ({
      reports: state.reports.map((report) =>
        report.id === reportId
          ? { ...report, status, updatedAt: new Date() }
          : report
      )
    }));
  }
}));
