import Image from 'next/image';
import { Button } from './ui/button';
import { Download, Expand, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ImagePreviewProps {
  image: string;
  isImageLoading: boolean;
  progress: number;
  isAiThumbnail: boolean;
  isAiGenerated: boolean;
  setIsPreviewOpen: (open: boolean) => void;
  handleDownload: (e: React.MouseEvent) => Promise<void>;
  handleDelete: (e: React.MouseEvent) => Promise<void>;
}

export const LoadingSkeleton = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Background with shimmer effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-black-1/20 to-black-1/10">
      <div className="h-full w-full animate-[shimmer_2s_infinite] bg-[length:200%_100%]
        bg-gradient-to-r from-transparent via-orange-1/5 to-transparent" />
    </div>

    {/* Placeholder content */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-32 h-32 rounded-lg bg-orange-1/5 animate-pulse">
        <div className="h-full w-full flex items-center justify-center">
          <svg 
            className="w-16 h-16 text-orange-1/20" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    </div>

    {/* Grid overlay */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),
      linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)]
      bg-[size:20px_20px] opacity-10" />
  </div>
);

const ImagePreview = ({
  image,
  isImageLoading,
  progress,
  isAiThumbnail,
  isAiGenerated,
  setIsPreviewOpen,
  handleDownload,
  handleDelete,
}: ImagePreviewProps) => {
  // Add a loading state for image preview
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);

  // Reset loading state whenever image changes
  useEffect(() => {
    setIsPreviewLoading(true);
  }, [image]);

  return (
    <div className="flex-center w-full group animate-in fade-in-50 duration-300 mt-8">
      <div className="w-full max-w-md space-y-4">
        {/* Header */}
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

        {/* Preview Container */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black-1/20
          ring-2 ring-white/5 shadow-[0_0_30px_-15px_rgba(0,0,0,0.8)]
          backdrop-blur-sm group/image">
          {isImageLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black-1/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-orange-1/30">
                    <div 
                      className="absolute top-0 left-0 w-16 h-16 rounded-full border-2 border-orange-1 border-t-transparent 
                      animate-[spin_1.5s_linear_infinite]"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-base font-medium text-orange-1">{progress}%</span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-sm font-semibold text-white">
                    {isAiThumbnail ? 'Generating Thumbnail...' : 'Uploading Image...'}
                  </p>
                  <span className="text-xs text-orange-1/80">Please wait a moment</span>
                </div>
              </div>
            </div>
          ) : image ? (
            <>
              {isPreviewLoading && <LoadingSkeleton />}
              <Image
                src={image}
                alt="Podcast thumbnail"
                fill
                className="object-cover rounded-xl transition-all duration-300"
                onLoadingComplete={() => setIsPreviewLoading(false)}
                unoptimized={image.endsWith('.gif')}
              />

              {/* Only show overlay when preview is loaded */}
              {!isPreviewLoading && (
                <>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent 
                    opacity-0 group-hover/image:opacity-100 transition-all duration-300
                    group-hover/image:rotate-1 transform-gpu"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Move buttons to top right */}
                    <div className="absolute top-3 right-3 flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-9 w-9 rounded-full 
                          bg-white/10 hover:bg-white/20
                          backdrop-blur-lg border border-white/10 
                          transition-all duration-300 hover:scale-110"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsPreviewOpen(true);
                        }}
                      >
                        <Expand className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-9 w-9 rounded-full 
                          bg-white/10 hover:bg-white/20
                          backdrop-blur-lg border border-white/10 
                          transition-all duration-300 hover:scale-110"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDownload(e);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-9 w-9 rounded-full 
                          bg-red-500/80 hover:bg-red-500
                          backdrop-blur-lg border border-red-400/30 
                          transition-all duration-300 hover:scale-110"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(e);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    {isAiGenerated ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 
                        bg-gradient-to-r from-orange-1 to-orange-400 
                        backdrop-blur-md rounded-full border border-orange-1/50 
                        shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span className="text-xs font-semibold text-white">AI Generated</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1.5
                        bg-gradient-to-r from-blue-400 to-blue-500
                        backdrop-blur-md rounded-full border border-blue-400/50
                        shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span className="text-xs font-semibold text-white">Custom Upload</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <LoadingSkeleton />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePreview; 