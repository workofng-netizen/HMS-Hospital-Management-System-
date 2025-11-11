import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import DateTime from '../../components/DateTime';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const AvailabilityPage: React.FC = () => {
    const { user } = useAuth();
    const { doctors, updateDoctorAvailability } = useData();

    const [status, setStatus] = useState<'Available' | 'On Break' | 'On Leave'>('Available');

    useEffect(() => {
        if (user) {
            const currentUser = doctors.find(d => d.id === user.id);
            if (currentUser && currentUser.availability) {
                setStatus(currentUser.availability);
            }
        }
    }, [user, doctors]);

    const handleSave = () => {
        if (user) {
            updateDoctorAvailability(user.id, status);
            alert('Availability updated successfully!');
        }
    };

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-gray-900 dark:text-gray-100";
    const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="flex flex-col h-full">
            <Header title="Availability" showDateTime={false} />
            <main className="flex-grow p-8 bg-white dark:bg-gray-800 rounded-b-lg flex flex-col">
                <div className="max-w-md mx-auto w-full">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Update Your Status</h3>
                    <div className="mt-4">
                        <label htmlFor="availability-status" className={labelStyle}>
                            Current Availability
                        </label>
                        <select
                            id="availability-status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as typeof status)}
                            className={inputStyle}
                        >
                            <option>Available</option>
                            <option value="On Break">On Break</option>
                            <option value="On Leave">On Leave</option>
                        </select>
                    </div>
                    <div className="mt-6">
                        <button
                            onClick={handleSave}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200"
                        >
                            Save
                        </button>
                    </div>
                </div>
                <div className="mt-auto pt-4 flex justify-end">
                    <DateTime />
                </div>
            </main>
        </div>
    );
};

export default AvailabilityPage;
