import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const BookletCreate: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${apiUrl}/booklets`,
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate('/booklets'); // redirect to list after success
    } catch (err) {
      console.error('Failed to create booklet', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-fuchsia-600">Create Booklet</h1>
        <Link
          to="/"
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
          ← Back
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-fuchsia-600 text-white py-2 rounded-lg hover:bg-fuchsia-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default BookletCreate;
