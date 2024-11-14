import React, { useState, useEffect} from 'react';
import '../ui/main.css';
import revolver from '../img/revolver.png';
import speed from '../img/speed.png';
import sumaMarca from '../img/sumaMarca.png';

/*npm install react-responsive-carousel*/

const banners = [
  { url: speed, alt: 'Speed' },
  { url: revolver, alt: 'Revolver' },
  { url: sumaMarca, alt: 'Suma tu marca' }
];

const BannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? banners.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === banners.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Deslizamiento automático de las imágenes cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 3000); // Cambia la imagen cada 3 segundos

    // Limpiar el intervalo cuando se desmonta el componente
    return () => clearInterval(interval);
  }, [currentIndex]); // El efecto se reinicia cada vez que cambia currentIndex

  return (
    <div className="carousel-container">
      <button className="carousel-button carousel-button-left" onClick={goToPrevious}>
        ❮
      </button>
      <div 
        className="carousel-slide" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <img
            key={index}
            src={banner.url}
            alt={banner.alt}
            className="carousel-image"
          />
        ))}
      </div>
      <button className="carousel-button carousel-button-right" onClick={goToNext}>
        ❯
      </button>
    </div>
  );
};

export default BannerCarousel;