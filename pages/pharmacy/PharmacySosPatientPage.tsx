import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import DateTime from '../../components/DateTime';
import { useData } from '../../context/DataContext';

const PharmacySosPatientPage: React.FC = () => {
    const navigate = useNavigate();
    const { sosPatients } = useData();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSosPatients = sosPatients.filter(patient => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            patient.id.toLowerCase().includes(query) ||
            patient.name.toLowerCase().includes(query) ||
            patient.status.toLowerCase().includes(query) ||
            patient.admittedWard.toLowerCase().includes(query)
        );
    });

    const inputStyles = "p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500 dark:placeholder-gray-400";

    return (
        <div className="flex flex-col h-full">
            <Header title="SOS Patients" showDateTime={false} />
            <main className="flex-grow p-6 bg-white dark:bg-gray-800 rounded-b-lg flex flex-col">
                <div className="flex items-center mb-4">
                    <div className="flex-grow flex items-center">
                        <input 
                            type="text" 
                            placeholder="Search SOS Patients (ID, Name, Status, Ward)..." 
                            className={inputStyles + ' w-full'}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto flex-grow">
                  <table className="min-w-full bg-white dark:bg-gray-800">
                    <thead className="bg-gray-100 dark:bg-gray-700/50">
                      <tr>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">SOS Patient ID</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">SOS Patient Name</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Admitted Ward</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSosPatients.map((patient) => (
                        <tr key={patient.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
                          <td className="py-2 px-4">{patient.id}</td>
                          <td className="py-2 px-4">{patient.name}</td>
                          <td className="py-2 px-4">
                             <span className={`px-2 py-1 text-xs rounded-full ${
                                patient.status === 'Admitted' ? 'bg-green-100 text-green-800' : 
                                'bg-red-100 text-red-800'
                             }`}>
                                {patient.status}
                            </span>
                          </td>
                           <td className="py-2 px-4">{patient.admittedWard}</td>
                           <td className="py-2 px-4 space-x-2">
                                <button onClick={() => navigate(`/sos-patients/report/${patient.id}`)} className="bg-blue-500 text-white text-sm py-1 px-3 rounded-md hover:bg-blue-600">View Report</button>
                                <button onClick={() => navigate(`/pharmacy/sos-patients/edit-report/${patient.id}`)} className="bg-green-500 text-white text-sm py-1 px-3 rounded-md hover:bg-green-600">Edit</button>
                           </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <DateTime />
                </div>
            </main>
        </div>
    );
};

export default PharmacySosPatientPage;
