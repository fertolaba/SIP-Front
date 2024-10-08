import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './componentes/auth/Login'; 
import Register from './componentes/auth/Registro';
import ClientDashboard from './componentes/ClientDashboard';
import ArtistDashboard from './componentes/ArtistDashboard';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register/>} />
        <Route path="/client-dashboard" element={<ClientDashboard/>} />
        <Route path="/artist-dashboard" element={<ArtistDashboard/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;