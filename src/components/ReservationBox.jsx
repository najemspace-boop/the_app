import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import ComprehensiveCalendar from "./ui/comprehensive-calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { Separator } from "./ui/separator";
import { 
  Calendar as CalendarIcon, 
  Users, 
  CreditCard,
  Shield,
  Clock,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export const ReservationBox = ({ propertyId, property, priceLabel = "month" }) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [guests, setGuests] = useState(1);
  const [duration, setDuration] = useState(1);
  const [isBooking, setIsBooking] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMode, setCalendarMode] = useState(priceLabel === 'month' ? 'single' : 'range');

  const isRTL = language === 'ar';

  // Translation helper
  const t = (key) => {
    const translations = {
      en: {
        reserveNow: 'Reserve Now',
        bookNow: 'Book Now',
        checkAvailability: 'Check Availability',
        checkIn: 'Check-in',
        checkOut: 'Check-out',
        guests: 'Guests',
        duration: 'Duration',
        months: 'months',
        weeks: 'weeks',
        days: 'days',
        priceBreakdown: 'Price Breakdown',
        basePrice: 'Base Price',
        serviceFee: 'Service Fee',
        cleaningFee: 'Cleaning Fee',
        taxes: 'Taxes & Fees',
        total: 'Total',
        perMonth: 'per month',
        perWeek: 'per week',
        perNight: 'per night',
        loginRequired: 'Please login to make a reservation',
        selectDates: 'Select your dates',
        instantBook: 'Instant Book',
        requestToBook: 'Request to Book',
        availableNow: 'Available Now',
        minimumStay: 'Minimum Stay',
        securePayment: 'Secure Payment',
        confirmAndPay: 'Confirm and Pay',
        bookingSuccess: 'Booking request sent successfully!',
        bookingError: 'Failed to process booking. Please try again.'
      },
      ar: {
        reserveNow: 'احجز الآن',
        bookNow: 'احجز الآن',
        checkAvailability: 'تحقق من التوفر',
        checkIn: 'تسجيل الوصول',
        checkOut: 'تسجيل المغادرة',
        guests: 'الضيوف',
        duration: 'المدة',
        months: 'أشهر',
        weeks: 'أسابيع',
        days: 'أيام',
        priceBreakdown: 'تفاصيل السعر',
        basePrice: 'السعر الأساسي',
        serviceFee: 'رسوم الخدمة',
        cleaningFee: 'رسوم التنظيف',
        taxes: 'الضرائب والرسوم',
        total: 'الإجمالي',
        perMonth: 'شهرياً',
        perWeek: 'أسبوعياً',
        perNight: 'لليلة',
        loginRequired: 'يرجى تسجيل الدخول للحجز',
        selectDates: 'اختر التواريخ',
        instantBook: 'حجز فوري',
        requestToBook: 'طلب حجز',
        availableNow: 'متاح الآن',
        minimumStay: 'الحد الأدنى للإقامة',
        securePayment: 'دفع آمن',
        confirmAndPay: 'تأكيد والدفع',
        bookingSuccess: 'تم إرسال طلب الحجز بنجاح!',
        bookingError: 'فشل في معالجة الحجز. يرجى المحاولة مرة أخرى.'
      }
    };
    return translations[language]?.[key] || key;
  };

  // Mock unavailable and booked dates for demonstration
  const unavailableDates = [
    new Date(2024, 2, 15), // March 15, 2024
    new Date(2024, 2, 16), // March 16, 2024
  ];
  
  const bookedDates = [
    new Date(2024, 2, 20), // March 20, 2024
    new Date(2024, 2, 21), // March 21, 2024
    new Date(2024, 2, 22), // March 22, 2024
  ];

  // Mock pricing per date
  const pricePerDate = {
    '2024-03-01': 150,
    '2024-03-02': 150,
    '2024-03-03': 180,
    '2024-03-04': 180,
    '2024-03-05': 200,
    '2024-03-06': 200,
    '2024-03-07': 150,
  };

  // Calculate pricing
  const basePrice = parseFloat(property?.price?.replace(/[^0-9.]/g, '') || 0);
  const serviceFee = basePrice * 0.1; // 10% service fee
  const cleaningFee = 50; // Fixed cleaning fee
  const taxes = (basePrice + serviceFee) * 0.05; // 5% taxes
  const totalPrice = basePrice + serviceFee + cleaningFee + taxes;

  const handleReservation = async () => {
    if (!user) {
      toast.error(t('loginRequired'));
      return;
    }

    if (priceLabel === 'month' && (!checkIn || !duration)) {
      toast.error(t('selectDates'));
      return;
    }

    setIsBooking(true);

    try {
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Implement actual booking logic with Firebase
      const bookingData = {
        propertyId,
        userId: user.uid,
        checkIn: checkIn?.toISOString(),
        checkOut: checkOut?.toISOString(),
        guests,
        duration,
        totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      console.log('Booking data:', bookingData);
      toast.success(t('bookingSuccess'));
      
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(t('bookingError'));
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">${basePrice}</span>
            <span className="text-muted-foreground">/{t(priceLabel)}</span>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {t('availableNow')}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Enhanced Date Selection */}
        <div className="space-y-4">
          {priceLabel === 'month' ? (
            <>
              {/* Monthly rental - Start date and duration */}
              <div>
                <Label htmlFor="start-date">{t('checkIn')}</Label>
                <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, "PPP") : t('selectDates')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <ComprehensiveCalendar
                      mode="single"
                      selectedDate={checkIn}
                      onDateSelect={(date) => {
                        setCheckIn(date);
                        setShowCalendar(false);
                      }}
                      minDate={new Date()}
                      unavailableDates={unavailableDates}
                      bookedDates={bookedDates}
                      showPrices={false}
                      showAvailability={true}
                      language={language}
                      monthsToShow={1}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="duration">{t('duration')}</Label>
                <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder={`${t('duration')} (${t('months')})`} />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 6, 12].map((month) => (
                      <SelectItem key={month} value={month.toString()}>
                        {month} {month === 1 ? 'month' : 'months'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              {/* Daily/weekly rental - Enhanced range selection */}
              <div>
                <Label>{t('selectDates')}</Label>
                <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.start && dateRange.end 
                        ? `${format(dateRange.start, "MMM dd")} - ${format(dateRange.end, "MMM dd")}`
                        : dateRange.start 
                        ? `${format(dateRange.start, "MMM dd")} - ${t('selectCheckOut')}`
                        : t('selectDates')
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <ComprehensiveCalendar
                      mode="range"
                      selectedRange={dateRange}
                      onRangeSelect={(range) => {
                        setDateRange(range);
                        setCheckIn(range.start);
                        setCheckOut(range.end);
                        if (range.start && range.end) {
                          setShowCalendar(false);
                        }
                      }}
                      minDate={new Date()}
                      unavailableDates={unavailableDates}
                      bookedDates={bookedDates}
                      pricePerDate={pricePerDate}
                      showPrices={true}
                      showAvailability={true}
                      language={language}
                      monthsToShow={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}
        </div>

        {/* Guests Selection */}
        <div>
          <Label htmlFor="guests">{t('guests')}</Label>
          <Select value={guests.toString()} onValueChange={(value) => setGuests(parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder={t('guests')} />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((guestCount) => (
                <SelectItem key={guestCount} value={guestCount.toString()}>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2">
          <Separator />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{t('basePrice')} ({duration} {duration === 1 ? 'month' : 'months'})</span>
              <span>${(basePrice * duration).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('serviceFee')}</span>
              <span>${(serviceFee * duration).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('cleaningFee')}</span>
              <span>${cleaningFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('taxes')}</span>
              <span>${(taxes * duration).toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>{t('total')}</span>
              <span>${(totalPrice * duration).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Reserve Button */}
        <Button 
          className="w-full" 
          size="lg"
          onClick={handleReservation}
          disabled={isBooking}
        >
          {isBooking ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              {t('reserveNow')}
            </div>
          )}
        </Button>

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3 w-3" />
          <span>{t('securePayment')}</span>
        </div>

        {/* Property Info */}
        {property?.minimumStay && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{t('minimumStay')}: {property.minimumStay}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
