import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post('http://localhost:3000/users/register', {
        name,
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <RegisterForm
        name={name}
        email={email}
        password={password}
        onNameChange={setName}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleRegister}
        error={error}
      />
    </div>
  );
};

export default RegisterPage;
