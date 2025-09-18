import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const formRef = useRef(null);

  const preventAutofill = (e) => {
    e.target.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://hkmu-3d-model-hub-backend.onrender.com/api/register', {
        username,
        email,
        password,
        nickname,
      });
      console.log('Register response:', response.data);
      setUsername('');
      setEmail('');
      setPassword('');
      setNickname('');
      if (formRef.current) formRef.current.reset();
      navigate('/login');
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Registration failed';
      setError(errorMsg);
      console.error('Registration error:', errorMsg, error.response?.data?.details || '');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Register for HKMU 3D Model Hub</h1>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={preventAutofill}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              autoComplete="new-password"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={preventAutofill}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              autoComplete="new-password"
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
              onChange={(e) => setPassword(e.target.value)}
              onFocus={preventAutofill}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              autoComplete="new-password"
              required
            />
          </div>
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">Nickname (Optional)</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onFocus={preventAutofill}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              autoComplete="new-password"
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