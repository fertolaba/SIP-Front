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
      // Send delete like to the backend
      removeLike(eventId);
    }
    localStorage.setItem('likedEvents', JSON.stringify(likedEvents));
  };

  // Function to send like to the backend
  const recordLike = (eventId) => {
    const userId = Number(localStorage.getItem('userId'));
    const endpoint = `http://localhost:4002/api/user-interactions/${userId}/events/${eventId}/like`;
  
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
      return response.text();
    })
    .then(data => {
      try {
        const jsonData = JSON.parse(data);
        console.log('Like recorded:', jsonData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    })
    .catch(error => {
      console.error('Error recording like:', error);
    });
  };

  // Function to remove like from the backend
  const removeLike = (eventId) => {
    const userId = Number(localStorage.getItem('userId'));
    const endpoint = `http://localhost:4002/api/user-interactions/${userId}/events/${eventId}/like`;
  
    fetch(endpoint, {
      method: 'DELETE', // Use DELETE method to remove the like
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      console.log('Like removed:', data);
    })
    .catch(error => {
      console.error('Error removing like:', error);
    });
  };

  // Function to send attendance to the backend
  const recordAttendance = () => {
    const userId = Number(localStorage.getItem('userId'));
    const endpoint = `http://localhost:4002/api/user-interactions/${userId}/events/${eventId}/assist`;
  
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
      return response.text();
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


/*
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre del evento"
                  name="name"
                  value={eventData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descripción del evento"
                  name="description"
                  value={eventData.description}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ubicación"
                  name="location"
                  value={eventData.location}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid container item xs={12} spacing={6}>
                <Grid item xs={6}>
                  <LocalizationProvider  fullWidth dateAdapter={AdapterDateFns}>
                    <DatePicker
                      
                      label="Fecha"
                      value={eventData.date}
                      onChange={handleDateChange}
                      renderInput={(params) => <TextField {...params} fullWidth required />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      label="Hora"
                      value={eventData.time}
                      onChange={handleTimeChange}
                      viewRenderers={{
                        hours: renderTimeViewClock,
                        minutes: renderTimeViewClock,
                        seconds: renderTimeViewClock,
                      }}
                      renderInput={(params) => <TextField {...params} fullWidth required />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
  
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Género musical</InputLabel>
                  <Select
                    name="genre"
                    value={eventData.genre}
                    onChange={handleChange}
                    required
                  >
                    {musicGenres.map((genre) => (
                      <MenuItem key={genre} value={genre}>
                        {genre.replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Precio de la entrada"
                  name="price"
                  type="number"
                  value={eventData.price}
                  onChange={handleChange}
                  helperText="Deja en blanco si el evento es gratuito"
                />
              </Grid>
*/