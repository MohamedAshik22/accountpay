// src/components/UserList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const loggedInUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiUrl}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Exclude logged-in user
        const otherUsers = response.data.filter((user: User) => user.id !== loggedInUserId);
        setUsers(otherUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="w-full mt-6">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <div className="grid grid-cols-2 gap-4">
        {users.map((user) => (
          <Link
            to={`/credebt/${loggedInUserId}/${user.id}`}
            key={user.id}
            className="p-4 bg-white shadow rounded hover:bg-gray-100 transition"
          >
            {user.firstName} {user.lastName}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserList;
