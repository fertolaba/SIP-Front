import React, { useState, useEffect } from 'react';
import EventCardArtist from '../componentes/EventCardArtist';
import {Card,  CardContent,Typography,TextField,Button,MenuItem,Select,InputLabel,FormControl,Grid,Link} from "@mui/material";
import Header from '../componentes/Header';
import Footer from '../componentes/Footer';
import '../ui/main.css';


const EventosAsistire = () => {
  const [events, setEvents] = useState([]);
  const [pasEvents,setPasEvents]=useState([]);

  useEffect(() => {
    fetchUserEvents();
  }, []);

  const fetchUserEvents = () => {
    const userId = Number(localStorage.getItem('userId'));
    fetch(`http://localhost:4002/api/events/user/${userId}/attending`)
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

  return (
    <>
      <Header />
      <div id='client-home'>
        
        <div className="client-home-img"></div>
      
          <Typography variant="h5" gutterBottom id="customFont" textAlign={"center"} marginTop={2} fontWeight={'fontWeightBold'} >
            Eventos a los que asistiras
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
              />
            ))
          ) : (
            <p>No tienes eventos proximos.</p>
          )};
          </div>
        <div className="line-below"></div>
        
      </div>
      <Footer />
    </>
  );
};

export default EventosAsistire;