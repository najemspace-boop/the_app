import React from 'react';
import { demo, glassmorphismCard, responsiveGrid, propertyCard } from '../styles/demo.css';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';

const VanillaExtractDemo: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Vanilla Extract Integration Demo</h1>
      
      {/* Demo Component */}
      <div className={demo}>
        This is a demo component styled with Vanilla Extract
      </div>

      {/* Glassmorphism Card */}
      <div className={glassmorphismCard}>
        <h3 className="text-lg font-semibold mb-2">Glassmorphism Card</h3>
        <p>This card uses glassmorphism effects with Vanilla Extract</p>
      </div>

      {/* Button Variants */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default Button</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">🏠</Button>
        </div>
      </div>

      {/* Input Demo */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Input Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <Input placeholder="Enter your email" type="email" />
          <Input placeholder="Enter your password" type="password" />
          <Input placeholder="Phone number" type="tel" />
          <Input placeholder="Search properties..." />
        </div>
      </div>

      {/* Card Demo */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Card Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Property Listing</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This is a sample property card using Vanilla Extract styling.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Another card example with consistent styling.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Responsive Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Responsive Grid</h2>
        <div className={responsiveGrid}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className={propertyCard}>
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500"></div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Property {item}</h3>
                <p className="text-sm text-gray-600">Sample property description</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VanillaExtractDemo;