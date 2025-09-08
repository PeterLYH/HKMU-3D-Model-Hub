import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', nickname: '' });
  const [icon, setIcon] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIconChange = (e) => {
    setIcon(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/register', formData);
      if (icon) {
        const loginResponse = await axios.post('http://localhost:5000/api/login', {
          identifier: formData.username,
          password: formData.password,
        });
        localStorage.setItem('token', loginResponse.data.token);
        localStorage.setItem('userId', loginResponse.data.user.id);
        localStorage.setItem('nickname', loginResponse.data.user.nickname);
        localStorage.setItem('icon', loginResponse.data.user.icon);
        const formDataIcon = new FormData();
        formDataIcon.append('icon', icon);
        await axios.post('http://localhost:5000/api/profile', formDataIcon, {
          headers: {
            Authorization: `Bearer ${loginResponse.data.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
      console.error('Register error:', error.response?.data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">Nickname</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Optional"
            />
          </div>
          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700">Profile Icon</label>
            <input
              type="file"
              id="icon"
              accept="image/png,image/jpeg"
              onChange={handleIconChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;