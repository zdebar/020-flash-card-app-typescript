import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputForm from './InputForm';
import SubmitButton from './SubmitButton';
import AuthForm from './AuthForm';
import RegisterLink from './RegisterLink';
import { useUser } from '../hooks/useUser';
import { authenticationAPI } from '../utils/login.utils';

export default function LoginCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userError, setUserError] = useState('');
  const { setUserInfo, setLoading } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Register form submitted with:', { email, password });

    // const API_PATH = `${process.env.REACT_APP_API_URL}/auth/login`;
    const API_PATH = `http://localhost:3000/user/login`;

    await authenticationAPI(
      { email, password },
      setUserInfo,
      setLoading,
      navigate,
      setUserError,
      API_PATH
    );
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
