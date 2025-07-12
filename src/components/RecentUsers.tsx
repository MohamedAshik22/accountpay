import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  imageUrl?: string;
  updatedAt: string;
}

interface RecentUsersProps {
  loggedInUserId: string;
  apiBaseUrl: string;
}

const RecentUsers: React.FC<RecentUsersProps> = ({ loggedInUserId, apiBaseUrl }) => {
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchRecentUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get<User[]>(`${apiBaseUrl}/users/${loggedInUserId}/recent-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Sort by updatedAt DESC (newest first)
      const sortedUsers = res.data.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      setRecentUsers(sortedUsers);
      setError(null);
    } catch {
      setError("Failed to load recent users.");
    } finally {
      setLoading(false);
    }
  };

  // Call this when user clicks a recent user item
  const handleSelectUser = async (userId: string) => {
    if (!loggedInUserId || !token) {
      navigate("/login");
      return;
    }

    try {
      // Post again to update 'updatedAt' in backend
      await axios.post(
        `${apiBaseUrl}/users/${loggedInUserId}/recent-users`,
        { contactUserId: userId },
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      );

      // Refresh the list to reflect new updatedAt order
      fetchRecentUsers();

      // Navigate to the credebt page
      navigate(`/credebt/${loggedInUserId}/${userId}`);
    } catch {
      setError("Failed to update recent user.");
    }
  };

  useEffect(() => {
    if (loggedInUserId) fetchRecentUsers();
  }, [loggedInUserId]);

  if (loading) return <p className="text-gray-500">Loading recent users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className=" p-4 rounded  max-w-md w-full">
      <h2 className="text-xl font-semibold mb-3">Recent Users</h2>
      {recentUsers.length === 0 ? (
        <p className="text-gray-500">No recent users found.</p>
      ) : (
        <ul
          className="grid grid-cols-4 gap-4"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          {recentUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => handleSelectUser(user.id)}
              className="flex flex-col items-center space-y-1 p-2 rounded hover:shadow cursor-pointer "
              title={`${user.firstName} ${user.lastName}`}
            >
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-200 to-blue-200 flex items-center justify-center text-black font-bold text-xl">
                  {user.firstName.charAt(0)}
                </div>
              )}
              <span className="text-indigo-900 text-center text-sm truncate w-full">
                {user.firstName} {user.lastName}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentUsers;
