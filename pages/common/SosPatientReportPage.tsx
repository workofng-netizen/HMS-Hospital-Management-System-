import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import DateTime from '../../components/DateTime';
import { useData } from '../../context/DataContext';

const SosPatientReportPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { sosPatients } = useData();
    const patient = sosPatients.find(p => p.id === id);

    if (!patient) {
        return (
            <div className="flex flex-col h-full">
                <Header title="Error" />
                <main className="flex-grow p-8 bg-white dark:bg-gray-800 rounded-b-lg flex items-center justify-center">
                    <p className="text-xl text-red-500">SOS Patient not found.</p>
                </main>
            </div>
        );
    }
    
    const DetailItem: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
        <div className="py-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-md text-gray-900 dark:text-gray-100">{value || 'N/A'}</p>
        </div>
    );

    return (
        <div className="flex flex-col h-full">
            <Header title="SOS Patient Report" />
            <main className="flex-grow p-8 bg-white dark:bg-gray-800 rounded-b-lg flex flex-col justify-between">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg shadow-inner">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <DetailItem label="SOS Patient ID" value={patient.id} />
                        <DetailItem label="SOS Patient Name" value={patient.name} />
                        <DetailItem label="Status" value={patient.status} />
                        <DetailItem label="Gender" value={patient.gender} />
                        <DetailItem label="Email" value={patient.email} />
                        <DetailItem label="Admitted Ward" value={patient.admittedWard} />
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

export default SosPatientReportPage;