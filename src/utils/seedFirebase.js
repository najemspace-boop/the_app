import { db } from '../config/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Sample amenities data
const amenitiesData = [
  { id: 'wifi', name: 'WiFi', icon: 'Wifi', category: 'essentials' },
  { id: 'kitchen', name: 'Kitchen', icon: 'ChefHat', category: 'essentials' },
  { id: 'washer', name: 'Washer', icon: 'Shirt', category: 'essentials' },
  { id: 'dryer', name: 'Dryer', icon: 'Wind', category: 'essentials' },
  { id: 'air_conditioning', name: 'Air conditioning', icon: 'Snowflake', category: 'essentials' },
  { id: 'heating', name: 'Heating', icon: 'Flame', category: 'essentials' },
  { id: 'tv', name: 'TV', icon: 'Tv', category: 'entertainment' },
  { id: 'pool', name: 'Pool', icon: 'Waves', category: 'outdoor' },
  { id: 'hot_tub', name: 'Hot tub', icon: 'Bath', category: 'outdoor' },
  { id: 'gym', name: 'Gym', icon: 'Dumbbell', category: 'facilities' },
  { id: 'parking', name: 'Free parking', icon: 'Car', category: 'facilities' },
  { id: 'elevator', name: 'Elevator', icon: 'ArrowUp', category: 'facilities' },
  { id: 'balcony', name: 'Balcony', icon: 'Building', category: 'outdoor' },
  { id: 'garden', name: 'Garden', icon: 'Trees', category: 'outdoor' },
  { id: 'security', name: '24/7 Security', icon: 'Shield', category: 'safety' }
];

// Sample categories data
const categoriesData = [
  { id: 'apartment', name: 'Apartment', icon: 'Building', description: 'Modern apartments in the city' },
  { id: 'villa', name: 'Villa', icon: 'Home', description: 'Luxury villas with gardens' },
  { id: 'townhouse', name: 'Townhouse', icon: 'Building2', description: 'Multi-level townhouses' },
  { id: 'penthouse', name: 'Penthouse', icon: 'Crown', description: 'Premium penthouses with views' },
  { id: 'studio', name: 'Studio', icon: 'Square', description: 'Compact studio apartments' },
  { id: 'duplex', name: 'Duplex', icon: 'Layers', description: 'Two-level living spaces' }
];

// Sample property listings
const listingsData = [
  {
    title: 'Luxury Marina Apartment',
    description: 'Stunning waterfront apartment with panoramic marina views. Features modern amenities, spacious living areas, and premium finishes throughout.',
    listingType: 'rent',
    category: 'apartment',
    location: {
      address: 'Marina Walk, Dubai Marina',
      city: 'Dubai',
      district: 'Dubai Marina',
      country: 'UAE',
      coordinates: { lat: 25.0657, lng: 55.1413 }
    },
    details: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      maxGuests: 4,
      propertyType: 'apartment'
    },
    amenities: ['wifi', 'kitchen', 'air_conditioning', 'tv', 'pool', 'gym', 'parking'],
    photos: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    coverPhoto: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    pricing: {
      basePrice: 350,
      currency: 'USD',
      cleaningFee: 50,
      securityDeposit: 500
    },
    policies: {
      checkIn: '15:00',
      checkOut: '11:00',
      cancellationPolicy: 'flexible',
      houseRules: ['No smoking', 'No pets', 'No parties']
    },
    status: 'active',
    rating: 4.8,
    reviewsCount: 24,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'Modern Downtown Penthouse',
    description: 'Exclusive penthouse in the heart of downtown with breathtaking city skyline views. Premium location with world-class amenities.',
    listingType: 'sale',
    category: 'penthouse',
    location: {
      address: 'Downtown Boulevard, Downtown Dubai',
      city: 'Dubai',
      district: 'Downtown Dubai',
      country: 'UAE',
      coordinates: { lat: 25.1972, lng: 55.2744 }
    },
    details: {
      bedrooms: 3,
      bathrooms: 3,
      area: 2500,
      maxGuests: 6,
      propertyType: 'penthouse'
    },
    amenities: ['wifi', 'kitchen', 'air_conditioning', 'tv', 'pool', 'gym', 'parking', 'balcony'],
    photos: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
    ],
    coverPhoto: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    pricing: {
      basePrice: 4200000,
      currency: 'USD'
    },
    policies: {
      checkIn: '14:00',
      checkOut: '12:00',
      cancellationPolicy: 'strict'
    },
    status: 'active',
    rating: 5.0,
    reviewsCount: 18,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  },
  {
    title: 'Family Villa with Garden',
    description: 'Spacious family villa featuring a private garden, multiple living areas, and modern amenities. Perfect for families seeking comfort and privacy.',
    listingType: 'rent',
    category: 'villa',
    location: {
      address: 'Arabian Ranches 2',
      city: 'Dubai',
      district: 'Arabian Ranches',
      country: 'UAE',
      coordinates: { lat: 25.0515, lng: 55.2708 }
    },
    details: {
      bedrooms: 4,
      bathrooms: 4,
      area: 3200,
      maxGuests: 8,
      propertyType: 'villa'
    },
    amenities: ['wifi', 'kitchen', 'air_conditioning', 'tv', 'pool', 'garden', 'parking', 'security'],
    photos: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80'
    ],
    coverPhoto: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    pricing: {
      basePrice: 450,
      currency: 'USD',
      cleaningFee: 75,
      securityDeposit: 800
    },
    policies: {
      checkIn: '16:00',
      checkOut: '10:00',
      cancellationPolicy: 'moderate',
      houseRules: ['No smoking', 'Pets allowed', 'No parties']
    },
    status: 'active',
    rating: 4.9,
    reviewsCount: 31,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }
];

export const seedFirebase = async () => {
  try {
    console.log('🌱 Starting Firebase seeding...');

    // Seed amenities
    console.log('📝 Seeding amenities...');
    for (const amenity of amenitiesData) {
      await setDoc(doc(db, 'amenities', amenity.id), amenity);
    }
    console.log(`✅ Seeded ${amenitiesData.length} amenities`);

    // Seed categories
    console.log('📝 Seeding categories...');
    for (const category of categoriesData) {
      await setDoc(doc(db, 'categories', category.id), category);
    }
    console.log(`✅ Seeded ${categoriesData.length} categories`);

    // Seed listings
    console.log('📝 Seeding listings...');
    for (const listing of listingsData) {
      // Add a dummy owner ID (you can replace this with actual user IDs later)
      listing.ownerId = 'demo-owner-' + Math.random().toString(36).substr(2, 9);
      
      const docRef = await addDoc(collection(db, 'listings'), listing);
      console.log(`✅ Added listing: ${listing.title} (ID: ${docRef.id})`);
    }

    console.log('🎉 Firebase seeding completed successfully!');
    return { success: true, message: 'Database seeded successfully' };

  } catch (error) {
    console.error('❌ Error seeding Firebase:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to clear all data (use with caution)
export const clearFirebaseData = async () => {
  try {
    console.log('🧹 Clearing Firebase data...');
    
    // Note: This is a simplified version. In production, you'd want to use batch operations
    // and handle pagination for large datasets
    
    console.log('⚠️  Manual deletion required for security. Please use Firebase Console to clear data.');
    return { success: true, message: 'Please clear data manually via Firebase Console' };
    
  } catch (error) {
    console.error('❌ Error clearing Firebase:', error);
    return { success: false, error: error.message };
  }
};
