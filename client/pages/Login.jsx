import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
<<<<<<< HEAD
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        identifier,
        password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.id); // Store userId
      localStorage.setItem('nickname', response.data.user.nickname || '');
      localStorage.setItem('username', response.data.user.username);
      if (rememberMe) {
        localStorage.setItem('identifier', identifier);
        localStorage.setItem('password', password);
      } else {
        localStorage.removeItem('identifier');
        localStorage.removeItem('password');
      }
      window.dispatchEvent(new Event('loginUpdate'));
      navigate('/my-models', { replace: true });
=======
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      console.log('Login response:', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('nickname', response.data.user.nickname);
      localStorage.setItem('icon', response.data.user.icon);
      navigate('/');
>>>>>>> parent of 8d5df78 (version 1.0.1)
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
      console.error('Login error:', error.response?.data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">Username or Email</label>
            <input
              type="text"
              id="identifier"
<<<<<<< HEAD
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-2 border rounded-md"
              autoComplete={rememberMe ? 'on' : 'off'}
=======
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
>>>>>>> parent of 8d5df78 (version 1.0.1)
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
<<<<<<< HEAD
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
              autoComplete={rememberMe ? 'on' : 'off'}
              required
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-600">Remember Me</label>
          </div>
=======
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
>>>>>>> parent of 8d5df78 (version 1.0.1)
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;