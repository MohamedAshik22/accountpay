import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Login';
import {jwtDecode} from 'jwt-decode'; // Correct named import for jwt-decode

interface JwtPayload {
  userId: number;
  id: number;
  user_id: number;
  firstName?: string;
}

const LoginPage: React.FC = () => {
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post(`${apiUrl}/auth/login`, {
        loginIdentifier,
        password
      });

      // Get the token from the response
      const token = res.data.token;

      // Save the token to localStorage
      localStorage.setItem('token', token);

      // Decode the token to extract user details
      const decodedToken = jwtDecode<JwtPayload>(token); // Decode with JwtPayload type
      console.log('Decoded Token:', decodedToken);
      // Assuming the user ID is stored under 'userId' or 'user_id'
      const userId = decodedToken.userId || decodedToken.user_id || decodedToken.id;
      const firstName = decodedToken.firstName || '';
      console.log('User ID from decoded token:', userId);

      // Save the userId in localStorage
      localStorage.setItem('userId', userId.toString());
      localStorage.setItem('firstName', firstName);

      // Navigate after successful login
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Invalid credentials or server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm
        loginIdentifier={loginIdentifier}
        password={password}
        onLoginIdentifierChange={setLoginIdentifier}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
        error={error}
      />
    </div>
  );
};

export default LoginPage;
