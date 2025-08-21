import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

interface Booklet {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

const BookletList: React.FC = () => {
  const [booklets, setBooklets] = useState<Booklet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooklets = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get(`${apiUrl}/booklets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooklets(res.data || []);
      } catch (err) {
        console.error('Failed to fetch booklets', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooklets();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading booklets...</p>;
  }

  return (
    <div className="w-full max-w-2xl mt-6 p-4 bg-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
      <Link
          to="/booklets"
          className="px-4 py-2  text-fuchsia-600 rounded-lg hover:bg-fuchsia-700"
        >
        <h2 className="text-lg font-semibold">Your Booklets</h2>
        </Link>
        <Link
          to="/booklets/create"
          className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700"
        >
          + Create
        </Link>
      </div>

      {booklets.length === 0 ? (
        <p className="text-gray-500">No booklets found. Create one!</p>
      ) : (
        <ul className="space-y-2">
          {booklets.map((b) => (
            <li
              key={b.id}
              className="p-3 rounded-lg hover:bg-gray-50 flex justify-between"
            >
             
              <Link
                to={`/booklets/${b.id}`}
                className="text-fuchsia-600 hover:underline"
              >
                <h3 className="font-medium text-black">{b.name}</h3>
                <p className="text-sm text-gray-500">{b.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookletList;
