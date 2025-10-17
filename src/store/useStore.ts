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
  {
    id: '1',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic issues near intersection',
    category: 'infrastructure',
    status: 'pending',
    citizenId: 'user1',
    citizenName: 'John Citizen',
    location: {
      lat: 40.7128,
      lng: -74.0060,
      address: '123 Main St, New York, NY'
    },
    photos: ['https://images.unsplash.com/photo-1625936095886-123534678234'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Broken Streetlight',
    description: 'Streetlight not working for over a week',
    category: 'infrastructure',
    status: 'in-progress',
    citizenId: 'user1',
    citizenName: 'John Citizen',
    location: {
      lat: 40.7589,
      lng: -73.9851,
      address: '456 Park Ave, New York, NY'
    },
    photos: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    title: 'Graffiti on Public Building',
    description: 'Vandalism on city hall exterior wall',
    category: 'environment',
    status: 'resolved',
    citizenId: 'user2',
    citizenName: 'Jane Smith',
    location: {
      lat: 40.7614,
      lng: -73.9776,
      address: '789 City Hall Plaza, New York, NY'
    },
    photos: ['https://images.unsplash.com/photo-1625936095886-456789123456'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '4',
    title: 'Dangerous Intersection',
    description: 'No stop signs causing near accidents',
    category: 'safety',
    status: 'pending',
    citizenId: 'user2',
    citizenName: 'Jane Smith',
    location: {
      lat: 40.7489,
      lng: -73.9680,
      address: 'Corner of 5th Ave & 42nd St'
    },
    photos: [],
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  }
];

export const useStore = create<AppState>((set) => ({
  user: null,
  reports: mockReports,
  
  login: (email: string, password: string) => {
    // Mock authentication
    if (email === 'admin@civic.gov' && password === 'admin123') {
      set({ 
        user: { 
          id: 'admin1', 
          name: 'Admin User', 
          email, 
          role: 'admin' 
        } 
      });
      return true;
    } else if (email === 'citizen@example.com' && password === 'citizen123') {
      set({ 
        user: { 
          id: 'user1', 
          name: 'John Citizen', 
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
