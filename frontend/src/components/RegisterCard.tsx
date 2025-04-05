import React, { useState } from 'react';
import SubmitButton from './SubmitButton';
import InputForm from './InputForm';
import AuthForm from './AuthForm';
import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { handleLoginResponse } from '../utils/handleLoginResponse';
import { handleLoginError } from '../utils/errorHandlers';

export default function RegisterCard() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userError, setUserError] = useState('');
  const { setUserInfo, setLoading } = useUser();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Register form submitted with:', { username, email, password });

    // const API_PATH = `${process.env?.VITE_API_URL || 'http://localhost:3000'}/auth/register`;
    const API_PATH = `http://localhost:3000/auth/register`;
    console.log('API Path:', API_PATH);

    // // Optionally, you can throw an error if the environment variable is missing
    // if (!process.env?.VITE_API_URL) {
    //   console.warn(
    //     'Environment variable REACT_APP_API_URL is not defined. Using fallback URL.'
    //   );
    // }

    try {
      const response = await fetch(API_PATH, {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('API response:', response);

      await handleLoginResponse(response, setUserInfo, setLoading, navigate);
    } catch (error: unknown) {
      console.error('Error during registration:', error);
      handleLoginError(error, setUserError);
    }
  };

  return (
    <AuthForm title="Registrace" onSubmit={handleRegister} error={userError}>
      <InputForm
        type="text"
        label="Uživatelské jméno"
        placeholder="Zadejte své uživatelské jméno"
        value={username}
        onChange={setUsername}
      />
      <InputForm
        type="email"
        label="Email"
        placeholder="Zadejte svůj e-mail"
        value={email}
        onChange={setEmail}
      />
      <InputForm
        type="password"
        label="Heslo"
        placeholder="Zadejte svoje heslo"
        value={password}
        onChange={setPassword}
      />
      <SubmitButton>Zaregistrovat se</SubmitButton>
    </AuthForm>
  );
}
