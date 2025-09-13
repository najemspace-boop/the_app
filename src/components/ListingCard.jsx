import { Star, MapPin } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Link to={`/property/${listing.id}`}>
      <Card className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={listing.image || listing.coverPhoto || (listing.photos && listing.photos[0])}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{listing.rating}</span>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
            {listing.title}
          </h3>
          
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm line-clamp-1">
              {listing.location}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-gray-900">
              {formatPrice(listing.price)}
            </div>
            <div className="text-xs text-gray-500">
              {listing.reviews} reviews
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ListingCard;
