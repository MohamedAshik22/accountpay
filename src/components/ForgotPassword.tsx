import axios from "axios";
import { useState, useEffect } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0); // countdown in seconds
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("❌ Email is required");
      return;
    }

    try {
      await axios.post(`${apiUrl}/auth/forgot-password`, { email });
      setMessage("✅ Check your email for the reset link.");
      setCooldown(30); // disable for 30 seconds
    } catch {
      setError("❌ Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md transition-transform transform hover:scale-[1.01]"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Forgot Password
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 rounded-lg p-3 mb-4 text-center">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-100 text-green-700 border border-green-300 rounded-lg p-3 mb-4 text-center">
            {message}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1 text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            placeholder="Enter your email"
            required
            disabled={cooldown > 0}
          />
        </div>

        <button
          type="submit"
          disabled={cooldown > 0}
          className={`w-full py-3 rounded-lg font-medium transition ${
            cooldown > 0
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
          }`}
        >
          {cooldown > 0 ? `Resend link in ${cooldown}s` : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
