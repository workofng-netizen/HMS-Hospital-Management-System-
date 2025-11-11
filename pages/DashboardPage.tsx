import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { PlusIcon, DoctorIcon, ReceptionistIcon, PharmacyIcon, AdminIcon, MasterIcon } from '../components/icons';
import DateTime from '../components/DateTime';

// A generic stat card component
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; }> = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
        <div className={`p-3 rounded-full mr-4 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        </div>
    </div>
);

// A quick action button component
const ActionButton: React.FC<{ label: string; onClick: () => void; icon: React.ReactNode }> = ({ label, onClick, icon }) => (
    <button onClick={onClick} className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center justify-center text-lg">
        {icon}
        <span className="ml-2">{label}</span>
    </button>
);


const DashboardPage: React.FC = () => {
    const { user, hospitalName, hospitalLogo } = useAuth();
    const { appointments, patients } = useData();
    const navigate = useNavigate();

    if (!user) return null;

    const getWelcomeMessage = () => {
        const hour = new Date().getHours();
        if (hour < 12) return `Good morning, ${user.name.split(' ')[0]}!`;
        if (hour < 18) return `Good afternoon, ${user.name.split(' ')[0]}!`;
        return `Good evening, ${user.name.split(' ')[0]}!`;
    };

    const today = new Date().toISOString().split('T')[0];
    
    // Role-specific data
    const todaysAppointments = appointments.filter(a => a.date === today).length;
    const totalPatients = patients.length;
    const admittedPatients = patients.filter(p => p.status === 'Admitted').length;

    const doctorsTodaysAppointments = appointments.filter(a => a.date === today && a.doctorId === user.id && a.status === 'Scheduled').length;
    const doctorsAssignedPatients = patients.filter(p => p.assignedDoctorId === user.id).length;
    
    const renderReceptionistDashboard = () => (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Today's Appointments" value={todaysAppointments} icon={<ReceptionistIcon className="w-6 h-6 text-white"/>} color="bg-blue-500" />
                <StatCard title="Total Patients" value={totalPatients} icon={<PlusIcon className="w-6 h-6 text-white"/>} color="bg-green-500" />
                <StatCard title="Admitted Patients" value={admittedPatients} icon={<DoctorIcon className="w-6 h-6 text-white"/>} color="bg-yellow-500" />
            </div>
            <div className="flex flex-wrap gap-6 justify-center">
                <ActionButton label="New Appointment" onClick={() => navigate('/appointments')} icon={<PlusIcon className="w-5 h-5"/>} />
                <ActionButton label="New Patient" onClick={() => navigate('/patients/add')} icon={<PlusIcon className="w-5 h-5"/>} />
                <ActionButton label="New SOS Patient" onClick={() => navigate('/sos-patients/add')} icon={<PlusIcon className="w-5 h-5"/>} />
            </div>
        </>
    );

    const renderDoctorDashboard = () => (
         <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Your Appointments Today" value={doctorsTodaysAppointments} icon={<ReceptionistIcon className="w-6 h-6 text-white"/>} color="bg-blue-500" />
                <StatCard title="Your Assigned Patients" value={doctorsAssignedPatients} icon={<DoctorIcon className="w-6 h-6 text-white"/>} color="bg-green-500" />
                <StatCard title="Your Status" value={user.availability || 'Available'} icon={<DoctorIcon className="w-6 h-6 text-white"/>} color="bg-purple-500" />
            </div>
            <div className="flex flex-wrap gap-6 justify-center">
                 <ActionButton label="Update Availability" onClick={() => navigate('/doctor/availability')} icon={<PlusIcon className="w-5 h-5"/>} />
            </div>
        </>
    );
    
    const renderGenericDashboard = (role: string, icon: React.ReactNode) => (
        <div className="text-center">
            <div className="inline-block bg-primary p-6 rounded-full text-white mb-6">
                {icon}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Welcome, {role} User!</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">All systems are operational.</p>
        </div>
    );

    const renderDashboardContent = () => {
        switch (user.role) {
            case UserRole.RECEPTIONIST:
                return renderReceptionistDashboard();
            case UserRole.DOCTOR:
                return renderDoctorDashboard();
            case UserRole.PHARMACY:
                return renderGenericDashboard("Pharmacy", <PharmacyIcon className="w-12 h-12" />);
            case UserRole.ADMIN:
                return renderGenericDashboard("Admin", <AdminIcon className="w-12 h-12" />);
            case UserRole.MASTER:
                return renderGenericDashboard("Master", <MasterIcon className="w-12 h-12" />);
            default:
                return <p>Dashboard coming soon for your role.</p>;
        }
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg shadow-inner h-full flex flex-col">
            <header className="flex justify-between items-start mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                    {hospitalLogo && <img src={hospitalLogo} alt="Hospital Logo" className="h-16 w-16 mr-4 object-cover rounded-full"/>}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{hospitalName}</h1>
                        <p className="text-md text-gray-500 dark:text-gray-400">{getWelcomeMessage()}</p>
                    </div>
                </div>
                <DateTime />
            </header>
            <main className="flex-grow flex flex-col justify-center">
                {renderDashboardContent()}
            </main>
        </div>
    );
};

export default DashboardPage;