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
      className="logout-button bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
    >
      Logout
    </button>
  );
};

export default LogOut;