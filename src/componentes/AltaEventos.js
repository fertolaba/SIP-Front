import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import fetchWithTimeout from "./error/_fetchWithTimeOut";

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

      const registerRequest = {
        name: eventData.name,
        description: eventData.description,
        location: eventData.location,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        dateTime: dateTime.toISOString(),
        price: eventData.price,
        organizerId: localStorage.getItem('userId'),
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
    <Card style={{ backgroundColor: "#f5f5f5", padding: "20px", marginTop: "20px" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Alta de Evento
        </Typography>
        <form onSubmit={handleSubmit}>
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
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Fecha"
                  value={eventData.date}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
                <TimePicker
                  label="Hora"
                  value={eventData.time}
                  onChange={handleTimeChange}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </LocalizationProvider>
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
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Crear Evento
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default AltaEventos;
