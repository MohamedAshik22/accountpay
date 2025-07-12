import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FiPhone } from 'react-icons/fi';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
}

const UserByPhoneSearch: React.FC = () => {
  const [phoneQuery, setPhoneQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const loggedInUserId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      if (!phoneQuery.trim() || !token) return;

      try {
        const response = await axios.get(`${apiUrl}/users/search?phone=${phoneQuery}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.id) {
          setUser(response.data);
          setError(null);
        } else {
          setUser(null);
          setError('No user found.');
        }
      } catch (err) {
        console.error('Error searching for user:', err);
        setUser(null);
        setError('Error searching for user.');
      }
    };

    if (showSearch) fetchUser();
    else {
      setPhoneQuery('');
      setUser(null);
      setError(null);
    }
  }, [phoneQuery, showSearch, token]);

  const handleAddRecentUser = async (contactUserId: string) => {
    if (!loggedInUserId || !token) {
      navigate('/login');
      return;
    }

    try {
      const payload = { contactUserId };

      const response = await axios.post(
        `${apiUrl}/users/${loggedInUserId}/recent-users`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error response:", error.response?.data);
      } else {
        console.error("Unknown error occurred:", error);
      }
    }
  };

  return (
    <div className="relative mt-6 w-full max-w-md">
      <button
        onClick={() => setShowSearch(!showSearch)}
        className="p-2 rounded transition flex flex-col items-center gap-2"
        aria-label="Toggle phone search"
      >
        <FiPhone size={20} className='text-green-600'/>
        <p className='text-black'>Pay Phone Number</p>
      </button>

      {showSearch && (
        <div className="mt-2 p-4 rounded  ">
          <input
            type="text"
            placeholder="Enter full phone number"
            value={phoneQuery}
            onChange={(e) => setPhoneQuery(e.target.value)}
            className="border p-2 rounded w-full"
          />

          {error && <p className="text-red-500 mt-2">{error}</p>}

          {user && (
            <div className="ml-4 rounded bg-gray-50 p-2">
              <Link
                to={`/credebt/${loggedInUserId}/${user.id}`}
                className="inline-block text-blue-600 hover:underline"
                onClick={() => {
                  handleAddRecentUser(user.id);
                  setShowSearch(false);
                }}
              >
                {user.firstName} {user.lastName}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserByPhoneSearch;
