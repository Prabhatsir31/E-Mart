import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import '../styles/coursel.css';

const Coursel = () => {
  const images = [
    'https://www.asus.com/ca-en/site/gaming/assets/images/logos/social-preview.jpg',
    'https://g.sdlcdn.com/imgs/k/s/i/cookware-bc6ef.jpg',
    'https://g.sdlcdn.com/imgs/k/s/i/bedsheets0512-a7f6e.jpg',
    'https://g.sdlcdn.com/imgs/k/x/g/sportshoesbanner03july-85e66.jpg',
    'https://g.sdlcdn.com/imgs/k/s/i/cookware-bc6ef.jpg',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 3000);

    // Cleanup on unmount or when currentIndex/images change
    return () => clearInterval(timer);
  }, [images.length]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="coursel-container">
      <h2>Best Deals</h2>
      <div className="coursel-slider">
        <button className="slider-arrow left" onClick={handlePrevious}>
          <FiChevronLeft size={24} />
        </button>

        <div className="coursel-slider-inner">
          <div className="coursel-card">
            <img
              src={images[currentIndex]}
              alt={`Product ${currentIndex + 1}`}
              className="coursel-image"
            />
          </div>
        </div>

        <button className="slider-arrow right" onClick={handleNext}>
          <FiChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Coursel;
