import React, { useState } from "react";
import {Card,  CardContent,Typography,TextField,Button,MenuItem,Select,InputLabel,FormControl,Grid,Link} from "@mui/material";
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import Header from '../componentes/Header';
import Footer from '../componentes/Footer';
import Popup from "../componentes/auth/Popup";
import { useNavigate } from 'react-router-dom';
import '../ui/main.css';


const AltaEventos = ({ genres, localities, eventTypes }) => {
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    location: "",
    date: null,
    time: null,
    genre: "",
    price: "",
    locality: "",
  });

  const userId = localStorage.getItem('userId');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();

  const handleRegisterRedirect = () => {
    navigate('/artist-dashboard'); 
  };

  const getLatLongFromAddress = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.length > 0) {
        return {
          lat: data[0].lat,
          lng: data[0].lon
        };
      } else {
        throw new Error('Error al obtener coordenadas');
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleDateChange = (newDate) => {
    setEventData({ ...eventData, date: newDate });
  };

  const handleTimeChange = (newTime) => {
    setEventData({ ...eventData, time: newTime });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const address = eventData.location;
    const coordinates = await getLatLongFromAddress(address);
  
    if (coordinates) {
      const date = eventData.date;
      const time = eventData.time;
  
      const dateTime = new Date(date);
      dateTime.setHours(time.getHours());
      dateTime.setMinutes(time.getMinutes());
      dateTime.setHours(dateTime.getHours() - 3);
  
      const registerRequest = {
        name: eventData.name,
        description: eventData.description,
        location: eventData.location,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        dateTime: dateTime.toISOString(),
        price: eventData.price,
        organizerId: userId,
        genres: [eventData.genre],
      };
  
      try {
        const response = await fetch('http://localhost:4002/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registerRequest),
        });
  
        if (!response.ok) {
          throw new Error('Error al crear evento');
        }
  
        const data = await response.json();
        console.log('Registro exitoso:', data);
        
        setIsPopupOpen(true);  
      } catch (error) {
        console.error('Error al crear evento:', error);
      }
    } else {
      console.error('No se pudieron obtener las coordenadas');
    }
  };
  
  const musicGenres = [
    "ROCK", "POP", "JAZZ", "FOLKLORE", "TANGO", "CUMBIA", "REGGAETON", "TRAP", 
    "ELECTRONICA", "CUARTETO", "HEAVY_METAL", "PUNK", "BLUES", "INDIE", "SKA", 
    "SALSA", "LATIN_JAZZ", "BOSSA_NOVA", "RUMBA", "HIP_HOP", "RB", "REGGAE", 
    "FUSION", "FOLKLORE_MODERNO", "ALTERNATIVE", "PUNK_ROCK", "CLASICO", "GRUNGE"
  ];

  return (
    <>
      <Header />
      <Card  elevation={0} id="customFont"  style={{ Papershadow: '0px',padding: "20px", margin: "20px auto", maxWidth: "600px"  }}>
        <CardContent id="customFont" className = 'logEvent-container' style={{padding:'20px'}}>
          <Typography variant="h5" gutterBottom id="customFont" >
            Alta de Evento
          </Typography>
          <form onSubmit={handleSubmit} id="logEvent-form">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre del evento"
                  name="name"
                  value={eventData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción del evento"
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ubicación"
                  name="location"
                  value={eventData.location}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid container item xs={12} spacing={6}>
                <Grid item xs={6}>
                  <LocalizationProvider  fullWidth dateAdapter={AdapterDateFns}>
                    <DatePicker
                      
                      label="Fecha"
                      value={eventData.date}
                      onChange={handleDateChange}
                      renderInput={(params) => <TextField {...params} fullWidth required />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      label="Hora"
                      value={eventData.time}
                      onChange={handleTimeChange}
                      viewRenderers={{
                        hours: renderTimeViewClock,
                        minutes: renderTimeViewClock,
                        seconds: renderTimeViewClock,
                      }}
                      renderInput={(params) => <TextField {...params} fullWidth required />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
  
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Género musical</InputLabel>
                  <Select
                    name="genre"
                    value={eventData.genre}
                    onChange={handleChange}
                    required
                  >
                    {musicGenres.map((genre) => (
                      <MenuItem key={genre} value={genre}>
                        {genre.replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Precio de la entrada"
                  name="price"
                  type="number"
                  value={eventData.price}
                  onChange={handleChange}
                  helperText="Deja en blanco si el evento es gratuito"
                />
              </Grid>
              <Grid item xs={12} id="logEvent-button">
                <Button  type="submit" variant="contained" color="primary" fullWidth>
                  Crear Evento
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <Popup trigger={isPopupOpen} setTrigger={setIsPopupOpen}>
        <h3>Evento creado </h3>
        <p>Tu evento ha sido registrado exitosamente.</p>
        <Link component="button" onClick={handleRegisterRedirect}>Ok </Link>
      </Popup>
      <Footer />
    </>
  );
};

export default AltaEventos;