import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ nickname: '', icon: '', role: 'user' });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    fetchUsers();
  }, [token, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://hkmu-3d-model-hub-backend.onrender.com/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch users');
      console.error('Fetch users error:', error.response?.data);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user._id);
    setEditForm({ nickname: user.nickname, icon: user.icon, role: user.role });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://hkmu-3d-model-hub-backend.onrender.com/api/admin/users/${editUser}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map(u => u._id === editUser ? response.data.user : u));
      setEditUser(null);
      setEditForm({ nickname: '', icon: '', role: 'user' });
    } catch (error) {
      setError(error.response?.data?.error || 'Update failed');
      console.error('Update user error:', error.response?.data);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`https://hkmu-3d-model-hub-backend.onrender.com/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      setError(error.response?.data?.error || 'Delete failed');
      console.error('Delete user error:', error.response?.data);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <p className="text-red-500 text-center">{error}</p>
        <Link to="/browser" className="block text-center text-blue-600 hover:underline mt-4">
          Back to Browser
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Admin - Users Management</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Nickname</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.nickname || 'N/A'}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => handleEdit(user)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                    <button onClick={() => handleDelete(user._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {editUser && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nickname</label>
                <input
                  type="text"
                  value={editForm.nickname}
                  onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Icon URL</label>
                <input
                  type="url"
                  value={editForm.icon}
                  onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
                  Update
                </button>
                <button type="button" onClick={() => setEditUser(null)} className="flex-1 bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;