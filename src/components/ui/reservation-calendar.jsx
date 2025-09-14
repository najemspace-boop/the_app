import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star
} from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  addMonths, 
  subMonths, 
  isSameMonth, 
  isSameDay, 
  isToday, 
  isBefore, 
  isAfter,
  differenceInDays,
  parseISO,
  isWeekend
} from 'date-fns';
import { cn } from '../../lib/utils';

const ReservationCalendar = ({ 
  onDateRangeSelect,
  onGuestsChange,
  minDate = new Date(),
  maxDate = null,
  unavailableDates = [],
  bookedDates = [],
  pricePerDate = {},
  maxGuests = 8,
  className = ''
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const [guests, setGuests] = useState(1);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [showMobileCalendar, setShowMobileCalendar] = useState(false);

  // Mock pricing data
  const mockPricing = {
    basePrice: 250,
    weekendMultiplier: 1.3,
    cleaningFee: 50,
    serviceFee: 0.12
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const days = [];
    let currentDate = calendarStart;

    while (currentDate <= calendarEnd) {
      days.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }

    return days;
  };

  // Check if date is disabled
  const isDateDisabled = (date) => {
    if (isBefore(date, minDate)) return true;
    if (maxDate && isAfter(date, maxDate)) return true;
    if (unavailableDates.some(unavailableDate => 
      isSameDay(date, typeof unavailableDate === 'string' ? parseISO(unavailableDate) : unavailableDate)
    )) return true;
    return false;
  };

  // Check if date is booked
  const isDateBooked = (date) => {
    return bookedDates.some(bookedDate => 
      isSameDay(date, typeof bookedDate === 'string' ? parseISO(bookedDate) : bookedDate)
    );
  };

  // Get price for date
  const getPriceForDate = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    if (pricePerDate[dateKey]) return pricePerDate[dateKey];
    
    // Use mock pricing
    const basePrice = mockPricing.basePrice;
    return isWeekend(date) ? Math.round(basePrice * mockPricing.weekendMultiplier) : basePrice;
  };

  // Get date status
  const getDateStatus = (date) => {
    if (isDateDisabled(date)) return 'disabled';
    if (isDateBooked(date)) return 'booked';
    if (selectedRange.start && isSameDay(date, selectedRange.start)) return 'range-start';
    if (selectedRange.end && isSameDay(date, selectedRange.end)) return 'range-end';
    if (selectedRange.start && selectedRange.end && 
        isAfter(date, selectedRange.start) && isBefore(date, selectedRange.end)) {
      return 'in-range';
    }
    if (selectedRange.start && !selectedRange.end && hoveredDate &&
        isAfter(date, selectedRange.start) && isBefore(date, hoveredDate)) {
      return 'hover-range';
    }
    if (isToday(date)) return 'today';
    return 'available';
  };

  // Handle date click
  const handleDateClick = (date) => {
    if (isDateDisabled(date) || isDateBooked(date)) return;

    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      // Start new range
      setSelectedRange({ start: date, end: null });
    } else if (selectedRange.start && !selectedRange.end) {
      // Complete range
      if (isBefore(date, selectedRange.start)) {
        setSelectedRange({ start: date, end: selectedRange.start });
      } else {
        setSelectedRange({ start: selectedRange.start, end: date });
      }
    }
  };

  // Calculate total nights and pricing
  const calculateBookingDetails = () => {
    if (!selectedRange.start || !selectedRange.end) return null;

    const nights = differenceInDays(selectedRange.end, selectedRange.start);
    let totalPrice = 0;

    // Calculate price for each night
    let currentDate = selectedRange.start;
    while (isBefore(currentDate, selectedRange.end)) {
      totalPrice += getPriceForDate(currentDate);
      currentDate = addDays(currentDate, 1);
    }

    const serviceFee = Math.round(totalPrice * mockPricing.serviceFee);
    const cleaningFee = mockPricing.cleaningFee;
    const total = totalPrice + serviceFee + cleaningFee;

    return {
      nights,
      subtotal: totalPrice,
      serviceFee,
      cleaningFee,
      total
    };
  };

  // Get date classes
  const getDateClasses = (date) => {
    const status = getDateStatus(date);
    const isCurrentMonth = isSameMonth(date, currentMonth);
    
    const baseClasses = "relative w-10 h-10 flex flex-col items-center justify-center text-xs rounded-lg cursor-pointer transition-all duration-200";
    
    const statusClasses = {
      'disabled': 'text-gray-300 cursor-not-allowed',
      'booked': 'text-red-400 cursor-not-allowed bg-red-50 line-through',
      'range-start': 'bg-primary text-primary-foreground font-semibold rounded-r-none',
      'range-end': 'bg-primary text-primary-foreground font-semibold rounded-l-none',
      'in-range': 'bg-primary/20 text-primary rounded-none',
      'hover-range': 'bg-primary/10 text-primary rounded-none',
      'today': 'bg-blue-100 text-blue-700 font-semibold ring-2 ring-blue-300',
      'available': 'hover:bg-gray-100 text-foreground hover:ring-2 hover:ring-primary/20'
    };

    return cn(
      baseClasses,
      statusClasses[status] || statusClasses.available,
      !isCurrentMonth && 'opacity-30'
    );
  };

  const bookingDetails = calculateBookingDetails();

  useEffect(() => {
    if (selectedRange.start && selectedRange.end) {
      onDateRangeSelect?.(selectedRange);
    }
  }, [selectedRange, onDateRangeSelect]);

  useEffect(() => {
    onGuestsChange?.(guests);
  }, [guests, onGuestsChange]);

  const days = generateCalendarDays();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Mobile Calendar Toggle */}
      <div className="md:hidden">
        <Button
          variant="outline"
          onClick={() => setShowMobileCalendar(!showMobileCalendar)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4" />
            <span>
              {selectedRange.start && selectedRange.end
                ? `${format(selectedRange.start, 'MMM d')} - ${format(selectedRange.end, 'MMM d')}`
                : 'Select dates'
              }
            </span>
          </div>
          {bookingDetails && (
            <Badge variant="secondary">{bookingDetails.nights} nights</Badge>
          )}
        </Button>
      </div>

      {/* Calendar */}
      <Card className={cn("overflow-hidden", showMobileCalendar || "hidden md:block")}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <CardTitle className="text-lg font-semibold">
              {format(currentMonth, 'MMMM yyyy')}
            </CardTitle>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map((day, dayIndex) => (
              <div key={dayIndex} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, dayIndex) => {
              const price = getPriceForDate(date);
              const isCurrentMonth = isSameMonth(date, currentMonth);
              
              return (
                <div
                  key={dayIndex}
                  className={getDateClasses(date)}
                  onClick={() => isCurrentMonth && handleDateClick(date)}
                  onMouseEnter={() => isCurrentMonth && setHoveredDate(date)}
                  onMouseLeave={() => setHoveredDate(null)}
                >
                  <span className="font-medium">{format(date, 'd')}</span>
                  {isCurrentMonth && price && (
                    <span className="text-xs text-green-600 font-medium leading-none">
                      ${price}
                    </span>
                  )}
                  
                  {/* Status indicators */}
                  {isCurrentMonth && (
                    <>
                      {isDateBooked(date) && (
                        <div className="absolute -top-1 -right-1">
                          <XCircle className="h-3 w-3 text-red-500" />
                        </div>
                      )}
                      {getDateStatus(date) === 'available' && (
                        <div className="absolute -top-1 -right-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <XCircle className="h-3 w-3 text-red-500" />
              <span>Booked</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-300 rounded"></div>
              <span>Unavailable</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guests Selection */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Guests</span>
              </label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  disabled={guests <= 1}
                  className="h-8 w-8 p-0"
                >
                  -
                </Button>
                <span className="font-medium min-w-[2rem] text-center">{guests}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGuests(Math.min(maxGuests, guests + 1))}
                  disabled={guests >= maxGuests}
                  className="h-8 w-8 p-0"
                >
                  +
                </Button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Maximum {maxGuests} guests
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Summary */}
      {selectedRange.start && selectedRange.end && bookingDetails && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Trip Details */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center space-x-1">
                  <CalendarIcon className="h-4 w-4 text-green-600" />
                  <span>Check-in:</span>
                </span>
                <span className="font-medium">{format(selectedRange.start, 'MMM d')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center space-x-1">
                  <CalendarIcon className="h-4 w-4 text-red-600" />
                  <span>Check-out:</span>
                </span>
                <span className="font-medium">{format(selectedRange.end, 'MMM d')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>Duration:</span>
                </span>
                <span className="font-medium">{bookingDetails.nights} nights</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span>Guests:</span>
                </span>
                <span className="font-medium">{guests}</span>
              </div>
            </div>

            <div className="border-t pt-3 space-y-2">
              {/* Price Breakdown */}
              <div className="flex justify-between text-sm">
                <span>${mockPricing.basePrice} × {bookingDetails.nights} nights</span>
                <span>${bookingDetails.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Service fee</span>
                <span>${bookingDetails.serviceFee}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Cleaning fee</span>
                <span>${bookingDetails.cleaningFee}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>${bookingDetails.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button 
          className="w-full" 
          disabled={!selectedRange.start || !selectedRange.end}
          style={{ backgroundColor: '#7043c7' }}
        >
          {selectedRange.start && selectedRange.end ? 'Reserve' : 'Select dates to reserve'}
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          disabled={!selectedRange.start || !selectedRange.end}
        >
          Request Booking
        </Button>
      </div>

      {/* Quick Info */}
      <div className="text-xs text-muted-foreground space-y-1">
        <div className="flex items-center space-x-1">
          <Star className="h-3 w-3 text-yellow-500" />
          <span>Free cancellation for 48 hours</span>
        </div>
        <div className="flex items-center space-x-1">
          <CheckCircle className="h-3 w-3 text-green-500" />
          <span>Instant booking available</span>
        </div>
      </div>
    </div>
  );
};

export default ReservationCalendar;