import React, { useState } from "react";
import axios from "axios";

interface Props {
  userA: string;
  userB: string;
  onTransactionCreated: () => void;
}

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export const NewTransactionForm: React.FC<Props> = ({ userA, userB, onTransactionCreated }) => {
  const [amount, setAmount] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }
  
      await axios.post(
        `${apiUrl}/transactions`,
        {
          from: userA,
          to: userB,
          amount: parseFloat(amount),
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setAmount("");
      setMessage("");
      onTransactionCreated(); 
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 flex rounded shadow space-x-4">

      {error && <p className="text-red-500">{error}</p>}

      <input
        type="number"
        placeholder="Amount (₹)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        required
      />

      <input
        type="text"
        placeholder="Message (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4  rounded hover:bg-blue-700"
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  );
};
