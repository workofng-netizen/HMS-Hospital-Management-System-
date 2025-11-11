export enum UserRole {
  RECEPTIONIST = 'Receptionist',
  DOCTOR = 'Doctor',
  PHARMACY = 'Pharmacy',
  ADMIN = 'Admin',
  MASTER = 'Master',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  username: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
  profilePicture?: string;
  password?: string;
  specialty?: string; // For doctors
  availability?: 'Available' | 'On Break' | 'On Leave'; // For doctors
}

export interface Patient {
    id: string;
    name: string;
    contact: string;
    email: string;
    status: 'Admitted' | 'Discharged' | 'Died';
    gender: 'Male' | 'Female' | 'Other';
    ward: string;
    assignedDoctorId?: string;
    diagnosis?: string[];
    prescriptions?: string[];
    instructions?: string[];
}

export interface SosPatient {
    id: string;
    name: string;
    status: 'Admitted' | 'Died';
    admittedWard: string;
    gender: 'Male' | 'Female' | 'Other';
    email?: string;
    diagnosis?: string[];
    prescriptions?: string[];
    instructions?: string[];
}

export interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    date: string;
    time: string;
    status: 'Scheduled' | 'Cancelled' | 'Checked';
}

export interface Medicine {
    id: string;
    name: string;
    quantity: number;
    buyPrice: number;
    sellPrice: number;
}

// Fix: Added Ward interface for WardManagementPage.
export interface Ward {
    id: string;
    name: string;
    capacity: number;
}

export interface LeaveApplication {
    id: string;
    staffId: string;
    staffName: string;
    staffRole: UserRole;
    type: 'Normal' | 'Emergency' | 'Medical';
    reason: string;
    startDate: string;
    endDate: string;
    status: 'Pending' | 'Accepted' | 'Declined';
}

export interface AuditLog {
    id: string;
    staffId: string;
    staffName: string;
    staffRole: UserRole;
    username: string;
    action: string;
    timestamp: string;
}

export interface BilledMedicine {
    id: string;
    name: string;
    quantity: number;
    sellPrice: number;
}

export interface Bill {
    id: string;
    patientId: string;
    patientName: string;
    medicines: BilledMedicine[];
    totalAmount: number;
    paymentMethod: 'Cash' | 'Online';
    timestamp: string;
}