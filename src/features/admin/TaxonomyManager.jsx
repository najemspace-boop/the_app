import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import { Plus, Edit, Trash2, Save, X, Settings } from 'lucide-react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import toast from 'react-hot-toast';

const TaxonomyManager = () => {
  const [taxonomies, setTaxonomies] = useState({
    amenities: [],
    categories: [],
    subcategories: [],
    conditions: [],
    facingOptions: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('amenities');
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', description: '', icon: '' });

  useEffect(() => {
    fetchTaxonomies();
  }, []);

  const fetchTaxonomies = () => {
    const unsubscribes = [];

    Object.keys(taxonomies).forEach(taxonomyType => {
      const unsubscribe = onSnapshot(
        collection(db, 'taxonomies', taxonomyType, 'items'),
        (snapshot) => {
          const items = [];
          snapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
          });
          setTaxonomies(prev => ({ ...prev, [taxonomyType]: items }));
        }
      );
      unsubscribes.push(unsubscribe);
    });

    setLoading(false);
    return () => unsubscribes.forEach(unsub => unsub());
  };

  const addItem = async () => {
    if (!newItem.name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      await addDoc(collection(db, 'taxonomies', activeTab, 'items'), {
        ...newItem,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      setNewItem({ name: '', description: '', icon: '' });
      toast.success('Item added successfully');
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    }
  };

  const updateItem = async (itemId, updates) => {
    try {
      await updateDoc(doc(db, 'taxonomies', activeTab, 'items', itemId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      setEditingItem(null);
      toast.success('Item updated successfully');
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    }
  };

  const deleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteDoc(doc(db, 'taxonomies', activeTab, 'items', itemId));
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const getDefaultItems = (type) => {
    const defaults = {
      amenities: [
        { name: 'WiFi', description: 'High-speed internet access', icon: 'wifi' },
        { name: 'TV', description: 'Television with cable/streaming', icon: 'tv' },
        { name: 'Kitchen', description: 'Full kitchen facilities', icon: 'coffee' },
        { name: 'Parking', description: 'Dedicated parking space', icon: 'car' },
        { name: 'Pool', description: 'Swimming pool access', icon: 'waves' },
        { name: 'Gym', description: 'Fitness center access', icon: 'dumbbell' },
        { name: 'Balcony', description: 'Private balcony or terrace', icon: 'home' },
        { name: 'Garden', description: 'Garden or outdoor space', icon: 'tree-pine' }
      ],
      categories: [
        { name: 'Apartment', description: 'Multi-unit residential building', icon: 'building' },
        { name: 'House', description: 'Single-family detached home', icon: 'home' },
        { name: 'Villa', description: 'Luxury detached house', icon: 'castle' },
        { name: 'Studio', description: 'Single room living space', icon: 'square' },
        { name: 'Townhouse', description: 'Multi-story attached home', icon: 'buildings' },
        { name: 'Penthouse', description: 'Top-floor luxury apartment', icon: 'crown' }
      ],
      subcategories: [
        { name: '1 Bedroom', description: 'One bedroom unit', icon: 'bed' },
        { name: '2 Bedroom', description: 'Two bedroom unit', icon: 'bed' },
        { name: '3 Bedroom', description: 'Three bedroom unit', icon: 'bed' },
        { name: '4+ Bedroom', description: 'Four or more bedrooms', icon: 'bed' }
      ],
      conditions: [
        { name: 'Ready to Move', description: 'Property is ready for immediate occupancy', icon: 'check-circle' },
        { name: 'Under Construction', description: 'Property is still being built', icon: 'hammer' },
        { name: 'Off Plan', description: 'Property exists only in plans', icon: 'blueprint' },
        { name: 'Brand New', description: 'Newly constructed, never occupied', icon: 'sparkles' },
        { name: 'Recently Renovated', description: 'Property has been recently updated', icon: 'wrench' }
      ],
      facingOptions: [
        { name: 'North', description: 'North-facing property', icon: 'compass' },
        { name: 'South', description: 'South-facing property', icon: 'compass' },
        { name: 'East', description: 'East-facing property', icon: 'compass' },
        { name: 'West', description: 'West-facing property', icon: 'compass' },
        { name: 'Front Facing', description: 'Faces the front of the building', icon: 'eye' },
        { name: 'Back Facing', description: 'Faces the back of the building', icon: 'eye-off' }
      ]
    };
    return defaults[type] || [];
  };

  const seedDefaultItems = async (type) => {
    const defaultItems = getDefaultItems(type);
    
    try {
      for (const item of defaultItems) {
        await addDoc(collection(db, 'taxonomies', type, 'items'), {
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      toast.success(`Default ${type} added successfully`);
    } catch (error) {
      console.error('Error seeding default items:', error);
      toast.error('Failed to add default items');
    }
  };

  const tabs = [
    { key: 'amenities', label: 'Amenities', description: 'Property features and facilities' },
    { key: 'categories', label: 'Categories', description: 'Property types and classifications' },
    { key: 'subcategories', label: 'Subcategories', description: 'Property size and layout options' },
    { key: 'conditions', label: 'Conditions', description: 'Property construction status' },
    { key: 'facingOptions', label: 'Facing Options', description: 'Property orientation and direction' }
  ];

  const EditForm = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item);

    return (
      <div className="space-y-3 p-3 bg-gray-50 rounded">
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Name"
        />
        <Input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Description"
        />
        <Input
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          placeholder="Icon name (lucide-react)"
        />
        <div className="flex space-x-2">
          <Button size="sm" onClick={() => onSave(formData)}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center space-x-2">
          <Settings className="h-6 w-6" />
          <span>Taxonomy Manager</span>
        </h2>
      </div>

      {/* Tabs */}
      <Card>
        <CardContent className="p-0">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium">
                {tabs.find(t => t.key === activeTab)?.label}
              </h3>
              <p className="text-sm text-gray-600">
                {tabs.find(t => t.key === activeTab)?.description}
              </p>
            </div>

            {/* Add New Item */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Add New Item</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                  <Input
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  />
                  <Input
                    placeholder="Icon name (lucide-react)"
                    value={newItem.icon}
                    onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={addItem}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                  {taxonomies[activeTab].length === 0 && (
                    <Button
                      variant="outline"
                      onClick={() => seedDefaultItems(activeTab)}
                    >
                      Add Default Items
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Items List */}
            <div className="space-y-3">
              {taxonomies[activeTab].length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No items found. Add some items or use the "Add Default Items" button to get started.
                  </AlertDescription>
                </Alert>
              ) : (
                taxonomies[activeTab].map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      {editingItem === item.id ? (
                        <EditForm
                          item={item}
                          onSave={(updates) => updateItem(item.id, updates)}
                          onCancel={() => setEditingItem(null)}
                        />
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{item.name}</h4>
                              {item.icon && (
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {item.icon}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingItem(item.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteItem(item.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxonomyManager;
