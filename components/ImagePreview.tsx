import Image from 'next/image';
import { Button } from './ui/button';
import { Download, Expand, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Move LoadingSkeleton component directly into ImagePreview.tsx
export const LoadingSkeleton = () => (
  <div className="absolute inset-0 overflow-hidden backdrop-blur-sm">
    {/* Enhanced gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-black-1/40 to-black-1/20">
      <div className="h-full w-full animate-[shimmer_2s_infinite] bg-[length:200%_100%]
        bg-gradient-to-r from-transparent via-orange-1/10 to-transparent" />
    </div>

    {/* Premium loading animation */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-32 h-32">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-2 border-orange-1/20 animate-[spin_3s_linear_infinite]" />

        {/* Inner pulsing circle */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-orange-1/20 to-orange-400/20 
          animate-pulse backdrop-blur-xl" />

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-orange-1/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    </div>

    {/* Enhanced grid overlay */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),
      linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]
      bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]" />
  </div>
);

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


// Update the PreviewActionButton for better visibility and interaction
const PreviewActionButton = ({
  onClick,
  icon: Icon,
  className = "",
  "aria-label": ariaLabel,
}: {
  onClick: (e: React.MouseEvent) => void;
  icon: React.ElementType;
  className?: string;
  "aria-label": string;
}) => (
  <Button
    variant="secondary"
    size="icon"
    className={cn(
      "h-11 w-11 rounded-full",
      "bg-black/40 hover:bg-black/60",
      "backdrop-blur-xl border border-white/30",
      "transition-all duration-300",
      "hover:scale-110 hover:rotate-3",
      "shadow-[0_4px_16px_rgba(0,0,0,0.5)]",
      "hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)]",
      "hover:border-white/40",
      "group/button",
      className
    )}
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(e);
    }}
    aria-label={ariaLabel}
  >
    <Icon className={cn(
      "h-5 w-5 transition-transform duration-300",
      "group-hover/button:scale-110",
      className.includes("text-") ? "" : "text-white"
    )} />
  </Button>
);

// Update the PreviewControls for a more elegant overlay
const PreviewControls = ({
  setIsPreviewOpen,
  handleDownload,
  handleDelete,
}: Pick<ImagePreviewProps, "setIsPreviewOpen" | "handleDownload" | "handleDelete">) => (
  <div
    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent 
      opacity-0 group-hover/image:opacity-100 transition-all duration-500
      transform-gpu backdrop-blur-[2px]"
    onClick={(e) => e.stopPropagation()}
  >
    <div
      className="absolute top-4 right-4 flex items-center gap-3
        [&>button]:translate-y-4 group-hover/image:[&>button]:translate-y-0
        [&>button]:opacity-0 group-hover/image:[&>button]:opacity-100"
      onClick={(e) => e.stopPropagation()}
    >
      {[
        { icon: Expand, onClick: () => setIsPreviewOpen(true), label: "Full preview", delay: "delay-[0ms]" },
        { icon: Download, onClick: handleDownload, label: "Download image", delay: "delay-[50ms]" },
        { icon: Trash2, onClick: handleDelete, label: "Delete image", delay: "delay-[100ms]" },
      ].map((button, index) => (
        <PreviewActionButton
          key={button.label}
          icon={button.icon}
          onClick={button.onClick}
          aria-label={button.label}
          className={cn("transition-all duration-500", button.delay)}
        />
      ))}
    </div>
  </div>
);

// Update the TypeBadge for a more premium look
const TypeBadge = ({ isAiGenerated }: { isAiGenerated: boolean }) => (
  <div className="absolute top-4 left-4 opacity-0 group-hover/image:opacity-100 
    transition-all duration-500 translate-y-4 group-hover/image:translate-y-0">
    {isAiGenerated ? (
      <div className="flex items-center gap-2 px-4 py-2
        bg-gradient-to-r from-orange-1/80 to-orange-400/80 
        backdrop-blur-xl rounded-full border border-orange-1/50 
        shadow-[0_4px_20px_rgba(0,0,0,0.4)]
        hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]
        transition-all duration-300 hover:scale-105">
        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span className="text-sm font-medium text-white">AI Generated</span>
      </div>
    ) : (
      <div className="flex items-center gap-2 px-4 py-2
        bg-gradient-to-r from-blue-400/80 to-blue-500/80
        backdrop-blur-xl rounded-full border border-blue-400/50
        shadow-[0_4px_20px_rgba(0,0,0,0.4)]
        hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]
        transition-all duration-300 hover:scale-105">
        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span className="text-sm font-medium text-white">Custom Upload</span>
      </div>
    )}
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
              {isAiGenerated ? 'AI' : 'Custom'}
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
                  <p className="text-sm font-semibold text-[white]">
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
                alt="Preview"
                width={400}
                height={400}
                className={cn(
                  "w-full h-full object-cover rounded-xl",
                  "aspect-square min-h-[200px]",
                  isImageLoading ? "opacity-0" : "opacity-100",
                  "transition-opacity duration-300"
                )}
                onLoad={() => setIsPreviewLoading(false)}
                priority
              />

              {/* Only show overlay when preview is loaded */}
              {!isPreviewLoading && (
                <>
                  <PreviewControls
                    setIsPreviewOpen={setIsPreviewOpen}
                    handleDownload={handleDownload}
                    handleDelete={handleDelete}
                  />
                  <TypeBadge isAiGenerated={isAiGenerated} />
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