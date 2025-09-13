import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userNickname, setUserNickname] = useState(localStorage.getItem('nickname') || localStorage.getItem('username') || '');
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || 'user');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLoginUpdate = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
      setUserNickname(localStorage.getItem('nickname') || localStorage.getItem('username') || '');
      setUserRole(localStorage.getItem('role') || 'user');
    };

    window.addEventListener('loginUpdate', handleLoginUpdate);
    return () => window.removeEventListener('loginUpdate', handleLoginUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('nickname');
    localStorage.removeItem('icon');
    localStorage.removeItem('role');
    localStorage.removeItem('rememberedIdentifier');
    localStorage.removeItem('rememberedPassword');
    window.dispatchEvent(new Event('loginUpdate'));
    setIsMenuOpen(false);
    navigate('/login', { replace: true });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isAdmin = userRole === 'admin';

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-gray-300 transition">
          HKMU 3D Model Hub
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            to="/browser"
            className="hover:text-gray-300 transition"
          >
            Browse
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/my-models" className="hover:text-gray-300 transition">
                My Models
              </Link>
              <div className="relative">
                <Link to="/profile" className="hover:text-gray-300 transition">
                  {userNickname}
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="absolute left-0 top-full bg-gray-700 p-2 rounded shadow-md mt-1">
                    Admin Dashboard
                  </Link>
                )}
              </div>
              <button onClick={handleLogout} className="hover:text-gray-300 transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-gray-300 transition">
                Register
              </Link>
            </>
          )}
          <Link to="/contact" className="hover:text-gray-300 transition">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;