import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { useRef, useState } from 'react';
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
import { Skeleton } from "./ui/skeleton";
import { Trash2 } from 'lucide-react';
import { Id } from '@/convex/_generated/dataModel';

interface GenerateThumbnailProps {
  setImage: (url: string) => void;
  setImageStorageId: (id: Id<"_storage"> | null) => void;
  image: string;
  imagePrompt: string;
  setImagePrompt: (prompt: string) => void;
  imageStorageId: Id<"_storage"> | null;
}

const GenerateThumbnail = ({ setImage, setImageStorageId, image, imagePrompt, setImagePrompt, imageStorageId }: GenerateThumbnailProps) => {
  const [isAiThumbnail, setIsAiThumbnail] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null); //To store Img ref
  const { toast } = useToast();
  const handleGenerateThumbnail = useAction(api.freepik.generateThumbnailAction)
  const [imageLoading, setImageLoading] = useState(true);
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  //To upload Image & fetch uploaded url
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl)
  const getImageUrl = useMutation(api.podcasts.getUrl);
  const deleteFile = useMutation(api.files.deleteFile);

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

    try {
      // Delete previous image if exists
      await deletePreviousImage();

      const file = new File([blob], fileName, { type: 'image/png' });
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setImageStorageId(storageId);
      const imageUrl = await getImageUrl({ storageId });
      setImage(imageUrl!);
      setIsImageLoading(false);
      setIsAiGenerated(isAI);
      toast({
        title: "Thumbnail generated successfully",
      })
    }
    catch (error) {
      console.log(error)
      toast({ title: 'Error generating thumbnail', variant: 'destructive' })
      setIsImageLoading(false);
    }
  }

  //Custom Thumbnail
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    try {
      setIsImageLoading(true);
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      // If the file is very large, directly creating a Blob from it 
      // might consume more memory than using arrayBuffer().
      const blob = await file.arrayBuffer()
        .then((ab) => new Blob([ab]));

      handleImage(blob, file.name, false);
    } catch (error) {
      console.log(error)
      toast({ title: 'Error uploading image', variant: 'destructive' })
    }
  }

  //AI Thumbnail
  const generateImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      setIsImageLoading(true);
      const imageUrl = await handleGenerateThumbnail({ prompt: imagePrompt });
      
      if (!imageUrl) {
        throw new Error("No image URL received");
      }

      const imgResponse = await fetch(imageUrl);
      if (!imgResponse.ok) {
        throw new Error(`Failed to fetch image: ${imgResponse.status}`);
      }

      const blob = await imgResponse.blob();
      await handleImage(blob, `thumbnail-${uuidv4()}`, true);

    } catch (error) {
      console.error("Error generating thumbnail:", error);
      toast({ 
        title: 'Error generating thumbnail', 
        description: error instanceof Error ? error.message : 'Failed to generate thumbnail',
        variant: 'destructive' 
      });
      setIsImageLoading(false);
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

  return (
    <>
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
        <div className="flex flex-col gap-5 animate-in fade-in-50 duration-200">
          <div className="mt-5 flex flex-col gap-2.5">
            <Label className="text-16 font-bold text-white-1">
              AI Prompt to generate Thumbnail
            </Label>
            <Textarea
              className="input-class font-light focus-visible:ring-offset-orange-1 min-h-[120px] 
                bg-black-1/50 hover:bg-black-1/70 transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Describe how you want your thumbnail to look..."
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              disabled={isImageLoading}
            />
          </div>
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
      ) : (
        <div 
          onClick={() => !isImageLoading && imageRef?.current?.click()}
          className={cn(
            "image_div hover:border-orange-1/50 hover:bg-black-1/30",
            "transition-all duration-200 group animate-in fade-in-50",
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
          
          {!isImageLoading ? (
            <div className="p-3 rounded-full bg-orange-1/10 group-hover:bg-orange-1/20 
              transition-colors duration-200">
              <Image
                src="/icons/upload-image.svg"
                alt="upload"
                width={40}
                height={40}
                className="size-6"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
          ) : (
            <div className="text-16 flex-center font-medium text-white-1 gap-2">
              <Loader size={20} className="animate-spin text-orange-1" />
              <span>Uploading...</span>
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <h2 className={cn(
              "text-12 font-bold text-orange-1 group-hover:text-orange-400",
              "transition-colors duration-200",
              isImageLoading && "group-hover:text-orange-1"
            )}>
              Click to upload
            </h2>
            <p className="text-12 font-normal text-gray-1">
              SVG, PNG, JPG, or GIF (max. 1080x1080px)
            </p>
          </div>
        </div>
      )}

      {image && (
        <div className="flex-center w-full group animate-in fade-in-50 duration-200 mt-6">
          {/* Title and dimensions outside the image */}
          <div className="w-full max-w-md space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-bold text-sm bg-gradient-to-r from-orange-1 to-orange-400 
                bg-clip-text text-transparent">
                Podcast Thumbnail
              </h3>
              <span className="text-[10px] font-medium text-gray-400">
                1080 × 1080px
              </span>
            </div>

            {/* Image container */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black-1/20
              ring-1 ring-white/10 shadow-2xl">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black-1/10 overflow-hidden">
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-white/5 to-black/0 
                    animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                  
                  {/* Skeleton content layout */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    {/* Animated logo placeholder */}
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-orange-1/20 to-orange-1/10 
                      animate-pulse overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                        animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                    </div>

                    {/* Loading text */}
                    <div className="space-y-2 text-center">
                      <div className="h-4 w-32 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full 
                        animate-pulse" />
                      <div className="h-3 w-24 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full 
                        animate-pulse mx-auto" />
                    </div>

                    {/* Progress bar */}
                    <div className="absolute bottom-8 w-2/3 max-w-[200px]">
                      <div className="h-1 w-full bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-gradient-to-r from-orange-1 to-orange-400 
                          animate-progress rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Corner decorations */}
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-1/10 to-transparent 
                    animate-pulse" />
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-orange-1/10 to-transparent 
                    animate-pulse" />
                </div>
              )}
              
              {/* Premium image effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/10" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.7))] opacity-60" />
              
              {/* Hover effects */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              <Image
                src={image}
                width={500}
                height={300}
                className={cn(
                  "w-full h-full object-cover transition-all duration-500",
                  "group-hover:scale-105",
                  imageLoading ? "opacity-0" : "opacity-100"
                )}
                alt="thumbnail"
                onLoadingComplete={() => setImageLoading(false)}
                priority
              />

              {/* Badge overlay */}
              <div className="absolute top-3 left-3 z-10">
                {isAiGenerated ? (
                  <span className="text-xs px-3 py-1.5 bg-gradient-to-r from-orange-1 to-orange-400 
                    backdrop-blur-md rounded-full border border-orange-1/50 
                    text-white font-semibold shadow-lg
                    animate-in fade-in-50 duration-300">
                    AI Generated
                  </span>
                ) : (
                  <span className="text-xs px-3 py-1.5 bg-gradient-to-r from-blue-400 to-blue-500 
                    backdrop-blur-md rounded-full border border-blue-400/50 
                    text-white font-semibold shadow-lg
                    animate-in fade-in-50 duration-300">
                    Custom Upload
                  </span>
                )}
              </div>

              {/* Delete button */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 
                transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-10">
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 
                    hover:from-red-600 hover:to-red-700
                    backdrop-blur-lg border border-red-400/30 shadow-lg
                    transition-all duration-200 hover:scale-105"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Premium corner effects */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-50" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-1/10 via-transparent to-transparent" />
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-orange-1/10 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default GenerateThumbnail