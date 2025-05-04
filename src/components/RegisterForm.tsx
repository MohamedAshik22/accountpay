import React from 'react';
import { Link } from 'react-router-dom';

interface RegisterFormProps {
  name: string;
  email: string;
  phone: string;
  password: string;
  onNameChange: (val: string) => void;
  onEmailChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
  onPasswordChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error?: string | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  name,
  email,
  phone,
  password,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onPasswordChange,
  onSubmit,
  error,
}) => {
  return (
    <form onSubmit={onSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
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
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        Register
      </button>
      <p className="mt-4 text-center">  
      Already have an account?{' '}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login here
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
