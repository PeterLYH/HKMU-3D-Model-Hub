import { useState, useEffect, useRef } from 'react';
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
  const canvasRef = useRef();

  useEffect(() => {
    if (token) {
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

  const handleDownload = async (fileName) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/models/${fileName}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError(error.response?.data?.error || 'Download failed');
      console.error('Download error:', error.response?.data);
    }
  };

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
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
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
                  onClick={() => handleDownload(model.name)}
                  className="text-blue-600 hover:underline"
                >
                  Download
                </button>
                <button
                  onClick={() => handleView(model.name)}
                  className="text-blue-600 hover:underline"
                >
                  View
                </button>
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
          )}
          {selectedModel && (
            <div className="preview-container bg-gray-200 rounded-lg p-4">
              <img src={selectedModel} alt="Model Preview" className="w-full h-auto max-h-96 object-contain" />
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-lg text-gray-600">Please log in to upload and view 3D models.</p>
      )}
    </div>
  );
}

export default Home;