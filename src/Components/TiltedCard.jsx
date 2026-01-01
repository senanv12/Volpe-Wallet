import React, { useRef, useState } from "react";

const TiltedCard = ({ 
  children, 
  rotateAmplitude = 3, // Dönmə dərəcəsi
  scaleOnHover = 1.1,  // Böyümə dərəcəsi
  className = "" 
}) => {
  const ref = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [scale, setScale] = useState(1);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -rotateAmplitude;
    const rotateYValue = ((x - centerX) / centerX) * rotateAmplitude;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseEnter = () => {
    setScale(scaleOnHover);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setScale(1);
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
        transition: "transform 0.1s ease-out", // Mouse hərəkəti üçün sürətli reaksiya
      }}
    >
      <div
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
          transition: "transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99)", // Hamar keçid
          transformStyle: "preserve-3d",
          width: "100%",
          height: "100%"
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default TiltedCard;