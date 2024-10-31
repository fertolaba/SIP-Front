import React, { useState, useEffect } from 'react';
import '../ui/main.css';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaymentIcon from '@mui/icons-material/Payment';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const EventCard = ({ eventId, image, name, location, dateTime, price }) => {
  const [liked, setLiked] = useState(false);

  // Check if the event is liked based on localStorage
  useEffect(() => {
    const likedEvents = JSON.parse(localStorage.getItem('likedEvents')) || [];
    setLiked(likedEvents.includes(eventId)); // Set initial liked state based on localStorage
  }, [eventId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
  };

  const toggleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    
    // Update localStorage
    const likedEvents = JSON.parse(localStorage.getItem('likedEvents')) || [];
    if (newLikedState) {
      // Add the event ID to liked events
      likedEvents.push(eventId);
      // Send like to the backend
      recordLike(eventId);
    } else {
      // Remove the event ID from liked events
      const updatedLikedEvents = likedEvents.filter(id => id !== eventId);
      localStorage.setItem('likedEvents', JSON.stringify(updatedLikedEvents));
    }
    localStorage.setItem('likedEvents', JSON.stringify(likedEvents));
  };

  // Function to send like to the backend
  const recordLike = (eventId) => {
    const userId = Number(localStorage.getItem('userId')); // Obtiene el userId del local storage
    const endpoint = `http://localhost:4002/api/user-interactions/${userId}/events/${eventId}/like`; // Endpoint directo
  
    // Realizar la solicitud POST al backend
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text(); // Cambia a text() para ver la respuesta cruda
    })
    .then(data => {
      try {
        const jsonData = JSON.parse(data); // Intenta analizar el JSON
        console.log('Like recorded:', jsonData); // Imprimir la respuesta del servidor
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    })
    .catch(error => {
      console.error('Error recording like:', error); // Imprimir cualquier error
    });
  };

  // Function to send attendance to the backend
  const recordAttendance = () => {
    const userId = Number(localStorage.getItem('userId')); // Obtiene el userId del local storage
    const endpoint = `http://localhost:4002/api/user-interactions/${userId}/events/${eventId}/assist`; // Endpoint para asistencia
  
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text(); // Cambia a text() para ver la respuesta cruda
    })
    .then(data => {
      console.log('Attendance recorded:', data);
    })
    .catch(error => {
      console.error('Error recording attendance:', error);
    });
  };

  const isPastEvent = new Date(dateTime) < new Date();

  if (isPastEvent) {
    return null;
  }

  return (
    <div className="card-event">
      <div className="card-image" style={{ backgroundImage: image ? `url(${image})` : '#ccc' }}>
        {!image && <div className="no-image">No Image</div>}
        <div className="like-icon" onClick={toggleLike}>
          {liked ? (
            <FavoriteIcon style={{ color: 'red' }} />
          ) : (
            <FavoriteBorderIcon style={{ color: 'white' }} />
          )}
        </div>
      </div>
      <div className="card-info">
        <h3>{name}</h3>
        <p className="location">{location}</p>
        <p className="date">
          <CalendarTodayIcon style={{ fontSize: 'small', verticalAlign: 'middle', marginRight: '5px' }} />
          {formatDate(dateTime)}
        </p>
        <p className="price">
          <PaymentIcon style={{ fontSize: 'small', verticalAlign: 'middle', marginRight: '5px' }} />
          {price}
        </p>
      </div>
      <div className="card-buttons">
        <button className="button-asisto" onClick={recordAttendance}>Asisto</button>
        <button className="button-entradas">Entradas</button>
      </div>
    </div>
  );
};

export default EventCard;
