import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [identifier, setIdentifier] = useState(localStorage.getItem('rememberedIdentifier') || '');
  const [password, setPassword] = useState(localStorage.getItem('rememberedPassword') || '');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedIdentifier = localStorage.getItem('rememberedIdentifier');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    if (rememberedIdentifier && rememberedPassword) {
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setRememberMe(checked);
    } else {
      if (name === 'identifier') setIdentifier(value);
      if (name === 'password') setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://hkmu-3d-model-hub-backend.onrender.com/api/login', {
        identifier,
        password,
      });
      console.log('Login response:', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('username', response.data.user.username);
      localStorage.setItem('nickname', response.data.user.nickname || '');
      localStorage.setItem('icon', response.data.user.icon || '');
      localStorage.setItem('role', response.data.user.role); // Store role
      if (rememberMe) {
        localStorage.setItem('rememberedIdentifier', identifier);
        localStorage.setItem('rememberedPassword', password);
      } else {
        localStorage.removeItem('rememberedIdentifier');
        localStorage.removeItem('rememberedPassword');
      }
      window.dispatchEvent(new Event('loginUpdate'));
      navigate('/browser');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
      console.error('Login error:', error.response?.data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Login to HKMU 3D Model Hub</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">Username or Email</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={identifier}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              autoComplete={rememberMe ? 'on' : 'off'}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              autoComplete={rememberMe ? 'on' : 'new-password'}
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">Remember Me</label>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;