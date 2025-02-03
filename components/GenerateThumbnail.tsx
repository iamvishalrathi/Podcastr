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
  const [uploadProgress, setUploadProgress] = useState(0);

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

  // Loading UI component
  const LoadingUI = ({ type }: { type: 'uploading' | 'generating' }) => (
    <div className="absolute inset-0 flex items-center justify-center 
      bg-gradient-to-br from-black/90 to-black/70 overflow-hidden">
      {/* Skeleton image background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black-1/50 to-black-1/30 animate-pulse" />
      
      {/* Animated lines */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-orange-1/50 to-transparent 
          animate-[moveDown_2s_linear_infinite]" />
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-orange-1/50 to-transparent 
          animate-[moveUp_2s_linear_infinite]" />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center gap-6 z-10">
        {/* Icon */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-1/20 to-orange-1/10 
            animate-pulse flex items-center justify-center">
            <Image
              src={type === 'uploading' ? "/icons/upload-image.svg" : "/icons/ai-generate.svg"}
              alt={type}
              width={24}
              height={24}
              className="opacity-60"
            />
            <div className="absolute -inset-1 border border-orange-1/20 rounded-full animate-spin duration-3000" />
          </div>
          <div className="absolute -inset-2 bg-orange-1/10 rounded-full blur-lg animate-pulse" />
        </div>

        {/* Status text */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-1/80 animate-[bounce_1s_ease-in-out_infinite]" />
            <div className="w-1.5 h-1.5 rounded-full bg-orange-1/80 animate-[bounce_1s_ease-in-out_0.2s_infinite]" />
            <div className="w-1.5 h-1.5 rounded-full bg-orange-1/80 animate-[bounce_1s_ease-in-out_0.4s_infinite]" />
          </div>
          <span className="text-sm font-medium text-white/90">
            {type === 'uploading' ? 'Uploading Image...' : 'Generating Image...'}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-48 bg-black/40 rounded-full h-1.5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-1 to-orange-400 rounded-full transition-all duration-300"
            style={{ 
              width: `${uploadProgress}%`,
              transition: 'width 0.3s ease-in-out'
            }}
          />
        </div>
        <span className="text-xs text-white/60 font-medium">{uploadProgress}%</span>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),
        linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]
        bg-[size:20px_20px] opacity-30" />
    </div>
  );

  // Update upload function
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      setIsImageLoading(true);
      setUploadProgress(0);
      
      const files = e.target.files;
      if (!files) return;
      
      const file = files[0];
      const totalSize = file.size;
      let loadedSize = 0;

      const blob = await new Promise<Blob>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          loadedSize = e.loaded || 0;
          setUploadProgress(Math.round((loadedSize / totalSize) * 100));
          resolve(new Blob([e.target?.result as ArrayBuffer]));
        };
        reader.onprogress = (e) => {
          if (e.lengthComputable) {
            setUploadProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
        reader.readAsArrayBuffer(file);
      });

      await handleImage(blob, file.name, false);
      setUploadProgress(100);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error uploading image', variant: 'destructive' });
    }
  };

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

            {/* Progress Skeleton */}
            {isImageLoading && (
              <div className="w-full max-w-[300px] rounded-xl overflow-hidden bg-black-1/20 p-4
                ring-1 ring-white/5 animate-in fade-in-50">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-1/20 to-orange-1/10 
                      animate-pulse flex items-center justify-center">
                      <Image
                        src="/icons/ai-generate.svg"
                        alt="processing"
                        width={20}
                        height={20}
                        className="opacity-60"
                      />
                    </div>
                    <svg className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] rotate-90">
                      <circle
                        className="text-orange-1/20"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="transparent"
                        r="22"
                        cx="26"
                        cy="26"
                      />
                      <circle
                        className="text-orange-1"
                        strokeWidth="2"
                        strokeDasharray={138.2}
                        strokeDashoffset={138.2 - (uploadProgress / 100) * 138.2}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="22"
                        cx="26"
                        cy="26"
                      />
                    </svg>
                  </div>

                  <div className="space-y-1 text-center">
                    <p className="text-xs font-medium text-white/90">
                      Generating Image...
                    </p>
                    <p className="text-[10px] font-medium text-white/60">
                      {uploadProgress}%
                    </p>
                  </div>

                  <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-1 to-orange-400 rounded-full 
                        transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
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
          
          {isImageLoading && (
            <LoadingUI type="uploading" />
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
                  {isAiGenerated ? 'AI' : 'Custom'}
                </span>
              </div>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-black-1/20
              ring-2 ring-white/5 shadow-[0_0_30px_-15px_rgba(0,0,0,0.8)]
              backdrop-blur-sm group/image">
              {isImageLoading ? (
                <div className="absolute inset-0 bg-black-1/60 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-black-1/50 to-black-1/30">
                    <div className="h-full w-full animate-pulse bg-gradient-to-r from-black-1/10 via-black-1/5 to-black-1/10 
                      bg-[length:200%_100%]" style={{ animation: 'shimmer 2s infinite' }} />
                  </div>

                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-1/20 to-orange-1/10 
                        animate-pulse flex items-center justify-center">
                        <Image
                          src={isAiThumbnail ? "/icons/ai-generate.svg" : "/icons/upload-image.svg"}
                          alt="processing"
                          width={24}
                          height={24}
                          className="opacity-60"
                        />
                      </div>
                      <svg className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] rotate-90">
                        <circle
                          className="text-orange-1/20"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="transparent"
                          r="30"
                          cx="34"
                          cy="34"
                        />
                        <circle
                          className="text-orange-1"
                          strokeWidth="2"
                          strokeDasharray={188.5}
                          strokeDashoffset={188.5 - (uploadProgress / 100) * 188.5}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="30"
                          cx="34"
                          cy="34"
                        />
                      </svg>
                    </div>

                    <div className="space-y-2 text-center">
                      <p className="text-sm font-medium text-white/90">
                        {isAiThumbnail ? 'Generating Image...' : 'Uploading Image...'}
                      </p>
                      <p className="text-xs font-medium text-white/60">
                        {uploadProgress}%
                      </p>
                    </div>

                    <div className="w-48 h-1 bg-black/40 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-1 to-orange-400 rounded-full 
                          transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/10" />
                  <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-orange-1/5 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-1/5 via-transparent to-transparent" />
                  </div>

                  <Image
                    src={image}
                    width={500}
                    height={300}
                    className={cn(
                      "w-full h-full object-cover transition-all duration-700",
                      "group-hover/image:scale-105",
                      "group-hover/image:rotate-1"
                    )}
                    alt="thumbnail"
                    priority
                  />

                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.8)_0%,transparent_50%,rgba(0,0,0,0.2)_100%)]
                    opacity-0 group-hover/image:opacity-100 transition-all duration-500" />

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
                    bg-[size:20px_20px] opacity-40" />
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isImageLoading && (
        <LoadingUI type="generating" />
      )}
    </>
  )
}

export default GenerateThumbnail