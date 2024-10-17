import { GoogleMap, InfoWindowF, MarkerF } from "@react-google-maps/api";
import { useState, useEffect } from "react";

const MapComponent = ({ isLoaded, selectedEvent, setSelectedEvent, userLocation, filteredEvents }) => {
  const [activeInfoWindow, setActiveInfoWindow] = useState();

  const containerStyle = {
    width: "100%",
    height: "90vh",
  };

  const center = userLocation || {
    lat: -34.6131500,
    lng: -58.3772300,
  };

  const onSelect = (event, index) => {
    setSelectedEvent(event);
    setActiveInfoWindow(index);
  };

  useEffect(() => {
    if (selectedEvent) {
      const selectedIndex = filteredEvents.findIndex(
        (event) => event.name === selectedEvent.name
      );
      setActiveInfoWindow(selectedIndex);
    }
  }, [selectedEvent, filteredEvents]);

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11}>
      {filteredEvents.map((event, index) => (
        <MarkerF
          key={event.name}
          position={event.location}
          onClick={() => onSelect(event, index)}
        />
      ))}

      {userLocation && (
        <MarkerF
          position={userLocation}
          icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
          onClick={() => {
            setSelectedEvent({ name: "Ubicación del Usuario", location: userLocation });
          }}
        />
      )}

      {filteredEvents.map((event, index) => (
        activeInfoWindow === index && (
          <InfoWindowF
            key={event.name}
            position={event.location}
            onCloseClick={() => setActiveInfoWindow()}
          >
            <div>
              <h3>{event.name}</h3>
            </div>
          </InfoWindowF>
        )
      ))}

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