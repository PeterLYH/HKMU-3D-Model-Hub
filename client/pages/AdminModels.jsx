import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminModels() {
  const [models, setModels] = useState([]);
  const [error, setError] = useState('');
  const [editModel, setEditModel] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', fileType: 'glb' });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    fetchModels();
  }, [token, navigate]);

  const fetchModels = async () => {
    try {
      const response = await axios.get('https://hkmu-3d-model-hub-backend.onrender.com/api/admin/models', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModels(response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch models');
      console.error('Fetch models error:', error.response?.data);
    }
  };

  const handleEdit = (model) => {
    setEditModel(model._id);
    setEditForm({ name: model.name, description: model.description, fileType: model.fileType });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://hkmu-3d-model-hub-backend.onrender.com/api/admin/models/${editModel}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModels(models.map(m => m._id === editModel ? response.data.model : m));
      setEditModel(null);
      setEditForm({ name: '', description: '', fileType: 'glb' });
    } catch (error) {
      setError(error.response?.data?.error || 'Update failed');
      console.error('Update model error:', error.response?.data);
    }
  };

  const handleDelete = async (modelId) => {
    if (!window.confirm('Are you sure you want to delete this model?')) return;
    try {
      await axios.delete(`https://hkmu-3d-model-hub-backend.onrender.com/api/admin/models/${modelId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModels(models.filter(m => m._id !== modelId));
    } catch (error) {
      setError(error.response?.data?.error || 'Delete failed');
      console.error('Delete model error:', error.response?.data);
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
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Admin - Models Management</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">File Type</th>
                <th className="px-4 py-2">Owner</th>
                <th className="px-4 py-2">Likes</th>
                <th className="px-4 py-2">Downloads</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr key={model._id} className="border-b">
                  <td className="px-4 py-2">{model.name}</td>
                  <td className="px-4 py-2 truncate max-w-xs">{model.description || 'N/A'}</td>
                  <td className="px-4 py-2">{model.fileType.toUpperCase()}</td>
                  <td className="px-4 py-2">{model.owner?.nickname || model.owner?.username || 'Unknown'}</td>
                  <td className="px-4 py-2">{Array.isArray(model.likes) ? model.likes.length : 0}</td>
                  <td className="px-4 py-2">{model.downloads || 0}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => handleEdit(model)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                    <button onClick={() => handleDelete(model._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {editModel && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="text-xl font-bold mb-4">Edit Model</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">File Type</label>
                <select
                  value={editForm.fileType}
                  onChange={(e) => setEditForm({ ...editForm, fileType: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="glb">GLB</option>
                  <option value="fbx">FBX</option>
                  <option value="obj">OBJ</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
                  Update
                </button>
                <button type="button" onClick={() => setEditModel(null)} className="flex-1 bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400">
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

export default AdminModels;