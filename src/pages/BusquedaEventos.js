import { useJsApiLoader } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import { Typography, TextField, Button, Select, MenuItem, Box, InputLabel } from "@mui/material";
import MapComponent from "../componentes/utils/Map";
import axios from "axios";
import Header from '../componentes/Header';
import Footer from '../componentes/Footer';
import '../ui/main.css';

function BusquedaEventos() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCpP0aUVjmiS3e38oMrZOdD_jWu039El8Y",
  });

  const [selectedEvent, setSelectedEvent] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [distanceFilter, setDistanceFilter] = useState(100000); 
  const [allEvents, setAllEvents] = useState([]); 
  const [filteredEvents, setFilteredEvents] = useState([]); 
  const [mapCenter, setMapCenter] = useState({ lat: -34.6131500, lng: -58.3772300 });
  const [errorMessage, setErrorMessage] = useState(""); 


  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:4002/api/events");
      const eventos = response.data.map((event) => ({
        ...event,
        location: { lat: event.latitude, lng: event.longitude },
        address: "", 
      }));

      const eventosOrdenados = eventos.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
      setAllEvents(eventosOrdenados);
      setFilteredEvents(eventosOrdenados);
    } catch (error) {
      console.error("Error obteniendo eventos desde el backend: ", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);


  const handleGeocodeAddress = async () => {
    if (!address) {
      setErrorMessage("Por favor ingresa una dirección válida.");
      return;
    }

    if (isLoaded) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK") {
          const { lat, lng } = results[0].geometry.location;
          setUserLocation({
            lat: lat(),
            lng: lng(),
          });
          setMapCenter({ lat: lat(), lng: lng() });
          setErrorMessage("");
        } else {
          setErrorMessage("No se pudo geocodificar la dirección. Intenta con otra.");
        }
      });
    } else {
      setErrorMessage("Google Maps API no está cargada correctamente.");
    }
  };


  const handleGetUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter({ lat: latitude, lng: longitude });
          setErrorMessage("");
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


  const updateFilteredEvents = async () => {
    if (userLocation) {
      try {
        const response = await axios.get("http://localhost:4002/api/events/proximity", {
          params: {
            lat: userLocation.lat,
            lng: userLocation.lng,
            radius: distanceFilter,
          },
        });
        const eventos = response.data.map((event) => ({
          ...event,
          location: { lat: event.latitude, lng: event.longitude },
          address: "", 
        }));
        setFilteredEvents(eventos);
      } catch (error) {
        console.error("Error al obtener eventos por proximidad: ", error);
        setErrorMessage("No se pudieron obtener eventos por proximidad.");
      }
    }
  };

  useEffect(() => {
    if (userLocation) {
      updateFilteredEvents();
    }
  }, [userLocation, distanceFilter]);


  const geocodeLatLng = (lat, lng, callback) => {
    if (isLoaded) {
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
    }
  };

  useEffect(() => {
    filteredEvents.forEach((event) => {
      if (!event.address) {
        geocodeLatLng(event.location.lat, event.location.lng, (address) => {
          event.address = address;
          setFilteredEvents((prevEvents) => [...prevEvents]);
        });
      }
    });
  }, [filteredEvents]);

  return (
    <>
    <Header/>
    <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#f5f5f5" }}>
      
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
    </>
  );
}

export default BusquedaEventos;