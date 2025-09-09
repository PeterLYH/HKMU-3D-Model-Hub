import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [formData, setFormData] = useState({ nickname: localStorage.getItem('nickname') || '' });
  const [icon, setIcon] = useState(null);
  const [previewIcon, setPreviewIcon] = useState(localStorage.getItem('icon') || '');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      console.log('No token found in Profile, redirecting to /login');
      navigate('/login', { replace: true });
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    setIcon(file);
    setPreviewIcon(file ? URL.createObjectURL(file) : localStorage.getItem('icon') || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('nickname', formData.nickname);
    if (icon) formDataToSend.append('icon', icon);
    try {
      const response = await axios.post('http://localhost:5000/api/profile', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      localStorage.setItem('username', response.data.user.username);
      localStorage.setItem('nickname', response.data.user.nickname || '');
      localStorage.setItem('icon', response.data.user.icon || '');
      setPreviewIcon(response.data.user.icon || '');
      setError('');
      window.dispatchEvent(new Event('loginUpdate')); // Update navbar
      alert('Profile updated successfully!');
    } catch (error) {
      setError(error.response?.data?.error || 'Profile update failed');
      console.error('Profile error:', error.response?.data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Profile - HKMU 3D Model Hub</h1>
        <div className="flex justify-center mb-4">
          {previewIcon ? (
            <img src={previewIcon} alt="Profile Icon" className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
              No Icon
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">Nickname (Optional)</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter nickname"
            />
          </div>
          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700">Profile Icon (Optional)</label>
            <input
              type="file"
              id="icon"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleIconChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;