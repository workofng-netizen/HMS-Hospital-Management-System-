import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AppointmentPage from './pages/receptionist/AppointmentPage';
import PatientPage from './pages/receptionist/PatientPage';
import PatientFormPage from './pages/receptionist/PatientFormPage';
import SosPatientPage from './pages/receptionist/SosPatientPage';
import AddSosPatientPage from './pages/receptionist/AddSosPatientPage';
import ConvertSosPatientPage from './pages/receptionist/ConvertSosPatientPage';
import ProfilePage from './pages/common/ProfilePage';
import HospitalSettingsPage from './pages/master/HospitalSettingsPage';
import { UserRole } from './types';
import LeaveApplyPage from './pages/common/LeaveApplyPage';
import PatientReportPage from './pages/common/PatientReportPage';
import SosPatientReportPage from './pages/common/SosPatientReportPage';
import DoctorPatientPage from './pages/doctor/DoctorPatientPage';
import DoctorSosPatientPage from './pages/doctor/DoctorSosPatientPage';
import DoctorAppointmentPage from './pages/doctor/DoctorAppointmentPage';
import AvailabilityPage from './pages/doctor/AvailabilityPage';
import EditPatientReportPage from './pages/doctor/EditPatientReportPage';
import LeaveApplicationsPage from './pages/admin/LeaveApplicationsPage';
import ManageStaffPage from './pages/admin/ManageStaffPage';
import AdminSosPatientsPage from './pages/admin/AdminSosPatientsPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';
import StaffFormPage from './pages/admin/StaffFormPage';
import PharmacyPatientPage from './pages/pharmacy/PharmacyPatientPage';
import PharmacySosPatientPage from './pages/pharmacy/PharmacySosPatientPage';
import InventoryPage from './pages/pharmacy/InventoryPage';
import BillingPage from './pages/pharmacy/BillingPage';
import EditPharmacyReportPage from './pages/pharmacy/EditPharmacyReportPage';
import RecycleBinPage from './pages/admin/RecycleBinPage';


// Fix: Layout components for react-router-dom v6 render an <Outlet /> and do not receive children as props.
// The component signature is updated to reflect this, as it doesn't receive children.
const ProtectedRoute: React.FC<{ roles?: UserRole[] }> = ({ roles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" replace />; // Or a dedicated "Access Denied" page
    }

    return <Outlet />;
};

// Fix: Layout components for react-router-dom v6 render an <Outlet /> and do not receive children as props.
// The component signature is updated to reflect this, as it doesn't receive children.
const AppLayout: React.FC = () => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 p-4 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <DataProvider>
            <AuthProvider>
                <HashRouter>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route element={<AppLayout />}>
                            <Route path="/" element={<DashboardPage />} />

                            {/* Common Routes */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/leave-apply" element={<LeaveApplyPage />} />
                                <Route path="/patients/report/:id" element={<PatientReportPage />} />
                                <Route path="/sos-patients/report/:id" element={<SosPatientReportPage />} />
                            </Route>

                            {/* Receptionist Routes */}
                            <Route element={<ProtectedRoute roles={[UserRole.RECEPTIONIST]} />}>
                                <Route path="/appointments" element={<AppointmentPage />} />
                                <Route path="/patients" element={<PatientPage />} />
                                <Route path="/patients/add" element={<PatientFormPage />} />
                                <Route path="/patients/edit/:id" element={<PatientFormPage />} />
                                <Route path="/sos-patients" element={<SosPatientPage />} />
                                <Route path="/sos-patients/add" element={<AddSosPatientPage />} />
                                <Route path="/sos-patients/convert/:id" element={<ConvertSosPatientPage />} />
                            </Route>
                            
                            {/* Doctor Routes */}
                            <Route element={<ProtectedRoute roles={[UserRole.DOCTOR]} />}>
                                <Route path="/doctor/patients" element={<DoctorPatientPage />} />
                                <Route path="/doctor/sos-patients" element={<DoctorSosPatientPage />} />
                                <Route path="/doctor/appointments" element={<DoctorAppointmentPage />} />
                                <Route path="/doctor/availability" element={<AvailabilityPage />} />
                                <Route path="/doctor/patients/edit-report/:id" element={<EditPatientReportPage />} />
                                <Route path="/doctor/sos-patients/edit-report/:id" element={<EditPatientReportPage />} />
                            </Route>

                            {/* Pharmacy Routes */}
                            <Route element={<ProtectedRoute roles={[UserRole.PHARMACY]} />}>
                                <Route path="/pharmacy/patients" element={<PharmacyPatientPage />} />
                                <Route path="/pharmacy/sos-patients" element={<PharmacySosPatientPage />} />
                                <Route path="/pharmacy/inventory" element={<InventoryPage />} />
                                <Route path="/pharmacy/billing" element={<BillingPage />} />
                                <Route path="/pharmacy/patients/edit-report/:id" element={<EditPharmacyReportPage />} />
                                <Route path="/pharmacy/sos-patients/edit-report/:id" element={<EditPharmacyReportPage />} />
                            </Route>

                            {/* Admin Routes */}
                            <Route element={<ProtectedRoute roles={[UserRole.ADMIN, UserRole.MASTER]} />}>
                                <Route path="/admin/leave-applications" element={<LeaveApplicationsPage />} />
                                <Route path="/master/leave-applications" element={<LeaveApplicationsPage />} />
                                <Route path="/admin/manage-staff" element={<ManageStaffPage />} />
                                <Route path="/master/manage-staff" element={<ManageStaffPage />} />
                                <Route path="/admin/manage-staff/add" element={<StaffFormPage />} />
                                <Route path="/master/manage-staff/add" element={<StaffFormPage />} />
                                <Route path="/admin/manage-staff/edit/:id" element={<StaffFormPage />} />
                                <Route path="/master/manage-staff/edit/:id" element={<StaffFormPage />} />
                                <Route path="/admin/sos-patients" element={<AdminSosPatientsPage />} />
                                <Route path="/master/sos-patients" element={<AdminSosPatientsPage />} />
                                <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
                                <Route path="/master/audit-logs" element={<AuditLogsPage />} />
                                <Route path="/admin/recycle-bin" element={<RecycleBinPage />} />
                                <Route path="/master/recycle-bin" element={<RecycleBinPage />} />
                            </Route>

                            {/* Master-Specific Routes */}
                            <Route element={<ProtectedRoute roles={[UserRole.MASTER]} />}>
                                <Route path="/master/settings" element={<HospitalSettingsPage />} />
                            </Route>

                            <Route path="*" element={<Navigate to="/" />} />
                        </Route>
                    </Routes>
                </HashRouter>
            </AuthProvider>
        </DataProvider>
    );
};

export default App;