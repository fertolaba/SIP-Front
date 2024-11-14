import React, { useState, useEffect, useCallback } from 'react';
import EventCardArtist from '../componentes/EventCardArtist';
import { Typography, CircularProgress } from "@mui/material";
import Header from '../componentes/Header';
import Footer from '../componentes/Footer';
import eventosServices from '../service/eventos.services';
import '../ui/main.css';

const MisEventos = () => {
  const [events, setEvents] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);

  const fetchUserEvents = useCallback(async () => {
    try {
      const userId = Number(localStorage.getItem('userId'));
      const data = await eventosServices.getUserEvents(userId);
      const currentDate = new Date();

      setEvents({
        upcoming: data.filter(event => new Date(event.dateTime) >= currentDate),
        past: data.filter(event => new Date(event.dateTime) < currentDate),
      });
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserEvents();
  }, [fetchUserEvents]);

  const handleDelete = async (eventId) => {
    const success = await eventosServices.deleteEvent(eventId);
    if (success) {
      setEvents(prevEvents => ({
        ...prevEvents,
        upcoming: prevEvents.upcoming.filter(event => event.id !== eventId)
      }));
    } else {
      console.error('Error deleting event');
    }
  };

  const renderEventList = (eventList, showEditDeleteButtons = false) => (
    eventList.length > 0 ? (
      eventList.map((event) => (
        <EventCardArtist
          key={event.id}
          {...event}
          onDelete={() => handleDelete(event.id)}
          onEdit={() => window.location.href = `/EditarEventos/${event.id}`}
          showEditDeleteButtons={showEditDeleteButtons}
        />
      ))
    ) : (
      <Typography variant="body1">No tienes eventos.</Typography>
    )
  );

  return (
    <>
    <Header />
    <div id='client-home'>
      
      <div className="client-home-img"></div>

      <Typography variant="h5" gutterBottom id="customFont" textAlign="center" marginTop={2} fontWeight={'fontWeightBold'}>
        Eventos activos
      </Typography>
      <div id='client-main'>
        {loading ? <CircularProgress /> : renderEventList(events.upcoming, true)}
      </div>

      <div className="line-below"></div>

      <Typography variant="h5" gutterBottom id="customFont" textAlign="center" marginTop={2} fontWeight={'fontWeightBold'}>
        Eventos pasados
      </Typography>
      <div id='client-main'>
        {loading ? <CircularProgress /> : renderEventList(events.past)}
      </div>
      <div className="line-below"></div>

      <Footer />
    </div>
    </>
  );
};

export default MisEventos;
