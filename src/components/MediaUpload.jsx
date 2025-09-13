import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Upload, X, Image, Video, AlertCircle } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';
import toast from 'react-hot-toast';

const MediaUpload = ({ 
  images = [], 
  video = null, 
  onImagesChange, 
  onVideoChange, 
  maxImages = 12,
  maxImageSize = 2 * 1024 * 1024, // 2MB
  maxVideoSize = 50 * 1024 * 1024, // 50MB
  userId 
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const validateImageFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPG, PNG, and WebP images are allowed');
    }
    
    if (file.size > maxImageSize) {
      throw new Error(`Image must be less than ${maxImageSize / (1024 * 1024)}MB`);
    }
    
    return true;
  };

  const validateVideoFile = (file) => {
    const allowedTypes = ['video/mp4', 'video/avi', 'video/webm', 'video/mov'];
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only MP4, AVI, WebM, and MOV videos are allowed');
    }
    
    if (file.size > maxVideoSize) {
      throw new Error(`Video must be less than ${maxVideoSize / (1024 * 1024)}MB`);
    }
    
    return true;
  };

  const uploadFile = async (file, path) => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (uploading) return;

    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    const videoFiles = acceptedFiles.filter(file => file.type.startsWith('video/'));

    // Check image limits
    if (images.length + imageFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Check video limits
    if (video && videoFiles.length > 0) {
      toast.error('Only one video is allowed');
      return;
    }

    if (videoFiles.length > 1) {
      toast.error('Only one video can be uploaded at a time');
      return;
    }

    setUploading(true);

    try {
      // Upload images
      const newImages = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        
        try {
          validateImageFile(file);
          
          setUploadProgress(prev => ({ ...prev, [`image_${i}`]: 0 }));
          
          const path = `listings/${userId}/images/${Date.now()}_${file.name}`;
          const url = await uploadFile(file, path);
          
          newImages.push({
            id: Date.now() + i,
            url,
            name: file.name,
            path
          });
          
          setUploadProgress(prev => ({ ...prev, [`image_${i}`]: 100 }));
        } catch (error) {
          toast.error(`${file.name}: ${error.message}`);
        }
      }

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
      }

      // Upload video
      if (videoFiles.length > 0) {
        const file = videoFiles[0];
        
        try {
          validateVideoFile(file);
          
          setUploadProgress(prev => ({ ...prev, video: 0 }));
          
          const path = `listings/${userId}/video/${Date.now()}_${file.name}`;
          const url = await uploadFile(file, path);
          
          onVideoChange({
            id: Date.now(),
            url,
            name: file.name,
            path
          });
          
          setUploadProgress(prev => ({ ...prev, video: 100 }));
        } catch (error) {
          toast.error(`Video: ${error.message}`);
        }
      }

      toast.success('Media uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload media');
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  }, [images, video, maxImages, maxImageSize, maxVideoSize, userId, onImagesChange, onVideoChange, uploading]);

  const removeImage = async (imageToRemove) => {
    try {
      // Delete from storage
      if (imageToRemove.path) {
        const storageRef = ref(storage, imageToRemove.path);
        await deleteObject(storageRef);
      }
      
      // Remove from state
      onImagesChange(images.filter(img => img.id !== imageToRemove.id));
      toast.success('Image removed');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
  };

  const removeVideo = async () => {
    try {
      // Delete from storage
      if (video?.path) {
        const storageRef = ref(storage, video.path);
        await deleteObject(storageRef);
      }
      
      // Remove from state
      onVideoChange(null);
      toast.success('Video removed');
    } catch (error) {
      console.error('Error removing video:', error);
      toast.error('Failed to remove video');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'video/*': ['.mp4', '.avi', '.webm', '.mov']
    },
    disabled: uploading
  });

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary-400 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? 'Drop files here' : 'Upload Property Media'}
              </p>
              <p className="text-sm text-gray-600">
                Drag and drop images and videos, or click to browse
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Images: JPG, PNG, WebP (max {maxImageSize / (1024 * 1024)}MB each, {maxImages} max)</p>
                <p>Video: MP4, AVI, WebM, MOV (max {maxVideoSize / (1024 * 1024)}MB, 1 max)</p>
              </div>
            </div>
          </div>

          {uploading && (
            <div className="mt-4 space-y-2">
              {Object.entries(uploadProgress).map(([key, progress]) => (
                <div key={key} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 capitalize">{key.replace('_', ' ')}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{progress}%</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Images Grid */}
      {images.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center space-x-2">
                <Image className="h-5 w-5" />
                <span>Images ({images.length}/{maxImages})</span>
              </h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url}
                    alt={`Property ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(image)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-primary-600 text-white px-2 py-1 rounded text-xs">
                      Cover
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video */}
      {video && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center space-x-2">
                <Video className="h-5 w-5" />
                <span>Property Video</span>
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={removeVideo}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
            
            <div className="relative">
              <video
                src={video.url}
                controls
                className="w-full max-h-64 rounded-lg"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Messages */}
      {images.length === 0 && (
        <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">At least one image is required for your listing</span>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
