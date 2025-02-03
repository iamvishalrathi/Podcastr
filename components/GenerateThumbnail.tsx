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

const GenerateThumbnail = ({ setImage, setImageStorageId, image, imagePrompt, setImagePrompt }: GenerateThumbnailProps) => {
  const [isAiThumbnail, setIsAiThumbnail] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null); //To store Img ref
  const { toast } = useToast();
  const handleGenerateThumbnail = useAction(api.freepik.generateThumbnailAction)

  //To upload Image & fetch uploaded url
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl)
  const getImageUrl = useMutation(api.podcasts.getUrl);

  //Image Handler Func
  const handleImage = async (blob: Blob, fileName: string) => {
    setImage('');

    try {
      const file = new File([blob], fileName, { type: 'image/png' });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setImageStorageId(storageId);

      const imageUrl = await getImageUrl({ storageId });
      setImage(imageUrl!);
      setIsImageLoading(false);
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

      handleImage(blob, file.name);
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
      const response = await handleGenerateThumbnail({ prompt: imagePrompt });

      const imgResponse = await fetch(response);
      const blob = await imgResponse.blob();
      // const blob = new Blob([response], { type: 'image/png' });

      handleImage(blob, `thumbnail-${uuidv4()}`);

      // setImage(`data:image/png;base64,${ response }`);
    } catch (error) {
      console.log(error)
      toast({ title: 'Error generating thumbnail', variant: 'destructive' })
    }
  }

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
                bg-black-1/50 hover:bg-black-1/70 transition-colors duration-200"
              placeholder="Describe how you want your thumbnail to look..."
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
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
          onClick={() => imageRef?.current?.click()}
          className="image_div hover:border-orange-1/50 hover:bg-black-1/30 
            transition-all duration-200 group animate-in fade-in-50"
        >
          <Input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={(e) => uploadImage(e)}
            accept="image/*"
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
            <h2 className="text-12 font-bold text-orange-1 group-hover:text-orange-400 
              transition-colors duration-200">
              Click to upload
            </h2>
            <p className="text-12 font-normal text-gray-1">
              SVG, PNG, JPG, or GIF (max. 1080x1080px)
            </p>
          </div>
        </div>
      )}

      {image && (
        <div className="flex-center w-full group animate-in fade-in-50 duration-200">
          <div className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent 
              opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <Image
              src={image}
              width={300}
              height={300}
              className="mt-5 rounded-xl shadow-lg transition-transform duration-200 
                group-hover:scale-[1.02]"
              alt="thumbnail"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default GenerateThumbnail