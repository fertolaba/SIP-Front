import React, { useState, useEffect } from 'react';
import EventCardArtist from '../componentes/EventCardArtist';
import {Card,  CardContent,Typography,TextField,Button,MenuItem,Select,InputLabel,FormControl,Grid,Link} from "@mui/material";
import Header from '../componentes/Header';
import Footer from '../componentes/Footer';
import '../ui/main.css';


const MisEventos = () => {
  const [events, setEvents] = useState([]);
  const [pasEvents,setPasEvents]=useState([]);

  useEffect(() => {
    fetchUserEvents();
  }, []);

  const fetchUserEvents = () => {
    const userId = Number(localStorage.getItem('userId'));
    fetch(`http://localhost:4002/api/events/artist/${userId}`)
      .then((response) => response.json())
      .then(data => {
        const currentDate = new Date();
        const upcomingEvents = data.filter(event => new Date(event.dateTime) >= currentDate);
        const pastEvents = data.filter(event => new Date(event.dateTime) < currentDate);
        
        setEvents(upcomingEvents);
        setPasEvents(pastEvents);
      })
      .catch((error) => console.error('Error fetching user events:', error));
  };
  

  const handleDelete = (eventId) => {
    fetch(`http://localhost:4002/api/events/${eventId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setEvents(events.filter(event => event.id !== eventId));
        } else {
          console.error('Error deleting event');
        }
      })
      .catch((error) => console.error('Error deleting event:', error));
  };

  const handleEdit = (eventId) => {
    // Redirige a una página o muestra un formulario de edición
    // Ejemplo para redirigir a una página de edición con el ID del evento
    window.location.href = `/EditarEventos/${eventId}`;
  };

  return (
    <div id='client-home'>
      <Header />
      <div className="client-home-img"></div>
    
        <Typography variant="h5" gutterBottom id="customFont" textAlign={"center"} marginTop={2} >
          Eventos activos
        </Typography>
      <div id='client-main'>
        {events.length > 0 ? (
          events.map((event) => (
            <EventCardArtist
              key={event.id}
              eventId={event.id}
              name={event.name}
              description={event.description}
              dateTime={event.dateTime}
              price={event.price}
              latitude={event.latitude}
              longitude={event.longitude}
              onDelete={() => handleDelete(event.id)}
              onEdit={() => handleEdit(event.id)}
              showEditDeleteButtons
            />
          ))
        ) : (
          <p>No tienes eventos proximos.</p>
        )};
        </div>
        <div className="line-below"></div>

      <Typography variant="h5" gutterBottom id="customFont" textAlign={"center"} marginTop={2} >
          Eventos pasados
      </Typography>
      <div id='client-main'>
        {pasEvents.length > 0 ? (
          pasEvents.map((event) => (
            <EventCardArtist
              key={event.id}
              eventId={event.id}
              name={event.name}
              description={event.description}
              dateTime={event.dateTime}
              price={event.price}
              latitude={event.latitude}
              longitude={event.longitude}
            />
          ))
        ) : (
          <p>No tienes eventos pasados.</p>
        )}
      </div>

      <div className="line-below"></div>
      <Footer />
    </div>
  );
};

export default MisEventos;