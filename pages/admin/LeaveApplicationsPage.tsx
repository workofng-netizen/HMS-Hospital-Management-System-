import React, { useState, useMemo } from 'react';
import Header from '../../components/Header';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { SearchIcon } from '../../components/icons';
import { LeaveApplication } from '../../types';

const LeaveApplicationsPage: React.FC = () => {
    const { user } = useAuth();
    const { leaveApplications, updateLeaveApplicationStatus } = useData();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLeaveApplications = useMemo(() => {
        if (!searchQuery) {
            return leaveApplications;
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        return leaveApplications.filter(app =>
            app.id.toLowerCase().includes(lowercasedQuery) ||
            app.staffId.toLowerCase().includes(lowercasedQuery) ||
            app.staffName.toLowerCase().includes(lowercasedQuery) ||
            app.status.toLowerCase().includes(lowercasedQuery)
        );
    }, [searchQuery, leaveApplications]);

    const inputStyles = "p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500 dark:placeholder-gray-400";

    const getStatusColor = (status: LeaveApplication['status']) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Accepted': return 'bg-green-100 text-green-800';
            case 'Declined': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex flex-col h-full">
            <Header title="Leave Applications" />
            <main className="flex-grow p-6 bg-white dark:bg-gray-800 rounded-b-lg flex flex-col">
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search by ID, Staff ID, Name, or Status..."
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
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">ID</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Staff ID</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Role</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Type</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeaveApplications.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-4">No applications found.</td></tr>
                            ) : (
                                filteredLeaveApplications.map((app) => (
                                    <tr key={app.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
                                        <td className="py-2 px-4">{app.id}</td>
                                        <td className="py-2 px-4">{app.staffId}</td>
                                        <td className="py-2 px-4">{app.staffName}</td>
                                        <td className="py-2 px-4">{app.staffRole}</td>
                                        <td className="py-2 px-4">{app.type}</td>
                                        <td className="py-2 px-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 space-x-2">
                                            <button
                                                onClick={() => updateLeaveApplicationStatus(app.id, 'Accepted')}
                                                disabled={app.staffId === user?.id || app.status !== 'Pending'}
                                                className="bg-green-500 text-white text-sm py-1 px-3 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => updateLeaveApplicationStatus(app.id, 'Declined')}
                                                disabled={app.staffId === user?.id || app.status !== 'Pending'}
                                                className="bg-danger text-white text-sm py-1 px-3 rounded-md hover:bg-danger-dark disabled:bg-gray-400 disabled:cursor-not-allowed"
                                            >
                                                Decline
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default LeaveApplicationsPage;
