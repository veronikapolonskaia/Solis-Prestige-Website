import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Bespoke from './pages/Bespoke';
import Membership from './pages/Membership';
import Register from './pages/Register';
import Editorials from './pages/Editorials';
import EditorialDetail from './pages/EditorialDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/bespoke" element={<Bespoke />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/editorials" element={<Editorials />} />
          <Route path="/editorials/:slug" element={<EditorialDetail />} />
          {/* Add more routes here as you create pages */}
          {/* <Route path="/destinations" element={<Destinations />} /> */}
          {/* <Route path="/about" element={<About />} /> */}
          {/* <Route path="/contact" element={<Contact />} /> */}
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
