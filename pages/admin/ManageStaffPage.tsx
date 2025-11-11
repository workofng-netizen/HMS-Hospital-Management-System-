import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { SearchIcon, PlusIcon } from '../../components/icons';
import { User, UserRole } from '../../types';

const ManageStaffPage: React.FC = () => {
    const { user } = useAuth();
    const { staff, removeStaff } = useData();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredStaff = useMemo(() => {
        if (!searchQuery) return staff;
        const lowercasedQuery = searchQuery.toLowerCase();
        return staff.filter(s =>
            s.id.toLowerCase().includes(lowercasedQuery) ||
            s.name.toLowerCase().includes(lowercasedQuery) ||
            s.role.toLowerCase().includes(lowercasedQuery) ||
            s.username.toLowerCase().includes(lowercasedQuery) ||
            (s.availability && s.availability.toLowerCase().includes(lowercasedQuery))
        );
    }, [searchQuery, staff]);
    
    const inputStyles = "p-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500 dark:placeholder-gray-400";

    const canModify = (staffMember: User): boolean => {
        if (!user) return false;
        // A user cannot modify their own account.
        if (user.id === staffMember.id) return false;

        if (user.role === UserRole.MASTER) {
            return true; // Master can manage anyone but themselves
        }
        if (user.role === UserRole.ADMIN) {
            // Admin can manage anyone but other Admins, Masters, or themselves
            return staffMember.role !== UserRole.ADMIN && staffMember.role !== UserRole.MASTER;
        }
        return false;
    };

    const handleRemove = (staffId: string) => {
        if (window.confirm('Are you sure you want to move this staff member to the recycle bin?')) {
            removeStaff(staffId);
        }
    };

    const basePath = user?.role === UserRole.MASTER ? '/master/manage-staff' : '/admin/manage-staff';

    return (
        <div className="flex flex-col h-full">
            <Header title="Manage Staff" />
            <main className="flex-grow p-6 bg-white dark:bg-gray-800 rounded-b-lg flex flex-col">
                 <div className="flex items-center mb-4">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search by Staff ID, Name, Role, Status..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`pl-10 ${inputStyles}`}
                        />
                        <SearchIcon className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                    </div>
                    <button onClick={() => navigate(`${basePath}/add`)} className="ml-4 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors flex items-center justify-center">
                        <PlusIcon className="w-5 h-5 mr-2" /> Add Staff
                    </button>
                 </div>
                 <div className="overflow-x-auto flex-grow">
                    <table className="min-w-full bg-white dark:bg-gray-800">
                        <thead className="bg-gray-100 dark:bg-gray-700/50">
                            <tr>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Staff ID</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Role</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Username</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Specialty</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStaff.map((s) => (
                                <tr key={s.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
                                    <td className="py-2 px-4">{s.id}</td>
                                    <td className="py-2 px-4">{s.name}</td>
                                    <td className="py-2 px-4">{s.role}</td>
                                    <td className="py-2 px-4">{s.username}</td>
                                    <td className="py-2 px-4">{s.specialty || 'N/A'}</td>
                                    <td className="py-2 px-4 space-x-2">
                                        <button 
                                            onClick={() => navigate(`${basePath}/edit/${s.id}`)}
                                            disabled={!canModify(s)}
                                            className="bg-blue-500 text-white text-sm py-1 px-3 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleRemove(s.id)}
                                            disabled={!canModify(s)}
                                            className="bg-danger text-white text-sm py-1 px-3 rounded-md hover:bg-danger-dark disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            Remove
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

export default ManageStaffPage;