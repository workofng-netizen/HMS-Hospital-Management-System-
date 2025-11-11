import React, { createContext, useState, useContext, ReactNode, useMemo, PropsWithChildren, useEffect } from 'react';
import { Patient, SosPatient, Appointment, User, LeaveApplication, UserRole, AuditLog, Medicine, Bill, Ward } from '../types';
import { mockPatients as initialPatients, mockSosPatients as initialSosPatients, mockAppointments as initialAppointments, mockStaff as initialStaff, mockLeaveApplications as initialLeaveApplications, mockAuditLogs as initialAuditLogs, mockMedicines as initialMedicines, mockWards as initialWards } from '../data';

interface DataContextType {
  patients: Patient[];
  sosPatients: SosPatient[];
  appointments: Appointment[];
  staff: User[];
  doctors: User[];
  leaveApplications: LeaveApplication[];
  auditLogs: AuditLog[];
  medicines: Medicine[];
  bills: Bill[];
  recycledStaff: User[];
  recycledMedicines: Medicine[];
  wards: Ward[];
  updatePatient: (updatedPatient: Patient) => void;
  addPatient: (newPatient: Omit<Patient, 'id'>) => void;
  addSosPatient: (newPatient: Omit<SosPatient, 'id'>) => void;
  removeSosPatient: (id: string) => void;
  addAppointment: (newAppointment: Omit<Appointment, 'id'>) => void;
  updateAppointmentStatus: (id: string, status: 'Scheduled' | 'Cancelled' | 'Checked') => void;
  addLeaveApplication: (newLeaveApplication: Omit<LeaveApplication, 'id' | 'staffId' | 'staffName' | 'staffRole' | 'status'>, currentUser: User) => void;
  updateLeaveApplicationStatus: (id: string, status: 'Accepted' | 'Declined') => void;
  addStaff: (newStaff: Omit<User, 'id'>) => void;
  updateStaff: (updatedStaff: User) => void;
  removeStaff: (id: string) => void;
  restoreStaff: (id: string) => void;
  permanentlyDeleteStaff: (id: string) => void;
  updateSosPatient: (updatedPatient: SosPatient) => void;
  updateDoctorAvailability: (doctorId: string, status: 'Available' | 'On Break' | 'On Leave') => void;
  addMedicine: (newMedicine: Omit<Medicine, 'id'>) => void;
  updateMedicine: (updatedMedicine: Medicine) => void;
  removeMedicine: (id: string) => void;
  restoreMedicine: (id: string) => void;
  permanentlyDeleteMedicine: (id: string) => void;
  addBill: (newBill: Omit<Bill, 'id'>) => void;
  addWard: (newWard: Omit<Ward, 'id'>) => void;
  updateWard: (updatedWard: Ward) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: PropsWithChildren) => {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [sosPatients, setSosPatients] = useState<SosPatient[]>(initialSosPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [staff, setStaff] = useState<User[]>(() => {
    const savedStaff = localStorage.getItem('hms-staff');
    return savedStaff ? JSON.parse(savedStaff) : initialStaff;
  });
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>(initialLeaveApplications);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [bills, setBills] = useState<Bill[]>([]);
  const [recycledStaff, setRecycledStaff] = useState<User[]>([]);
  const [recycledMedicines, setRecycledMedicines] = useState<Medicine[]>([]);
  const [wards, setWards] = useState<Ward[]>(initialWards);


  useEffect(() => {
    localStorage.setItem('hms-staff', JSON.stringify(staff));
  }, [staff]);

  const doctors = useMemo(() => staff.filter(s => s.role === UserRole.DOCTOR), [staff]);

  const updatePatient = (updatedPatient: Patient) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  };
  
  const updateSosPatient = (updatedPatient: SosPatient) => {
    setSosPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  };

  const addPatient = (newPatientData: Omit<Patient, 'id'>) => {
    const newPatient: Patient = {
      id: `P${String(Date.now()).slice(-4)}`,
      ...newPatientData,
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const addSosPatient = (newPatientData: Omit<SosPatient, 'id'>) => {
    const newPatient: SosPatient = {
      id: `SOS${String(Date.now()).slice(-4)}`,
      ...newPatientData,
    };
    setSosPatients(prev => [...prev, newPatient]);
  };

  const removeSosPatient = (id: string) => {
    setSosPatients(prev => prev.filter(p => p.id !== id));
  };

  const addAppointment = (newAppointmentData: Omit<Appointment, 'id'>) => {
      const newAppointment: Appointment = {
          id: `app-${Date.now()}`,
          ...newAppointmentData,
      };
      setAppointments(prev => [newAppointment, ...prev]);
  };
  
  const updateAppointmentStatus = (id: string, status: 'Scheduled' | 'Cancelled' | 'Checked') => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };
  
  const updateDoctorAvailability = (doctorId: string, status: 'Available' | 'On Break' | 'On Leave') => {
    setStaff(prev => prev.map(s => s.id === doctorId ? { ...s, availability: status } : s));
  };

  const addLeaveApplication = (newLeaveApplicationData: Omit<LeaveApplication, 'id' | 'staffId' | 'staffName' | 'staffRole' | 'status'>, currentUser: User) => {
    const newLeaveApplication: LeaveApplication = {
        id: `L${String(Date.now()).slice(-4)}`,
        staffId: currentUser.id, 
        staffName: currentUser.name,
        staffRole: currentUser.role,
        status: 'Pending',
        ...newLeaveApplicationData,
    };
    setLeaveApplications(prev => [newLeaveApplication, ...prev]);
  };

  const updateLeaveApplicationStatus = (id: string, status: 'Accepted' | 'Declined') => {
    setLeaveApplications(prev => prev.map(la => la.id === id ? { ...la, status } : la));
  };

  const addStaff = (newStaffData: Omit<User, 'id'>) => {
    const rolePrefix = newStaffData.role.charAt(0).toUpperCase();
    const newId = `${rolePrefix}${String(Date.now()).slice(-4)}`;
    const newUser: User = { id: newId, ...newStaffData };
    setStaff(prev => [...prev, newUser]);
  };

  const updateStaff = (updatedStaff: User) => {
    setStaff(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
  };

  const removeStaff = (id: string) => {
    const staffToRemove = staff.find(s => s.id === id);
    if (staffToRemove) {
      setRecycledStaff(prev => [...prev, staffToRemove]);
      setStaff(prev => prev.filter(s => s.id !== id));
    }
  };
  
  const restoreStaff = (id: string) => {
    const staffToRestore = recycledStaff.find(s => s.id === id);
    if (staffToRestore) {
        setStaff(prev => [...prev, staffToRestore]);
        setRecycledStaff(prev => prev.filter(s => s.id !== id));
    }
  };

  const permanentlyDeleteStaff = (id: string) => {
    setRecycledStaff(prev => prev.filter(s => s.id !== id));
  };


  const addMedicine = (newMedicineData: Omit<Medicine, 'id'>) => {
    const newMedicine: Medicine = {
      id: `MED${String(Date.now()).slice(-4)}`,
      ...newMedicineData,
    };
    setMedicines(prev => [newMedicine, ...prev]);
  };

  const updateMedicine = (updatedMedicine: Medicine) => {
    setMedicines(prev => prev.map(m => m.id === updatedMedicine.id ? updatedMedicine : m));
  };

  const removeMedicine = (id: string) => {
    const medicineToRemove = medicines.find(m => m.id === id);
    if (medicineToRemove) {
        setRecycledMedicines(prev => [...prev, medicineToRemove]);
        setMedicines(prev => prev.filter(m => m.id !== id));
    }
  };

  const restoreMedicine = (id: string) => {
    const medicineToRestore = recycledMedicines.find(m => m.id === id);
    if (medicineToRestore) {
        setMedicines(prev => [...prev, medicineToRestore]);
        setRecycledMedicines(prev => prev.filter(m => m.id !== id));
    }
  };

  const permanentlyDeleteMedicine = (id: string) => {
    setRecycledMedicines(prev => prev.filter(m => m.id !== id));
  };

  const addBill = (newBillData: Omit<Bill, 'id'>) => {
    const newBill: Bill = {
      id: `B${String(Date.now()).slice(-5)}`,
      ...newBillData,
    };
    setBills(prev => [newBill, ...prev]);
    // Update medicine quantities
    setMedicines(prevMeds => prevMeds.map(med => {
      const billedMed = newBillData.medicines.find(bm => bm.id === med.id);
      if (billedMed) {
        return { ...med, quantity: med.quantity - billedMed.quantity };
      }
      return med;
    }));
  };

  const addWard = (newWardData: Omit<Ward, 'id'>) => {
    const newWard: Ward = {
      id: `W${String(Date.now()).slice(-3)}`,
      ...newWardData,
    };
    setWards(prev => [...prev, newWard]);
  };

  const updateWard = (updatedWard: Ward) => {
    setWards(prev => prev.map(w => w.id === updatedWard.id ? updatedWard : w));
  };

  const value = { 
      patients, 
      sosPatients, 
      appointments, 
      staff,
      doctors,
      leaveApplications, 
      auditLogs,
      medicines,
      bills,
      recycledStaff,
      recycledMedicines,
      wards,
      updatePatient, 
      addPatient, 
      addSosPatient, 
      removeSosPatient,
      addAppointment,
      updateAppointmentStatus,
      addLeaveApplication,
      updateLeaveApplicationStatus,
      addStaff,
      updateStaff,
      removeStaff,
      restoreStaff,
      permanentlyDeleteStaff,
      updateSosPatient,
      updateDoctorAvailability,
      addMedicine,
      updateMedicine,
      removeMedicine,
      restoreMedicine,
      permanentlyDeleteMedicine,
      addBill,
      addWard,
      updateWard,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};