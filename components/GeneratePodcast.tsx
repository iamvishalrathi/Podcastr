import { GeneratePodcastProps } from '@/types'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { useState } from 'react';
import { Button } from './ui/button';
import { Loader } from 'lucide-react';
import { useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { v4 as uuidv4 } from 'uuid';
import { useUploadFiles } from '@xixixao/uploadstuff/react';
import { useToast } from "@/components/ui/use-toast"

const useGeneratePodcast = ({
  setAudio, voiceType, voicePrompt, setAudioStorageId
}: GeneratePodcastProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast()
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  
  const { startUpload, isUploading } = useUploadFiles(generateUploadUrl, {
    onUploadComplete: async (uploadedFiles) => {
      console.log("Upload completed:", uploadedFiles);
      setUploadError(null);
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

  const generatePodcast = async () => {
    try {
      setIsGenerating(true);
      setAudio('');
      setUploadError(null);

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
    }
  };

  return { isGenerating, generatePodcast, isUploading }
}


const GeneratePodcast = (props: GeneratePodcastProps) => {
  const { isGenerating, generatePodcast, isUploading } = useGeneratePodcast(props);
  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          Script
        </Label>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder='Provide text to generate audio'
          rows={5}
          value={props.voicePrompt}
          onChange={(e) => props.setVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
        <Button type="submit" className="text-16 bg-orange-1 py-4 font-bold text-white-1" onClick={generatePodcast}>
          {isGenerating ? (
            <>
              Generating
              <Loader size={20} className="animate-spin ml-2" />
            </>
          ) : (
            'Generate'
          )}
        </Button>
      </div>
      {props.audio && (
        <audio
          controls
          src={props.audio}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}
        />
      )}
    </div>
  )
}

export default GeneratePodcast