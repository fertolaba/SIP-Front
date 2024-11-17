import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';


const Header = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role'); 

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login'); 
    };

    return (
        <header id='header'>
            <div id='logo'>
                <h3>SoundSeekers</h3>
            </div>
            <div id='nav'>
                <ul id='nav-list'>
                    {role === 'CLIENT' && (
                        <>
                            <li id='nav-item'><a id='nav-link' href="/client-dashboard">Eventos</a></li>
                            <li id='nav-item'><a id='nav-link' href="/BusquedaEventos">Mapa</a></li>
                            <li id='nav-item'><a id='nav-link' href="/MiPerfil">Mi Perfil</a></li>
                            <li id='nav-item'><a id='nav-link' href="/Asistencia">Asistencia</a></li>
                        </>
                    )}
                    {role === 'ARTIST' && (
                        <>
                            <li id='nav-item'><a id='nav-link' href="/artist-dashboard">Eventos</a></li>
                            <li id='nav-item'><a id='nav-link' href="/AltaEventos">Crear Evento</a></li>
                            <li id='nav-item'><a id='nav-link' href="/BusquedaEventos">Mapa</a></li>
                            <li id='nav-item'><a id='nav-link' href="/MiPerfil">Mi Perfil</a></li>
                            <li id='nav-item'><a id='nav-link' href="/misEventos">Mis Eventos</a></li>
                            <li id='nav-item'><a id='nav-link' href="/Asistencia">Asistencia</a></li>

                        </>
                    )}
                    
                </ul>
            </div>

            <a id='nav-link' href="/" onClick={handleLogout}>
        <LogoutIcon  sx={{ fontSize: 30 }}/> 
    </a>

        </header>
    );
};

export default Header;
