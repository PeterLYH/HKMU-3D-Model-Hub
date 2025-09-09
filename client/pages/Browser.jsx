import { useState, useEffect } from 'react';
import axios from 'axios';

function Browser() {
  const [models, setModels] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/models');
      setModels(response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch models');
      console.error('Fetch models error:', error.response?.data);
    }
  };

  const handleView = (previewPath) => {
    window.open(`https://qrrxxlditjguauylnxhy.supabase.co/storage/v1/object/public/models/${previewPath}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">HKMU 3D Model Hub</h1>
      <div className="max-w-6xl mx-auto p-4">
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <div key={model._id} className="bg-white p-4 rounded-lg shadow-md">
              <img
                src={`https://qrrxxlditjguauylnxhy.supabase.co/storage/v1/object/public/models/${model.previewPath}`}
                alt={model.name}
                className="w-full h-48 object-contain mb-4 cursor-pointer"
                onClick={() => handleView(model.previewPath)}
              />
              <h3 className="text-lg font-semibold">{model.name}</h3>
              <p className="text-sm text-gray-600">Type: {model.fileType.toUpperCase()}</p>
              <p className="text-sm text-gray-600">Owner: {model.owner.nickname || model.owner.username}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Browser;