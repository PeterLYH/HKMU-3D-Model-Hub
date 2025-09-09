import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [nickname, setNickname] = useState(localStorage.getItem('nickname') || '');
  const [icon, setIcon] = useState(localStorage.getItem('icon') || '');
  const navigate = useNavigate();

  const displayName = nickname || username; // Prioritize nickname, fall back to username

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('nickname');
    localStorage.removeItem('icon');
    localStorage.removeItem('rememberedIdentifier');
    localStorage.removeItem('rememberedPassword');
    setIsAuthenticated(false);
    setUsername('');
    setNickname('');
    setIcon('');
    navigate('/login');
  };

  useEffect(() => {
    // Initial check
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setUsername(localStorage.getItem('username') || '');
    setNickname(localStorage.getItem('nickname') || '');
    setIcon(localStorage.getItem('icon') || '');

    // Listen for storage changes (e.g., login/logout in another tab)
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
      setUsername(localStorage.getItem('username') || '');
      setNickname(localStorage.getItem('nickname') || '');
      setIcon(localStorage.getItem('icon') || '');
    };

    // Listen for login updates
    const handleLoginUpdate = () => {
      const token = localStorage.getItem('token'); // Fixed: Changed newToken to token
      setIsAuthenticated(!!token);
      setUsername(localStorage.getItem('username') || '');
      setNickname(localStorage.getItem('nickname') || '');
      setIcon(localStorage.getItem('icon') || '');
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('loginUpdate', handleLoginUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginUpdate', handleLoginUpdate);
    };
  }, []);

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/browser" className="text-2xl font-bold hover:text-gray-300 transition">
          HKMU 3D Model Hub
        </Link>
        <div className="flex items-center space-x-4">
          <NavLink
            to="/my-models"
            className={({ isActive }) => (isActive ? 'text-yellow-400' : 'hover:text-gray-300 transition')}
          >
            My Models
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? 'text-yellow-400' : 'hover:text-gray-300 transition')}
          >
            Contact
          </NavLink>
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="flex items-center space-x-2 hover:text-gray-300 transition"
              >
                {icon && <img src={icon} alt="User Icon" className="w-8 h-8 rounded-full object-cover" />}
                <span>{displayName}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-gray-300 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? 'text-yellow-400' : 'hover:text-gray-300 transition')}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) => (isActive ? 'text-yellow-400' : 'hover:text-gray-300 transition')}
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;