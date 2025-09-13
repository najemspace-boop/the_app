import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { MapPin, ZoomIn, ZoomOut, Maximize2, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';

const InteractiveMap = ({ properties = [], onPropertySelect }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const mapRef = useRef(null);

  // Handle mouse/touch start
  const handlePointerStart = (e) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStart({ 
      x: clientX - position.x, 
      y: clientY - position.y 
    });
  };

  // Handle mouse/touch move
  const handlePointerMove = (e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    setPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  // Handle mouse/touch end
  const handlePointerEnd = () => {
    setIsDragging(false);
  };

  // Handle zoom
  const handleZoom = (direction) => {
    const newZoom = direction === 'in' 
      ? Math.min(zoom * 1.2, 3) 
      : Math.max(zoom / 1.2, 0.5);
    setZoom(newZoom);
  };

  // Reset map position and zoom
  const resetMap = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setSelectedProperty(null);
  };

  // Handle property pin click
  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    onPropertySelect?.(property);
    toast.success(`Selected: ${property.title}`);
  };

  // Add event listeners for touch/mouse events
  useEffect(() => {
    const mapElement = mapRef.current;
    if (!mapElement) return;

    const handleMouseMove = (e) => handlePointerMove(e);
    const handleMouseUp = () => handlePointerEnd();
    const handleTouchMove = (e) => handlePointerMove(e);
    const handleTouchEnd = () => handlePointerEnd();

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragStart]);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div 
          ref={mapRef}
          className="h-96 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handlePointerStart}
          onTouchStart={handlePointerStart}
          style={{ touchAction: 'none' }}
        >
          {/* Map Background Pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, #3b82f6 2px, transparent 2px),
                radial-gradient(circle at 75% 75%, #8b5cf6 2px, transparent 2px)
              `,
              backgroundSize: '50px 50px',
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`
            }}
          />

          {/* Map Content Container */}
          <div 
            className="absolute inset-0 transition-transform duration-200"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`
            }}
          >
            {/* City Areas */}
            <div className="absolute inset-0">
              {/* Dubai Marina Area */}
              <div 
                className="absolute bg-blue-200/30 dark:bg-blue-600/20 rounded-lg border-2 border-blue-300/50 dark:border-blue-500/30"
                style={{ left: '15%', top: '20%', width: '25%', height: '30%' }}
              >
                <div className="p-2 text-xs font-medium text-blue-700 dark:text-blue-300">
                  Dubai Marina
                </div>
              </div>

              {/* Downtown Area */}
              <div 
                className="absolute bg-purple-200/30 dark:bg-purple-600/20 rounded-lg border-2 border-purple-300/50 dark:border-purple-500/30"
                style={{ left: '50%', top: '35%', width: '30%', height: '25%' }}
              >
                <div className="p-2 text-xs font-medium text-purple-700 dark:text-purple-300">
                  Downtown
                </div>
              </div>

              {/* JBR Area */}
              <div 
                className="absolute bg-green-200/30 dark:bg-green-600/20 rounded-lg border-2 border-green-300/50 dark:border-green-500/30"
                style={{ left: '10%', top: '60%', width: '20%', height: '25%' }}
              >
                <div className="p-2 text-xs font-medium text-green-700 dark:text-green-300">
                  JBR
                </div>
              </div>
            </div>

            {/* Property Pins */}
            {properties.map((property, index) => {
              const pinX = 20 + (index * 15) + Math.sin(index) * 10;
              const pinY = 30 + (index * 8) + Math.cos(index) * 8;
              const isSelected = selectedProperty?.id === property.id;
              
              return (
                <div key={property.id} className="absolute">
                  {/* Property Pin */}
                  <div 
                    className={`
                      relative bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center text-xs font-bold shadow-lg cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-xl
                      ${isSelected ? 'scale-125 ring-4 ring-primary/30 z-20' : 'z-10'}
                    `}
                    style={{
                      left: `${pinX}%`,
                      top: `${pinY}%`
                    }}
                    onClick={() => handlePropertyClick(property)}
                  >
                    ${Math.round(property.price / 1000)}k
                  </div>

                  {/* Property Info Popup */}
                  {isSelected && (
                    <div 
                      className="absolute bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-xl z-30 min-w-48"
                      style={{
                        left: `${pinX + 5}%`,
                        top: `${pinY - 8}%`,
                        transform: 'translateY(-100%)'
                      }}
                    >
                      <div className="text-sm font-semibold mb-1">{property.title}</div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {property.location.area}, {property.location.city}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>{property.features.bedrooms} bed • {property.features.bathrooms} bath</span>
                        <span className="font-bold text-primary">${property.price}</span>
                      </div>
                      <div className="absolute bottom-0 left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-background/95 transform translate-y-full"></div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Center Indicator */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-40">
            <Button 
              size="sm" 
              variant="secondary" 
              className="w-10 h-10 p-0 shadow-lg"
              onClick={() => handleZoom('in')}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              className="w-10 h-10 p-0 shadow-lg"
              onClick={() => handleZoom('out')}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              className="w-10 h-10 p-0 shadow-lg"
              onClick={resetMap}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Map Info */}
          <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-40">
            <div className="flex items-center gap-2 mb-2">
              <Navigation className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Interactive Map</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Drag to pan • Zoom: {Math.round(zoom * 100)}%
            </div>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-40">
            <div className="text-sm font-medium mb-2">Legend</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span>Available Properties</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-blue-300 rounded border"></div>
                <span>Residential Areas</span>
              </div>
            </div>
          </div>

          {/* Touch Instructions */}
          <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-2 shadow-lg z-40 lg:hidden">
            <div className="text-xs text-muted-foreground text-center">
              👆 Touch & drag to explore
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;
