<<<<<<< HEAD
<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
=======
import { useState, useEffect, useRef } from 'react';
>>>>>>> parent of 8d5df78 (version 1.0.1)
=======
import { useState, useEffect, useRef } from 'react';
>>>>>>> parent of 8d5df78 (version 1.0.1)
import axios from 'axios';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

function ModelViewer({ url, onSnapshot }) {
  const { scene, camera, gl } = useThree();
  const isObj = url.endsWith('.obj');
  let model;

  try {
    if (isObj) {
      const mtlUrl = url.replace('.obj', '.mtl');
      let materials = null;
      try {
        materials = useLoader(MTLLoader, mtlUrl);
        console.log('Loading MTL:', mtlUrl);
      } catch (mtlError) {
        console.warn('MTL file not found:', mtlError);
      }
      model = useLoader(
        OBJLoader,
        url,
        (loader) => {
          console.log('Loading OBJ:', url);
          if (materials) {
            materials.preload();
            loader.setMaterials(materials);
          }
        },
        undefined,
        (error) => {
          console.error('OBJLoader error:', error);
        }
      );
    } else {
      const { scene } = useGLTF(url);
      model = scene;
      console.log('Loading GLTF/GLB:', url);
    }

    useEffect(() => {
      if (model) {
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        camera.position.set(center.x, center.y, center.z + maxDim * 2);
        camera.lookAt(center);
        gl.render(scene, camera);
        const snapshot = gl.domElement.toDataURL('image/png');
        onSnapshot(snapshot);
      }
    }, [model, camera, gl, scene, onSnapshot]);

    return model ? <primitive object={model} scale={[1, 1, 1]} /> : null;
  } catch (error) {
    console.error('Model loading error:', error);
    return null;
  }
}

function Home() {
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState('');
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
<<<<<<< HEAD
<<<<<<< HEAD
  const navigate = useNavigate();
  const SUPABASE_URL = 'https://qrrxxlditjguauylnxhy.supabase.co'; // Hardcoded for local testing

  useEffect(() => {
    if (!token) {
      console.log('No token found, redirecting to /login');
      navigate('/login', { replace: true });
    } else {
=======
  const canvasRef = useRef();

  useEffect(() => {
    if (token) {
>>>>>>> parent of 8d5df78 (version 1.0.1)
=======
  const canvasRef = useRef();

  useEffect(() => {
    if (token) {
>>>>>>> parent of 8d5df78 (version 1.0.1)
      fetchModels();
    } else {
      setError('Please log in to view models');
    }
  }, [token]);

  const fetchModels = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/models', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModels(response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch models');
      console.error('Fetch models error:', error.response?.data);
    }
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
    setFileName(e.target.files[0]?.name || '');
  };

  const handleSnapshot = (snapshot) => {
    setPreviewImage(snapshot);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.length) return setError('Please select at least one file');
    if (!token) return setError('Please log in to upload models');
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('file', file);
    });
    formData.append('fileName', fileName);
    if (previewImage) {
      const blob = dataURLtoBlob(previewImage);
      formData.append('file', blob, fileName.replace(/\.[^/.]+$/, '.png'));
    }
    try {
      const response = await axios.post('http://localhost:5000/api/models', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload response:', response.data);
      setFiles([]);
      setFileName('');
      setPreviewImage(null);
      fetchModels();
    } catch (error) {
      setError(error.response?.data?.error || 'Upload failed');
      console.error('Upload error:', error.response?.data);
    }
  };

<<<<<<< HEAD
<<<<<<< HEAD
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
      const response = await axios.put(`http://localhost:5000/api/models/${modelId}`, formData, {
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
      await axios.delete(`http://localhost:5000/api/models/${modelId}`, {
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
=======
  const handleDownload = async (fileName) => {
>>>>>>> parent of 8d5df78 (version 1.0.1)
=======
  const handleDownload = async (fileName) => {
>>>>>>> parent of 8d5df78 (version 1.0.1)
    try {
      const response = await axios.get(`http://localhost:5000/api/models/download/${fileName}`, {
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

<<<<<<< HEAD
<<<<<<< HEAD
  if (!token) {
    return null;
=======
=======
>>>>>>> parent of 8d5df78 (version 1.0.1)
  const handleView = (fileName) => {
    const modelUrl = `https://qrrxxlditjguauylnxhy.supabase.co/storage/v1/object/public/models/models/${localStorage.getItem('userId')}/${fileName}`;
    const previewUrl = modelUrl.replace(/\.[^/.]+$/, '.png');
    console.log('Viewing model:', modelUrl, 'Preview:', previewUrl);
    setSelectedModel(previewUrl);
  };

  function dataURLtoBlob(dataURL) {
    const [header, data] = dataURL.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(data);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mime });
<<<<<<< HEAD
>>>>>>> parent of 8d5df78 (version 1.0.1)
=======
>>>>>>> parent of 8d5df78 (version 1.0.1)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">HKMU 3D Model Hub</h1>
      {token ? (
        <div className="max-w-4xl mx-auto p-4 space-y-4 bg-white rounded-lg shadow-md">
          <form onSubmit={handleUpload} className="space-y-4">
            <input
              type="file"
              accept=".glb,.obj,.mtl"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition">
              Upload Model
            </button>
          </form>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <h2 className="text-xl font-semibold mt-8">Your Models</h2>
          <ul className="space-y-2">
            {models.map((model) => (
              <li key={model.name} className="flex space-x-2 items-center">
                <span>{model.name}</span>
                <button
=======
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">HKMU 3D Model Hub</h1>
      {token ? (
        <div className="max-w-4xl mx-auto p-4 space-y-4 bg-white rounded-lg shadow-md">
          <form onSubmit={handleUpload} className="space-y-4">
            <input
              type="file"
              accept=".glb,.obj,.mtl"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition">
              Upload Model
            </button>
          </form>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <h2 className="text-xl font-semibold mt-8">Your Models</h2>
          <ul className="space-y-2">
            {models.map((model) => (
              <li key={model.name} className="flex space-x-2 items-center">
                <span>{model.name}</span>
                <button
>>>>>>> parent of 8d5df78 (version 1.0.1)
                  onClick={() => handleDownload(model.name)}
                  className="text-blue-600 hover:underline"
>>>>>>> parent of 8d5df78 (version 1.0.1)
                >
                  Download
                </button>
                <button
<<<<<<< HEAD
<<<<<<< HEAD
                  onClick={() => setShowEditModal(model)}
                  className="text-blue-600 hover:underline text-sm"
=======
=======
>>>>>>> parent of 8d5df78 (version 1.0.1)
                  onClick={() => handleView(model.name)}
                  className="text-blue-600 hover:underline"
>>>>>>> parent of 8d5df78 (version 1.0.1)
                >
                  View
                </button>
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
              </li>
            ))}
          </ul>
          {files.length > 0 && (
            <div className="hidden">
              <Canvas ref={canvasRef} gl={{ antialias: true, preserveDrawingBuffer: true }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <ModelViewer
                  url={`https://qrrxxlditjguauylnxhy.supabase.co/storage/v1/object/public/models/models/${localStorage.getItem('userId')}/${fileName}`}
                  onSnapshot={handleSnapshot}
                />
                <OrbitControls />
              </Canvas>
            </div>
=======
              </li>
            ))}
          </ul>
          {files.length > 0 && (
            <div className="hidden">
              <Canvas ref={canvasRef} gl={{ antialias: true, preserveDrawingBuffer: true }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <ModelViewer
                  url={`https://qrrxxlditjguauylnxhy.supabase.co/storage/v1/object/public/models/models/${localStorage.getItem('userId')}/${fileName}`}
                  onSnapshot={handleSnapshot}
                />
                <OrbitControls />
              </Canvas>
            </div>
>>>>>>> parent of 8d5df78 (version 1.0.1)
          )}
          {selectedModel && (
            <div className="preview-container bg-gray-200 rounded-lg p-4">
              <img src={selectedModel} alt="Model Preview" className="w-full h-auto max-h-96 object-contain" />
            </div>
          )}
<<<<<<< HEAD
>>>>>>> parent of 8d5df78 (version 1.0.1)
=======
>>>>>>> parent of 8d5df78 (version 1.0.1)
        </div>
      ) : (
        <p className="text-center text-lg text-gray-600">Please log in to upload and view 3D models.</p>
      )}
    </div>
  );
}

export default Home;