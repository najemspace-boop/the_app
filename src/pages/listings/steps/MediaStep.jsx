import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image, Video } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

const MediaStep = ({ formData, updateFormData }) => {
  const [draggedIndex, setDraggedIndex] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 12,
    maxSize: 2 * 1024 * 1024, // 2MB
    onDrop: (acceptedFiles) => {
      const newPhotos = [...(formData.photos || []), ...acceptedFiles];
      updateFormData({ photos: newPhotos.slice(0, 12) }); // Max 12 photos
    }
  });

  const removePhoto = (index) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    updateFormData({ photos: newPhotos });
  };

  const movePhoto = (fromIndex, toIndex) => {
    const newPhotos = [...formData.photos];
    const [movedPhoto] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, movedPhoto);
    updateFormData({ photos: newPhotos });
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      movePhoto(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos & Media</h3>
        <p className="text-gray-600 mb-6">
          Add photos and videos to showcase your property. The first photo will be your cover photo.
        </p>
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Property Photos * (Max 12 photos, 2MB each)
        </label>
        
        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            {isDragActive ? 'Drop photos here' : 'Upload property photos'}
          </p>
          <p className="text-sm text-gray-500">
            Drag and drop photos here, or click to select files
          </p>
          <p className="text-xs text-gray-400 mt-2">
            JPEG, PNG, WebP up to 2MB each
          </p>
        </div>

        {/* Photo Preview Grid */}
        {formData.photos && formData.photos.length > 0 && (
          <div className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {formData.photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-move"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Property photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Cover Photo Badge */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                      Cover Photo
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  
                  {/* Photo Number */}
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-sm text-gray-500 mt-2">
              Drag photos to reorder. The first photo will be your cover photo.
            </p>
          </div>
        )}
      </div>

      {/* Video URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Video (Optional)
        </label>
        <Input
          placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
          value={formData.videoUrl || ''}
          onChange={(e) => updateFormData({ videoUrl: e.target.value })}
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          Add a YouTube or Vimeo video link to showcase your property
        </p>
      </div>

      {/* Media Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Image className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">Photo Tips</h4>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Use natural lighting when possible</li>
                <li>Show all rooms and important features</li>
                <li>Include exterior shots and neighborhood views</li>
                <li>Keep photos clean and uncluttered</li>
                <li>Take photos from multiple angles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Requirements */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Video className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-yellow-800">Requirements</h4>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>At least 5 photos required</li>
                <li>Maximum 12 photos allowed</li>
                <li>Each photo must be under 2MB</li>
                <li>Supported formats: JPEG, PNG, WebP</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaStep;
