import { LogOutIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from './ConfirmationDialog';

const LogOut: React.FC = () => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleLogout = () => {
    // Remove the authentication token from localStorage
    localStorage.removeItem('token');
    
    // Redirect to login page
    navigate('/login');
  };

  const handleConfirm = () => {
    handleLogout();
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <button 
        onClick={() => setShowConfirmation(true)}
        className="bg-blue-100 text-red-500 font-bold py-2 px-2 rounded transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
      >
        <LogOutIcon className="w-5 h-5 mr-2" />
      </button>
      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to log out?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default LogOut;