import { LogOutIcon } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogOut: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the authentication token from localStorage
    localStorage.removeItem('token');
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <button 
      onClick={handleLogout} 
      className="bg-blue-100 text-red-500 font-bold py-2 px-2 rounded transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
    >
      <LogOutIcon className="w-5 h-5 mr-2" />
    </button>
  );
};

export default LogOut;