import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  runAllSeeders, 
  seedAmenities, 
  seedCategories, 
  seedPropertyConditions, 
  seedFacingOptions, 
  seedTestUsers,
  clearSeededData,
  checkExistingData 
} from '../utils/seeder';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CheckCircle, AlertCircle, Loader2, Database, Users, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SeederPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [seedingStatus, setSeedingStatus] = useState({});
  const [existingData, setExistingData] = useState({});

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Check existing data status
  const checkDataStatus = async () => {
    setLoading(true);
    try {
      const collections = ['amenities', 'categories', 'propertyConditions', 'facingOptions'];
      const status = {};
      
      for (const collection of collections) {
        status[collection] = await checkExistingData(collection);
      }
      
      setExistingData(status);
      toast.success('Data status checked');
    } catch (error) {
      console.error('Error checking data status:', error);
      toast.error('Failed to check data status');
    } finally {
      setLoading(false);
    }
  };

  // Run individual seeder
  const runIndividualSeeder = async (seederName, seederFunction) => {
    setSeedingStatus(prev => ({ ...prev, [seederName]: 'loading' }));
    
    try {
      await seederFunction();
      setSeedingStatus(prev => ({ ...prev, [seederName]: 'success' }));
      toast.success(`${seederName} seeded successfully`);
      
      // Refresh data status
      await checkDataStatus();
    } catch (error) {
      console.error(`Error seeding ${seederName}:`, error);
      setSeedingStatus(prev => ({ ...prev, [seederName]: 'error' }));
      toast.error(`Failed to seed ${seederName}`);
    }
  };

  // Run all seeders
  const runAllSeedersHandler = async () => {
    setLoading(true);
    setSeedingStatus({});
    
    try {
      await runAllSeeders({
        skipExisting: true,
        includeTestUsers: true,
        verbose: true
      });
      
      toast.success('All data seeded successfully!');
      await checkDataStatus();
    } catch (error) {
      console.error('Error running all seeders:', error);
      toast.error('Failed to seed data');
    } finally {
      setLoading(false);
    }
  };

  // Clear all seeded data
  const clearDataHandler = async () => {
    if (!window.confirm('Are you sure you want to clear all seeded data? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    
    try {
      await clearSeededData();
      toast.success('Seeded data cleared successfully');
      setExistingData({});
      setSeedingStatus({});
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error('Failed to clear seeded data');
    } finally {
      setLoading(false);
    }
  };

  // Status icon component
  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Seeder items configuration
  const seederItems = [
    {
      name: 'Amenities',
      key: 'amenities',
      description: 'WiFi, Parking, Pool, Gym, Kitchen, etc.',
      function: seedAmenities,
      collection: 'amenities'
    },
    {
      name: 'Categories & Subcategories',
      key: 'categories',
      description: 'Residential, Commercial, Vacation Rental types',
      function: seedCategories,
      collection: 'categories'
    },
    {
      name: 'Property Conditions',
      key: 'conditions',
      description: 'Excellent, Good, Fair, Needs Work',
      function: seedPropertyConditions,
      collection: 'propertyConditions'
    },
    {
      name: 'Facing Options',
      key: 'facing',
      description: 'North, South, East, West facing directions',
      function: seedFacingOptions,
      collection: 'facingOptions'
    },
    {
      name: 'Test Users',
      key: 'users',
      description: 'Admin, Owner, and Guest test accounts',
      function: seedTestUsers,
      collection: null
    }
  ];

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only administrators can access the database seeder.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Database className="h-8 w-8 text-blue-600" />
            Database Seeder
          </h1>
          <p className="mt-2 text-gray-600">
            Populate your database with initial data including amenities, categories, and test users.
          </p>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={runAllSeedersHandler}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Database className="h-4 w-4" />
              )}
              Seed All Data
            </Button>
            
            <Button
              onClick={checkDataStatus}
              variant="outline"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Check Data Status
            </Button>
            
            <Button
              onClick={clearDataHandler}
              variant="outline"
              disabled={loading}
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Clear Seeded Data
            </Button>
          </div>
        </Card>

        {/* Individual Seeders */}
        <div className="grid gap-6 md:grid-cols-2">
          {seederItems.map((item) => (
            <Card key={item.key} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    {item.name}
                    <StatusIcon status={seedingStatus[item.key]} />
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
                
                {item.collection && existingData[item.collection] && (
                  <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    <CheckCircle className="h-3 w-3" />
                    Exists
                  </div>
                )}
              </div>
              
              <Button
                onClick={() => runIndividualSeeder(item.key, item.function)}
                disabled={loading || seedingStatus[item.key] === 'loading'}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {seedingStatus[item.key] === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Seeding...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Seed {item.name}
                  </>
                )}
              </Button>
            </Card>
          ))}
        </div>

        {/* Test User Credentials */}
        <Card className="p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Test User Credentials
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900">Admin User</h3>
              <p className="text-sm text-gray-600 mt-1">
                Email: admin@airbnb.com<br />
                Password: Admin123!
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900">Property Owner</h3>
              <p className="text-sm text-gray-600 mt-1">
                Email: owner@airbnb.com<br />
                Password: Owner123!
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900">Guest User</h3>
              <p className="text-sm text-gray-600 mt-1">
                Email: guest@airbnb.com<br />
                Password: Guest123!
              </p>
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h2>
          <div className="prose prose-sm text-gray-600">
            <ol className="list-decimal list-inside space-y-2">
              <li>Click "Seed All Data" to populate all collections at once</li>
              <li>Use individual seed buttons to populate specific collections</li>
              <li>Check data status to see which collections already have data</li>
              <li>Test users will be created with email verification enabled</li>
              <li>Use "Clear Seeded Data" to remove all seeded collections (users are not cleared)</li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SeederPage;
