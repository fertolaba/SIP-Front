import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl,FormHelperText ,Grid, Link } from "@mui/material";
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { styled } from '@mui/material/styles';
import Header from '../componentes/Header';
import Footer from '../componentes/Footer';
import Popup from "../componentes/popups/Popup";
import '../ui/main.css';

const EditarEventos = ({ genres, localities, eventTypes }) => {
  const { eventId } = useParams(); 
  const [localidades, setLocalidades] = useState([]);
  const [errors, setErrors] = useState({});
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    location: "",
    date: null,
    time: null,
    genre: "",
    price: "",
    localidad: "",
  });

  const HelperText = styled(FormHelperText)`
  color: #d32f2f;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1.66;
    letter-spacing: 0.03333em;
    text-align: left;
    margin-top: 3px;
    margin-right: 0;
    margin-bottom: 0;
    margin-left: 0;
    margin-left: 14px;
    margin-right: 14px;
}
`;

  const userId = localStorage.getItem('userId');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocalidades = async () => {
      try {
        const response = await fetch('http://localhost:4002/api/localidad');
        if (!response.ok) {
          throw new Error('Error al obtener localidades');
        }
        const data = await response.json();
        setLocalidades(data);
      } catch (error) {
        console.error('Error al cargar localidades:', error);
      }
    };
    fetchLocalidades();
  }, []);

  const getAddressFromCoordinates = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data && data.display_name) {
        return data.display_name; 
      } else {
        throw new Error("Error al obtener dirección a partir de coordenadas");
      }
    } catch (error) {
      console.error(error);
      return ""; 
    }
  };

  const validateFields = async () => {
    const newErrors = {};

    if (!eventData.name) newErrors.name = "El nombre del evento es obligatorio.";
    if (!eventData.description) newErrors.description = "La descripción del evento es obligatoria.";
    if (!eventData.localidad) {
      newErrors.localidad = "La ubicación es obligatoria.";
      console.log("Localidad obtenida:", eventData.localidad);
    }
  
      const coordinates = await getLatLongFromAddress(eventData.location);
      console.log("Coordenadas obtenidas:", coordinates);
      if (!coordinates) {
        newErrors.location = "Ingrese una ubicación válida.";
      } else {
        setEventData({
          ...eventData,
          coordinates: coordinates, 
        });
      }
  
    if (!eventData.date) newErrors.date = "La fecha es obligatoria.";
    if (!eventData.time) newErrors.time = "La hora es obligatoria.";
    if (!eventData.genre) newErrors.genre = "Debes seleccionar un género musical.";
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };
  

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch('http://localhost:4002/api/events');
        if (!response.ok) throw new Error('Error al obtener eventos');
        const events = await response.json();
        
        const selectedEvent = events.find(event => event.id === parseInt(eventId));
        if (selectedEvent) {
          const address = await getAddressFromCoordinates(selectedEvent.latitude, selectedEvent.longitude);
          console.log("Event Data localidadId:", selectedEvent.localidad); 
          setEventData({
            name: selectedEvent.name,
            description: selectedEvent.description,
            location: address,
            date: new Date(selectedEvent.dateTime),
            time: new Date(selectedEvent.dateTime),
            genre: selectedEvent.genres[0],
            price: selectedEvent.price,
            localidad: selectedEvent.localidad?.id || '',
          });
        } else {
          console.error("Evento no encontrado");
        }
      } catch (error) {
        console.error('Error al cargar datos del evento:', error);
      }
    };
  
    fetchEventData();
  }, [eventId]);

  const handleRegisterRedirect = () => {
    navigate('/artist-dashboard'); 
  };

  const getLatLongFromAddress = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        return { lat: data[0].lat, lng: data[0].lon };
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
    const isValid = await validateFields();
    
    if (!isValid) {
      console.error("Errores de validación:", errors);
      return;
    }
    const address = eventData.location;
    const coordinates = await getLatLongFromAddress(address);

    if (coordinates) {
      const dateTime = new Date(eventData.date);
      dateTime.setHours(eventData.time.getHours());
      dateTime.setMinutes(eventData.time.getMinutes());
      dateTime.setHours(dateTime.getHours() - 3); 

      const registerRequest = {
        name: eventData.name,
        description: eventData.description,
        location: eventData.location,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        dateTime: dateTime.toISOString(),
        price: eventData.price || 0,
        organizerId: userId,
        genres: [eventData.genre],
        localidadId: eventData.localidad
      };

      try {
        const response = await fetch(`http://localhost:4002/api/events/${eventId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registerRequest),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error del servidor:', errorText);
          throw new Error('Error al actualizar el evento');
        }

        console.log('Datos enviados:', JSON.stringify(registerRequest, null, 2));
        setIsPopupOpen(true);  
      } catch (error) {
        console.log('Datos enviados:', JSON.stringify(registerRequest, null, 2));
        console.error('Error al actualizar evento:', error);
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
            Editar Evento
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
                  error={Boolean(errors.name)}
                  helperText={errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción del evento"
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  error={Boolean(errors.description)}
                  helperText={errors.description}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ubicación"
                  name="location"
                  value={eventData.location}
                  onChange={handleChange}
                  error={Boolean(errors.location)}
                  helperText={errors.location}
                />
              </Grid>
              <Grid container item xs={12} spacing={6}>
                <Grid item xs={6}>
                  <LocalizationProvider  fullWidth dateAdapter={AdapterDateFns} error={Boolean(errors.date)}>
                    <DatePicker
                      
                      label="Fecha"
                      value={eventData.date}
                      onChange={handleDateChange}
                      renderInput={(params) => <TextField {...params} fullWidth required />}
                    />
                  <HelperText>{errors.date}</HelperText>
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} error={Boolean(errors.time)}>
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
                    <HelperText>{errors.time}</HelperText>
                  </LocalizationProvider>
                </Grid>
              </Grid>
              <Grid item xs={12}>
              <FormControl fullWidth margin="normal" error={Boolean(errors.localidad)}>
              <InputLabel>Localidad</InputLabel>
              <Select
                name="localidadId"
                value={eventData.localidad}
                onChange={(e) => setEventData({ ...eventData, localidad: e.target.value })}
              >
                {localidades.map((localidad) => (
                  <MenuItem key={localidad.id} value={localidad.id}>
                    {localidad.nombre}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.localidad}</FormHelperText>
            </FormControl>
          </Grid>          
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(errors.genre)}>
                  <InputLabel>Género musical</InputLabel>
                  <Select
                    name="genre"
                    value={eventData.genre}
                    onChange={handleChange}
                  >
                    {musicGenres.map((genre) => (
                      <MenuItem key={genre} value={genre}>
                        {genre.replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                <FormHelperText>{errors.genre}</FormHelperText>
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
                  Editar Evento
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <Popup trigger={isPopupOpen} setTrigger={setIsPopupOpen}>
        <h3>Evento editado</h3>
        <p>Tu evento ha sido editado exitosamente.</p>
        <Link component="button" onClick={handleRegisterRedirect}>Ok </Link>
      </Popup>
      <Footer />
    </>
  );
};

export default EditarEventos;