import { GeneratePodcastProps } from '@/types'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Loader, Mic, Play, Square, Trash2 } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { v4 as uuidv4 } from 'uuid';
import { useUploadFiles } from '@xixixao/uploadstuff/react';
import { useToast } from "@/components/ui/use-toast"
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';
import { Id } from 'convex/react';

const MAX_CHARACTERS = 2500;
const CHARACTERS_PER_CREDIT = 150;
const FADE_IN_ANIMATION = "animate-in fade-in duration-500";
const SLIDE_IN_ANIMATION = "animate-in slide-in-from-bottom-4 duration-500";

const useGeneratePodcast = ({
  setAudio, voiceType, voicePrompt, setAudioStorageId, audioStorageId
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [estimatedCredits, setEstimatedCredits] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { toast } = useToast()
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const deleteFile = useMutation(api.files.deleteFile);

  const { startUpload, isUploading } = useUploadFiles(generateUploadUrl, {
    onUploadComplete: async (uploadedFiles) => {
      console.log("Upload completed:", uploadedFiles);
      setUploadError(null);
      setProgress(80);
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
      setUploadError(error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const getAudioUrl = useMutation(api.podcasts.getUrl);

  // Update character count when prompt changes
  useEffect(() => {
    setCharacterCount(voicePrompt.length);
    setEstimatedCredits(Math.ceil(voicePrompt.length / CHARACTERS_PER_CREDIT));
  }, [voicePrompt]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Add handler for audio ending
  const handleAudioEnded = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('ended', handleAudioEnded);
      return () => {
        audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current?.removeEventListener('ended', handleAudioEnded);
      };
    }
  }, []);

  const togglePlayPause = (e: React.MouseEvent) => {
    // Stop event from bubbling up to the form
    e.preventDefault();
    e.stopPropagation();
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    if (!isFinite(time) || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const generatePodcast = async () => {
    try {
      setIsGenerating(true);
      setAudio('');
      setUploadError(null);
      setProgress(20);

      if (!voicePrompt || !voiceType) {
        throw new Error(!voicePrompt ? "Please provide a Voice Prompt" : "Please provide a Voice Type");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/elevenlabs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: voicePrompt,
          voice: voiceType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      setProgress(60);
      const blob = await response.blob();
      const fileName = `podcast-${uuidv4()}.mp3`;
      const file = new File([blob], fileName, { type: 'audio/mpeg' });

      console.log('Starting file upload...');
      const uploadResult = await startUpload([file]);
      console.log('Upload result:', uploadResult);

      if (!uploadResult?.[0]?.response?.storageId) {
        throw new Error('No storage ID received');
      }

      const storageId = uploadResult[0].response.storageId;
      setAudioStorageId(storageId);
      console.log('Getting audio URL for storageId:', storageId);

      const audioUrl = await getAudioUrl({ storageId });
      if (!audioUrl) {
        throw new Error('Failed to get audio URL');
      }

      setAudio(audioUrl);
      setProgress(100);
      toast({
        title: "Podcast generated successfully",
      });

    } catch (error) {
      console.error('Error generating podcast:', error);
      toast({
        title: 'Error creating podcast',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const handleDelete = async () => {
    try {
      if (audioStorageId) {
        await deleteFile({ storageId: audioStorageId });
      }
      setAudio("");
      setAudioStorageId(null);
      toast({
        title: "Audio deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting audio:', error);
      toast({
        title: 'Error deleting audio',
        description: error instanceof Error ? error.message : 'Failed to delete audio',
        variant: 'destructive',
      });
    }
  };

  return {
    isGenerating,
    generatePodcast,
    isUploading,
    progress,
    characterCount,
    estimatedCredits,
    audioRef,
    isPlaying,
    togglePlayPause,
    currentTime,
    duration,
    formatTime,
    handleAudioEnded,
    handleDelete,
  }
}

const GeneratePodcast = (props: GeneratePodcastProps) => {
  const {
    isGenerating,
    generatePodcast,
    isUploading,
    progress,
    characterCount,
    estimatedCredits,
    audioRef,
    isPlaying,
    togglePlayPause,
    currentTime,
    duration,
    formatTime,
    handleAudioEnded,
    handleDelete,
  } = useGeneratePodcast(props);

  // Add client-side only rendering for the audio player
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={`flex flex-col gap-6 pt-10 ${FADE_IN_ANIMATION}`}>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <Label className="text-lg font-bold text-white-1 tracking-tight">Script</Label>
          <div className="text-sm text-gray-1 bg-black-1/50 px-3 py-1.5 rounded-full flex gap-3">
            <span className={characterCount > MAX_CHARACTERS ? "text-red-500 font-medium" : ""}>
              {characterCount}/{MAX_CHARACTERS}
            </span>
            <span className="opacity-50">|</span>
            <span className={estimatedCredits > 50 ? "text-orange-1 font-medium" : ""}>
              {estimatedCredits} credits
            </span>
          </div>
        </div>
        <Textarea
          placeholder="Write or generate script for your podcast..."
          className="input-class focus-visible:ring-offset-orange-1 min-h-[200px] text-base leading-relaxed
            transition-all duration-200 resize-y bg-black-1/50 hover:bg-black-1/70"
          value={props.voicePrompt}
          onChange={(e) => {
            const text = e.target.value;
            if (text.length <= MAX_CHARACTERS) {
              props.setVoicePrompt(text);
            } else {
              toast({
                title: "Character limit exceeded",
                description: `Maximum ${MAX_CHARACTERS} characters allowed`,
                variant: "destructive",
              });
            }
          }}
        />
      </div>

      <div className={`flex flex-col gap-4 ${SLIDE_IN_ANIMATION}`}>
        <div className="flex items-center justify-between">
          <Label className="text-lg font-bold text-white-1 tracking-tight">
            Audio Preview
          </Label>
          {props.audio && (
            <Button
              onClick={handleDelete}
              variant="destructive"
              size="sm"
              className="gap-2 hover:scale-105 transition-all duration-200 bg-red-500/90 hover:bg-red-500"
            >
              <Trash2 size={16} className="text-white" />
              <span className="text-white">Delete Audio</span>
            </Button>
          )}
        </div>

        {isGenerating && !props.audio && (
          <div className={`flex flex-col gap-3 bg-black-1/50 p-5 rounded-xl ${FADE_IN_ANIMATION}`}>
            <Progress
              value={progress}
              className="h-2.5 bg-black-1/50"
            />
            <div className="flex items-center gap-2 text-sm text-gray-1">
              <Loader size={14} className="animate-spin" />
              <p>Generating audio... {progress}%</p>
            </div>
          </div>
        )}

        {props.audio && isMounted && (
          <div className={`flex flex-col gap-4 bg-black-1/80 p-5 rounded-xl backdrop-blur-sm ${FADE_IN_ANIMATION}`}>
            <div className="flex items-center gap-4">
              <Button
                onClick={(e) => togglePlayPause(e)}
                size="icon"
                variant="ghost"
                className={cn(
                  "h-12 w-12 rounded-full bg-orange-1 hover:bg-orange-2 hover:scale-105 transition-all duration-300 shadow-lg",
                  isPlaying && "animate-pulse ring-2 ring-orange-1/50 ring-offset-2 ring-offset-black"
                )}
              >
                {isPlaying ? <Square size={20} /> : <Play size={20} className="ml-1" />}
              </Button>
              <div className="flex-1 space-y-2">
                <Progress
                  value={(currentTime / duration) * 100}
                  className="h-1.5 bg-black-1/50"
                />
                {isMounted && (
                  <div className="flex justify-between text-sm text-gray-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                )}
              </div>
            </div>
            <audio
              ref={audioRef}
              src={props.audio}
              className="hidden"
              onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
              onEnded={handleAudioEnded}
            />
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Button
            onClick={generatePodcast}
            disabled={
              isGenerating ||
              !props.voiceType ||
              !props.voicePrompt ||
              props.voicePrompt.length > MAX_CHARACTERS ||
              estimatedCredits > 50
            }
            className={cn(
              "bg-orange-1 text-white-1 hover:bg-orange-2 gap-2 py-6 text-lg font-medium",
              "transition-all duration-200 hover:scale-[1.02] shadow-xl",
              "disabled:opacity-50 disabled:hover:scale-100"
            )}
          >
            {isGenerating ? (
              <>
                Generating Audio
                <Loader size={18} className="animate-spin" />
              </>
            ) : (
              <>
                Generate Audio
                <Mic size={18} className="animate-bounce" />
              </>
            )}
          </Button>

          {estimatedCredits > 50 && (
            <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-pulse">
              Text is too long and would require too many credits. Please reduce the length.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default GeneratePodcast