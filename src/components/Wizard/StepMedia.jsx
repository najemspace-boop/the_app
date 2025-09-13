import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import toast from "react-hot-toast";
import { 
  Upload, 
  Camera, 
  X, 
  Image as ImageIcon,
  Video,
  Plus,
  Loader2
} from "lucide-react";

const StepMedia = ({ data, onNext, onBack }) => {
  const [images, setImages] = useState(data.images || []);
  const [videos, setVideos] = useState(data.videos || []);
  const [uploading, setUploading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(new Set());
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const uploadFile = async (file, type) => {
    const maxSize = type === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB for video, 10MB for images
    
    if (file.size > maxSize) {
      toast.error(`${type === 'video' ? 'Video' : 'Image'} must be smaller than ${type === 'video' ? '50MB' : '10MB'}`);
      return null;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${type}s/${fileName}`;

    try {
      // Mock implementation - replace with Firebase storage
      console.log('Mock file upload:', file.name, type);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return a mock URL
      return URL.createObjectURL(file);
    } catch (error) {
      toast.error(error.message || "Failed to upload file");
      return null;
    }
  };

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 10) {
      toast.error("You can upload a maximum of 10 photos");
      return;
    }

    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      setUploadingFiles(prev => new Set([...prev, file.name]));
      const url = await uploadFile(file, 'image');
      setUploadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(file.name);
        return newSet;
      });
      return url;
    });

    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(url => url !== null);
      
      setImages(prev => [...prev, ...validUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Some images failed to upload');
    } finally {
      uploadedUrls.forEach(url => {
        if (url && url.startsWith('blob:')) {
          // Clean up blob URLs after a delay
          setTimeout(() => URL.revokeObjectURL(url), 60000);
        }
      });
    }

    setUploading(false);
    // Clear the input
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleVideoUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (videos.length + files.length > 1) {
      toast.error("You can upload only 1 video");
      return;
    }

    setUploading(true);
    const file = files[0];
    setUploadingFiles(prev => new Set([...prev, file.name]));
    
    const url = await uploadFile(file, 'video');
    
    setUploadingFiles(prev => {
      const newSet = new Set(prev);
      newSet.delete(file.name);
      return newSet;
    });

    if (url) {
      setVideos(prev => [...prev, url]);
      // Clean up blob URL after a delay
      if (url.startsWith('blob:')) {
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      }
    }

    setUploading(false);
    // Clear the input
    if (event.target) {
      event.target.value = '';
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  const reorderImages = (fromIndex, toIndex) => {
    setImages(prev => {
      const newImages = [...prev];
      const [removed] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, removed);
      return newImages;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ images, videos });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Property Media
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-sm text-muted-foreground mb-6">
            Upload high-quality photos and videos to showcase your property. The first photo will be used as the main image.
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Photos ({images.length}/10)</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || images.length >= 10}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Photos
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {images.length === 0 ? (
              <div 
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Click to upload photos</p>
                <p className="text-sm text-muted-foreground">
                  Upload up to 10 high-quality photos (max 10MB each)
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Property photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {index === 0 && (
                      <Badge className="absolute top-2 left-2 text-xs">Main</Badge>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Video ({videos.length}/1)</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => videoInputRef.current?.click()}
                disabled={uploading || videos.length >= 1}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Video
              </Button>
            </div>

            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />

            {videos.length === 0 ? (
              <div 
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => videoInputRef.current?.click()}
              >
                <Video className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Add a video tour (optional, max 50MB)
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {videos.map((video, index) => (
                  <div key={index} className="relative group">
                    <video
                      src={video}
                      className="w-full h-48 object-cover rounded-lg"
                      controls
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      onClick={() => removeVideo(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading files...
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" disabled={images.length === 0}>
              Next: Pricing
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StepMedia;
