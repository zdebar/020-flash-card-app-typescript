import React, { useState } from 'react';
import SubmitButton from './SubmitButton';
import InputForm from './InputForm';
import AuthForm from './AuthForm';
import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { postAuth } from '../utils/login.utils';

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

    // const API_PATH = `${process.env?.VITE_API_URL || 'http://localhost:3000'}/user/register`;
    const API_PATH = `http://localhost:3000/user/register`;

    await postAuth(
      { username, email, password },
      setUserInfo,
      setLoading,
      navigate,
      setUserError,
      API_PATH
    );
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
