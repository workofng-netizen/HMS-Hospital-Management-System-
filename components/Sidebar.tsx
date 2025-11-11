import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { navLinks, commonNavLinks } from '../constants';
import { MedicalIcon, LogoutIcon, HomeIcon, ReceptionistIcon, DoctorIcon, PharmacyIcon, AdminIcon, MasterIcon } from './icons';
import { UserRole } from '../types';
import ThemeToggle from './ThemeToggle';

const roleIcons: Record<UserRole, React.FC<{ className?: string }>> = {
    [UserRole.RECEPTIONIST]: ReceptionistIcon,
    [UserRole.DOCTOR]: DoctorIcon,
    [UserRole.PHARMACY]: PharmacyIcon,
    [UserRole.ADMIN]: AdminIcon,
    [UserRole.MASTER]: MasterIcon,
};

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredCommonLinks = user.role === UserRole.MASTER
    ? commonNavLinks.filter(link => link.path !== '/leave-apply')
    : commonNavLinks;

  const roleNavLinks = navLinks[user.role] || [];
  const allLinks = [...roleNavLinks, ...filteredCommonLinks];

  const activeLinkClass = "bg-blue-100 text-primary border-l-4 border-primary dark:bg-blue-900/50";
  const inactiveLinkClass = "hover:bg-gray-100 dark:hover:bg-gray-700";

  const RoleIcon = roleIcons[user.role];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex flex-col h-screen shadow-lg">
      <div className="p-4 flex flex-col items-center border-b border-gray-200 dark:border-gray-700">
        <img 
          src={user.profilePicture || `https://i.pravatar.cc/150?u=${user.id}`} 
          alt="Profile" 
          className="w-20 h-20 rounded-full mb-2 border-2 border-primary"
        />
        <h2 className="text-lg font-bold">{user.name}</h2>
        <div className="flex items-center text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-600 dark:text-gray-300 mt-2">
            {RoleIcon && <RoleIcon className="w-4 h-4 mr-1.5" />}
            <span>{user.role}</span>
        </div>
      </div>
      <nav className="flex-grow mt-4 overflow-y-auto">
        <NavLink
          to="/"
          className={({ isActive }) => `flex items-center px-6 py-3 text-md font-medium ${isActive ? activeLinkClass : inactiveLinkClass}`}
        >
            <HomeIcon className="w-5 h-5 mr-3" />
            Dashboard
        </NavLink>
        <div className="px-6 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Sections</div>
        {allLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `flex items-center px-6 py-3 text-md font-medium ${isActive ? activeLinkClass : inactiveLinkClass}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <ThemeToggle />
        <button
          onClick={handleLogout}
          className="flex items-center justify-center bg-danger text-white py-2 px-4 rounded-md hover:bg-danger-dark transition-colors duration-200"
        >
          <LogoutIcon className="w-5 h-5 mr-2"/>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;