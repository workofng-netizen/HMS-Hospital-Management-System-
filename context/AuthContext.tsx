import React, { createContext, useState, useContext, ReactNode, useEffect, PropsWithChildren } from 'react';
import { User, UserRole } from '../types';
import { DEFAULT_HOSPITAL_NAME } from '../constants';
import { useData } from './DataContext';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  hospitalName: string;
  setHospitalName: (name: string) => void;
  hospitalLogo: string | null;
  setHospitalLogo: (logo: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const { staff: allStaff, updateStaff } = useData();
  
  const [hospitalName, setHospitalName] = useState<string>(() => {
    const savedName = localStorage.getItem('hospitalName');
    return savedName || DEFAULT_HOSPITAL_NAME;
  });
  
  const [hospitalLogo, setHospitalLogo] = useState<string | null>(() => {
      return localStorage.getItem('hospitalLogo');
  });

  useEffect(() => {
    localStorage.setItem('hospitalName', hospitalName);
  }, [hospitalName]);

  useEffect(() => {
    if (hospitalLogo) {
        localStorage.setItem('hospitalLogo', hospitalLogo);
    } else {
        localStorage.removeItem('hospitalLogo');
    }
  }, [hospitalLogo]);


  const login = (username: string, password: string): boolean => {
    const staffUser = allStaff.find(
      (staff) => staff.username.toLowerCase() === username.toLowerCase()
    );

    if (staffUser && (staffUser.password || 'password') === password) {
        setUser(staffUser);
        return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updatedUserInfo: Partial<User>) => {
    if(user){
        const fullyUpdatedUser = { ...user, ...updatedUserInfo };
        setUser(fullyUpdatedUser); // Update local context state
        updateStaff(fullyUpdatedUser); // Update master list in DataContext to ensure data sync
    }
  };

  const value = { 
    user, 
    login, 
    logout, 
    updateUser, 
    hospitalName, 
    setHospitalName, 
    hospitalLogo, 
    setHospitalLogo 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};