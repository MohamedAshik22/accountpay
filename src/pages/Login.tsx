import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/Login';

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
      localStorage.setItem('token', res.data.token);
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
