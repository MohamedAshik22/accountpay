import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();

  // Grab token from URL
  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    if (urlToken) {
      setToken(urlToken);
    } else {
      setError("❌ Invalid or missing reset link.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password) {
      setError("❌ Password cannot be empty");
      return;
    }

    try {
      await axios.post(
        `${apiUrl}/auth/reset-password`,
        { token, newPassword: password },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage("✅ Password has been reset successfully!");
        // Redirect after short delay (optional)
    setTimeout(() => {
        navigate("/"); // Redirect to home
      }, 1000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(`❌ ${err.response.data.error}`);
      } else {
        setError("❌ An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold text-center mb-4">
        Reset Password
      </h2>

      {error && (
        <p className="mb-4 text-red-500 text-sm text-center">{error}</p>
      )}
      {message && (
        <p className="mb-4 text-green-500 text-sm text-center">{message}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
