import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Browser from './pages/Browser';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import { useEffect, useState } from 'react';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('ProtectedRoute: No token found, redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AutoLogout() {
  const navigate = useNavigate();
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    const inactivityTimeout = 30 * 60 * 1000; // 30 minutes in milliseconds

    const resetTimer = () => {
      setLastActivity(Date.now());
    };

    const checkInactivity = () => {
      if (localStorage.getItem('token') && Date.now() - lastActivity >= inactivityTimeout) {
        console.log('Inactivity timeout: Logging out');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('nickname');
        localStorage.removeItem('icon');
        localStorage.removeItem('rememberedIdentifier');
        localStorage.removeItem('rememberedPassword');
        window.dispatchEvent(new Event('loginUpdate'));
        navigate('/login', { replace: true });
      }
    };

    // Add event listeners for user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);

    // Check inactivity every minute
    const interval = setInterval(checkInactivity, 60 * 1000);

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      clearInterval(interval);
    };
  }, [lastActivity, navigate]);

  return null; // This component only handles logic, no UI
}

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <AutoLogout /> {/* Add auto-logout logic here */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Browser />} />
            <Route path="/browser" element={<Browser />} />
            <Route
              path="/my-models"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;