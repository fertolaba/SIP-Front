import React, { useState, useEffect } from 'react';
import EventCardArtist from '../componentes/EventCardArtist';
import { Typography } from "@mui/material";
import Header from '../componentes/Header';
import Footer from '../componentes/Footer';
import eventosServices from '../service/eventos.services';
import '../ui/main.css';

const MisEventos = () => {
  const [events, setEvents] = useState([]);
  const [pasEvents, setPasEvents] = useState([]);

  useEffect(() => {
    fetchUserEvents();
  }, []);

  const fetchUserEvents = async () => {
    const userId = Number(localStorage.getItem('userId'));
    const data = await eventosServices.getUserEvents(userId);

    const currentDate = new Date();
    const upcomingEvents = data.filter(event => new Date(event.dateTime) >= currentDate);
    const pastEvents = data.filter(event => new Date(event.dateTime) < currentDate);
    
    setEvents(upcomingEvents);
    setPasEvents(pastEvents);
  };

  const handleDelete = async (eventId) => {
    const success = await eventosServices.deleteEvent(eventId);
    if (success) {
      setEvents(events.filter(event => event.id !== eventId));
    } else {
      console.error('Error deleting event');
    }
  };

  const handleEdit = (eventId) => {
    window.location.href = `/EditarEventos/${eventId}`;
  };

  return (
    <div id='client-home'>
      <Header />
      <div className="client-home-img"></div>
    
      <Typography variant="h5" gutterBottom id="customFont" textAlign={"center"} marginTop={2}>
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
          <p>No tienes eventos próximos.</p>
        )}
      </div>

      <div className="line-below"></div>
      
      <Typography variant="h5" gutterBottom id="customFont" textAlign={"center"} marginTop={2}>
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
