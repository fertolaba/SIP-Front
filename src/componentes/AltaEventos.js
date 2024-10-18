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

const AltaEventos = ({ genres, localities, eventTypes }) => {
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    location: "",
    date: null,
    time: null,
    genre: "",
    price: "",
    eventType: "",
    locality: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const dateTime = new Date(eventData.date);
    if (eventData.time) {
      dateTime.setHours(eventData.time.getHours());
      dateTime.setMinutes(eventData.time.getMinutes());
    }
    console.log({ ...eventData, dateTime }); 
  };

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
                  {genres?.map((genre) => (
                    <MenuItem key={genre.id} value={genre.id}>
                      {genre.name}
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de evento</InputLabel>
                <Select
                  name="eventType"
                  value={eventData.eventType}
                  onChange={handleChange}
                  required
                >
                  {eventTypes?.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Localidad</InputLabel>
                <Select
                  name="locality"
                  value={eventData.locality}
                  onChange={handleChange}
                  required
                >
                  {localities?.map((locality) => (
                    <MenuItem key={locality.id} value={locality.id}>
                      {locality.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
