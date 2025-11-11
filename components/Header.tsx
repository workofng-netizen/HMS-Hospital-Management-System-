import React from 'react';
import { useAuth } from '../context/AuthContext';
import DateTime from './DateTime';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showDateTime?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, showDateTime = true }) => {
  const { hospitalName } = useAuth();
  return (
    <div className="bg-header dark:bg-gray-800 p-6 rounded-t-lg flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{hospitalName}</h1>
        <h2 className="text-xl text-gray-600 dark:text-gray-300">{title}</h2>
        {subtitle && <p className="mt-1 text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </div>
      {showDateTime && <DateTime />}
    </div>
  );
};

export default Header;