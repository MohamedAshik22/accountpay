// src/components/LogOut.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from './ConfirmationDialog';

type LogOutProps = {
  className?: string;
  variant?: 'button' | 'menu';
  onAfterLogout?: () => void;
  label?: string;
};

const LogOut: React.FC<LogOutProps> = ({
  className = '',
  variant = 'button',
  onAfterLogout,
  label = 'Logout',   // ✅ default text
}) => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (onAfterLogout) onAfterLogout();
    navigate('/login');
  };

  const handleConfirm = () => {
    handleLogout();
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  // Styles per variant
  const baseMenu =
    'w-full text-left block px-4 py-2 text-sm rounded-md';
  const menuClasses = `${baseMenu} text-red-600 hover:bg-red-50 ${className}`;
  const buttonClasses =
    `bg-blue-100 text-red-500 font-bold py-2 px-4 rounded transition-colors duration-300
     ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 ${className}`;

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowConfirmation(true);
        }}
        className={variant === 'menu' ? menuClasses : buttonClasses}
      >
        {label}
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
