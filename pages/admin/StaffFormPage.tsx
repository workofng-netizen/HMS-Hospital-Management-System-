import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { User, UserRole } from '../../types';

const StaffFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { staff, addStaff, updateStaff } = useData();
    const { user: currentUser } = useAuth();
    const isEditMode = Boolean(id);

    const initialFormState: Omit<User, 'id' | 'password'> = {
        name: '',
        role: UserRole.RECEPTIONIST,
        username: '',
        email: '',
        gender: 'Other',
        contact: '',
        specialty: '',
    };

    const [formData, setFormData] = useState(initialFormState);
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (isEditMode && id) {
            const staffToEdit = staff.find(s => s.id === id);
            if (staffToEdit) {
                setFormData(staffToEdit);
            }
        }
    }, [id, isEditMode, staff]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!isEditMode && password.trim() === '') {
            alert('Password is required for new staff members.');
            return;
        }

        const dataToSave = { ...formData };
        if (dataToSave.role !== UserRole.DOCTOR) {
            delete dataToSave.specialty;
        }

        if (isEditMode && id) {
            const originalStaff = staff.find(s => s.id === id);
            if (!originalStaff) return; // Should not happen

            const updatedStaff: User = {
                ...originalStaff, // Start with original data to preserve password if not changed
                ...dataToSave, // Apply form changes
                id,
            };

            if (password.trim() !== '') {
                updatedStaff.password = password; // Overwrite password only if a new one is provided
            }
            
            updateStaff(updatedStaff);
        } else {
            addStaff({ ...dataToSave, password });
        }
        navigate(-1); // Go back to the manage staff page
    };

    const roleOptions = Object.values(UserRole).filter(role => {
        if (currentUser?.role === UserRole.MASTER) {
            return true; // Master can create any role
        }
        if (currentUser?.role === UserRole.ADMIN) {
            return role !== UserRole.ADMIN && role !== UserRole.MASTER;
        }
        return false;
    });

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-gray-900 dark:text-gray-100";
    const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="flex flex-col h-full">
            <Header title={isEditMode ? 'Edit Staff Member' : 'Add Staff Member'} />
            <main className="flex-grow p-8 bg-white dark:bg-gray-800 rounded-b-lg flex flex-col">
                <form className="max-w-4xl mx-auto flex-grow w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isEditMode && (
                             <div>
                                <label className={labelStyle}>Staff ID</label>
                                <input type="text" value={id} className={`${inputStyle} bg-gray-100 dark:bg-gray-600 cursor-not-allowed`} readOnly />
                            </div>
                        )}
                         <div>
                            <label htmlFor="name" className={labelStyle}>Name</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="role" className={labelStyle}>Role</label>
                            <select id="role" name="role" value={formData.role} onChange={handleChange} className={inputStyle} disabled={isEditMode && currentUser?.role === UserRole.ADMIN && (formData.role === UserRole.ADMIN || formData.role === UserRole.MASTER)}>
                                {roleOptions.map(role => <option key={role} value={role}>{role}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="username" className={labelStyle}>Username</label>
                            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className={inputStyle} />
                        </div>
                         <div>
                            <label htmlFor="password" className={labelStyle}>Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                name="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className={inputStyle} 
                                placeholder={isEditMode ? "Leave blank to keep current password" : "Required"}
                            />
                        </div>
                        {formData.role === UserRole.DOCTOR && (
                             <div>
                                <label htmlFor="specialty" className={labelStyle}>Specialty</label>
                                <input type="text" id="specialty" name="specialty" value={formData.specialty || ''} onChange={handleChange} className={inputStyle} />
                            </div>
                         )}
                         <div>
                            <label htmlFor="contact" className={labelStyle}>Contact</label>
                            <input type="tel" id="contact" name="contact" value={formData.contact} onChange={handleChange} className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="email" className={labelStyle}>Email</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="gender" className={labelStyle}>Gender</label>
                            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className={inputStyle}>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>
                </form>
                <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-start items-center">
                    <button onClick={handleSave} className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 mr-4">
                        Save
                    </button>
                    <button onClick={() => navigate(-1)} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
                        Cancel
                    </button>
                </div>
            </main>
        </div>
    );
};

export default StaffFormPage;