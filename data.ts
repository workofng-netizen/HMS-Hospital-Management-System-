import { Patient, SosPatient, Appointment, User, UserRole, LeaveApplication, AuditLog, Medicine, Ward } from './types';

export const mockStaff: User[] = [
    { id: 'D001', name: 'Dr. Evelyn Reed', role: UserRole.DOCTOR, specialty: 'Cardiology', username: 'doctor', email: 'e.reed@hospital.com', gender: 'Female', contact: '111-222-3333', availability: 'Available', password: 'password' },
    { id: 'R001', name: 'John Smith', role: UserRole.RECEPTIONIST, username: 'receptionist', email: 'j.smith@hospital.com', gender: 'Male', contact: '222-333-4444', password: 'password' },
    { id: 'PH001', name: 'Maria Garcia', role: UserRole.PHARMACY, username: 'pharmacy', email: 'm.garcia@hospital.com', gender: 'Female', contact: '333-444-5555', password: 'password' },
    { id: 'A001', name: 'Chen Wei', role: UserRole.ADMIN, username: 'admin', email: 'c.wei@hospital.com', gender: 'Male', contact: '444-555-6666', password: 'password' },
    { id: 'M001', name: 'Alice Wonder', role: UserRole.MASTER, username: 'master', email: 'a.wonder@hospital.com', gender: 'Female', contact: '555-666-7777', password: 'password' },
];

export const mockPatients: Patient[] = [
    { id: 'P1234', name: 'John Doe', contact: '123-456-7890', email: 'j.doe@email.com', status: 'Admitted', gender: 'Male', ward: 'General Medicine', assignedDoctorId: 'D001' },
    { id: 'P5678', name: 'Alice Smith', contact: '987-654-3210', email: 'a.smith@email.com', status: 'Admitted', gender: 'Female', ward: 'Cardiology', assignedDoctorId: 'D001' }
];

export const mockAppointments: Appointment[] = [];

export const mockSosPatients: SosPatient[] = [
    { id: 'SOS2301', name: 'Jane Doe', status: 'Admitted', admittedWard: 'Emergency', gender: 'Female' },
    { id: 'SOS2302', name: 'Unknown Male', status: 'Admitted', admittedWard: 'ICU', gender: 'Male' },
];

// Fix: Added mockWards to provide initial data for the new ward management feature.
export const mockWards: Ward[] = [
    { id: 'W001', name: 'General Medicine', capacity: 20 },
    { id: 'W002', name: 'Cardiology', capacity: 15 },
    { id: 'W003', name: 'Emergency', capacity: 10 },
    { id: 'W004', name: 'ICU', capacity: 8 },
];

export const mockLeaveApplications: LeaveApplication[] = [
    { id: 'L001', staffId: 'D001', staffName: 'Dr. Evelyn Reed', staffRole: UserRole.DOCTOR, type: 'Medical', reason: 'Personal medical procedure.', startDate: '2025-04-10', endDate: '2025-04-15', status: 'Pending' },
    { id: 'L002', staffId: 'R001', staffName: 'John Smith', staffRole: UserRole.RECEPTIONIST, type: 'Normal', reason: 'Family vacation.', startDate: '2025-05-20', endDate: '2025-05-25', status: 'Accepted' },
    { id: 'L003', staffId: 'A001', staffName: 'Chen Wei', staffRole: UserRole.ADMIN, type: 'Emergency', reason: 'Urgent family matter.', startDate: '2025-03-22', endDate: '2025-03-23', status: 'Pending' },
];

export const mockAuditLogs: AuditLog[] = [
    { id: 'AL001', staffId: 'R001', staffName: 'John Smith', staffRole: UserRole.RECEPTIONIST, username: 'receptionist', action: 'Added new patient: P20240320', timestamp: '2025-03-20 09:15:30 AM' },
    { id: 'AL002', staffId: 'D001', staffName: 'Dr. Evelyn Reed', staffRole: UserRole.DOCTOR, username: 'doctor', action: 'Updated patient report for P20240319', timestamp: '2025-03-20 10:05:12 AM' },
    { id: 'AL003', staffId: 'M001', staffName: 'Alice Wonder', staffRole: UserRole.MASTER, username: 'master', action: 'Updated hospital settings', timestamp: '2025-03-19 05:30:00 PM' },
    { id: 'AL004', staffId: 'A001', staffName: 'Chen Wei', staffRole: UserRole.ADMIN, username: 'admin', action: 'Logged in', timestamp: '2025-03-20 08:55:00 AM' },
];

export const mockMedicines: Medicine[] = [
    { id: 'MED001', name: 'Paracetamol 500mg', quantity: 1000, buyPrice: 0.05, sellPrice: 0.10 },
    { id: 'MED002', name: 'Ibuprofen 200mg', quantity: 800, buyPrice: 0.08, sellPrice: 0.15 },
    { id: 'MED003', name: 'Amoxicillin 250mg', quantity: 500, buyPrice: 0.20, sellPrice: 0.35 },
    { id: 'MED004', name: 'Lisinopril 10mg', quantity: 300, buyPrice: 0.15, sellPrice: 0.25 },
    { id: 'MED005', name: 'Aspirin 75mg', quantity: 1200, buyPrice: 0.02, sellPrice: 0.05 },
];