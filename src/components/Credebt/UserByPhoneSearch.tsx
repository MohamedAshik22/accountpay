import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiPhone } from 'react-icons/fi'; // Phone icon

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
  const [showSearch, setShowSearch] = useState(false); // toggle input visibility
  const loggedInUserId = localStorage.getItem('userId');

  useEffect(() => {
    if (!showSearch) {
      setUser(null);
      setError(null);
      setPhoneQuery('');
      return;
    }

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiUrl}/users/search?phone=${phoneQuery}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.id) {
          setUser(response.data);
          setError(null);
        } else {
          setUser(null);
          setError('No user found.');
        }
      } catch (err) {
        console.error(err);
        setUser(null);
        setError('Error searching for user.');
      }
    };

    fetchUser();
  }, [phoneQuery, showSearch]);

  return (
    <div className="relative mt-6 w-full max-w-md">
      {/* Phone Icon button */}
      <button
        onClick={() => setShowSearch(!showSearch)}
        className="p-2 rounded bg-green-100 border transition"
        aria-label="Toggle phone search"
      >
        <FiPhone size={20} />
        Search by Phone
      </button>

      {/* Search input and results */}
      {showSearch && (
        <div className="mt-2 p-4  rounded shadow bg-white">
          <input
            type="text"
            placeholder="Enter full phone number"
            value={phoneQuery}
            onChange={(e) => setPhoneQuery(e.target.value)}
            className="border p-2 rounded w-full"
          />

          {error && <p className="text-red-500 mt-2">{error}</p>}

          {user && (
            <div className="ml-4 rounded bg-gray-50">
              <Link
                to={`/credebt/${loggedInUserId}/${user.id}`}
                className="inline-block mt-2 text-red-600"
                onClick={() => setShowSearch(false)} 
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
