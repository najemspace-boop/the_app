import React, { useState, useMemo } from 'react';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Badge } from './Badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { format, 
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
  parseISO
} from 'date-fns';

const ComprehensiveCalendar = ({ 
  selectedDate, 
  onDateSelect, 
  selectedRange = null,
  onRangeSelect = null,
  mode = 'single', // 'single', 'range'
  minDate = new Date(),
  maxDate = null,
  unavailableDates = [],
  bookedDates = [],
  pricePerDate = {},
  showPrices = false,
  showAvailability = true,
  className = '',
  monthsToShow = 1,
  language = 'en'
}) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const [hoveredDate, setHoveredDate] = useState(null);

  // Translation helper
  const t = (key) => {
    const translations = {
      en: {
        months: [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ],
        weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        today: 'Today',
        available: 'Available',
        unavailable: 'Unavailable',
        booked: 'Booked',
        selected: 'Selected',
        checkIn: 'Check-in',
        checkOut: 'Check-out',
        minimumStay: 'Minimum stay',
        nights: 'nights',
        selectCheckIn: 'Select check-in date',
        selectCheckOut: 'Select check-out date',
        clearDates: 'Clear dates',
        previousMonth: 'Previous month',
        nextMonth: 'Next month'
      },
      ar: {
        months: [
          'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
          'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ],
        weekdays: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
        today: 'اليوم',
        available: 'متاح',
        unavailable: 'غير متاح',
        booked: 'محجوز',
        selected: 'محدد',
        checkIn: 'تسجيل الوصول',
        checkOut: 'تسجيل المغادرة',
        minimumStay: 'الحد الأدنى للإقامة',
        nights: 'ليالي',
        selectCheckIn: 'اختر تاريخ الوصول',
        selectCheckOut: 'اختر تاريخ المغادرة',
        clearDates: 'مسح التواريخ',
        previousMonth: 'الشهر السابق',
        nextMonth: 'الشهر التالي'
      }
    };
    return translations[language]?.[key] || translations.en[key];
  };

  const isRTL = language === 'ar';

  // Generate calendar days for a month
  const generateCalendarDays = (month) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
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

  // Get date status
  const getDateStatus = (date) => {
    if (isDateDisabled(date)) return 'disabled';
    if (isDateBooked(date)) return 'booked';
    if (mode === 'range' && selectedRange) {
      if (selectedRange.start && isSameDay(date, selectedRange.start)) return 'range-start';
      if (selectedRange.end && isSameDay(date, selectedRange.end)) return 'range-end';
      if (selectedRange.start && selectedRange.end && 
          isAfter(date, selectedRange.start) && isBefore(date, selectedRange.end)) {
        return 'in-range';
      }
    }
    if (mode === 'single' && selectedDate && isSameDay(date, selectedDate)) return 'selected';
    if (isToday(date)) return 'today';
    return 'available';
  };

  // Handle date click
  const handleDateClick = (date) => {
    if (isDateDisabled(date) || isDateBooked(date)) return;

    if (mode === 'single') {
      onDateSelect(date);
    } else if (mode === 'range') {
      if (!selectedRange?.start || (selectedRange.start && selectedRange.end)) {
        // Start new range
        onRangeSelect({ start: date, end: null });
      } else if (selectedRange.start && !selectedRange.end) {
        // Complete range
        if (isBefore(date, selectedRange.start)) {
          onRangeSelect({ start: date, end: selectedRange.start });
        } else {
          onRangeSelect({ start: selectedRange.start, end: date });
        }
      }
    }
  };

  // Handle date hover for range selection
  const handleDateHover = (date) => {
    if (mode === 'range' && selectedRange?.start && !selectedRange.end) {
      setHoveredDate(date);
    }
  };

  // Get date classes
  const getDateClasses = (date) => {
    const status = getDateStatus(date);
    const baseClasses = "w-10 h-10 flex items-center justify-center text-sm rounded-lg transition-all duration-200 cursor-pointer relative";
    
    const statusClasses = {
      'disabled': 'text-gray-300 cursor-not-allowed bg-gray-50',
      'booked': 'text-red-500 cursor-not-allowed bg-red-50 line-through',
      'selected': 'bg-primary text-primary-foreground font-semibold shadow-md',
      'range-start': 'bg-primary text-primary-foreground font-semibold rounded-r-none',
      'range-end': 'bg-primary text-primary-foreground font-semibold rounded-l-none',
      'in-range': 'bg-primary/20 text-primary rounded-none',
      'today': 'bg-blue-100 text-blue-700 font-semibold border-2 border-blue-300',
      'available': 'hover:bg-gray-100 text-gray-700'
    };

    // Handle hover effect for range selection
    if (mode === 'range' && selectedRange?.start && !selectedRange.end && hoveredDate) {
      if (isAfter(date, selectedRange.start) && isBefore(date, hoveredDate) ||
          isBefore(date, selectedRange.start) && isAfter(date, hoveredDate)) {
        return `${baseClasses} bg-primary/10 text-primary`;
      }
    }

    return `${baseClasses} ${statusClasses[status] || statusClasses.available}`;
  };

  // Get price for date
  const getPriceForDate = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return pricePerDate[dateKey] || null;
  };

  // Calculate nights between dates
  const calculateNights = () => {
    if (mode === 'range' && selectedRange?.start && selectedRange?.end) {
      return differenceInDays(selectedRange.end, selectedRange.start);
    }
    return 0;
  };

  // Render calendar month
  const renderCalendarMonth = (month, index) => {
    const days = generateCalendarDays(month);
    const monthName = t('months')[month.getMonth()];
    const year = month.getFullYear();

    return (
      <Card key={index} className="w-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            {index === 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2"
                title={t('previousMonth')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            
            <CardTitle className="text-lg font-semibold">
              {monthName} {year}
            </CardTitle>
            
            {index === monthsToShow - 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2"
                title={t('nextMonth')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {t('weekdays').map((day, dayIndex) => (
              <div key={dayIndex} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, dayIndex) => {
              const isCurrentMonth = isSameMonth(date, month);
              const price = getPriceForDate(date);
              
              return (
                <div
                  key={dayIndex}
                  className={`${getDateClasses(date)} ${!isCurrentMonth ? 'opacity-30' : ''}`}
                  onClick={() => isCurrentMonth && handleDateClick(date)}
                  onMouseEnter={() => isCurrentMonth && handleDateHover(date)}
                  onMouseLeave={() => setHoveredDate(null)}
                >
                  <div className="flex flex-col items-center">
                    <span>{format(date, 'd')}</span>
                    {showPrices && price && isCurrentMonth && (
                      <span className="text-xs text-green-600 font-medium">
                        ${price}
                      </span>
                    )}
                  </div>
                  
                  {/* Status indicators */}
                  {isCurrentMonth && (
                    <>
                      {isDateBooked(date) && (
                        <div className="absolute -top-1 -right-1">
                          <XCircle className="h-3 w-3 text-red-500" />
                        </div>
                      )}
                      {getDateStatus(date) === 'available' && showAvailability && (
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
        </CardContent>
      </Card>
    );
  };

  // Generate months to display
  const monthsToDisplay = useMemo(() => {
    const months = [];
    for (let i = 0; i < monthsToShow; i++) {
      months.push(addMonths(currentMonth, i));
    }
    return months;
  }, [currentMonth, monthsToShow]);

  return (
    <div className={`comprehensive-calendar ${className}`}>
      {/* Calendar Grid */}
      <div className={`grid gap-4 ${monthsToShow === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {monthsToDisplay.map((month, index) => renderCalendarMonth(month, index))}
      </div>
      
      {/* Selection Summary */}
      {mode === 'range' && selectedRange && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                {selectedRange.start && (
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{t('checkIn')}:</span>
                    <span>{format(selectedRange.start, 'MMM dd, yyyy')}</span>
                  </div>
                )}
                {selectedRange.end && (
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-red-600" />
                    <span className="font-medium">{t('checkOut')}:</span>
                    <span>{format(selectedRange.end, 'MMM dd, yyyy')}</span>
                  </div>
                )}
                {selectedRange.start && selectedRange.end && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{calculateNights()} {t('nights')}</span>
                  </div>
                )}
              </div>
              
              {(selectedRange.start || selectedRange.end) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRangeSelect({ start: null, end: null })}
                >
                  {t('clearDates')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Legend */}
      {showAvailability && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-primary rounded"></div>
                <span>{t('selected')}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-100 rounded"></div>
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>{t('available')}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-100 rounded"></div>
                <XCircle className="h-3 w-3 text-red-500" />
                <span>{t('booked')}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-100 rounded"></div>
                <span>{t('unavailable')}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-100 border-2 border-blue-300 rounded"></div>
                <span>{t('today')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComprehensiveCalendar;