import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import LogOut from './LogOut';

// Default user icon as SVG
const DefaultUserIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="w-8 h-8 text-gray-500"
  >
    <path 
      fillRule="evenodd" 
      d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097c1.504-1.055 3.422-1.847 5.685-1.847 2.263 0 4.18.792 5.685 1.847zm-1.435-1.622c-1.264-.794-2.848-1.275-4.25-1.275a6.08 6.08 0 00-4.25 1.275 7.249 7.249 0 005.855 2.919 7.25 7.25 0 005.855-2.919zM12 10.5a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" 
      clipRule="evenodd" 
    />
  </svg>
);

// Define a type for JWT payload
interface JwtPayload {
  userId?: string;
  id?: string;
  user_id?: string;
  [key: string]: any;
}

// Define a type for user profile
interface UserProfile {
  image?: string;
  firstName?: string;
}

const Header: React.FC = () => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Decode the token to get user ID
        const decoded = jwtDecode<JwtPayload>(token);
        const userId = decoded.userId || decoded.id || decoded.user_id;

        if (!userId) return;

        const response = await axios.get<UserProfile>(`${apiUrl}/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Set user image if available
        if (response.data.image) {
          setUserImage(response.data.image);
        }
        if (response.data.firstName) {
          setFirstName(response.data.firstName);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [apiUrl]);

  const getInitial = () => {
    if (!firstName) return null;
    return firstName.charAt(0).toUpperCase();
  };


  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* App Name / Home Link */}
        <Link 
          to="/" 
          className="text-2xl font-bold hover:text-blue-200 transition-colors duration-300"
        >
          AccountPay
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-4">
          <Link 
            to="/pftracker" 
            className="hover:text-blue-200 transition-colors duration-300"
          >
            Finance Tracker
          </Link>
         
          <Link 
            to="/profile" 
            className="flex items-center justify-center bg-white rounded-full w-8 h-8 text-blue-600 font-bold text-lg shadow-md hover:text-black transition-colors duration-300"
          >
            {userImage ? (
              <img 
                src={userImage} 
                alt="Profile" 
                className="w-8 h-8 rounded-full mr-2"
              />
            ) : (
               // Show initial letter in circle background
              getInitial() || "?"
              // <DefaultUserIcon />
            )}
          </Link>
          <LogOut />
        </nav>
      </div>
    </header>
  );
};

export default Header;