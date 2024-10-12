import { useJsApiLoader } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import { Typography, TextField, Button, Select, MenuItem, Box, InputLabel } from "@mui/material";
import MapComponent from "./utils/Map";
import Eventos from "./utils/Eventos"; // Importamos los eventos
import haversineDistance from './utils/HaversineDistance';

function BusquedaEventos() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCpP0aUVjmiS3e38oMrZOdD_jWu039El8Y", // Reemplaza con tu clave de Google Maps
  });

  const [selectedEvent, setSelectedEvent] = useState({});
  const [userLocation, setUserLocation] = useState(null); // Para almacenar la ubicación del usuario
  const [address, setAddress] = useState("");
  const [distanceFilter, setDistanceFilter] = useState(100000); // Rango de búsqueda
  const [filteredEvents, setFilteredEvents] = useState(Eventos); // Eventos filtrados según el rango


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

  // Función para convertir dirección en coordenadas usando la API de Google Maps
  const handleGeocodeAddress = async () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK") {
        const { lat, lng } = results[0].geometry.location;
        setUserLocation({
          lat: lat(),
          lng: lng(),
        });
      } else {
        alert("Geocode falló debido a: " + status);
      }
    });
  };

  // Función para obtener la ubicación actual del usuario
  const handleGetUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error obteniendo la geolocalización: ", error);
          alert("No se pudo obtener tu ubicación.");
        }
      );
    } else {
      alert("La geolocalización no es soportada por tu navegador.");
    }
  };

  // Función para filtrar los eventos según el rango de distancia
  useEffect(() => {
    if (userLocation) {
      const filtered = Eventos.map((event) => {
        const distance = haversineDistance(userLocation, event.location); // Calculamos la distancia
        if (distance <= distanceFilter) {
          // Obtener la dirección usando geocodificación inversa
          geocodeLatLng(event.location.lat, event.location.lng, (address) => {
            event.address = address; // Guardamos la dirección en cada evento
            setFilteredEvents((prevEvents) => [...prevEvents]); // Forzamos un re-render
          });
          return event;
        }
        return null;
      }).filter(Boolean); // Filtramos eventos nulos
      setFilteredEvents(filtered); // Actualizamos los eventos filtrados
    }
  }, [userLocation, distanceFilter]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Opciones de búsqueda y distancia sobre el mapa */}
      <Box sx={{ padding: "10px", backgroundColor: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "15px", zIndex: 10 }}>
        <TextField
          label="Ingresa una dirección"
          variant="outlined"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          sx={{ width: "40%" }}
        />
        <Button variant="contained" onClick={handleGeocodeAddress}>
          Buscar dirección
        </Button>
        <Button variant="contained" onClick={handleGetUserLocation}>
          Usar mi ubicación actual
        </Button>
        <InputLabel>Rango de busqueda: </InputLabel>
        <Select
          value={distanceFilter}
          onChange={(e) => setDistanceFilter(parseInt(e.target.value))}
          sx={{ width: "5%" }}
        >
          <MenuItem value={2}>2 km</MenuItem>
          <MenuItem value={5}>5 km</MenuItem>
          <MenuItem value={10}>10 km</MenuItem>
          <MenuItem value={20}>20 km</MenuItem>
          <MenuItem value={50}>50 km</MenuItem>
        </Select>
      </Box>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Panel de control y lista de eventos a la izquierda */}
        <Box sx={{ width: "30%", padding: "10px", backgroundColor: "#f5f5f5" }}>
          <Typography variant="h6">Lista de Eventos</Typography>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filteredEvents.length === 0 ? (
              <li style={{ padding: "10px", backgroundColor: "#f8d7da", color: "#721c24", borderRadius: "5px" }}>
                No se encontraron eventos en esta ubicación, probá buscando en otra ubicación.
              </li>
            ) : (
              filteredEvents.map((event) => (
                <li
                  key={event.name}
                  onClick={() => setSelectedEvent(event)} // Sincroniza el evento seleccionado al hacer clic
                  style={{
                    padding: "10px",
                    margin: "5px 0",
                    backgroundColor: selectedEvent.name === event.name ? "#d3d3d3" : "white", // Cambia el color si está seleccionado
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                >
                  {/* Usamos Typography para darle formato al nombre, fecha y dirección */}
                  <Typography variant="subtitle1" fontWeight="bold">
                    {event.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Fecha: {event.date}
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
          selectedEvent={selectedEvent} // Pasa el evento seleccionado al mapa
          setSelectedEvent={setSelectedEvent} // Permite cambiar el evento seleccionado desde el mapa
          userLocation={userLocation} // Pasa la ubicación del usuario (ya sea por dirección o geolocalización)
          filteredEvents={filteredEvents} // Pasa los eventos filtrados según la distancia
        />
      </div>
    </div>
  );
}

export default BusquedaEventos;
