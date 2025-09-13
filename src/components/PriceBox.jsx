import { useState } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Calendar, Star, Users } from "lucide-react";

const PriceBox = ({ price, rating, reviewCount, onReserve }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const handleReserve = () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }
    
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * price;
    
    onReserve({
      checkIn,
      checkOut,
      guests,
      nights,
      totalPrice
    });
  };

  const nights = checkIn && checkOut ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) : 0;
  const totalPrice = nights * price;

  return (
    <Card className="p-6 rounded-[18px] shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-2xl font-bold">${price}</span>
          <span className="text-muted-foreground"> / night</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{rating}</span>
          <span className="text-muted-foreground">({reviewCount})</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
              min={checkIn || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Guests</label>
          <div className="flex items-center gap-2 p-2 border rounded-lg">
            <Users className="h-4 w-4 text-muted-foreground" />
            <select
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="flex-1 bg-transparent outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>

        <Button onClick={handleReserve} className="w-full">
          Reserve
        </Button>

        {nights > 0 && (
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span>${price} × {nights} nights</span>
              <span>${price * nights}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service fee</span>
              <span>$25</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Total</span>
              <span>${totalPrice + 25}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PriceBox;
