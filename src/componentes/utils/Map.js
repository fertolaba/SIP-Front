import { GoogleMap, InfoWindowF, MarkerF } from "@react-google-maps/api";
import { useState, useEffect } from "react";

const MapComponent = ({ isLoaded, selectedEvent, setSelectedEvent, userLocation, filteredEvents }) => {
  const [activeInfoWindow, setActiveInfoWindow] = useState(); // Para controlar qué InfoWindow está abierta

  const containerStyle = {
    width: "100%",
    height: "90vh",
  };

  const center = {
    lat: -34.6131500,
    lng: -58.3772300,
  };

  // Función para seleccionar un evento cuando se hace clic en un marcador
  const onSelect = (event, index) => {
    setSelectedEvent(event);
    setActiveInfoWindow(index); // Identifica el marcador seleccionado para controlar el InfoWindow
  };

  // Efecto para abrir automáticamente el InfoWindow cuando se selecciona un evento desde la lista
  useEffect(() => {
    if (selectedEvent) {
      const selectedIndex = filteredEvents.findIndex(
        (event) => event.name === selectedEvent.name
      );
      setActiveInfoWindow(selectedIndex); // Abrimos el InfoWindow del evento seleccionado
    }
  }, [selectedEvent, filteredEvents]);

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11}>
      {/* Mostrar todos los eventos filtrados en el mapa */}
      {filteredEvents.map((event, index) => (
        <MarkerF
          key={event.name}
          position={event.location}
          onClick={() => onSelect(event, index)} // Maneja la selección de eventos
        />
      ))}

      {/* Mostrar la ubicación del usuario si está disponible */}
      {userLocation && (
        <MarkerF
          position={userLocation}
          icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }} // Marcador azul para el usuario
          onClick={() => {
            setSelectedEvent({ name: "Ubicación del Usuario", location: userLocation });
          }}
        />
      )}

      {/* Muestra InfoWindow solo para el marcador seleccionado */}
      {filteredEvents.map((event, index) => (
        activeInfoWindow === index && (
          <InfoWindowF
            key={event.name}
            position={event.location}
            onCloseClick={() => setActiveInfoWindow()} // Cierra el InfoWindow
          >
            <div>
              <h3>{event.name}</h3>
            </div>
          </InfoWindowF>
        )
      ))}

      {/* Muestra InfoWindow para la ubicación del usuario si está seleccionado */}
      {selectedEvent.location && selectedEvent.name === "Ubicación del Usuario" && (
        <InfoWindowF
          position={userLocation}
          onCloseClick={() => setSelectedEvent({})}
        >
          <div>
            <h3>{selectedEvent.name}</h3>
            <p>Esta es tu ubicación actual.</p>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default MapComponent;
