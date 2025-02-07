import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { useRef, useState, useEffect } from 'react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Loader } from 'lucide-react';
import { GenerateThumbnailProps } from '@/types';
import { Input } from './ui/input';
import Image from 'next/image';
import { useToast } from './ui/use-toast';
import { useAction, useMutation } from 'convex/react';
import { useUploadFiles } from '@xixixao/uploadstuff/react';
import { api } from '@/convex/_generated/api';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Expand, Download, X } from 'lucide-react';
import { Id } from '@/convex/_generated/dataModel';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import ImagePreview from './ImagePreview';
import { LoadingSkeleton } from './ImagePreview';

interface GenerateThumbnailProps {
  setImage: (url: string) => void;
  setImageStorageId: (id: Id<"_storage"> | null) => void;
  image: string;
  imagePrompt: string;
  setImagePrompt: (prompt: string) => void;
  imageStorageId: Id<"_storage"> | null;
  thumbnailPrompts: string[];
}

const GenerateThumbnail = ({ setImage, setImageStorageId, image, imagePrompt, setImagePrompt, imageStorageId, thumbnailPrompts }: GenerateThumbnailProps) => {
  const [isAiThumbnail, setIsAiThumbnail] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null); //To store Img ref
  const { toast } = useToast();
  const handleGenerateThumbnail = useAction(api.freepik.generateThumbnailAction)
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isFullPreviewLoading, setIsFullPreviewLoading] = useState(true);

  //To upload Image & fetch uploaded url
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl)
  const getImageUrl = useMutation(api.podcasts.getUrl);
  const deleteFile = useMutation(api.files.deleteFile);

  // Reset full preview loading state when image or preview dialog changes
  useEffect(() => {
    if (isPreviewOpen) {
      setIsFullPreviewLoading(true);
    }
  }, [isPreviewOpen, image]);

  // Helper function to delete previous image
  const deletePreviousImage = async () => {
    if (imageStorageId) {
      try {
        await deleteFile({ storageId: imageStorageId });
      } catch (error) {
        console.error('Error deleting previous image:', error);
      }
    }
  };

  //Image Handler Func
  const handleImage = async (blob: Blob, fileName: string, isAI: boolean) => {
    setImage('');
    setIsAiGenerated(isAI);

    try {
      await deletePreviousImage();

      const file = new File([blob], fileName, { type: 'image/png' });
      const uploaded = await startUpload([file]);
      const storageId = uploaded[0].response?.storageId as Id<"_storage">;

      setImageStorageId(storageId);
      const imageUrl = await getImageUrl({ storageId });
      setImage(imageUrl!);
      setIsImageLoading(false);
    }
    catch (error) {
      console.log(error)
      toast({ title: 'Error generating thumbnail', variant: 'destructive' })
      setIsImageLoading(false);
    }
  }

  // Add validation helper
  const isImageRequired = () => {
    if (!image && !isImageLoading) {
      toast({
        title: "Thumbnail is required",
        description: "Please upload or generate a thumbnail image",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  // Update upload function to handle validation
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      setIsImageLoading(true);
      setProgress(20);
      const files = e.target.files;
      if (!files) {
        toast({
          title: "No file selected",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      const file = files[0];
      setProgress(40);
      const blob = await file.arrayBuffer()
        .then((ab) => new Blob([ab]));
      
      setProgress(60);
      await handleImage(blob, file.name, false);
      setProgress(100);
    } catch (error) {
      console.error(error);
      toast({ 
        title: 'Error uploading image', 
        description: "Please try again",
        variant: 'destructive' 
      });
      setIsImageLoading(false);
    } finally {
      setProgress(0);
    }
  };

  // Update generate function to handle validation
  const generateImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!imagePrompt.trim()) {
      toast({
        title: "Prompt is required",
        description: "Please enter a prompt for the thumbnail",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsImageLoading(true);
      setProgress(20);
      const imageUrl = await handleGenerateThumbnail({ prompt: imagePrompt });

      if (!imageUrl) {
        throw new Error("No image URL received");
      }
      
      setProgress(40);
      const imgResponse = await fetch(imageUrl);
      if (!imgResponse.ok) {
        throw new Error(`Failed to fetch image: ${imgResponse.status}`);
      }

      setProgress(60);
      const blob = await imgResponse.blob();
      await handleImage(blob, `thumbnail-${uuidv4()}`, true);
      setProgress(100);

    } catch (error) {
      console.error("Error generating thumbnail:", error);
      toast({
        title: 'Error generating thumbnail',
        description: error instanceof Error ? error.message : 'Failed to generate thumbnail',
        variant: 'destructive'
      });
      setIsImageLoading(false);
    } finally {
      setProgress(0);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    try {
      e.stopPropagation();
      if (imageStorageId) {
        await deleteFile({ storageId: imageStorageId });
      }
      setImage("");
      setImageStorageId(null);
      toast({
        title: "Thumbnail deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting thumbnail:', error);
      toast({
        title: 'Error deleting thumbnail',
        description: error instanceof Error ? error.message : 'Failed to delete thumbnail',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `podcast-thumbnail-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Image downloaded successfully",
      });
    } catch (error) {
      toast({
        title: 'Error downloading image',
        description: 'Failed to download image',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div className="generate_thumbnail">
        <Button
          type="button"
          variant="plain"
          onClick={() => setIsAiThumbnail(true)}
          className={cn('', {
            'bg-black-6': isAiThumbnail
          })}
          disabled={isImageLoading}
        >
          Use AI to generate thumbnail
        </Button>
        <Button
          type="button"
          variant="plain"
          onClick={() => setIsAiThumbnail(false)}
          className={cn('', {
            'bg-black-6': !isAiThumbnail
          })}
          disabled={isImageLoading}
        >
          Upload custom image
        </Button>
      </div>

      {isAiThumbnail ? (
        <div className="flex flex-col gap-5 animate-in fade-in-50">
          {thumbnailPrompts.length > 0 && (
            <div className="mt-5 flex flex-col gap-2.5">
              <Label className="text-16 font-bold text-white-1">
                Select a Thumbnail Prompt
              </Label>
              <div className="grid gap-2">
                {thumbnailPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant={imagePrompt === prompt ? "default" : "outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      "hover:bg-orange-1/10 transition-colors duration-200",
                      "bg-black-1/50 hover:bg-black-1/70 border-black-6",
                      imagePrompt === prompt && "bg-orange-1 hover:bg-orange-1/90 text-white border-none"
                    )}
                    onClick={() => setImagePrompt(prompt)}
                  >
                    <span className="mr-2 font-semibold">#{index + 1}</span>
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-16 font-bold text-white-1">
              {thumbnailPrompts.length > 0 ? 'Customize Prompt' : 'Enter Prompt'}
            </Label>
            <Textarea
              className="input-class font-light focus-visible:ring-offset-orange-1 min-h-[120px] 
                bg-black-1/50 hover:bg-black-1/70 transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                border border-black-6"
              placeholder={thumbnailPrompts.length > 0 
                ? "Customize the selected prompt or write your own..." 
                : "Write a prompt for your thumbnail..."}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              disabled={isImageLoading}
            />
          </div>

          <div className="space-y-4">
            <div className="w-full max-w-[200px]">
              <Button
                type="submit"
                className="text-16 bg-orange-1 py-4 font-bold text-white-1 w-full
                  hover:bg-orange-600 transition-all duration-300 hover:scale-[1.02]
                  disabled:opacity-50 disabled:hover:scale-100"
                onClick={generateImage}
                disabled={isImageLoading || !imagePrompt.trim()}
              >
                {isImageLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader size={20} className="animate-spin" />
                    <span>Generating...</span>
                  </div>
                ) : (
                  'Generate'
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            onClick={() => !isImageLoading && imageRef?.current?.click()}
            className={cn(
              "image_div hover:border-orange-1/50 hover:bg-black-1/30",
              "transition-all duration-200 group animate-in fade-in-50",
              "border-black-6 bg-black-1/50",
              isImageLoading && "opacity-50 cursor-not-allowed hover:border-gray-700 hover:bg-transparent"
            )}
          >
            <Input
              type="file"
              className="hidden"
              ref={imageRef}
              onChange={(e) => uploadImage(e)}
              accept="image/*"
              disabled={isImageLoading}
            />
            
            <div className="flex flex-col items-center gap-1">
              <h2 className={cn(
                "text-12 font-bold text-orange-1 group-hover:text-orange-400",
                "transition-colors duration-200"
              )}>
                Click to upload
              </h2>
              <p className="text-12 font-normal text-gray-1">
                SVG, PNG, JPG, or GIF (max. 1080x1080px)
              </p>
            </div>
          </div>
        </div>
      )}

      {(image || isImageLoading) && (
        <ImagePreview
          image={image}
          isImageLoading={isImageLoading}
          progress={progress}
          isAiThumbnail={isAiThumbnail}
          isAiGenerated={isAiGenerated}
          setIsPreviewOpen={setIsPreviewOpen}
          handleDownload={handleDownload}
          handleDelete={handleDelete}
        />
      )}

      {image && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent 
            className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-black-1/95 border-white/5"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            onClick={(e) => e.stopPropagation()}
          >
            <DialogTitle className="sr-only">
              Thumbnail Preview
            </DialogTitle>
            
            <DialogDescription className="sr-only">
              Preview your podcast thumbnail image in full size. You can download or close the preview using the buttons in the top right corner.
            </DialogDescription>
            
            <div className="relative group">
              {isFullPreviewLoading && <LoadingSkeleton />}
              <Image
                src={image}
                width={1920}
                height={1080}
                className={cn(
                  "w-full h-full object-contain transition-all duration-500",
                  isFullPreviewLoading ? "opacity-0" : "opacity-100"
                )}
                alt="thumbnail preview"
                priority
                unoptimized={image.endsWith('.gif')}
                onLoadingComplete={() => setIsFullPreviewLoading(false)}
                onClick={(e) => e.stopPropagation()}
              />
              
              {!isFullPreviewLoading && (
                <div className="absolute top-4 right-4 flex items-center gap-2 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 rounded-full 
                      bg-white/10 hover:bg-white/20
                      backdrop-blur-lg border border-white/10 
                      shadow-[0_4px_10px_rgba(0,0,0,0.5)]
                      transition-all duration-300 hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(e);
                    }}
                    aria-label="Download thumbnail"
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 rounded-full 
                      bg-white/10 hover:bg-white/20
                      backdrop-blur-lg border border-white/10 
                      shadow-[0_4px_10px_rgba(0,0,0,0.5)]
                      transition-all duration-300 hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPreviewOpen(false);
                    }}
                    aria-label="Close preview"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add a hidden input for form validation */}
      <input 
        type="hidden" 
        name="thumbnail" 
        value={image} 
        required 
        aria-hidden="true"
      />
    </div>
  )
}

export default GenerateThumbnail