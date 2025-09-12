import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState(''); // Could extend to { email: '', general: '' } for field-specific
  const [isLoading, setIsLoading] = useState(false);
  const [formKey, setFormKey] = useState(Date.now());
  const formRef = useRef(null);
  const navigate = useNavigate();

  // Centralized reset function
  const resetForm = () => {
    formRef.current.reset();
    setUsername('');
    setEmail('');
    setPassword('');
    setNickname('');
    setError('');
    setFormKey(Date.now()); // Remount to bust autofill cache
  };

  // Clear form on mount
  useEffect(() => {
    resetForm();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Email domain validation
    if (!email.endsWith('@hkmu.edu.hk') && !email.endsWith('@live.hkmu.edu.hk')) {
      setError('Please use an HKMU email address (@hkmu.edu.hk or @live.hkmu.edu.hk)');
      // Optionally: setError({ email: '...' }) and show under email field
      resetForm();
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/register`, {
        username,
        email,
        password,
        nickname,
      });
      // Replace alert with toast if using a lib: toast.success(response.data.message);
      alert(response.data.message); // Temp
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      setError(
        error.response?.data?.error ||
        error.response?.data?.details ||
        'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
      resetForm();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-4"
          autoComplete="off"
          key={formKey}
        >
          {/* Hidden dummy inputs to distract browser autofill */}
          <input type="email" style={{ display: 'none' }} autoComplete="email" />
          <input type="password" style={{ display: 'none' }} autoComplete="current-password" />

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-md"
              autoComplete="username" // Semantic value
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              HKMU Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md"
              autoComplete="email" // Semantic value
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
              autoComplete="new-password" // Tells browser it's a new account
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
              Nickname (Optional)
            </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full p-2 border rounded-md"
              autoComplete="off" // Simple off for optional field
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center" role="alert" aria-live="polite">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>

          <button
            type="button"
            onClick={resetForm}
            disabled={isLoading}
            className="mt-2 w-full text-sm text-blue-600 hover:underline"
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