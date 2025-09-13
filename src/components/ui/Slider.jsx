import { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

const Slider = ({ 
  value = [0, 100], 
  onValueChange, 
  min = 0, 
  max = 100, 
  step = 1, 
  className,
  ...props 
}) => {
  const [isDragging, setIsDragging] = useState(null);
  const sliderRef = useRef(null);

  const getPercentage = (val) => ((val - min) / (max - min)) * 100;
  
  const getValue = (percentage) => {
    const val = min + (percentage / 100) * (max - min);
    return Math.round(val / step) * step;
  };

  const handleMouseDown = (index) => (e) => {
    e.preventDefault();
    setIsDragging(index);
  };

  const handleMouseMove = (e) => {
    if (isDragging === null || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const newValue = getValue(percentage);

    const newValues = [...value];
    newValues[isDragging] = newValue;

    // Ensure min <= max
    if (isDragging === 0 && newValue > value[1]) {
      newValues[1] = newValue;
    } else if (isDragging === 1 && newValue < value[0]) {
      newValues[0] = newValue;
    }

    onValueChange?.(newValues);
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  useEffect(() => {
    if (isDragging !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, value]);

  return (
    <div className={cn("relative w-full", className)} {...props}>
      <div
        ref={sliderRef}
        className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
      >
        {/* Track between thumbs */}
        <div
          className="absolute h-2 bg-primary-600 rounded-full"
          style={{
            left: `${getPercentage(value[0])}%`,
            width: `${getPercentage(value[1]) - getPercentage(value[0])}%`
          }}
        />
        
        {/* Left thumb */}
        <div
          className="absolute w-4 h-4 bg-white border-2 border-primary-600 rounded-full cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 top-1/2 shadow-sm hover:shadow-md transition-shadow"
          style={{ left: `${getPercentage(value[0])}%` }}
          onMouseDown={handleMouseDown(0)}
        />
        
        {/* Right thumb */}
        <div
          className="absolute w-4 h-4 bg-white border-2 border-primary-600 rounded-full cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 top-1/2 shadow-sm hover:shadow-md transition-shadow"
          style={{ left: `${getPercentage(value[1])}%` }}
          onMouseDown={handleMouseDown(1)}
        />
      </div>
    </div>
  );
};

export { Slider };
