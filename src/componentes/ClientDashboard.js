import React, { useState, useEffect } from 'react';
import EventCard from './EventCard'; 
import Header from './Header';
import '../ui/main.css';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PlaceIcon from '@mui/icons-material/Place';
import AppsIcon from '@mui/icons-material/Apps';
import Footer from './Footer';


const ClientDashboard = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4002/api/events') // Ajusta esto según la URL de tu API
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  
  return (
    <div id='client-home'>
      <Header />
      <div  className="client-home-img"></div>

          <div className="search-bar">
            <div className="search-item">
              <input type="text" placeholder="Buscar por Artista" />
            </div>
            <div className="divider"></div>
            <div className="search-item">
              <i className="fa fa-calendar"></i>
              <CalendarTodayIcon style={{ fontSize:'small', verticalAlign: 'middle', marginRight: '5px', color:'white' }} />
              <input type="text" placeholder="Fecha" />
            </div>
            <div className="divider"></div>
            <div className="search-item">
              <i className="fa fa-map-marker"></i>
              <PlaceIcon style={{ fontSize:'medium', verticalAlign: 'middle', marginRight: '5px', color:'white' }} />

              <input type="text" placeholder="Ubicación" />
            </div>
            <div className="divider"></div>
            <div className="search-item">
              <i className="fa fa-music"></i>
              <AppsIcon style={{ fontSize:'medium', verticalAlign: 'middle', marginRight: '5px', color:'white' }} />

              <input type="text" placeholder="Género" />
            </div>
            <button className="search-btn">
              Buscar
            </button>
        </div>

  

      <div className="line-below"></div>

      <div id='client-main'>
        {events.map(event => (
          <EventCard 
            key={event.id} 
            name={event.name} 
            description={event.description} 
            price={event.price} 
            dateTime={event.dateTime} 
            latitude={event.latitude}
            longitude={event.longitude}
          />
        ))}
      </div>
      <div className="line-below"></div>

      <Footer />

    </div>

  );

};

export default ClientDashboard;