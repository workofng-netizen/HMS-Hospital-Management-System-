import React, { useState } from 'react';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types';

const ProfilePage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    
    const handleSaveChanges = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updatedData = Object.fromEntries(formData.entries());
        
        const userUpdatePayload: Partial<User> = {
            name: updatedData.name as string,
            email: updatedData.email as string,
            gender: updatedData.gender as 'Male' | 'Female' | 'Other',
            contact: updatedData.contact as string,
            username: updatedData.username as string,
        };
        
        if (password.trim() !== '') {
            userUpdatePayload.password = password;
        }

        updateUser(userUpdatePayload);
        alert('Profile saved!');
    };

    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    updateUser({ profilePicture: reader.result as string });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    if (!user) return <div>Loading...</div>;

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-gray-900 dark:text-gray-100";
    const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="flex flex-col h-full">
            <Header title="Profile" />
            <main className="flex-grow p-8 bg-white dark:bg-gray-800 rounded-b-lg overflow-y-auto flex flex-col">
                <form onSubmit={handleSaveChanges} className="max-w-4xl mx-auto flex-grow w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Side: Inputs */}
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <label className={labelStyle}>Name</label>
                                <input type="text" name="name" defaultValue={user.name} className={inputStyle} />
                            </div>
                            <div>
                                <label className={labelStyle}>Email</label>
                                <input type="email" name="email" defaultValue={user.email} className={inputStyle} />
                            </div>
                            <div>
                                <label className={labelStyle}>Gender</label>
                                <select name="gender" defaultValue={user.gender} className={inputStyle}>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                             <div>
                                <label className={labelStyle}>Contact</label>
                                <input type="text" name="contact" defaultValue={user.contact} className={inputStyle} />
                            </div>
                            <div>
                                <label className={labelStyle}>Username</label>
                                <input type="text" name="username" defaultValue={user.username} className={inputStyle} />
                            </div>
                            <div>
                                <label className={labelStyle}>Password</label>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? 'text' : 'password'} 
                                        name="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={inputStyle} 
                                        placeholder="Leave blank to keep current password"
                                    />
                                </div>
                                <div className="mt-2 flex items-center">
                                    <input id="show-password" type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-500 rounded" />
                                    <label htmlFor="show-password" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">Show password</label>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200">
                                    Save Changes
                                </button>
                            </div>
                        </div>

                        {/* Right Side: Profile Picture */}
                        <div className="flex flex-col items-center">
                            <img src={user.profilePicture || `https://i.pravatar.cc/150?u=${user.id}`} alt="Profile" className="w-40 h-40 rounded-full mb-4 border-4 border-primary shadow-lg object-cover"/>
                            <input 
                                type="file" 
                                id="profile-picture-upload" 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleProfilePictureChange} 
                            />
                            <label htmlFor="profile-picture-upload" className="cursor-pointer text-sm bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
                                Change Profile Picture
                            </label>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default ProfilePage;