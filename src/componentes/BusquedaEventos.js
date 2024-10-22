import { useJsApiLoader } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import { Typography, TextField, Button, Select, MenuItem, Box, InputLabel,Alert } from "@mui/material";
import MapComponent from "./utils/Map";
import haversineDistance from './utils/HaversineDistance';
import axios from "axios"; 
import Header from './Header';
import Footer from './Footer';
import '../ui/main.css';


function BusquedaEventos() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCpP0aUVjmiS3e38oMrZOdD_jWu039El8Y",
  });

  const [selectedEvent, setSelectedEvent] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [distanceFilter, setDistanceFilter] = useState(100000); 
  const [allEvents, setAllEvents] = useState([]); // Todos los eventos
  const [filteredEvents, setFilteredEvents] = useState([]); // Eventos filtrados
  const [mapCenter, setMapCenter] = useState({ lat: -34.6131500, lng: -58.3772300 }); // Centro del mapa
  const [errorMessage, setErrorMessage] = useState(""); // Estado para manejar el mensaje de error

//función para obtener eventos del backend
const fetchEvents = async () => {
  try {
    const response = await axios.get("http://localhost:4002/api/events");
    
    const eventos = response.data.map((event) => ({
      ...event,
      location: { lat: event.latitude, lng: event.longitude }, 
      address: "", 
    }));
    
    // Ordena los eventos por fecha antes de guardarlos
    const eventosOrdenados = eventos.sort((a, b) => {
      const dateA = new Date(a.dateTime); // Convierte la fecha a un objeto Date
      const dateB = new Date(b.dateTime);
      return dateA - dateB; // Ordena de menor a mayor (más cercano primero)
    });
    
    setAllEvents(eventosOrdenados); // Guarda los eventos ordenados
    setFilteredEvents(eventosOrdenados); // Inicializa con los eventos ordenados
  } catch (error) {
    console.error("Error obteniendo eventos desde el backend: ", error);
  }
};


  useEffect(() => {
    fetchEvents();
  }, []);

  // Función de geocodificación directa: convierte una dirección a coordenadas
  const handleGeocodeAddress = async () => {
    if (!address) {
      setErrorMessage("Por favor ingresa una dirección válida."); // Mostrar error si está vacío
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK") {
        const { lat, lng } = results[0].geometry.location;
        setUserLocation({
          lat: lat(),
          lng: lng(),
        });
        setMapCenter({ lat: lat(), lng: lng() }); // Actualiza el centro del mapa
        setErrorMessage(""); // Limpia el mensaje de error
      } else {
        setErrorMessage("No se pudo geocodificar la dirección. Intenta con otra."); // Error de geocodificación
      }
    });
  };

  // Función para obtener la ubicación actual del usuario
  const handleGetUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter({ lat: latitude, lng: longitude }); // Actualiza el centro del mapa
          setErrorMessage(""); // Limpia el mensaje de error si se obtiene la ubicación correctamente
        },
        (error) => {
          console.error("Error obteniendo la geolocalización: ", error);
          setErrorMessage("No se pudo obtener tu ubicación.");
        }
      );
    } else {
      setErrorMessage("La geolocalización no es soportada por tu navegador.");
    }
  };

  // Función para actualizar los eventos filtrados según la ubicación y el rango
  const updateFilteredEvents = () => {
    if (userLocation) {
      const filtered = allEvents.filter((event) => {
        const distance = haversineDistance(userLocation, event.location); 
        return distance <= distanceFilter; 
      });
      setFilteredEvents(filtered);
    }
  };

  // Efecto para actualizar los eventos cuando cambian el rango o la ubicación del usuario
  useEffect(() => {
    if (userLocation) {
      updateFilteredEvents();
    }
  }, [userLocation, distanceFilter]); 

  // Función de geocodificación inversa para obtener direcciones a partir de latitud y longitud
  const geocodeLatLng = (lat, lng, callback) => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          callback(results[0].formatted_address);
        } else {
          console.error("No se encontraron resultados.");
          callback("Dirección no disponible");
        }
      } else {
        console.error("Falla en Geocodificación Inversa: " + status);
        callback("Error al obtener dirección");
      }
    });
  };

  // Efecto para asignar direcciones a los eventos filtrados
  useEffect(() => {
    filteredEvents.forEach((event) => {
      if (!event.address) {
        geocodeLatLng(event.location.lat, event.location.lng, (address) => {
          event.address = address; // Asigna la dirección
          setFilteredEvents((prevEvents) => [...prevEvents]); // Forzar re-render
        });
      }
    });
  }, [filteredEvents]);

  return (
    
    <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#f5f5f5" }}>
      <Header/>
      <Box id='eventSearch-container' sx={{ padding: "10px", backgroundColor: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "15px", zIndex: 10 }}>
        <TextField
          label="Ingresa una dirección"
          variant="outlined"
          value={address}
          error={Boolean(errorMessage)}
          helperText={errorMessage}
          onChange={(e) => setAddress(e.target.value)}
          sx={{ width: "40%" }}
        />
        <Button variant="contained" onClick={handleGeocodeAddress}>
          Buscar dirección
        </Button>
        <Button sx={{width:{xs:"100%",md:"13%"}}} variant="contained" onClick={handleGetUserLocation}>
          Usar mi ubicación actual
        </Button>
        <InputLabel>Rango de búsqueda: </InputLabel>
        <Select
          value={distanceFilter}
          onChange={(e) => setDistanceFilter(parseInt(e.target.value))}
          sx={{ width: { xs: "100%", md: "5%" } }}
        >
          <MenuItem value={2}>2 km</MenuItem>
          <MenuItem value={5}>5 km</MenuItem>
          <MenuItem value={10}>10 km</MenuItem>
          <MenuItem value={20}>20 km</MenuItem>
          <MenuItem value={50}>50 km</MenuItem>
        </Select>
      </Box>

      <div style={{ display: "flex", flex: 1 }}>
        <Box sx={{ width: "30%", padding: "10px", backgroundColor: "#f5f5f5" }}>
          <Typography variant="h6">Lista de Eventos</Typography>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filteredEvents.length === 0 ? (
              <li style={{ padding: "10px", backgroundColor: "#f8d7da", color: "#721c24", borderRadius: "5px" }}>
                No se encontraron eventos en esta ubicación.
              </li>
            ) : (
              filteredEvents.map((event) => (
                <li
                  key={event.name}
                  onClick={() => setSelectedEvent(event)}
                  style={{
                    padding: "10px",
                    margin: "5px 0",
                    backgroundColor: selectedEvent.name === event.name ? "#d3d3d3" : "white",
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {event.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Fecha y hora: {event.dateTime}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {event.address ? event.address : "Obteniendo dirección..."}
                  </Typography>
                </li>
              ))
            )}
          </ul>
        </Box>
        <MapComponent
          isLoaded={isLoaded}
          selectedEvent={selectedEvent}
          setSelectedEvent={setSelectedEvent}
          userLocation={userLocation}
          filteredEvents={filteredEvents}
          mapCenter={mapCenter}
        />
      </div>
      <Footer />
    </div>
  );
}

export default BusquedaEventos;