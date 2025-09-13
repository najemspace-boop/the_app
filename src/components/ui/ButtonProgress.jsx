import React, { useState, useEffect } from 'react';

const ButtonProgress = ({ onClick, isSelected, icon, title, description, fullWidth = false }) => {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [intervalActive, setIntervalActive] = useState(false);

  useEffect(() => {
    let interval;
    
    if (intervalActive) {
      interval = setInterval(() => {
        setProgress((current) => {
          if (current < 100) {
            return current + 1;
          }
          setIntervalActive(false);
          setLoaded(true);
          return 0;
        });
      }, 20);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [intervalActive]);

  const handleClick = () => {
    if (loaded) {
      setLoaded(false);
      setProgress(0);
    } else if (!intervalActive) {
      setIntervalActive(true);
      setProgress(0);
    }
    
    if (onClick) {
      onClick();
    }
  };

  const getButtonText = () => {
    if (loaded) return 'Property For Rent';
    return 'Property For Rent';
  };

  const getButtonColor = () => {
    if (loaded) return 'bg-teal-600 hover:bg-teal-700 border-teal-600';
    return 'bg-blue-600 hover:bg-blue-700 border-blue-600';
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        relative px-3 py-1 text-white font-medium transition-colors duration-150 ease-in-out overflow-hidden
        ${fullWidth ? 'w-1/2' : 'w-1/2'}
        ${getButtonColor()}
      `}
      style={{ borderRadius: '18px' }}
    >
      {/* Progress Bar */}
      {progress !== 0 && (
        <div
          className="absolute top-0 left-0 h-full bg-blue-200 bg-opacity-35 transition-all duration-75 ease-linear z-0"
          style={{ width: `${progress}%` }}
        />
      )}
      
      {/* Button Content */}
      <div className="relative z-10">
        {getButtonText()}
      </div>
    </button>
  );
};

export { ButtonProgress };