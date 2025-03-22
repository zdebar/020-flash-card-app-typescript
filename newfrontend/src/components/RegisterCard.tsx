import React, { useState } from 'react';

export function RegisterCard() {
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
        setError(errorData.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error registering:', error);
      setError('An error occurred while registering.');
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="card w-[320px] shadow-md bg-gray-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-semibold">Username</label>
              <input
                type="text"
                id="username"
                className="input input-bordered w-full mt-2"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold">Email</label>
              <input
                type="email"
                id="email"
                className="input input-bordered w-full mt-2"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-semibold">Password</label>
              <input
                type="password"
                id="password"
                className="input input-bordered w-full mt-2"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};
