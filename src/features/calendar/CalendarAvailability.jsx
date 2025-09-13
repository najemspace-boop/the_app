import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Calendar, ChevronLeft, ChevronRight, DollarSign, Users } from 'lucide-react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs,
  orderBy 
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isAfter, isBefore } from 'date-fns';
import toast from 'react-hot-toast';

const CalendarAvailability = ({ listingId, isOwner = false, onDateSelect, selectedDates = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [dateSettings, setDateSettings] = useState({
    available: true,
    price: 0,
    maxGuests: 1,
    minStay: 1,
    discount: 0
  });

  useEffect(() => {
    fetchCalendarData();
  }, [listingId, currentMonth]);

  const fetchCalendarData = async () => {
    if (!listingId) return;
    
    setLoading(true);
    try {
      const startDate = startOfMonth(currentMonth);
      const endDate = endOfMonth(currentMonth);
      
      const calendarQuery = query(
        collection(db, 'listings', listingId, 'calendar'),
        where('date', '>=', format(startDate, 'yyyy-MM-dd')),
        where('date', '<=', format(endDate, 'yyyy-MM-dd')),
        orderBy('date')
      );
      
      const querySnapshot = await getDocs(calendarQuery);
      const data = {};
      
      querySnapshot.forEach((doc) => {
        data[doc.id] = doc.data();
      });
      
      setCalendarData(data);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      toast.error('Failed to load calendar data');
    } finally {
      setLoading(false);
    }
  };

  const updateDateAvailability = async (date, settings) => {
    if (!isOwner) return;
    
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const docRef = doc(db, 'listings', listingId, 'calendar', dateStr);
      
      if (settings.available) {
        await setDoc(docRef, {
          date: dateStr,
          available: settings.available,
          price: parseFloat(settings.price) || 0,
          maxGuests: parseInt(settings.maxGuests) || 1,
          minStay: parseInt(settings.minStay) || 1,
          discount: parseFloat(settings.discount) || 0,
          updatedAt: new Date()
        });
      } else {
        await deleteDoc(docRef);
      }
      
      // Update local state
      setCalendarData(prev => ({
        ...prev,
        [dateStr]: settings.available ? {
          date: dateStr,
          ...settings
        } : undefined
      }));
      
      toast.success('Calendar updated successfully');
    } catch (error) {
      console.error('Error updating calendar:', error);
      toast.error('Failed to update calendar');
    }
  };

  const getDayStatus = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayData = calendarData[dateStr];
    const today = new Date();
    
    if (isBefore(date, today)) {
      return 'past';
    }
    
    if (!dayData || !dayData.available) {
      return 'blocked';
    }
    
    // Check if date is in selected range
    if (selectedDates.length === 2) {
      const [start, end] = selectedDates;
      if (isSameDay(date, start) || isSameDay(date, end)) {
        return 'selected';
      }
      if (isAfter(date, start) && isBefore(date, end)) {
        return 'in-range';
      }
    } else if (selectedDates.length === 1 && isSameDay(date, selectedDates[0])) {
      return 'selected';
    }
    
    return 'available';
  };

  const getDayClasses = (status) => {
    const baseClasses = 'w-10 h-10 flex items-center justify-center text-sm rounded-lg cursor-pointer transition-colors';
    
    switch (status) {
      case 'past':
        return `${baseClasses} text-gray-300 cursor-not-allowed`;
      case 'blocked':
        return `${baseClasses} bg-gray-100 text-gray-400 cursor-not-allowed`;
      case 'available':
        return `${baseClasses} hover:bg-primary-50 hover:text-primary-600`;
      case 'selected':
        return `${baseClasses} bg-primary-600 text-white`;
      case 'in-range':
        return `${baseClasses} bg-primary-100 text-primary-700`;
      default:
        return baseClasses;
    }
  };

  const handleDateClick = (date) => {
    const status = getDayStatus(date);
    
    if (status === 'past' || status === 'blocked') {
      return;
    }
    
    if (isOwner) {
      setSelectedDate(date);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayData = calendarData[dateStr];
      
      setDateSettings({
        available: dayData?.available ?? true,
        price: dayData?.price ?? 0,
        maxGuests: dayData?.maxGuests ?? 1,
        minStay: dayData?.minStay ?? 1,
        discount: dayData?.discount ?? 0
      });
      setEditMode(true);
    } else if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const handleSaveSettings = () => {
    if (selectedDate) {
      updateDateAvailability(selectedDate, dateSettings);
      setEditMode(false);
      setSelectedDate(null);
    }
  };

  const renderCalendarGrid = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Weekday headers */}
        {weekdays.map(day => (
          <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map(date => {
          const status = getDayStatus(date);
          const dayData = calendarData[format(date, 'yyyy-MM-dd')];
          
          return (
            <div
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              className={getDayClasses(status)}
              title={dayData?.price ? `$${dayData.price}/night` : ''}
            >
              <div className="text-center">
                <div>{format(date, 'd')}</div>
                {dayData?.price && (
                  <div className="text-xs text-gray-500">
                    ${dayData.price}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Availability Calendar</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium min-w-[140px] text-center">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            renderCalendarGrid()
          )}
          
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary-600 rounded"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary-100 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <span>Blocked</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span>Past</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date Settings Modal */}
      {editMode && isOwner && (
        <Card>
          <CardHeader>
            <CardTitle>
              Edit Date: {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="available"
                checked={dateSettings.available}
                onChange={(e) => setDateSettings(prev => ({ ...prev, available: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="available" className="text-sm font-medium">
                Available for booking
              </label>
            </div>

            {dateSettings.available && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per night
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      value={dateSettings.price}
                      onChange={(e) => setDateSettings(prev => ({ ...prev, price: e.target.value }))}
                      className="pl-10"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="number"
                      value={dateSettings.maxGuests}
                      onChange={(e) => setDateSettings(prev => ({ ...prev, maxGuests: e.target.value }))}
                      className="pl-10"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum stay (nights)
                  </label>
                  <Input
                    type="number"
                    value={dateSettings.minStay}
                    onChange={(e) => setDateSettings(prev => ({ ...prev, minStay: e.target.value }))}
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <Input
                    type="number"
                    value={dateSettings.discount}
                    onChange={(e) => setDateSettings(prev => ({ ...prev, discount: e.target.value }))}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveSettings}>
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendarAvailability;