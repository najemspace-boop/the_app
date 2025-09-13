import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, query, onSnapshot, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import ListingCard from '../components/ListingCard';
import { Heart, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FavoritesPage = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const favoritesRef = collection(db, 'profiles', user.uid, 'favorites');
    
    const unsubscribe = onSnapshot(favoritesRef, async (snapshot) => {
      const favoriteListings = [];
      
      for (const favoriteDoc of snapshot.docs) {
        try {
          const listingRef = doc(db, 'listings', favoriteDoc.id);
          const listingSnap = await getDoc(listingRef);
          
          if (listingSnap.exists()) {
            favoriteListings.push({
              id: listingSnap.id,
              ...listingSnap.data(),
              favoriteId: favoriteDoc.id,
              favoritedAt: favoriteDoc.data().createdAt
            });
          }
        } catch (error) {
          console.error('Error fetching favorite listing:', error);
        }
      }
      
      setFavorites(favoriteListings);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const removeFavorite = async (listingId) => {
    try {
      await deleteDoc(doc(db, 'profiles', user.uid, 'favorites', listingId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <Heart className="h-8 w-8 text-red-500" />
            <span>My Favorites</span>
          </h1>
          <p className="text-gray-600">Properties you've saved for later</p>
        </div>

        {favorites.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-gray-600 mb-6">Start exploring and save properties you love!</p>
              <Button onClick={() => window.location.href = '/search'}>
                Browse Properties
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((listing) => (
              <div key={listing.id} className="relative">
                <ListingCard listing={listing} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFavorite(listing.id)}
                  className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm hover:bg-white"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
