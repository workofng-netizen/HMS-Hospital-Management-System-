import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import DateTime from '../../components/DateTime';
import { useData } from '../../context/DataContext';

const PatientReportPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { patients, doctors, appointments } = useData();
    const patient = patients.find(p => p.id === id);

    if (!patient) {
        return (
            <div className="flex flex-col h-full">
                <Header title="Error" />
                <main className="flex-grow p-8 bg-white dark:bg-gray-800 rounded-b-lg flex items-center justify-center">
                    <p className="text-xl text-red-500">Patient not found.</p>
                </main>
            </div>
        );
    }

    const assignedDoctor = doctors.find(d => d.id === patient.assignedDoctorId);
    const currentAppointment = appointments.find(a => a.patientId === patient.id && a.status === 'Scheduled');

    const DetailItem: React.FC<{ label: string; value?: string | string[] }> = ({ label, value }) => (
        <div className="py-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-md text-gray-900 dark:text-gray-100">
                {Array.isArray(value) ? value.join(', ') : (value || 'N/A')}
            </p>
        </div>
    );
    
    return (
        <div className="flex flex-col h-full">
            <Header title="Patient Report" />
            <main className="flex-grow p-8 bg-white dark:bg-gray-800 rounded-b-lg flex flex-col justify-between">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg shadow-inner">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <DetailItem label="Patient ID" value={patient.id} />
                        <DetailItem label="Patient Name" value={patient.name} />
                        <DetailItem label="Status" value={patient.status} />
                        <DetailItem label="Gender" value={patient.gender} />
                        <DetailItem label="Email" value={patient.email} />
                        <DetailItem label="Ward" value={patient.ward} />
                        <DetailItem label="Contact" value={patient.contact} />
                        <DetailItem label="Assigned Doctor" value={assignedDoctor?.name} />
                        <DetailItem label="Current Appointment" value={currentAppointment ? `${currentAppointment.date} at ${currentAppointment.time}` : 'None'} />
                        <DetailItem label="Diagnosis" value={patient.diagnosis} />
                        <DetailItem label="Prescription" value={patient.prescriptions} />
                    </div>
                </div>
                <div className="mt-8 flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={() => navigate(-1)} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-8 rounded-md">
                        OK
                    </button>
                </div>
            </main>
        </div>
    );
};

export default PatientReportPage;