import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  startAfter,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const useListings = (filters = {}, pageSize = 12) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [error, setError] = useState(null);

  const buildQuery = (isLoadMore = false) => {
    let q = collection(db, 'listings');
    
    // Base filter - only published listings
    q = query(q, where('status', '==', 'published'));

    // Apply filters
    if (filters.listingType) {
      q = query(q, where('listingType', '==', filters.listingType));
    }
    
    if (filters.propertyCategory) {
      q = query(q, where('propertyCategory', '==', filters.propertyCategory));
    }
    
    if (filters.subCategory) {
      q = query(q, where('subCategory', '==', filters.subCategory));
    }
    
    if (filters.location) {
      q = query(q, where('location.city', '==', filters.location));
    }
    
    if (filters.minPrice) {
      q = query(q, where('pricing.basePrice', '>=', parseInt(filters.minPrice)));
    }
    
    if (filters.maxPrice) {
      q = query(q, where('pricing.basePrice', '<=', parseInt(filters.maxPrice)));
    }
    
    if (filters.minArea) {
      q = query(q, where('propertyOptions.area', '>=', parseInt(filters.minArea)));
    }
    
    if (filters.maxArea) {
      q = query(q, where('propertyOptions.area', '<=', parseInt(filters.maxArea)));
    }
    
    if (filters.bedrooms) {
      q = query(q, where('propertyOptions.bedrooms', '>=', filters.bedrooms));
    }
    
    if (filters.bathrooms) {
      q = query(q, where('propertyOptions.bathrooms', '>=', filters.bathrooms));
    }
    
    if (filters.furnishing) {
      q = query(q, where('propertyOptions.furnishing', '==', filters.furnishing));
    }
    
    if (filters.facing) {
      q = query(q, where('propertyOptions.facing', '==', filters.facing));
    }

    // Order by creation date (newest first)
    q = query(q, orderBy('createdAt', 'desc'));
    
    // Pagination
    if (isLoadMore && lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    
    q = query(q, limit(pageSize));
    
    return q;
  };

  const fetchListings = async (isLoadMore = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const q = buildQuery(isLoadMore);
      const querySnapshot = await getDocs(q);
      
      const newListings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      if (isLoadMore) {
        setListings(prev => [...prev, ...newListings]);
      } else {
        setListings(newListings);
      }
      
      // Update pagination state
      setHasMore(querySnapshot.docs.length === pageSize);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
      
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchListings(true);
    }
  };

  const refresh = () => {
    setLastDoc(null);
    setHasMore(true);
    fetchListings(false);
  };

  useEffect(() => {
    refresh();
  }, [JSON.stringify(filters)]);

  return {
    listings,
    loading,
    hasMore,
    error,
    loadMore,
    refresh
  };
};

export const useListing = (listingId) => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const docRef = doc(db, 'listings', listingId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Listing not found');
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  return { listing, loading, error };
};
