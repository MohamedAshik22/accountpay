import React, { useEffect, useState } from "react";
import axios from "axios";

interface ClearRequest {
  id: string;
  fromUser: string;
  toUser: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ClearRequestProps {
  senderId: string;    // user who initiated the request
  receiverId: string;  // current user (who should receive it)
  onAccept: () => void;
}

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export const ClearRequestList: React.FC<ClearRequestProps> = ({ senderId, receiverId, onAccept }) => {
  const [request, setRequest] = useState<ClearRequest | null>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  const fetchRequest = async () => {
    try {
      const response = await axios.get(`${apiUrl}/transactions/clear/${receiverId}/${senderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        const data = response.data;

        // Normalize to camelCase
        const normalized: ClearRequest = {
          id: data.ID,
          fromUser: data.from_user,
          toUser: data.to_user,
          amount: data.Amount,
          status: data.status,
          createdAt: data.CreatedAt,
          updatedAt: data.UpdatedAt,
        };

        setRequest(normalized);
        console.log("Normalized clear request:", normalized);
      } else {
        setRequest(null);
      }
    } catch (err) {
      console.error("No clear request found or failed to fetch.", err);
      setRequest(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      await axios.post(`${apiUrl}/transactions/clear/${receiverId}/${senderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onAccept();
      setRequest(null);
    } catch (err) {
      console.error("Failed to accept clear request", err);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [senderId, receiverId]);

  const isReceiver = request?.toUser === currentUserId;

  return (
    <div className="border rounded-xl p-4 shadow bg-yellow-50 space-y-3">
      <h2 className="text-xl font-semibold">Clear Request</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : !request ? (
        <p className="text-gray-500">No pending clear request.</p>
      ) : (
        <div className="p-3 border rounded bg-white flex justify-between items-center">
          <div>
            <p className="text-md">Amount: ₹{request.amount}</p>
            <p className="text-sm text-gray-500">
              {new Date(request.createdAt).toLocaleString()}
            </p>
          </div>
          {isReceiver && (
            <button
              onClick={handleAccept}
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
            >
              Approve
            </button>
          )}
        </div>
      )}
    </div>
  );
};
