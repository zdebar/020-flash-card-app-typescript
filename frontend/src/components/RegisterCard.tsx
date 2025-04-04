import React, { useState } from 'react';
import SubmitButton from './SubmitButton';
import InputForm from './InputForm';
import AuthForm from './AuthForm';
import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { handleApiResponse } from '../utils/handleApiResponse';
import { handleAPIError } from '../utils/errorHandlers';

export default function RegisterCard() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userError, setUserError] = useState('');
  const { setUserInfo, setLoading } = useUser();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const API_PATH = `${process.env.REACT_APP_API_URL}/auth/register`;

    try {
      const response = await fetch(API_PATH, {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      await handleApiResponse(response, setUserInfo, setLoading, navigate);
    } catch (error: unknown) {
      handleAPIError(error, setUserError);
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
