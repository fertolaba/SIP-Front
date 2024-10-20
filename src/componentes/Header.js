import React from 'react';
import '../ui/main.css';


const Header = () => {
  return (
    <header id='header'>
      <div id='logo'>
        <h3>SoundSeekers</h3>
      </div>
      <div id='nav'>
        <ul id='nav-list'>
          <li id='nav-item'><a id='nav-link' href="/client-dashboard">Eventos</a></li>
          <li id='nav-item'><a id='nav-link' href="/BusquedaEventos">Mapa</a></li>
        </ul>
      </div>
      <div id='profile'>
        <a id='nav-link' href="/">Perfil</a>
      </div>
    </header>
  );
};

export default Header;