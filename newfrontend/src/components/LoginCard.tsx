import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    <div className="flex items-center justify-center">
      <div className="card-auth">
        <h2 className="title">Login</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="label" htmlFor="email">
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
            <label className="label" htmlFor="password">
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
            Login
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-4 text-center">
          <p className="text-sm">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
