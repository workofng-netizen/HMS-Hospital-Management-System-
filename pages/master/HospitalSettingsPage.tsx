import React, { useState } from 'react';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import DateTime from '../../components/DateTime';

const HospitalSettingsPage: React.FC = () => {
    const { hospitalName, setHospitalName, hospitalLogo, setHospitalLogo } = useAuth();
    const [name, setName] = useState(hospitalName);

    const handleSave = () => {
        setHospitalName(name);
        alert("Settings saved!");
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setHospitalLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleRemoveLogo = () => {
        setHospitalLogo(null);
    }

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-gray-900 dark:text-gray-100";
    const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300";

    return (
        <div className="flex flex-col h-full">
            <Header title="Hospital Settings" showDateTime={false} />
            <main className="flex-grow p-8 bg-white dark:bg-gray-800 rounded-b-lg flex flex-col">
                <div className="max-w-2xl mx-auto flex-grow w-full">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 mb-6">
                        General Settings
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="hospital-name" className={labelStyle}>
                                Hospital Name
                            </label>
                            <input
                                type="text"
                                id="hospital-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={inputStyle}
                            />
                        </div>
                        <div>
                             <label className={labelStyle}>
                                Hospital Logo
                            </label>
                            <div className="mt-2 flex items-center space-x-4">
                                {hospitalLogo ? (
                                    <img src={hospitalLogo} alt="Hospital Logo" className="w-20 h-20 object-cover rounded-full bg-gray-100 dark:bg-gray-700 p-1 border border-gray-300 dark:border-gray-600" />
                                ) : (
                                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-gray-600">
                                        <span className="text-xs text-center">No Logo</span>
                                    </div>
                                )}
                                <div className="flex flex-col space-y-2">
                                    <input
                                        type="file"
                                        id="logo-upload"
                                        className="hidden"
                                        accept="image/png, image/jpeg, image/svg+xml"
                                        onChange={handleLogoChange}
                                    />
                                    <label htmlFor="logo-upload" className="cursor-pointer bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                        Upload new logo
                                    </label>
                                    {hospitalLogo && (
                                        <button onClick={handleRemoveLogo} className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-left">
                                            Remove logo
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button 
                                onClick={handleSave}
                                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
                 <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <DateTime />
                </div>
            </main>
        </div>
    );
};

export default HospitalSettingsPage;