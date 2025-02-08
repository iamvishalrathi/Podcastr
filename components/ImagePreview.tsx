import Image from 'next/image';
import { Button } from './ui/button';
import { Download, Expand, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { PreviewLoading } from './ui/preview-loading';
import { ActionButton } from "@/components/ui/action-button";

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
      ].map((button) => (
        <ActionButton
          key={button.label}
          icon={button.icon}
          onClick={button.onClick}
          label={button.label}
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
              {isPreviewLoading && <PreviewLoading />}
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
            <PreviewLoading />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePreview; 