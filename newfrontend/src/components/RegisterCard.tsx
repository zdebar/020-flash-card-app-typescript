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
    <div className="flex justify-center items-center">
      <div className="rounded-lg w-[320px] shadow-md bg-gray-100 p-4">
        <div className="">
          <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-semibold mb-2">Username</label>
              <input
                type="text"
                id="username"
                className="w-full border border-gray-300 p-2 rounded-md bg-white text-sm"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                id="email"
                className="w-full border border-gray-300 p-2 rounded-md bg-white text-sm"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                id="password"
                className="w-full border border-gray-300 p-2 rounded-md bg-white text-sm"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-800 shadow-l active:shadow-none">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};
