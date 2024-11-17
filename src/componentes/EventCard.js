import React, { useState, useEffect } from 'react'; 
import '../ui/main.css';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaymentIcon from '@mui/icons-material/Payment';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const EventCard = ({ eventId, image, name, location, dateTime, price }) => {
  const [liked, setLiked] = useState(false);
  const [attending, setAttending] = useState(false);
  const userId = Number(localStorage.getItem('userId'));  // Assuming userId is stored in localStorage

  // Obtener los eventos que el usuario ha "likeado" al cargar el componente
  useEffect(() => {
    // Obtener los eventos "likeados"
    fetch(`http://localhost:4002/api/events/user/${userId}/likes`)
      .then((response) => response.json())
      .then((data) => {
        const likedEvents = data.map((event) => event.id); // Extraemos los IDs de los eventos que el usuario ha "likeado"
        setLiked(likedEvents.includes(eventId)); // Si el ID del evento está en la lista, lo marcamos como "liked"
      })
      .catch((error) => console.error('Error fetching liked events:', error));

    // Verificar si el usuario está asistiendo al evento
    fetch(`http://localhost:4002/api/events/user/${userId}/attending`)
      .then((response) => response.json())
      .then((data) => {
        const attendingEvents = data.map((event) => event.id); // Extraemos los IDs de los eventos que el usuario está asistiendo
        setAttending(attendingEvents.includes(eventId)); // Si el ID del evento está en la lista, lo marcamos como "attending"
      })
      .catch((error) => console.error('Error fetching attending events:', error));
  }, [eventId, userId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
  };

  // Función para registrar o eliminar el "like" del evento
  const toggleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);

    const endpoint = `http://localhost:4002/api/user-interactions/${userId}/events/${eventId}/like`;

    fetch(endpoint, {
      method: newLikedState ? 'POST' : 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventId: eventId }), // Mandamos el ID del evento al backend
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log(`Like ${newLikedState ? 'added' : 'removed'}`);
      })
      .catch((error) => console.error('Error toggling like:', error));
  };

  // Función para registrar o eliminar la asistencia
  const toggleAttendance = () => {
    const newAttendingState = !attending;
    setAttending(newAttendingState);

    const endpoint = `http://localhost:4002/api/user-interactions/${userId}/events/${eventId}/assist`;

    fetch(endpoint, {
      method: newAttendingState ? 'POST' : 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log(`Attendance ${newAttendingState ? 'registered' : 'removed'}`);
      })
      .catch((error) => console.error('Error toggling attendance:', error));
  };

  const isPastEvent = new Date(dateTime) < new Date();
  if (isPastEvent) {
    return null; // Hide past events
  }

  return (
    <div className="card-event">
      <div className="card-image" style={{ backgroundImage: image ? `url(${image})` : '#ccc' }}>
        {!image && <div className="no-image">No Image</div>}
        <div className="like-icon" onClick={toggleLike}>
          {liked ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteBorderIcon style={{ color: 'white' }} />}
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
        <button
          className={`button-asisto ${attending ? 'attending' : ''}`}
          onClick={toggleAttendance}
        >
          {attending ? 'Asistiendo' : 'Asisto'}
        </button>
        <button className="button-entradas">Entradas</button>
      </div>
    </div>
  );
};

export default EventCard;
