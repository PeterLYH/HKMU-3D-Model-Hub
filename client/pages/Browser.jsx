import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Browser() {
  const [models, setModels] = useState([]);
  const [error, setError] = useState('');
  const SUPABASE_URL = 'https://qrrxxlditjguauylnxhy.supabase.co'; // Hardcoded for local testing

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await axios.get('${import.meta.env.VITE_API_URL}/api/models');
        setModels(response.data);
        setError('');
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to load models');
        console.error('Fetch models error:', error.response?.data);
      }
    };

    fetchModels();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Browse 3D Models</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {models.length === 0 ? (
            <p className="text-gray-700 text-center col-span-full">No models available</p>
          ) : (
            models.map((model) => (
              <div key={model._id} className="bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition">
                <Link to={`/models/${model._id}`}>
                  <img
                    src={`${SUPABASE_URL}/storage/v1/object/public/models/${model.previewPath}`}
                    alt={model.name}
                    className="w-full h-32 object-contain rounded-md mb-2"
                  />
                  <h3 className="text-base font-semibold text-gray-800 truncate">{model.name}</h3>
                </Link>
                <p className="text-sm text-gray-600 truncate">{model.description || 'No description'}</p>
                <p className="text-sm text-gray-600">File Type: {model.fileType.toUpperCase()}</p>
                <p className="text-sm text-gray-600">Owner: {model.owner.nickname || model.owner.username}</p>
                <p className="text-sm text-gray-600">Likes: {model.likes.length}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Browser;