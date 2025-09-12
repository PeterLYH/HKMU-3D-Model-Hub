import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [formKey, setFormKey] = useState(Date.now());
  const formRef = useRef(null);
  const navigate = useNavigate();

  // Clear form on mount
  useEffect(() => {
    formRef.current.reset();
    setUsername('');
    setEmail('');
    setPassword('');
    setNickname('');
  }, []);

  // Prevent browser autofill
  const preventAutofill = (e) => {
    e.target.value = ''; // Force clear input on autofill attempt
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.endsWith('@hkmu.edu.hk') && !email.endsWith('@live.hkmu.edu.hk')) {
      setError('Please use an HKMU email address (@hkmu.edu.hk or @live.hkmu.edu.hk)');
      formRef.current.reset();
      setUsername('');
      setEmail('');
      setPassword('');
      setNickname('');
      setFormKey(Date.now());
      return;
    }
    try {
<<<<<<< HEAD
      const response = await axios.post('http://localhost:5000/api/register', {
        username,
        email,
        password,
        nickname,
      });
      setError('');
      formRef.current.reset();
      setUsername('');
      setEmail('');
      setPassword('');
      setNickname('');
      setFormKey(Date.now());
      alert(response.data.message);
      navigate('/login', { replace: true });
=======
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
>>>>>>> parent of 8d5df78 (version 1.0.1)
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      setError(
        error.response?.data?.error ||
        error.response?.data?.details ||
        'Registration failed. Please try again.'
      );
      formRef.current.reset();
      setUsername('');
      setEmail('');
      setPassword('');
      setNickname('');
      setFormKey(Date.now());
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
<<<<<<< HEAD
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-4"
          autoComplete="off"
          key={formKey}
        >
=======
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
>>>>>>> parent of 8d5df78 (version 1.0.1)
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
<<<<<<< HEAD
              name={`username-${formKey}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={preventAutofill} // Block autofill on focus
              className="w-full p-2 border rounded-md"
              autoComplete={`off-nope-${formKey}`}
              data-lpignore="true"
              data-form-type="other"
=======
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
>>>>>>> parent of 8d5df78 (version 1.0.1)
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              HKMU Email
            </label>
            <input
              type="email"
              id="email"
<<<<<<< HEAD
              name={`email-${formKey}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={preventAutofill}
              className="w-full p-2 border rounded-md"
              autoComplete={`off-nope-${formKey}`}
              data-lpignore="true"
              data-form-type="other"
=======
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
>>>>>>> parent of 8d5df78 (version 1.0.1)
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
<<<<<<< HEAD
              name={`password-${formKey}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={preventAutofill}
              className="w-full p-2 border rounded-md"
              autoComplete="new-password"
              data-lpignore="true"
              data-form-type="other"
=======
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
>>>>>>> parent of 8d5df78 (version 1.0.1)
              required
            />
          </div>
          <div>
<<<<<<< HEAD
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
              Nickname (Optional)
            </label>
            <input
              type="text"
              id="nickname"
              name={`nickname-${formKey}`}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onFocus={preventAutofill}
              className="w-full p-2 border rounded-md"
              autoComplete={`off-nope-${formKey}`}
              data-lpignore="true"
              data-form-type="other"
=======
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
>>>>>>> parent of 8d5df78 (version 1.0.1)
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => {
              formRef.current.reset();
              setUsername('');
              setEmail('');
              setPassword('');
              setNickname('');
              setFormKey(Date.now());
            }}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Clear Form
          </button>
        </form>
        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Register;