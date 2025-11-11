import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { useData } from '../../context/DataContext';
import { SearchIcon } from '../../components/icons';
import { SosPatient } from '../../types';

const AdminSosPatientsPage: React.FC = () => {
    const navigate = useNavigate();
    const { sosPatients } = useData();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSosPatients = useMemo(() => {
        if (!searchQuery) return sosPatients;
        const lowercasedQuery = searchQuery.toLowerCase();
        return sosPatients.filter(p =>
            p.id.toLowerCase().includes(lowercasedQuery) ||
            p.name.toLowerCase().includes(lowercasedQuery) ||
            p.status.toLowerCase().includes(lowercasedQuery)
        );
    }, [searchQuery, sosPatients]);
    
    const getStatusColor = (status: SosPatient['status']) => {
        return status === 'Admitted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    const inputStyles = "p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500 dark:placeholder-gray-400";

    return (
        <div className="flex flex-col h-full">
            <Header title="SOS Patients" />
            <main className="flex-grow p-6 bg-white dark:bg-gray-800 rounded-b-lg flex flex-col">
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search by SOS Patient ID, Name, or Status..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`pl-10 ${inputStyles}`}
                    />
                    <SearchIcon className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                </div>
                <div className="overflow-x-auto flex-grow">
                    <table className="min-w-full bg-white dark:bg-gray-800">
                        <thead className="bg-gray-100 dark:bg-gray-700/50">
                            <tr>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">SOS Patient ID</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">SOS Patient Name</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Admitted Ward</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Option</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSosPatients.map((p) => (
                                <tr key={p.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
                                    <td className="py-2 px-4">{p.id}</td>
                                    <td className="py-2 px-4">{p.name}</td>
                                    <td className="py-2 px-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(p.status)}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4">{p.admittedWard}</td>
                                    <td className="py-2 px-4">
                                        <button 
                                            onClick={() => navigate(`/sos-patients/report/${p.id}`)}
                                            className="bg-blue-500 text-white text-sm py-1 px-3 rounded-md hover:bg-blue-600"
                                        >
                                            View Report
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminSosPatientsPage;
