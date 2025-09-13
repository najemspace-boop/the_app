import { useState } from 'react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { seedFirebase } from '../utils/seedFirebase';
import { Database, Loader2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SeedDatabase = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState(null);

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    
    try {
      const result = await seedFirebase();
      setSeedResult(result);
      
      if (result.success) {
        toast.success('Database seeded successfully!');
      } else {
        toast.error('Failed to seed database');
      }
    } catch (error) {
      console.error('Seeding error:', error);
      setSeedResult({ success: false, error: error.message });
      toast.error('Failed to seed database');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Database Seeding</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Populate your Firebase database with sample amenities, categories, and property listings.
        </p>
        
        <Button 
          onClick={handleSeed} 
          disabled={isSeeding}
          className="w-full"
        >
          {isSeeding ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Seeding Database...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Seed Database
            </>
          )}
        </Button>

        {seedResult && (
          <div className={`flex items-center space-x-2 p-3 rounded-lg ${
            seedResult.success 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            {seedResult.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <span className="text-sm">
              {seedResult.success ? seedResult.message : seedResult.error}
            </span>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p><strong>This will add:</strong></p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>15 amenities (WiFi, Kitchen, Pool, etc.)</li>
            <li>6 property categories</li>
            <li>3 sample property listings</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SeedDatabase;
