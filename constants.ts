import { UserRole } from './types';

export const DEFAULT_HOSPITAL_NAME = "Central City Hospital";

export const navLinks: Record<UserRole, { path: string; label: string }[]> = {
  [UserRole.RECEPTIONIST]: [
    { path: '/appointments', label: 'Appointments' },
    { path: '/patients', label: 'Patients' },
    { path: '/sos-patients', label: 'SOS Patients' },
  ],
  [UserRole.DOCTOR]: [
    { path: '/doctor/patients', label: 'Patients' },
    { path: '/doctor/sos-patients', label: 'SOS Patients' },
    { path: '/doctor/appointments', label: 'Appointments' },
    { path: '/doctor/availability', label: 'Availability' },
  ],
  [UserRole.PHARMACY]: [
    { path: '/pharmacy/patients', label: 'Patients' },
    { path: '/pharmacy/sos-patients', label: 'SOS Patients' },
    { path: '/pharmacy/inventory', label: 'Inventory' },
    { path: '/pharmacy/billing', label: 'Billing' },
  ],
  [UserRole.ADMIN]: [
    { path: '/admin/leave-applications', label: 'Leave Applications' },
    { path: '/admin/manage-staff', label: 'Manage Staff' },
    { path: '/admin/sos-patients', label: 'SOS Patients' },
    { path: '/admin/audit-logs', label: 'Audit Logs' },
    { path: '/admin/recycle-bin', label: 'Recycle Bin' },
  ],
  [UserRole.MASTER]: [
    { path: '/master/leave-applications', label: 'Leave Applications' },
    { path: '/master/manage-staff', label: 'Manage Staff' },
    { path: '/master/sos-patients', label: 'SOS Patients' },
    { path: '/master/audit-logs', label: 'Audit Logs' },
    { path: '/master/recycle-bin', label: 'Recycle Bin' },
    { path: '/master/settings', label: 'Hospital Settings' },
  ],
};

export const commonNavLinks = [
    { path: '/leave-apply', label: 'Apply for Leave' },
    { path: '/profile', label: 'Profile' },
];