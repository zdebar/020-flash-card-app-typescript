import React, { useState } from 'react';
import { SubmitButton } from './SubmitButton';
import { InputForm } from './InputForm';
import { AuthForm } from './AuthForm';

export default function RegisterCard() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('token', data.token);
          window.location.href = '/';
        } else {
          setError(data.message || 'Token not received');
        }
      } else {
        const errorData = await response.json();
        console.error('Error registering:', errorData);
        setError(errorData.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error registering:', error);
      setError('An error occurred while registering.');
    }
  };

  return (
    <AuthForm title="Registrace" onSubmit={handleRegister} error={error}>
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
