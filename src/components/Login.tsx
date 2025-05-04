import React from 'react';
import { Link } from 'react-router-dom';

interface LoginFormProps {
  loginIdentifier: string;
  password: string;
  onLoginIdentifierChange: (val: string) => void;
  onPasswordChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error?: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({
  loginIdentifier,
  password,
  onLoginIdentifierChange,
  onPasswordChange,
  onSubmit,
  error,
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Email or Phone</label>
        <input
          type="text"
          value={loginIdentifier}
          onChange={(e) => onLoginIdentifierChange(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          placeholder="Enter email or phone number"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Login
      </button>

      <div className="mt-4 text-center">
        <Link to="/register" className="text-blue-600 hover:underline">
          Don't have an account? Register
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
