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

  const [isEditingName, setIsEditingName] = useState(false);
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found.');
          setLoading(false);
          return;
        }

        const decoded = jwtDecode<JwtPayload>(token);
        const userId = decoded.userId || decoded.id || decoded.user_id;

        if (!userId) {
          setError('Invalid user ID.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${apiUrl}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(response.data);
        // Initialize inputs
        setFirstNameInput(response.data.firstName || '');
        setLastNameInput(response.data.lastName || '');
      } catch (err: any) {
        if (err.response) {
          setError(err.response.data.error || 'Failed to fetch profile.');
        } else if (err.request) {
          setError('No response from server.');
        } else {
          setError(err.message || 'Error setting up request.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditingName(true);
    setSaveError(null);
  };

  const handleCancel = () => {
    setIsEditingName(false);
    if (profile) {
      setFirstNameInput(profile.firstName || '');
      setLastNameInput(profile.lastName || '');
    }
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!profile) return;

    if (!firstNameInput.trim() || !lastNameInput.trim()) {
      setSaveError('First and last name cannot be empty.');
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found.');

      const response = await axios.put(
        `${apiUrl}/users/${profile.id}`,
        {
          firstName: firstNameInput.trim(),
          lastName: lastNameInput.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProfile(response.data);
      setIsEditingName(false);
    } catch (err: any) {
      setSaveError(err.response?.data?.error || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div
          className="bg-red-50 border border-red-300 text-red-700 px-6 py-4 rounded-lg shadow-md"
          role="alert"
        >
          {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-500 text-lg font-light">
        No profile data available.
      </div>
    );
  }

  return (
      <div className="flex justify-center items-start h-[90vh] bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 pt-20 p-6">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-8 flex flex-col items-center">
          {/* Profile Avatar */}
          <div className="relative w-28 h-28 rounded-full shadow-xl overflow-hidden mb-6">
            {profile.imageUrl ? (
              <img
                src={profile.imageUrl}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center w-full h-full">
                <span className="text-6xl font-bold text-white select-none">
                  {profile.firstName ? profile.firstName[0].toUpperCase() : 'U'}
                </span>
              </div>
            )}
          </div>

          {/* Name and Edit */}
          <div className="flex flex-col items-center w-full">
            {!isEditingName ? (
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide">
                  {profile.firstName && profile.lastName
                    ? `${profile.firstName} ${profile.lastName}`
                    : 'User Profile'}
                </h1>
                <button
                  onClick={handleEditClick}
                  aria-label="Edit name"
                  className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
                >
                  ✏️
                </button>
              </div>
            ) : (
              <div className="flex space-x-3 items-center">
                <input
                  type="text"
                  value={firstNameInput}
                  onChange={(e) => setFirstNameInput(e.target.value)}
                  placeholder="First name"
                  className="border rounded-md px-3 py-1 text-lg w-32"
                />
                <input
                  type="text"
                  value={lastNameInput}
                  onChange={(e) => setLastNameInput(e.target.value)}
                  placeholder="Last name"
                  className="border rounded-md px-3 py-1 text-lg w-32"
                />
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-indigo-600 text-white px-4 py-1 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-4 py-1 rounded-md border hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            )}
            {saveError && (
              <p className="text-red-600 mt-2 text-sm font-medium">{saveError}</p>
            )}
          </div>

          {/* Divider */}
          <div className="w-16 border-b-4 border-pink-400 rounded-full my-6"></div>

          {/* Contact Info */}
          <div className="w-full space-y-5">
            <div className="flex justify-between px-6">
              <span className="text-gray-600 font-semibold tracking-wide">Phone:</span>
              <span className="text-gray-800 font-medium">{profile.phone}</span>
            </div>
            <div className="flex justify-between px-6">
              <span className="text-gray-600 font-semibold tracking-wide">Email:</span>
              <span className="text-gray-800 font-medium break-words">{profile.email}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 text-sm text-gray-400 italic select-none">
            Accountpay.in
          </div>
        </div>
      </div>
  );
};

export default Profile;
