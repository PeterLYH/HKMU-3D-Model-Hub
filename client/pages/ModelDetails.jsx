import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function ModelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [model, setModel] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const SUPABASE_URL = 'https://qrrxxlditjguauylnxhy.supabase.co'; // Hardcoded for local testing

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const response = await axios.get(`https://hkmu-3d-model-hub-backend.onrender.com/api/models/${id}`);
        setModel(response.data);
        setError('');
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to load model details');
        console.error('Fetch model error:', error.response?.data);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`https://hkmu-3d-model-hub-backend.onrender.com/api/models/${id}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Fetch comments error:', error.response?.data);
      }
    };

    fetchModel();
    fetchComments();

    const handleLoginUpdate = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('loginUpdate', handleLoginUpdate);
    return () => window.removeEventListener('loginUpdate', handleLoginUpdate);
  }, [id]);

  const handleDownload = async () => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const fileName = model.filePath.split('/').pop(); // Use the actual filePath's filename
      const response = await axios.get(`https://hkmu-3d-model-hub-backend.onrender.com/api/models/download/${fileName}`, {
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
      // Refresh model to update downloads count
      const updatedModel = await axios.get(`https://hkmu-3d-model-hub-backend.onrender.com/api/models/${id}`);
      setModel(updatedModel.data);
    } catch (error) {
      setError(error.message || 'Download failed');
      console.error('Download error:', error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('User ID not found');
      const response = await axios.post(`https://hkmu-3d-model-hub-backend.onrender.com/api/models/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModel({ ...model, likes: response.data.likes });
    } catch (error) {
      setError(error.response?.data?.error || error.message || 'Like failed');
      console.error('Like error:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`https://hkmu-3d-model-hub-backend.onrender.com/api/models/${id}/comments`, { content: newComment }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments([...comments, response.data.comment]);
      setNewComment('');
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to post comment');
      console.error('Comment error:', error.response?.data);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-500 text-center">{error}</p>
          <Link to="/browser" className="block text-center text-blue-600 hover:underline mt-4">
            Back to Browser
          </Link>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  const ownerName = model.owner?.nickname || model.owner?.username || 'Unknown';
  const fileSizeMB = model.fileSize ? (model.fileSize / (1024 * 1024)).toFixed(2) : 'Unknown';
  const likes = Array.isArray(model.likes) ? model.likes : [];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <Link to="/browser" className="text-blue-600 hover:underline mb-4 inline-block">
          &larr; Back to Browser
        </Link>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{model.name}</h1>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <img
                src={`${SUPABASE_URL}/storage/v1/object/public/models/${model.previewPath}`}
                alt={model.name}
                className="w-full max-h-96 object-contain rounded-md"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Model Details</h2>
              <p className="text-gray-600 mb-2"><strong>Description:</strong> {model.description || 'No description provided'}</p>
              <p className="text-gray-600 mb-2"><strong>File Type:</strong> {model.fileType.toUpperCase()}</p>
              <p className="text-gray-600 mb-2"><strong>File Size:</strong> {fileSizeMB} MB</p>
              <p className="text-gray-600 mb-2"><strong>Owner:</strong> {ownerName}</p>
              <p className="text-gray-600 mb-2"><strong>Visits:</strong> {model.visits || 0}</p>
              <p className="text-gray-600 mb-2"><strong>Likes:</strong> {likes.length}</p>
              <p className="text-gray-600 mb-2"><strong>Downloads:</strong> {model.downloads || 0}</p>
              {isAuthenticated ? (
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={handleDownload}
                    className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Download Model
                  </button>
                  <button
                    onClick={handleLike}
                    className="bg-gray-200 text-gray-800 p-2 rounded-md hover:bg-gray-300 transition"
                    disabled={!localStorage.getItem('userId')}
                  >
                    {likes.includes(localStorage.getItem('userId')) ? 'Unlike' : 'Like'}
                  </button>
                </div>
              ) : (
                <p className="text-gray-600 mt-4">
                  <Link to="/login" className="text-blue-600 hover:underline">Log in</Link> to download or like this model.
                </p>
              )}
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Comments</h2>
            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  placeholder="Leave a comment..."
                />
                <button
                  type="submit"
                  className="mt-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                >
                  Post Comment
                </button>
              </form>
            ) : (
              <p className="text-gray-600 mb-4">
                <Link to="/login" className="text-blue-600 hover:underline">Log in</Link> to leave a comment.
              </p>
            )}
            {comments.length === 0 ? (
              <p className="text-gray-600">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="border-t pt-4 mt-4">
                  <p className="text-gray-600"><strong>{comment.user?.nickname || comment.user?.username || 'Anonymous'}</strong> ({new Date(comment.createdAt).toLocaleString()}):</p>
                  <p className="text-gray-600">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModelDetails;