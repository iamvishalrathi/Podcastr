import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { useRef, useState, useEffect } from "react"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Loader } from "lucide-react"
import { Input } from "./ui/input"
import { useToast } from "./ui/use-toast"
import { useAction, useMutation } from "convex/react"
import { useUploadFiles } from "@xixixao/uploadstuff/react"
import { api } from "@/convex/_generated/api"
import { v4 as uuidv4 } from "uuid"
import type { Id } from "@/convex/_generated/dataModel"
import { Dialog } from "./ui/dialog"
import ImagePreview from "./ImagePreview"
import { ImageDialogContent } from "./ui/dialog"
import { ToggleButtonGroup } from "@/components/ui/toggle-button-group"

interface GenerateThumbnailProps {
  setImage: (url: string) => void
  setImageStorageId: (id: Id<"_storage"> | null) => void
  image: string
  imagePrompt: string
  setImagePrompt: (prompt: string) => void
  imageStorageId: Id<"_storage"> | null
  thumbnailPrompts: string[]
}

const GenerateThumbnail = ({
  setImage,
  setImageStorageId,
  image,
  imagePrompt,
  setImagePrompt,
  imageStorageId,
  thumbnailPrompts,
}: GenerateThumbnailProps) => {
  const [isAiThumbnail, setIsAiThumbnail] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const imageRef = useRef<HTMLInputElement>(null) //To store Img ref
  const { toast } = useToast()
  const handleGenerateThumbnail = useAction(api.freepik.generateThumbnailAction)
  const [isAiGenerated, setIsAiGenerated] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isFullPreviewLoading, setIsFullPreviewLoading] = useState(true)

  //To upload Image & fetch uploaded url
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const { startUpload } = useUploadFiles(generateUploadUrl)
  const getImageUrl = useMutation(api.podcasts.getUrl)
  const deleteFile = useMutation(api.files.deleteFile)

  // Reset full preview loading state when image or preview dialog changes
  useEffect(() => {
    if (isPreviewOpen) {
      setIsFullPreviewLoading(true)
    }
  }, [isPreviewOpen])

  // Helper function to delete previous image
  const deletePreviousImage = async () => {
    if (imageStorageId) {
      try {
        await deleteFile({ storageId: imageStorageId })
      } catch (error) {
        console.error("Error deleting previous image:", error)
      }
    }
  }

  //Image Handler Func
  const handleImage = async (blob: Blob, fileName: string, isAI = false) => {
    try {
      setIsImageLoading(true)
      setProgress(20)

      // Create a File from Blob
      const file = new File([blob], fileName, { type: "image/png" })

      setProgress(40)
      await deletePreviousImage()

      setProgress(60)
      const uploaded = await startUpload([file])
      if (!uploaded?.[0]?.response?.storageId) {
        throw new Error("Upload failed - no storage ID received")
      }

      const storageId = uploaded[0].response.storageId as Id<"_storage">
      setImageStorageId(storageId)

      const imageUrl = await getImageUrl({ storageId })
      setImage(imageUrl!)

      // Set the isAiGenerated state based on the parameter
      setIsAiGenerated(isAI)

      setProgress(100)

      if (isAI) {
        toast({
          title: "Thumbnail generated successfully",
        })
      } else {
        toast({
          title: "Image uploaded successfully",
        })
      }
    } catch (error) {
      console.error("Error handling image:", error)
      toast({
        title: "Error with image",
        description: error instanceof Error ? error.message : "Failed to process image",
        variant: "destructive",
      })
    } finally {
      setIsImageLoading(false)
      setProgress(0)
    }
  }

  const uploadImage = async (file: File | null) => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    await handleImage(file, file.name, false) // Explicitly set isAiGenerated to false
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      uploadImage(files[0])
    }
  }

  // Add validation helper
  const isImageRequired = () => {
    if (!image && !isImageLoading) {
      toast({
        title: "Thumbnail is required",
        description: "Please upload or generate a thumbnail image",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  // Update generate function with better error handling
  const generateImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!imagePrompt.trim()) {
      toast({
        title: "Prompt is required",
        description: "Please enter a prompt for the thumbnail",
        variant: "destructive",
      })
      return
    }

    try {
      setIsImageLoading(true)
      setProgress(20)

      const imageUrl = await handleGenerateThumbnail({ prompt: imagePrompt })
      if (!imageUrl) {
        throw new Error("No image URL received from generation")
      }

      setProgress(40)
      const imgResponse = await fetch(imageUrl)
      if (!imgResponse.ok) {
        throw new Error(`Failed to fetch generated image: ${imgResponse.status}`)
      }

      setProgress(60)
      const blob = await imgResponse.blob()
      await handleImage(blob, `thumbnail-${uuidv4()}.png`, true) // Set isAiGenerated to true
    } catch (error) {
      console.error("Error generating thumbnail:", error)
      toast({
        title: "Error generating thumbnail",
        description: error instanceof Error ? error.message : "Failed to generate thumbnail",
        variant: "destructive",
      })
    } finally {
      setIsImageLoading(false)
      setProgress(0)
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    try {
      e.stopPropagation()
      if (imageStorageId) {
        await deleteFile({ storageId: imageStorageId })
      }
      setImage("")
      setImageStorageId(null)
      setIsAiGenerated(false) // Reset the AI generated state
      toast({
        title: "Thumbnail deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting thumbnail:", error)
      toast({
        title: "Error deleting thumbnail",
        description: error instanceof Error ? error.message : "Failed to delete thumbnail",
        variant: "destructive",
      })
    }
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const response = await fetch(image)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `podcast-thumbnail-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Image downloaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error downloading image",
        description: "Failed to download image",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 w-full max-w-[800px] mx-auto px-4 sm:px-6">
      <ToggleButtonGroup containerWidth="max-w-[580px]"
        button1text="Use AI to generate thumbnail" button2text="Upload custom thumbnail"
        button1Active={isAiThumbnail} button2Active={!isAiThumbnail}
        setButtonActive={setIsAiThumbnail}
      />

      {isAiThumbnail ? (
        <div className="flex flex-col gap-5 animate-in fade-in-50">
          {thumbnailPrompts.length > 0 && (
            <div className="mt-8 flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-6 w-1.5 flex-shrink-0 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
                  <Label className="text-16 sm:text-18 font-bold text-white-1 leading-tight">
                    Select a Thumbnail Prompt
                  </Label>
                </div>
                <span className="text-sm font-medium text-gray-1 whitespace-nowrap px-3 py-1.5 
                  bg-black-1/40 rounded-full border border-white/5">
                  {thumbnailPrompts.length} suggestions
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3 mt-6">
            <Label className="text-16 sm:text-18 font-bold text-white-1 flex items-center gap-3">
              <div className="h-6 w-1.5 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
              {thumbnailPrompts.length > 0 ? "Customize Prompt" : "Enter Prompt"}
            </Label>
            <Textarea
              className={cn(
                "input-class font-light min-h-[120px] w-full",
                "bg-black-1/50 hover:bg-black-1/70",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "border border-black-6 rounded-xl",
                "p-4",
                "focus-visible:ring-offset-orange-1",
                "placeholder:text-gray-1/70"
              )}
              placeholder={
                thumbnailPrompts.length > 0
                  ? "Customize the selected prompt or write your own..."
                  : "Write a prompt for your thumbnail..."
              }
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
                  disabled:opacity-50 disabled:hover:scale-100 rounded-full"
                onClick={generateImage}
                disabled={isImageLoading || !imagePrompt.trim()}
              >
                {isImageLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader size={20} className="animate-spin" />
                    <span>Generating...</span>
                  </div>
                ) : (
                  "Generate"
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
              "p-4 sm:p-6 rounded-lg",
              isImageLoading && "opacity-50 cursor-not-allowed hover:border-gray-700 hover:bg-transparent",
            )}
          >
            <Input
              type="file"
              className="hidden"
              ref={imageRef}
              onChange={handleFileChange}
              accept="image/*"
              disabled={isImageLoading}
            />

            <div className="flex flex-col items-center gap-1">
              <h2
                className={cn(
                  "text-12 font-bold text-orange-1 group-hover:text-orange-400",
                  "transition-colors duration-200",
                )}
              >
                Click to upload
              </h2>
              <p className="text-12 font-normal text-gray-1">SVG, PNG, JPG, or GIF (max. 1080x1080px)</p>
            </div>
          </div>
        </div>
      )}

      {(image || isImageLoading) && (
        <div className="mt-6 sm:mt-8">
          <ImagePreview
            image={image}
            isImageLoading={isImageLoading}
            progress={progress}
            isAiThumbnail={isAiThumbnail}
            isAiGenerated={isAiGenerated}
            setIsPreviewOpen={setIsPreviewOpen}
            handleDownload={handleDownload}
            handleDelete={handleDelete}
          />
        </div>
      )}

      {image && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <ImageDialogContent image={image} onDownload={handleDownload} />
        </Dialog>
      )}

      {/* Add a hidden input for form validation */}
      <input type="hidden" name="thumbnail" value={image} required aria-hidden="true" />
    </div>
  )
}

export default GenerateThumbnail

