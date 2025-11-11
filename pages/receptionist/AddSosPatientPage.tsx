import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import DateTime from '../../components/DateTime';
import { useData } from '../../context/DataContext';
import { SosPatient } from '../../types';

const AddSosPatientPage: React.FC = () => {
    const navigate = useNavigate();
    const { addSosPatient } = useData();

    const [formData, setFormData] = useState<Omit<SosPatient, 'id'>>({
        name: '',
        status: 'Admitted',
        admittedWard: '',
        gender: 'Male'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSave = () => {
        if (!formData.name || !formData.admittedWard) {
            alert('Please fill out all fields.');
            return;
        }
        addSosPatient(formData);
        navigate('/sos-patients');
    };

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-gray-900 dark:text-gray-100";
    const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="flex flex-col h-full">
            <Header title="Add SOS Patient" showDateTime={false} />
            <main className="flex-grow p-8 bg-white dark:bg-gray-800 rounded-b-lg flex flex-col">
                 <form className="max-w-2xl mx-auto flex-grow">
                    <div className="space-y-4">
                        <div>
                            <label className={labelStyle}>ID</label>
                            <span className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 rounded-md">Auto-generated</span>
                        </div>
                        <div>
                            <label htmlFor="name" className={labelStyle}>Name</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="gender" className={labelStyle}>Gender</label>
                            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className={inputStyle}>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="status" className={labelStyle}>Status</label>
                            <select id="status" name="status" value={formData.status} onChange={handleChange} className={inputStyle}>
                                <option>Admitted</option>
                                <option>Died</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="admittedWard" className={labelStyle}>Ward</label>
                            <input type="text" id="admittedWard" name="admittedWard" value={formData.admittedWard} onChange={handleChange} className={inputStyle} />
                        </div>
                    </div>
                </form>
                <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div>
                        <button onClick={handleSave} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 mr-4">
                            Save
                        </button>
                        <button onClick={() => navigate('/sos-patients')} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
                            Cancel
                        </button>
                    </div>
                    <DateTime />
                </div>
            </main>
        </div>
    );
};

export default AddSosPatientPage;