import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputForm } from './InputForm';
import { SubmitButton } from './SubmitButton';
import { AuthForm } from './AuthForm';
import { RegisterLink } from './RegisterLink';
import { useUser } from '../hooks/useUser';
import { handleApiResponse } from '../utils/handleApiResponse';

export default function LoginCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userError, setUserError] = useState('');
  const { setUserInfo, setLoading } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const API_PATH = `${process.env.REACT_APP_API_URL}/auth/login`;

    try {
      const response = await fetch(API_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      await handleApiResponse(response, setUserInfo, setLoading, navigate);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setUserError(error.message);
      } else {
        setUserError('An unknown error occurred.');
      }
    }
  };

  return (
    <AuthForm title="Přihlášení" onSubmit={handleLogin} error={userError}>
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
      <SubmitButton>Přihlásit se</SubmitButton>
      <RegisterLink />
    </AuthForm>
  );
}
