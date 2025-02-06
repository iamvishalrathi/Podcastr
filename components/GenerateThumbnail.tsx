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
import { Trash2 } from 'lucide-react';
import { Id } from '@/convex/_generated/dataModel';
import { Progress } from './ui/progress';

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

  // Update upload function
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      setIsImageLoading(true);
      setProgress(20);
      const files = e.target.files;
      if (!files) return;

      const file = files[0];
      setProgress(40);
      const blob = await file.arrayBuffer()
        .then((ab) => new Blob([ab]));
      
      setProgress(60);
      await handleImage(blob, file.name, false);
      setProgress(100);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error uploading image', variant: 'destructive' });
      setIsImageLoading(false);
    } finally {
      setProgress(0);
    }
  };

  //AI Thumbnail
  const generateImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
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
        <div className="flex-center w-full group animate-in fade-in-50 duration-300 mt-8">
          <div className="w-full max-w-md space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
                <div className="space-y-1">
                  <h3 className="font-bold text-sm bg-gradient-to-r from-orange-1 to-orange-400 
                    bg-clip-text text-transparent">
                    Podcast Thumbnail
                  </h3>
                  <p className="text-[10px] font-medium text-gray-400">
                    High quality • 1080 × 1080px
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-md bg-black-1/40 border border-white/5 
                  text-[10px] font-medium text-gray-400">
                  {isAiThumbnail ? 'AI' : 'Custom'}
                </span>
              </div>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-black-1/20
              ring-2 ring-white/5 shadow-[0_0_30px_-15px_rgba(0,0,0,0.8)]
              backdrop-blur-sm group/image
              before:absolute before:inset-0 before:bg-gradient-to-br before:from-orange-1/5 before:to-transparent before:opacity-0
              before:group-hover/image:opacity-100 before:transition-all before:duration-500">
              {isImageLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black-1/60 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-orange-1/20">
                        <div 
                          className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-orange-1 border-t-transparent 
                          animate-[spin_1.5s_linear_infinite]"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-semibold text-orange-1">{progress}%</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-white/90">
                      {isAiThumbnail ? 'Generating Thumbnail...' : 'Uploading Image...'}
                    </p>
                  </div>
                </div>
              ) : image ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/10 
                    transition-opacity duration-500 group-hover/image:opacity-0" 
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-1/20 via-transparent to-orange-1/20
                    animate-[gradient_3s_ease_infinite] opacity-0 group-hover/image:opacity-100 transition-opacity duration-500" 
                  />
                  
                  <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-orange-1/10 via-transparent to-transparent
                      group-hover/image:scale-150 transition-transform duration-700" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-1/10 via-transparent to-transparent
                      group-hover/image:scale-150 transition-transform duration-700" />
                  </div>

                  <Image
                    src={image}
                    width={500}
                    height={300}
                    className={cn(
                      "w-full h-full object-cover transition-all duration-700",
                      "group-hover/image:scale-110",
                      "group-hover/image:rotate-2",
                      "filter group-hover/image:brightness-110"
                    )}
                    alt="thumbnail"
                    priority
                  />

                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.8)_0%,transparent_50%,rgba(0,0,0,0.2)_100%)]
                    opacity-0 group-hover/image:opacity-100 transition-all duration-500
                    scale-110 group-hover/image:scale-100" />

                  <div className="absolute top-3 left-3 z-10">
                    {isAiGenerated ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 
                        bg-gradient-to-r from-orange-1 to-orange-400 
                        backdrop-blur-md rounded-full border border-orange-1/50 
                        shadow-[0_2px_10px_rgba(0,0,0,0.3)]
                        animate-in fade-in-50 duration-300">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span className="text-xs font-semibold text-white">AI Generated</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1.5
                        bg-gradient-to-r from-blue-400 to-blue-500
                        backdrop-blur-md rounded-full border border-blue-400/50
                        shadow-[0_2px_10px_rgba(0,0,0,0.3)]
                        animate-in fade-in-50 duration-300">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span className="text-xs font-semibold text-white">Custom Upload</span>
                      </div>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 z-10 
                    opacity-0 group-hover/image:opacity-100 
                    translate-y-2 group-hover/image:translate-y-0
                    transition-all duration-300">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-full 
                        bg-gradient-to-br from-red-500 to-red-600 
                        hover:from-red-600 hover:to-red-700
                        backdrop-blur-lg border border-red-400/30 
                        shadow-[0_4px_10px_rgba(0,0,0,0.5)]
                        transition-all duration-300 hover:scale-110"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),
                    linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)]
                    bg-[size:20px_20px] opacity-0 group-hover/image:opacity-40
                    transition-opacity duration-500
                    scale-95 group-hover/image:scale-100" />
                </>
              ) : (
                <div className="absolute inset-0 overflow-hidden bg-black-1/20">
                  {/* Skeletal loading animation */}
                  <div className="h-full w-full flex flex-col">
                    {/* Header skeleton */}
                    <div className="h-1/4 bg-gradient-to-r from-black-1/10 via-orange-1/5 to-black-1/10 
                      animate-[shimmer_2s_infinite] bg-[length:200%_100%]">
                      <div className="h-full flex items-end p-4">
                        <div className="w-1/3 h-4 bg-orange-1/10 rounded-full" />
                      </div>
                    </div>

                    {/* Content skeleton */}
                    <div className="flex-1 flex items-center justify-center">
                      <div className="space-y-4 w-2/3">
                        {/* Image placeholder */}
                        <div className="w-32 h-32 mx-auto rounded-lg bg-orange-1/10 animate-pulse">
                          <div className="h-full flex items-center justify-center">
                            <svg 
                              className="w-16 h-16 text-orange-1/20" 
                              fill="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        </div>

                        {/* Text lines skeleton */}
                        <div className="space-y-2">
                          <div className="h-2 bg-orange-1/10 rounded-full w-3/4 mx-auto" />
                          <div className="h-2 bg-orange-1/10 rounded-full w-1/2 mx-auto" />
                        </div>
                      </div>
                    </div>

                    {/* Footer skeleton */}
                    <div className="h-1/4 bg-gradient-to-r from-black-1/10 via-orange-1/5 to-black-1/10 
                      animate-[shimmer_2s_infinite] bg-[length:200%_100%] opacity-50" />
                  </div>

                  {/* Grid overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),
                    linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)]
                    bg-[size:20px_20px] opacity-10" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GenerateThumbnail