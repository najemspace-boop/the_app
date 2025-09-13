import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import toast from "react-hot-toast";
// Removed Supabase import - will use Firebase storage when needed
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

    const urls = await Promise.all(uploadPromises);
    const successfulUploads = urls.filter((url): url is string => url !== null);
    
    if (successfulUploads.length > 0) {
      setImages(prev => [...prev, ...successfulUploads]);
      toast({
        title: "Photos uploaded",
        description: `Successfully uploaded ${successfulUploads.length} photo(s)`,
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
      toast({
        title: "Video uploaded",
        description: "Successfully uploaded video",
      });
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
        <p className="text-sm text-muted-foreground">
          Add high-quality photos and videos to showcase your property. The first image will be your main photo.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Photo Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Photos ({images.length})
              </h3>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || images.length >= 10}
              >
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Add Photos (max 10)
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />

            {images.length === 0 ? (
              <div 
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload photos or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  PNG, JPG, GIF up to 10MB each
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
                      <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                        Main Photo
                      </Badge>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                 {/* Add more photos button */}
                {images.length < 10 && (
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => !uploading && fileInputRef.current?.click()}
                  >
                    {uploading ? (
                      <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
                    ) : (
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Video Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Video className="h-5 w-5" />
                Videos ({videos.length}) <span className="text-sm text-muted-foreground font-normal">(Optional)</span>
              </h3>
              <Button
                type="button"
                variant="outline"
                onClick={() => videoInputRef.current?.click()}
                disabled={uploading || videos.length >= 1}
              >
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Add Video (max 1)
              </Button>
            </div>

            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              multiple
              onChange={handleVideoUpload}
              className="hidden"
            />

            {videos.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                      onClick={() => removeVideo(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upload Tips */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Upload Guidelines</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">Photography Tips:</p>
                <ul className="space-y-1 mt-1">
                  <li>• Use natural lighting when possible</li>
                  <li>• Show all rooms and key features</li>
                  <li>• Keep photos clear and uncluttered</li>
                  <li>• Include exterior shots if applicable</li>
                  <li>• Ensure the main photo represents your property well</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground">File Requirements:</p>
                <ul className="space-y-1 mt-1">
                  <li>• Photos: Maximum 10MB each</li>
                  <li>• Video: Maximum 50MB</li>
                  <li>• Up to 10 photos + 1 video</li>
                  <li>• Supported: JPG, PNG, GIF, MP4, MOV</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button 
              type="submit"
              disabled={images.length === 0}
            >
              Next: Policies
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StepMedia;