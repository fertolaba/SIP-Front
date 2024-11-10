import React, { useState, useEffect } from 'react';
import EventCard from '../componentes/EventCard'; 
import Header from '../componentes/Header';
import '../ui/main.css';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Select, MenuItem } from "@mui/material";
import AppsIcon from '@mui/icons-material/Apps';
import generosServices from '../service/generos.services';
import Footer from '../componentes/Footer';

const ClientDashboard = () => {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [genres, setGenres] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    setLoading(true);  
    generosServices.getGeneros()
      .then(data => {
        console.log(data);  
        setGenres(data);  
      })
      .catch(error => {
        console.error('Error al obtener los géneros:', error);
      })
      .finally(() => {
        setLoading(false);  
      });
}, []); 

  const addDefaultTime = (date, time) => {
    return date ? `${date}T${time}` : '';
  };

  const loadAllEvents = () => {
    fetch('http://localhost:4002/api/events')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching events:', error));
  };

  useEffect(() => {
    loadAllEvents();  
  }, []); 

  const fetchEvents = () => {
    const params = new URLSearchParams();
    if (name) params.append('name', name);

    if (startDate) params.append('startDate', addDefaultTime(startDate, '00:00:00'));
    if (endDate) params.append('endDate', addDefaultTime(endDate, '23:59:59'));

    if (genres) params.append('genres', genres);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);

    fetch(`http://localhost:4002/api/events/filters?${params.toString()}`)
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching events:', error));
  };

  const clearFilters = () => {
    setName('');
    setStartDate('');
    setEndDate('');
    setGenres('');
    setMinPrice('');
    setMaxPrice('');
    loadAllEvents();  
  };

  return (
    <>
    <Header/>
    <div id='client-home'>
      
      <div className="client-home-img"></div>

      <div className="search-bar" id='customFont'>
        <div className="search-item">
          <input 
            type="text" 
            placeholder="Nombre del evento" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="divider"></div>
        <div className="search-item">


          <CalendarTodayIcon style={{ fontSize:'small', verticalAlign: 'middle', marginRight: '5px', color:'white' }} />
          <input 
            type="date" 
            placeholder="Fecha inicio" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="divider"></div>
        <div className="search-item">
          <CalendarTodayIcon style={{ fontSize:'small', verticalAlign: 'middle', marginRight: '5px', color:'white' }} />
          <input 
            type="date" 
            placeholder="Fecha fin"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="divider"></div>
        <div className="search-item">
          <AppsIcon style={{ fontSize:'medium', verticalAlign: 'middle', marginRight: '5px', color:'white' }} />
          <Select 
  value={selectedGenre} 
  onChange={(e) => setSelectedGenre(e.target.value)}
  displayEmpty
  inputProps={{ 'aria-label': 'Sin etiqueta' }}
  sx={{ width: { xs: "100%"}, color:'white', backgroundColor:'transparent', fontSize:"14" }}
>
  <MenuItem value="">Seleccionar Género</MenuItem>
  {genres.length > 0 ? (
    genres.map((genre, index) => (
      <MenuItem key={index} value={genre}>{genre}</MenuItem> 
    ))
  ) : (
    <MenuItem value="" disabled>Cargando géneros...</MenuItem>
  )}
</Select>
        </div>
        <div className="divider"></div>
        <div className="search-item">
          <input 
            type="number" 
            placeholder="Precio mínimo" 
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min="0"
            max="100000"
          />
        </div>
        <div className="divider"></div>
        <div className="search-item">
          <input 
            type="number" 
            placeholder="Precio máximo" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min="0"
            max="100000"
          />
        </div>
        <button className="search-btn" onClick={fetchEvents}>
          Buscar
        </button>
        <button className="search-btn" onClick={clearFilters} style={{ marginLeft: '10px' }}>
          Limpiar filtros
        </button>
      </div>

      <div className="line-below"></div>

      <div id='client-main'>
        {events.map(event => (
          <EventCard 
            key={event.id} 
            eventId = {event.id}
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

    </div>
    <Footer />
    </>
  );
};

export default ClientDashboard;