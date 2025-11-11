import React, { useState } from 'react';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const LeaveApplyPage: React.FC = () => {
    const { user } = useAuth();
    const { leaveApplications, addLeaveApplication } = useData();

    const [leaveType, setLeaveType] = useState<'Normal' | 'Emergency' | 'Medical'>('Normal');
    const [reason, setReason] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('You must be logged in to apply for leave.');
            return;
        }
        if (!reason || !startDate || !endDate) {
            alert('Please fill all fields.');
            return;
        }
        addLeaveApplication({
            type: leaveType,
            reason,
            startDate,
            endDate,
        }, user);
        // Reset form
        setReason('');
        setStartDate('');
        setEndDate('');
        alert('Leave application submitted!');
    };
    
    // In a real app, this would be filtered by the logged-in user's ID
    const userLeaveHistory = leaveApplications.filter(l => l.staffId === user?.id); 

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-gray-900 dark:text-gray-100";
    const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="flex flex-col h-full">
            <Header title="Apply for Leave" />
            <main className="flex-grow p-6 bg-white dark:bg-gray-800 rounded-b-lg overflow-y-auto">
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="leave-type" className={labelStyle}>Leave Type</label>
                            <select id="leave-type" value={leaveType} onChange={(e) => setLeaveType(e.target.value as any)} className={inputStyle}>
                                <option>Normal</option>
                                <option>Emergency</option>
                                <option>Medical</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="reason" className={labelStyle}>Reason</label>
                            <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className={inputStyle} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="start-date" className={labelStyle}>Start Date</label>
                                <input type="date" id="start-date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputStyle} />
                            </div>
                            <div>
                                <label htmlFor="end-date" className={labelStyle}>End Date</label>
                                <input type="date" id="end-date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputStyle} />
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200">
                                Apply Leave
                            </button>
                        </div>
                    </div>
                </form>

                <div className="max-w-4xl mx-auto mt-10">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">My Leave History</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-gray-800">
                            <thead className="bg-gray-100 dark:bg-gray-700/50">
                                <tr>
                                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Leave Type</th>
                                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Start Date</th>
                                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">End Date</th>
                                    <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userLeaveHistory.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4 text-gray-500 dark:text-gray-400">No leave history found.</td>
                                    </tr>
                                ) : userLeaveHistory.map((leave) => (
                                    <tr key={leave.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
                                        <td className="py-2 px-4">{leave.type}</td>
                                        <td className="py-2 px-4">{leave.startDate}</td>
                                        <td className="py-2 px-4">{leave.endDate}</td>
                                        <td className="py-2 px-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                leave.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
                                                leave.status === 'Declined' ? 'bg-red-100 text-red-800' : 
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {leave.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LeaveApplyPage;
