import React, { useState, useMemo } from 'react';
import Header from '../../components/Header';
import DateTime from '../../components/DateTime';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const DoctorAppointmentPage: React.FC = () => {
    const { user } = useAuth();
    const { appointments, updateAppointmentStatus } = useData();
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

    const doctorAppointments = useMemo(() => {
        return appointments.filter(app => app.doctorId === user?.id);
    }, [appointments, user]);

    const handleUpdateStatus = (status: 'Checked' | 'Cancelled') => {
        if (selectedAppointmentId) {
            updateAppointmentStatus(selectedAppointmentId, status);
            setSelectedAppointmentId(null);
        }
    };
    
    const selectedAppointment = appointments.find(a => a.id === selectedAppointmentId);
    const canTakeAction = selectedAppointment && selectedAppointment.status === 'Scheduled';

    const buttonDisabledStyles = "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed";

    return (
        <div className="flex flex-col h-full">
            <Header title="Appointments" showDateTime={false}/>
            <main className="flex-grow p-6 bg-white dark:bg-gray-800 rounded-b-lg flex flex-col">
                <div className="overflow-x-auto flex-grow">
                    <table className="min-w-full bg-white dark:bg-gray-800">
                        <thead className="bg-gray-100 dark:bg-gray-700/50">
                            <tr>
                                <th className="py-2 px-4"></th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Patient ID</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Patient Name</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Time</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctorAppointments.map((app) => (
                                <tr key={app.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
                                    <td className="py-2 px-4 text-center">
                                        <input 
                                            type="radio" 
                                            name="selectedAppointment" 
                                            value={app.id} 
                                            checked={selectedAppointmentId === app.id}
                                            onChange={(e) => setSelectedAppointmentId(e.target.value)} 
                                            className="form-radio h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-500"
                                        />
                                    </td>
                                    <td className="py-2 px-4">{app.patientId}</td>
                                    <td className="py-2 px-4">{app.patientName}</td>
                                    <td className="py-2 px-4">{app.date}</td>
                                    <td className="py-2 px-4">{app.time}</td>
                                    <td className="py-2 px-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            app.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                                            app.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex space-x-4">
                        <button 
                            onClick={() => handleUpdateStatus('Checked')}
                            disabled={!canTakeAction}
                            className={`py-2 px-4 rounded-md ${canTakeAction ? 'bg-green-500 hover:bg-green-600 text-white' : buttonDisabledStyles}`}
                        >
                            Checked
                        </button>
                        <button 
                            onClick={() => handleUpdateStatus('Cancelled')}
                            disabled={!canTakeAction}
                            className={`py-2 px-4 rounded-md ${canTakeAction ? 'bg-danger hover:bg-danger-dark text-white' : buttonDisabledStyles}`}
                        >
                            Cancel
                        </button>
                    </div>
                    <DateTime />
                </div>
            </main>
        </div>
    );
};

export default DoctorAppointmentPage;
