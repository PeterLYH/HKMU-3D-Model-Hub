import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [nickname, setNickname] = useState(localStorage.getItem('nickname') || '');
  const [icon, setIcon] = useState(localStorage.getItem('icon') || '');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('nickname');
    localStorage.removeItem('icon');
    setIsAuthenticated(false);
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setNickname(localStorage.getItem('nickname') || '');
    setIcon(localStorage.getItem('icon') || '');
  }, []);

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">HKMU 3D Model Hub</h1>
        <div className="flex items-center space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'text-yellow-400' : 'hover:text-gray-300 transition')}
          >
            Home
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) => (isActive ? 'text-yellow-400' : 'hover:text-gray-300 transition')}
          >
            Contact
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? 'text-yellow-400' : 'hover:text-gray-300 transition')}
              >
                Profile
              </NavLink>
              <div className="flex items-center space-x-2">
                {icon && <img src={icon} alt="User Icon" className="w-8 h-8 rounded-full object-cover" />}
                <span>{nickname}</span>
              </div>
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