import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [files, setFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [fileType, setFileType] = useState('');
  const [models, setModels] = useState([]);
  const [error, setError] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const SUPABASE_URL = 'https://qrrxxlditjguauylnxhy.supabase.co'; // Hardcoded for local testing

  useEffect(() => {
    if (!token) {
      console.log('No token found, redirecting to /login');
      navigate('/login', { replace: true });
    } else {
      fetchModels();
    }
  }, [token, navigate]);

  const fetchModels = async () => {
    try {
      const response = await axios.get('${import.meta.env.VITE_API_URL}/api/user/models', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModels(response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch models');
      console.error('Fetch models error:', error.response?.data);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);
    if (selectedFiles.length > 0) {
      const mainFile = selectedFiles[0];
      setFileName(mainFile.name.replace(/\.[^/.]+$/, ''));
      const extension = mainFile.name.split('.').pop().toLowerCase();
      setFileType(['obj', 'fbx', 'glb'].includes(extension) ? extension : '');
    }
  };

  const handlePreviewFileChange = (e) => {
    setPreviewFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!token) {
      console.log('No token found during upload, redirecting to /login');
      navigate('/login', { replace: true });
      return;
    }
    if (!files.length || !previewFile || !fileName || !fileType) {
      setError('Please select a model file, preview image, provide a name, and ensure file type is valid');
      return;
    }
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('file', file);
    });
    formData.append('file', previewFile);
    formData.append('name', fileName);
    formData.append('description', description);
    formData.append('fileType', fileType);
    try {
      const response = await axios.post('${import.meta.env.VITE_API_URL}/api/models', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload response:', response.data);
      setFiles([]);
      setPreviewFile(null);
      setFileName('');
      setDescription('');
      setFileType('');
      setShowUploadModal(false);
      fetchModels();
    } catch (error) {
      setError(error.response?.data?.error || 'Upload failed');
      console.error('Upload error:', error.response?.data);
    }
  };

  const handleEdit = async (e, modelId) => {
    e.preventDefault();
    if (!token) {
      console.log('No token found during edit, redirecting to /login');
      navigate('/login', { replace: true });
      return;
    }
    const formData = new FormData();
    formData.append('name', fileName || showEditModal.name);
    formData.append('description', description || showEditModal.description);
    formData.append('fileType', fileType || showEditModal.fileType);
    if (files.length > 0) {
      Array.from(files).forEach((file) => {
        formData.append('file', file);
      });
    }
    if (previewFile) {
      formData.append('file', previewFile);
    }
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/models/${modelId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Edit response:', response.data);
      setFiles([]);
      setPreviewFile(null);
      setFileName('');
      setDescription('');
      setFileType('');
      setShowEditModal(null);
      fetchModels();
    } catch (error) {
      setError(error.response?.data?.error || 'Edit failed');
      console.error('Edit error:', error.response?.data);
    }
  };

  const handleDelete = async (modelId) => {
    if (!token) {
      console.log('No token found during delete, redirecting to /login');
      navigate('/login', { replace: true });
      return;
    }
    if (!window.confirm('Are you sure you want to delete this model?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/models/${modelId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchModels();
    } catch (error) {
      setError(error.response?.data?.error || 'Delete failed');
      console.error('Delete error:', error.response?.data);
    }
  };

  const handleDownload = async (filePath, fileName) => {
    if (!token) {
      console.log('No token found during download, redirecting to /login');
      navigate('/login', { replace: true });
      return;
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/models/download/${fileName}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const contentType = response.headers['content-type'];
      if (contentType === 'application/json') {
        const errorData = JSON.parse(await response.data.text());
        throw new Error(errorData.error || 'Download failed');
      }
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      fetchModels();
    } catch (error) {
      setError(error.message || 'Download failed');
      console.error('Download error:', error);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">HKMU 3D Model Hub - My Models</h1>
      <div className="max-w-6xl mx-auto p-4">
        <button
          onClick={() => setShowUploadModal(true)}
          className="mb-6 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          Upload Model
        </button>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.map((model) => (
            <div key={model._id} className="bg-white p-3 rounded-lg shadow-md">
              <Link to={`/models/${model._id}`}>
                <img
                  src={`${SUPABASE_URL}/storage/v1/object/public/models/${model.previewPath}`}
                  alt={model.name}
                  className="w-full h-32 object-contain mb-2 rounded-md"
                />
                <h3 className="text-base font-semibold truncate">{model.name}</h3>
              </Link>
              <p className="text-sm text-gray-600 truncate">Type: {model.fileType.toUpperCase()}</p>
              <p className="text-sm text-gray-600 truncate">Description: {model.description || 'None'}</p>
              <p className="text-sm text-gray-600">Likes: {Array.isArray(model.likes) ? model.likes.length : 0}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleDownload(model.filePath, `${model.name}.${model.fileType}`)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Download
                </button>
                <button
                  onClick={() => setShowEditModal(model)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(model._id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Upload New Model</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700">Model File</label>
                <input
                  type="file"
                  id="file"
                  accept=".glb,.obj,.mtl,.fbx"
                  multiple
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="preview" className="block text-sm font-medium text-gray-700">Preview Image</label>
                <input
                  type="file"
                  id="preview"
                  accept=".png,.jpg,.jpeg"
                  onChange={handlePreviewFileChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Model Name</label>
                <input
                  type="text"
                  id="name"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows="4"
                />
              </div>
              <div>
                <label htmlFor="fileType" className="block text-sm font-medium text-gray-700">File Type</label>
                <input
                  type="text"
                  id="fileType"
                  value={fileType}
                  readOnly
                  className="w-full p-2 border rounded-md bg-gray-100"
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setFiles([]);
                    setPreviewFile(null);
                    setFileName('');
                    setDescription('');
                    setFileType('');
                    setError('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit Model</h2>
            <form onSubmit={(e) => handleEdit(e, showEditModal._id)} className="space-y-4">
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700">Model File (Optional)</label>
                <input
                  type="file"
                  id="file"
                  accept=".glb,.obj,.mtl,.fbx"
                  multiple
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="preview" className="block text-sm font-medium text-gray-700">Preview Image (Optional)</label>
                <input
                  type="file"
                  id="preview"
                  accept=".png,.jpg,.jpeg"
                  onChange={handlePreviewFileChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Model Name</label>
                <input
                  type="text"
                  id="name"
                  value={fileName || showEditModal.name}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  value={description || showEditModal.description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows="4"
                />
              </div>
              <div>
                <label htmlFor="fileType" className="block text-sm font-medium text-gray-700">File Type</label>
                <input
                  type="text"
                  id="fileType"
                  value={fileType || showEditModal.fileType}
                  readOnly
                  className="w-full p-2 border rounded-md bg-gray-100"
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(null);
                    setFiles([]);
                    setPreviewFile(null);
                    setFileName('');
                    setDescription('');
                    setFileType('');
                    setError('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;