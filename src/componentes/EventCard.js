import React from 'react';
import '../ui/main.css';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaymentIcon from '@mui/icons-material/Payment';



const EventCard = ({ image, name, location, dateTime, price }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', options);
  };
  return (
    <div className="card-event">
      <div className="card-image" style={{ backgroundImage: image ? `url(${image})` : '#ccc' }}>
        {!image && <div className="no-image">No Image</div>}
      </div>
      <div className="card-info">
        <h3>{name}</h3>
        <p className="location">{location}</p>
        <p className="date">
          <CalendarTodayIcon style={{ fontSize:'small', verticalAlign: 'middle', marginRight: '5px' }} />
          {formatDate(dateTime)}
        </p>
        <p className="price">          
          <PaymentIcon style={{ fontSize:'small', verticalAlign: 'middle', marginRight: '5px' }} />
          {price} </p>
      </div>
      <div className="card-buttons">
        <button className="button-entradas">Entradas</button>
      </div>
    </div>
  );
};


export default EventCard;