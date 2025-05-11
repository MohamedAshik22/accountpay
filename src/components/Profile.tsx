import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  userId: number;
  id: number;
  user_id: number;
}

interface UserProfile {
  id: string;
  email: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found');
          setLoading(false);
          return;
        }

        const decoded = jwtDecode<JwtPayload>(token);
        const userId = decoded.userId || decoded.id || decoded.user_id;

        if (!userId) {
          setError('Invalid user ID');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${apiUrl}/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        });
        setProfile(response.data);
        setLoading(false);
      } catch (err: any) {
        if (err.response) {
          setError(err.response.data.error || 'Failed to fetch profile');
        } else if (err.request) {
          setError('No response from server');
        } else {
          setError(err.message || 'Error setting up request');
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const truncateBase64Image = (base64Image: string, maxLength = 10000) => {
    if (base64Image && base64Image.length > maxLength) {
      return base64Image.substring(0, maxLength) + '...';
    }
    return base64Image;
  };

  if (loading) return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      {error}
    </div>
  );

  if (!profile) return (
    <div className="text-center text-gray-500">No profile data available</div>
  );

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        {profile.imageUrl && !imageError ? (
          <img 
            src={truncateBase64Image(profile.imageUrl)} 
            alt={`${profile.firstName || 'User'} profile`} 
            className="w-32 h-32 rounded-full mx-auto object-cover mb-4 border-4 border-blue-500"
            onError={() => {
              setImageError(true);
            }}
          />
        ) : (
          <div className="w-32 h-32 rounded-full mx-auto bg-gray-300 flex items-center justify-center text-gray-600 mb-4">
            <span className="text-2xl">
              {profile.firstName ? profile.firstName[0].toUpperCase() : 'U'}
            </span>
          </div>
        )}

        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {profile.firstName && profile.lastName 
              ? `${profile.firstName} ${profile.lastName}` 
              : 'User Profile'}
          </h2>
          
          <div className="text-gray-600 space-y-2">
            <p>
              <span className="font-medium">Phone:</span> {profile.phone}
            </p>
            <p>
              <span className="font-medium">Email:</span> {profile.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;