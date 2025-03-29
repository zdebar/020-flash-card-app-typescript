import React, { useState } from 'react';

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
    <div className="flex items-center justify-center">
      <div className="card-auth">
        <h2 className="title">Register</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="username" className="label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-rec btn-blue">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
