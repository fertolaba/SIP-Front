import './ui/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './componentes/auth/Login'; 
import Register from './componentes/auth/Registro';
import ClientDashboard from './pages/ClientDashboard';
import ArtistDashboard from './pages/ArtistDashboard';
import BusquedaEventos from './pages/BusquedaEventos'
import AltaEventos from './pages/AltaEventos'
import MiPerfil from './pages/MiPerfil';
import MisEventos from './pages/MisEventos';
import EditarEventos from './pages/EditarEventos';
import Reestablecer from './componentes/auth/Reestablecer';
import EventosAsistire from './pages/EventosAsistire';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register/>} />
        <Route path="/client-dashboard" element={<ClientDashboard/>} />
        <Route path="/artist-dashboard" element={<ArtistDashboard/>} />
        <Route path="/BusquedaEventos" element={<BusquedaEventos/>} />
        <Route path="/AltaEventos" element={<AltaEventos/>} />
        <Route path="/MiPerfil" element={<MiPerfil/>} />
        <Route path="/MisEventos" element={<MisEventos/>} />
        <Route  path="/EditarEventos/:eventId" element={<EditarEventos/>} />
        <Route  path="/Reestablecer" element={<Reestablecer/>} />
        <Route  path="/Asistencia" element={<EventosAsistire/>} />



      </Routes>
    </BrowserRouter>
  );
}

export default App;