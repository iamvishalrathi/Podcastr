import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { Loader, Mic, Play, Square, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface GeneratePodcastProps {
  setAudioStorageId: (id: Id<"_storage">) => void;
  setAudio: (url: string) => void;
  voiceType: string;
  audio: string;
  voicePrompt: string;
  setVoicePrompt: (prompt: string) => void;
  setAudioDuration: (duration: number) => void;
}

const MAX_CHARACTERS = 2500;
const CHARACTERS_PER_CREDIT = 150; // Approximate characters per credit in ElevenLabs

const GeneratePodcast = ({
  setAudioStorageId,
  setAudio,
  voiceType,
  audio,
  voicePrompt,
  setVoicePrompt,
  setAudioDuration,
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [estimatedCredits, setEstimatedCredits] = useState(0);

  const generateAudio = useAction(api.elevenlabs.generateAudio);

  const handleGenerate = async () => {
    try {
      if (!voiceType) {
        toast({
          title: "Please select a voice type",
          variant: "destructive",
        });
        return;
      }
      if (!voicePrompt) {
        toast({
          title: "Please enter a prompt",
          variant: "destructive",
        });
        return;
      }

      setIsGenerating(true);
      setProgress(20);

      const voiceIdMap: Record<string, string> = {
        'Drew': 'pNInz6obpgDQGcFmaJgB',
        'Rachel': 'EXAVITQu4vr4xnSDxMaL',
        'Sarah': '21m00Tcm4TlvDq8ikWAM',
      };

      const voiceId = voiceIdMap[voiceType];
      if (!voiceId) {
        throw new Error("Invalid voice type selected");
      }

      const result = await generateAudio({
        prompt: voicePrompt,
        voiceId: voiceId,
      });

      if (!result?.audioUrl || !result?.storageId) {
        throw new Error("Failed to generate audio - missing response data");
      }

      setProgress(100);
      setAudio(result.audioUrl);
      setAudioStorageId(result.storageId);

      toast({
        title: "Audio generated successfully",
      });
    } catch (error) {
      console.error("Error generating audio:", error);
      toast({
        title: "Error generating audio",
        description: error instanceof Error
          ? error.message
          : "Failed to generate audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setAudioDuration(audioRef.current.duration);
    }
  };

  const togglePlayPause = () => {
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
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDelete = () => {
    setAudio("");
    setVoicePrompt("");
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => {
        audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  // Update character count when prompt changes
  useEffect(() => {
    setCharacterCount(voicePrompt.length);
    setEstimatedCredits(Math.ceil(voicePrompt.length / CHARACTERS_PER_CREDIT));
  }, [voicePrompt]);

  return (
    <div className="flex flex-col gap-4 pt-10">
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center">
          <Label className="text-16 font-bold text-white-1">Script</Label>
          <div className="text-sm text-gray-1">
            <span className={characterCount > MAX_CHARACTERS ? "text-red-500" : ""}>
              {characterCount}/{MAX_CHARACTERS} characters
            </span>
            <span className="ml-2">
              (~{estimatedCredits} credits required)
            </span>
          </div>
        </div>
        <Textarea
          placeholder="Write or generate script for your podcast"
          className="input-class focus-visible:ring-offset-orange-1 min-h-[200px]"
          value={voicePrompt}
          onChange={(e) => {
            const text = e.target.value;
            if (text.length <= MAX_CHARACTERS) {
              setVoicePrompt(text);
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

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Label className="text-16 font-bold text-white-1">
            Audio Preview
          </Label>
          {audio && (
            <Button
              onClick={handleDelete}
              variant="destructive"
              size="sm"
              className="gap-2"
            >
              <Trash2 size={16} />
              Delete Audio
            </Button>
          )}
        </div>

        {isGenerating && (
          <div className="flex flex-col gap-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-1">Generating audio...</p>
          </div>
        )}

        {audio && (
          <div className="flex flex-col gap-3 bg-black-1 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <Button
                onClick={togglePlayPause}
                size="icon"
                variant="ghost"
                className={cn(
                  "h-10 w-10 rounded-full bg-orange-1 hover:bg-orange-2 hover:scale-105 transition-all",
                  isPlaying && "animate-pulse"
                )}
              >
                {isPlaying ? <Square size={20} /> : <Play size={20} />}
              </Button>
              <div className="flex-1">
                <Progress
                  value={(currentTime / duration) * 100}
                  className="h-1.5"
                />
              </div>
              <span className="text-sm text-gray-1 min-w-[4ch]">
                {formatTime(currentTime)}/{formatTime(duration)}
              </span>
            </div>
            <audio
              ref={audioRef}
              src={audio}
              className="hidden"
            />
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={
            isGenerating ||
            !voiceType ||
            !voicePrompt ||
            voicePrompt.length > MAX_CHARACTERS ||
            estimatedCredits > 50 // Add a reasonable credit limit
          }
          className="bg-orange-1 text-white-1 hover:bg-orange-2 gap-2"
        >
          {isGenerating ? (
            <>
              Generating
              <Loader size={16} className="animate-spin" />
            </>
          ) : (
            <>
              Generate Audio
              <Mic size={16} />
            </>
          )}
        </Button>

        {estimatedCredits > 50 && (
          <p className="text-sm text-red-500 mt-1">
            Text is too long and would require too many credits. Please reduce the length.
          </p>
        )}
      </div>
    </div>
  );
};

export default GeneratePodcast;