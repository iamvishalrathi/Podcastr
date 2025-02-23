"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import GeneratePodcast from "@/components/GeneratePodcast";
import GenerateThumbnail from "@/components/GenerateThumbnail";
import { Loader, Podcast } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import GenerateAIContent from "@/components/GenerateAIContent";
import { chatSession } from "@/service/Gemini";
import { Gemini_Prompt } from "@/constants/Gemini_Prompt";
import { podcastTypes } from "@/constants/PodcastFields";
import { formSchema } from "@/constants/FormSchema";
import { cn } from "@/lib/utils";

const CreatePodcast = () => {
    const router = useRouter()
    //Image States
    const [imagePrompt, setImagePrompt] = useState("");
    const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(null);
    const [imageUrl, setImageUrl] = useState("");
    const [thumbnailPrompts, setThumbnailPrompts] = useState<string[]>([]);

    //Audio States
    const [audioUrl, setAudioUrl] = useState("");
    const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(null);
    const [audioDuration, setAudioDuration] = useState(0);

    //Voice States
    const [voiceType, setVoiceType] = useState<string | null>("Drew");
    const [voicePrompt, setVoicePrompt] = useState("");

    //AI States
    const [duration, setDuration] = useState([1]);
    const [tone, setTone] = useState('casual');
    const [targetAudience, setTargetAudience] = useState('general');
    const [style, setStyle] = useState('conversational');
    const [note, setNote] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState('english');

    //Form States
    const [isGeneratingContent, setIsGeneratingContent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const createPodcast = useMutation(api.podcasts.createPodcast);
    const voiceCategories = ['Drew', "Rachel", "Sarah"];

    // 1. Define your form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            podcastTitle: "",
            podcastDescription: "",
            podcastType: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            setIsSubmitting(true);

            // Check all required fields with specific messages
            if (!data.podcastTitle.trim()) {
                toast({
                    title: 'Podcast title is required',
                    variant: 'destructive'
                });
                setIsSubmitting(false);
                return;
            }

            if (!data.podcastType) {
                toast({
                    title: 'Please select a podcast type',
                    variant: 'destructive'
                });
                setIsSubmitting(false);
                return;
            }

            if (!data.podcastDescription.trim()) {
                toast({
                    title: 'Podcast description is required',
                    variant: 'destructive'
                });
                setIsSubmitting(false);
                return;
            }

            if (!imageUrl || !imageStorageId) {
                toast({
                    title: 'Please upload or generate a thumbnail',
                    variant: 'destructive'
                });
                setIsSubmitting(false);
                return;
            }

            // Check if audio is required
            if (!audioUrl || !audioStorageId) {
                toast({
                    title: 'Please generate audio for your podcast',
                    variant: 'destructive'
                });
                setIsSubmitting(false);
                return;
            }

            // If all checks pass, proceed with submission
            const newPodcast = await createPodcast({
                podcastTitle: data.podcastTitle,
                podcastDescription: data.podcastDescription,
                podcastType: data.podcastType,
                audioUrl,
                imageUrl,
                voiceType: voiceType || '',
                imagePrompt,
                voicePrompt,
                views: 0,
                audioDuration,
                audioStorageId,
                imageStorageId,
            });

            toast({
                title: 'Podcast created successfully',
                description: 'Your podcast has been published'
            });

            // Redirect to the podcast detail page
            router.push(`/podcasts/${newPodcast}`);

        } catch (error) {
            console.error('Error creating podcast:', error);
            toast({
                title: 'Error creating podcast',
                description: error instanceof Error ? error.message : 'Something went wrong',
                variant: 'destructive'
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const generateAIContent = async () => {
        if (!form.getValues("podcastTitle")) {
            toast({
                title: 'Please enter a title first',
                variant: 'destructive'
            });
            return;
        }

        if (!form.getValues("podcastType")) {
            toast({
                title: 'Please select a podcast type first',
                variant: 'destructive'
            });
            return;
        }

        try {
            setIsGeneratingContent(true);
            const Final_Gemini_Prompt = Gemini_Prompt
                .replace('{title}', form.getValues("podcastTitle"))
                .replace('{podcastType}', form.getValues("podcastType"))
                .replace('{language}', selectedLanguage)
                .replace('{duration}', duration[0].toString())
                .replace('{tone}', tone)
                .replace('{targetAudience}', targetAudience)
                .replace('{style}', style)
                .replace('{note}', note || 'No additional notes');

            const result = await chatSession.sendMessage(Final_Gemini_Prompt);
            const response = await result.response;
            const text = response.text();

            try {
                const content = JSON.parse(text);
                form.setValue("podcastDescription", content.description);
                setVoicePrompt(content.script);

                // Set multiple thumbnail prompts
                if (Array.isArray(content.thumbnailPrompts)) {
                    setThumbnailPrompts(content.thumbnailPrompts);
                    // Set the first prompt as default
                    setImagePrompt(content.thumbnailPrompts[0]);
                } else {
                    // Fallback if the response doesn't contain multiple prompts
                    setThumbnailPrompts([content.thumbnailPrompt]);
                    setImagePrompt(content.thumbnailPrompt);
                }

                toast({
                    title: 'AI content generated successfully',
                    description: 'Description, script, and thumbnail prompts have been updated'
                });
            } catch (parseError) {
                console.error('Error parsing AI response:', parseError);
                toast({
                    title: 'Error processing AI response',
                    description: 'The AI response was not in the expected format',
                    variant: 'destructive'
                });
            }
        } catch (error) {
            console.error('Error generating content:', error);
            let errorMessage = 'Failed to generate content';

            // Handle specific Gemini API errors
            if (error instanceof Error) {
                if (error.message.includes('model is overloaded')) {
                    errorMessage = 'AI service is temporarily busy. Please try again in a moment.';
                } else if (error.message.includes('fetch')) {
                    errorMessage = 'Network error. Please check your connection.';
                }
            }

            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive'
            });
        } finally {
            setIsGeneratingContent(false);
        }
    };

    return (
        <section className="container max-w-4xl mx-auto px-4 py-10">
            <div className="space-y-10">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-white-1">Create New Podcast</h1>
                    <p className="text-gray-1 text-sm">
                        Fill in the details below to create your podcast. Use AI to generate content or write your own.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid gap-8">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-1 bg-orange-1 rounded-full" />
                                    <h2 className="text-lg font-semibold text-white-1">Basic Information</h2>
                                </div>

                                <div className="bg-black-1/30 rounded-xl p-6 border border-gray-800">
                                    <div className={`flex flex-col gap-6 pt-5`}>
                                        <FormField
                                            control={form.control}
                                            name="podcastTitle"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-16 sm:text-18 font-bold text-white-1 flex items-center gap-3 cursor-pointer">
                                                        <div className="h-6 w-1.5 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
                                                        Podcast Title
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="input-class focus-visible:ring-offset-orange-1 h-12"
                                                            placeholder="Enter your podcast title..."
                                                            suppressHydrationWarning
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-white-1" />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="podcastType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-16 sm:text-18 font-bold text-white-1 flex items-center gap-3 cursor-pointer">
                                                        <div className="h-6 w-1.5 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
                                                        Podcast Type
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger
                                                                className="input-class focus-visible:ring-offset-orange-1 h-12"
                                                            >
                                                                <SelectValue placeholder="Select a podcast type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="bg-black-1/95 text-white-1 border-orange-1/10 rounded-xl">
                                                            {podcastTypes.map((option) => (
                                                                <SelectItem
                                                                    key={option.value}
                                                                    value={option.value}
                                                                    className="focus:bg-orange-1/20 hover:bg-orange-1/10 transition-colors"
                                                                >
                                                                    {option.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage className="text-white-1" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Content Generation */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-1 bg-orange-1 rounded-full" />
                                    <h2 className="text-lg font-semibold text-white-1">Content Generation</h2>
                                </div>

                                <div className="bg-black-1/30 rounded-xl p-6 border border-gray-800">
                                    <GenerateAIContent
                                        title={form.getValues("podcastTitle")}
                                        setDuration={setDuration}
                                        duration={duration}
                                        setTone={setTone}
                                        tone={tone}
                                        setTargetAudience={setTargetAudience}
                                        targetAudience={targetAudience}
                                        setStyle={setStyle}
                                        style={style}
                                        generateAIContent={generateAIContent}
                                        isGeneratingContent={isGeneratingContent}
                                        note={note}
                                        setNote={setNote}
                                        selectedLanguage={selectedLanguage}
                                        setSelectedLanguage={setSelectedLanguage}
                                    />
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-1 bg-orange-1 rounded-full" />
                                    <h2 className="text-lg font-semibold text-white-1">Additional Details</h2>
                                </div>

                                <div className="bg-black-1/30 rounded-xl p-6 border border-gray-800">
                                    <div className={`flex flex-col gap-6 pt-5`}>
                                        <FormField
                                            control={form.control}
                                            name="podcastDescription"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-16 sm:text-18 font-bold text-white-1 flex items-center gap-3 cursor-pointer">
                                                        <div className="h-6 w-1.5 bg-gradient-to-t from-orange-1 to-orange-400 rounded-full" />
                                                        Podcast Description
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            className="input-class min-h-[120px]"
                                                            placeholder="Write or generate a compelling description for your podcast..."
                                                            suppressHydrationWarning
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-white-1" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Audio Generation */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-1 bg-orange-1 rounded-full" />
                                    <h2 className="text-lg font-semibold text-white-1">Audio Generation</h2>
                                </div>

                                <div className="bg-black-1/30 rounded-xl p-6 border border-gray-800">
                                    <GeneratePodcast
                                        setAudioStorageId={setAudioStorageId}
                                        audioStorageId={audioStorageId}
                                        setAudio={setAudioUrl}
                                        voiceType={voiceType!}
                                        setVoiceType={setVoiceType}
                                        audio={audioUrl}
                                        voicePrompt={voicePrompt}
                                        setVoicePrompt={setVoicePrompt}
                                        setAudioDuration={setAudioDuration}
                                    />
                                </div>
                            </div>

                            {/* Thumbnail Generation */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-1 bg-orange-1 rounded-full" />
                                        <h2 className="text-lg font-semibold text-white-1">Thumbnail Generation</h2>
                                    </div>
                                    {thumbnailPrompts.length > 0 && (
                                        <span className="text-sm text-gray-1">
                                            {thumbnailPrompts.length} AI suggestions available
                                        </span>
                                    )}
                                </div>

                                <div className="bg-black-1/30 rounded-xl p-6 border border-gray-800">
                                    <GenerateThumbnail
                                        setImage={setImageUrl}
                                        setImageStorageId={setImageStorageId}
                                        image={imageUrl}
                                        imagePrompt={imagePrompt}
                                        setImagePrompt={setImagePrompt}
                                        imageStorageId={imageStorageId}
                                        thumbnailPrompts={thumbnailPrompts}
                                    />
                                </div>
                            </div>

                            {/* Generate Button */}
                            <div className="flex flex-col gap-4 items-center">
                                <Button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className={cn(
                                        "bg-gradient-to-r from-orange-1 to-orange-400",
                                        "text-white font-semibold gap-3 py-6 text-lg",
                                        "transition-all duration-300 hover:scale-[1.02]",
                                        "shadow-lg hover:shadow-orange-1/20",
                                        "rounded-xl",
                                        "disabled:opacity-50 disabled:hover:scale-100",
                                        "max-w-[600px]",
                                        "w-full"
                                    )}
                                >
                                    {isSubmitting ? (
                                        <>
                                            Publishing Podcast
                                            <Loader size={20} className="animate-spin" />
                                        </>
                                    ) : (
                                        <>
                                            Publish Podcast
                                            <Podcast size={20} className="animate-bounce" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </section>
    );
};

export default CreatePodcast;