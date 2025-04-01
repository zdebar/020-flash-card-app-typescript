import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputForm } from './InputForm';
import { SubmitButton } from './SubmitButton';
import { AuthForm } from './AuthForm';
import { RegisterLink } from './RegisterLink';

export default function LoginCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          console.log('Token stored succesfully!');
          navigate('/');
        } else {
          setError('Token not received');
        }
      } else {
        const errorData = await response.json();
        console.error('Error logging in:', errorData);
        setError(errorData.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An error occurred while logging in.');
    }
  };

  return (
    <AuthForm title="Přihlášení" onSubmit={handleLogin} error={error}>
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
