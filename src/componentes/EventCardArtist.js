import React, { useState, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaymentIcon from '@mui/icons-material/Payment';
import PlaceIcon from '@mui/icons-material/Place';
import '../ui/main.css';

const EventCardArtist = ({ eventId, name, dateTime, price, latitude, longitude, onDelete, onEdit, showEditDeleteButtons }) => {
  const [address, setAddress] = useState("");

  // Configuración del hook para cargar la API de Google Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCpP0aUVjmiS3e38oMrZOdD_jWu039El8Y"
  });

  // Formateo de fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
  };

  // Geocodificación inversa para obtener la dirección principal
  const geocodeLatLng = (lat, lng, callback) => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat, lng };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          const route = results[0].address_components.find(component => component.types.includes("route"))?.long_name || "";
          const streetNumber = results[0].address_components.find(component => component.types.includes("street_number"))?.long_name || "";
          const mainAddress = `${route} ${streetNumber}`.trim();
          callback(mainAddress || "Dirección no disponible");
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

  useEffect(() => {
    if (isLoaded && latitude && longitude) {
      geocodeLatLng(latitude, longitude, (address) => {
        setAddress(address);
      });
    }
  }, [isLoaded, latitude, longitude]);

  return (
    <div className="card-event">
      <div className="card-info">
        <h3>{name}</h3>
        <p className="date">
          <CalendarTodayIcon style={{ fontSize: 'small', verticalAlign: 'middle', marginRight: '5px' }} />
          {formatDate(dateTime)}
        </p>
        <p className="date">
          <PlaceIcon style={{ fontSize: 'small', verticalAlign: 'middle', marginRight: '5px' }} />
          {address}
        </p>
        <p className="price">
          <PaymentIcon style={{ fontSize: 'small', verticalAlign: 'middle', marginRight: '5px' }} />
          {price}
        </p>
      </div>
      {showEditDeleteButtons && (
        <div className="card-buttons">
          <button className="button-asisto" onClick={onEdit}>Editar</button>
          <button className="button-eliminar" onClick={onDelete}>Eliminar</button>
        </div>
      )}
    </div>
  );
};

export default EventCardArtist;



