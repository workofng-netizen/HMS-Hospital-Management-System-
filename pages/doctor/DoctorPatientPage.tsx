import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import DateTime from '../../components/DateTime';
import { useData } from '../../context/DataContext';

const DoctorPatientPage: React.FC = () => {
    const navigate = useNavigate();
    const { patients } = useData();
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCategory, setSearchCategory] = useState('Name');

    const filteredPatients = patients.filter(patient => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        switch (searchCategory) {
            case 'Name':
                return patient.name.toLowerCase().includes(query);
            case 'Contact':
                return patient.contact.toLowerCase().includes(query);
            case 'ID':
                return patient.id.toLowerCase().includes(query);
            case 'Status':
                return patient.status.toLowerCase().includes(query);
            default:
                return true;
        }
    });

    const inputStyles = "p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500 dark:placeholder-gray-400";
    const buttonDisabledStyles = "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed";

    return (
        <div className="flex flex-col h-full">
            <Header title="Patients" showDateTime={false} />
            <main className="flex-grow p-6 bg-white dark:bg-gray-800 rounded-b-lg flex flex-col">
                <div className="flex items-center mb-4">
                    <div className="flex-grow flex items-center">
                         <select 
                            className={`${inputStyles} rounded-r-none`}
                            value={searchCategory}
                            onChange={e => setSearchCategory(e.target.value)}
                         >
                            <option>Name</option>
                            <option>Contact</option>
                            <option>ID</option>
                            <option>Status</option>
                        </select>
                        <input 
                            type="text" 
                            placeholder={`Search Patients by ${searchCategory}...`}
                            className={`${inputStyles} rounded-l-none w-full`}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto flex-grow">
                  <table className="min-w-full bg-white dark:bg-gray-800">
                    <thead className="bg-gray-100 dark:bg-gray-700/50">
                      <tr>
                        <th className="py-2 px-4"></th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Patient ID</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Patient Name</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Contact</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Email</th>
                        <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map((patient) => (
                        <tr key={patient.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
                          <td className="py-2 px-4 text-center">
                             <input type="radio" name="selectedPatient" value={patient.id} onChange={(e) => setSelectedPatient(e.target.value)} className="form-radio h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-500" />
                          </td>
                          <td className="py-2 px-4">{patient.id}</td>
                          <td className="py-2 px-4">{patient.name}</td>
                          <td className="py-2 px-4">{patient.contact}</td>
                          <td className="py-2 px-4">{patient.email}</td>
                          <td className="py-2 px-4">
                             <span className={`px-2 py-1 text-xs rounded-full ${
                                patient.status === 'Admitted' ? 'bg-green-100 text-green-800' : 
                                patient.status === 'Discharged' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                             }`}>
                                {patient.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div>
                        <button 
                            disabled={!selectedPatient} 
                            onClick={() => selectedPatient && navigate(`/patients/report/${selectedPatient}`)}
                            className={`py-2 px-4 rounded-md mr-4 ${selectedPatient ? 'bg-blue-500 hover:bg-blue-600 text-white' : buttonDisabledStyles}`}
                        >
                            View Report
                        </button>
                        <button disabled={!selectedPatient} onClick={() => selectedPatient && navigate(`/doctor/patients/edit-report/${selectedPatient}`)} className={`py-2 px-4 rounded-md ${selectedPatient ? 'bg-green-500 hover:bg-green-600 text-white' : buttonDisabledStyles}`}>
                            Edit Report
                        </button>
                    </div>
                    <DateTime />
                </div>
            </main>
        </div>
    );
};

export default DoctorPatientPage;
