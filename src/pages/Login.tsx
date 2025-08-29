import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Login';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios'; 
import api from '../lib/authClient';

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
      // 🔑 Login request (use raw axios, no token needed here)
      const res = await axios.post(`${apiUrl}/auth/login`, {
        loginIdentifier,
        password
      });

      const { access_token, refresh_token } = res.data;

      // Save tokens
      localStorage.setItem('token', access_token);
      localStorage.setItem('refreshToken', refresh_token);

      // Decode access token to extract user details
      const decodedToken = jwtDecode<JwtPayload>(access_token);

      // Get user info
      const userId = decodedToken.userId || decodedToken.user_id || decodedToken.id;
      const firstName = decodedToken.firstName || '';
      console.log('User ID from decoded token:', userId);

      // Save to storage
      localStorage.setItem('userId', userId.toString());
      localStorage.setItem('firstName', firstName);

      // 🔍 Fetch user's profile with the token (use api instance now)
      const profileRes = await api.get(`/users/${userId}`);
      const createdAt = profileRes.data?.created_at;
      if (createdAt) {
        localStorage.setItem('userCreatedDate', createdAt);
      }

      // ✅ Navigate after login
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Invalid credentials or server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100">
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
