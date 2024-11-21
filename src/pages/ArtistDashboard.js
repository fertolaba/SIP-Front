import React, { useState, useEffect } from 'react';
import EventCard from '../componentes/EventCard';
import Header from '../componentes/Header';
import Footer from '../componentes/Footer';
import '../ui/main.css';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AppsIcon from '@mui/icons-material/Apps';
import { Select, MenuItem,Typography } from "@mui/material";
import eventosServices from '../service/eventos.services';
import generosServices from '../service/generos.services';
import recommendationsServices from '../service/recommendations.services';
import { Carousel } from 'react-responsive-carousel';
import BannerCarousel from '../componentes/BannerCarrousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Estilos del carrusel

const ArtistDashboard = () => {
  const [events, setEvents] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [localidadId, setLocalidadId] = useState('');
  const [localidades, setLocalidades] = useState([]);
  const [selectedLocalidad, setselectedLocalidad] = useState('');

  useEffect(() => {  //eventos del home
    setLoading(true);
    eventosServices.getEventos() 
      .then(data => setEvents(data)) 
      .catch(error => console.error('Error fetching events:', error))
      .finally(() => setLoading(false)); 
  }, []);

  useEffect(() => {
    setLoading(true);  
    generosServices.getGeneros()
      .then(data => {
        setGenres(data);
      })
      .catch(error => {
        console.error('Error al obtener los géneros:', error);
      })
      .finally(() => setLoading(false));  
  }, []);

  useEffect(() => {  //recomendaciones
    setLoading(true);
    const userId = Number(localStorage.getItem('userId'));
    recommendationsServices.getRecommendations(userId) 
      .then(data => setRecommendations(data)) 
      .catch(error => console.error('Error fetching recommendations:', error))
      .finally(() => setLoading(false)); 
  }, []);

  // Cargar localidades disponibles
  useEffect(() => {
    const fetchLocalidades = async () => {
      try {
        const response = await fetch('http://localhost:4002/api/localidad');
        if (!response.ok) {
          throw new Error('Error al obtener localidades');
        }
        const data = await response.json();
        setLocalidades(data); // Guardamos las localidades en el estado
      } catch (error) {
        console.error('Error al cargar localidades:', error);
      }
    };
    fetchLocalidades();
  }, []);

  // Agregar tiempo por defecto a la fecha
  const addDefaultTime = (date, time) => {
    return date ? `${date}T${time}` : '';
  };
  
  // Función para obtener eventos filtrados
  const fetchEvents = () => {
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (startDate) params.append('startDate', addDefaultTime(startDate, '00:00:00'));
    if (endDate) params.append('endDate', addDefaultTime(endDate, '23:59:59'));
    if (selectedGenre) params.append('genres', selectedGenre);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (selectedLocalidad) params.append('localidadId', selectedLocalidad);

    fetch(`http://localhost:4002/api/events/filters?${params.toString()}`)
      .then(response => response.json())
      .then(data => {
        setEvents(data);


        const userId = Number(localStorage.getItem('userId'));
        const params = new URLSearchParams();
        if (name) params.append('name', name);
        if (startDate) params.append('startDate', addDefaultTime(startDate, '00:00:00'));
        if (endDate) params.append('endDate', addDefaultTime(endDate, '23:59:59'));
        if (selectedGenre) params.append('genres', selectedGenre);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        if (selectedLocalidad) params.append('localidadId', selectedLocalidad);

        fetch(`http://localhost:4002/api/user-interactions/${userId}/search?${params.toString()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error recording search query');
            }
            return response.json();
        })
        .then(data => console.log('Search query recorded successfully:', data))
        .catch(error => console.error('Error recording search query:', error));
    })
    .catch(error => console.error('Error fetching events:', error));
};
  


  const loadAllEvents = () => {          //eventos del select
    fetch('http://localhost:4002/api/events')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching events:', error));
  };


  const clearFilters = () => {
    setName('');
    setStartDate('');
    setEndDate('');
    setSelectedGenre('');
    setMinPrice('');
    setSelectedGenre('');
    setMaxPrice('');
    loadAllEvents();  
  };

  return (
    <>
    <Header />
    <div id='client-home'>
      
      {/* <div className="client-home-img"></div> */}

      <div className="search-bar" id='customFont'>
        {/* Filtro por nombre */}
        <div className="search-item">
          <input 
            type="text" 
            placeholder="Nombre del evento" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="divider"></div>

        {/* Filtro por fecha de inicio */}
        <div className="search-item">
          <CalendarTodayIcon style={{ fontSize:'small', verticalAlign: 'middle', marginRight: '5px', color:'white' }} />
          <input 
            type="date" 
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="divider"></div>

        {/* Filtro por fecha de fin */}
        <div className="search-item">
          <CalendarTodayIcon style={{ fontSize:'small', verticalAlign: 'middle', marginRight: '5px', color:'white' }} />
          <input 
            type="date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="divider"></div>

        {/* Filtro por género */}
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

        {/* Filtro por localidad */}
        <div className="search-item">
          <Select 
            value={selectedLocalidad} 
            onChange={(e) => setselectedLocalidad(e.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': 'Sin etiqueta' }}
            sx={{ width: { xs: "100%" }, color:'white', backgroundColor:'transparent', fontSize:"14" }}
          >
            <MenuItem value="">Seleccionar Localidad</MenuItem>
            {localidades.length > 0 ? (
              localidades.map((localidad) => (
                <MenuItem key={localidad.id} value={localidad.id}>{localidad.nombre}</MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>Cargando localidades...</MenuItem>
            )}
          </Select>
        </div>
        <div className="divider"></div>

        {/* Filtro por precio mínimo */}
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

        {/* Filtro por precio máximo */}
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

        {/* Botones para aplicar y limpiar filtros */}
        <button className="search-btn" onClick={fetchEvents}>
          Buscar
        </button>
        <button className="search-btn" onClick={clearFilters} style={{ marginLeft: '10px' }}>
          Limpiar filtros
        </button>
      </div>

      <BannerCarousel />

      {recommendations.length > 0 && (
        <>
          <div className="line-below"></div>
          <Typography 
            variant="h4" 
            gutterBottom 
            id="customFont" 
            textAlign={"center"} 
            marginTop={2} 
            fontWeight={'fontWeightBold'}
          >
            Eventos para vos
          </Typography>
          <div id='client-recommendations'>
            {recommendations.map(eventReco => (
              <EventCard 
                eventId={eventReco.id} 
                name={eventReco.name} 
                description={eventReco.description} 
                price={eventReco.price} 
                dateTime={eventReco.dateTime} 
                latitude={eventReco.latitude}
                longitude={eventReco.longitude}
              />
            ))}
          </div>
        </>
      )}

      <div className="line-below"></div>
      <Typography variant="h4" gutterBottom id="customFont" textAlign={"center"} marginTop={2} fontWeight={'fontWeightBold'} >
            Todos los eventos
      </Typography>
      <div id='client-main'>
        {/* Renderiza las tarjetas de eventos */}
          {events.length > 0 ? (

      events
      .filter(event => !recommendations.some(reco => reco.id === event.id))
      .map(event => (
        <EventCard 
          key={event.id}
          eventId={event.id} 
          name={event.name} 
          description={event.description} 
          price={event.price} 
          dateTime={event.dateTime} 
          latitude={event.latitude}
          longitude={event.longitude}
        />
      ))
      ) : (

      <Typography variant="h6" textAlign="center" marginTop={3}>
        No se encontraron eventos
      </Typography>
    )}
      </div>
      <div className="line-below"></div>

      <Footer />
    </div>

    </>
  );
};

export default ArtistDashboard;
