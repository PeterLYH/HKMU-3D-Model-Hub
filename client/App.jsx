import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
<<<<<<< HEAD
import Home from './pages/Home';
=======
=======
>>>>>>> parent of 8d5df78 (version 1.0.1)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
>>>>>>> parent of 8d5df78 (version 1.0.1)
import Register from './pages/Register';
import Login from './pages/Login';
import Browser from './pages/Browser';
import ModelDetails from './pages/ModelDetails';
import Profile from './pages/Profile';
<<<<<<< HEAD
<<<<<<< HEAD
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
=======
>>>>>>> parent of 8d5df78 (version 1.0.1)
=======
>>>>>>> parent of 8d5df78 (version 1.0.1)

function App() {
  return (
    <Router>
<<<<<<< HEAD
      <Navbar />
      <Routes>
        <Route path="/" element={<Browser />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-models" element={<Home />} />
        <Route path="/browser" element={<Browser />} />
        <Route path="/models/:id" element={<ModelDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
=======
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <Footer />
      </div>
>>>>>>> parent of 8d5df78 (version 1.0.1)
    </Router>
  );
}

export default App;