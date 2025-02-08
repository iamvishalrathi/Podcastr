"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
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
import { Loader } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import GenerateAIContent from "@/components/GenerateAIContent";
import { chatSession } from "@/service/Gemini";
import { Gemini_Prompt } from "@/constants/Gemini_Prompt";
import { podcastTypes } from "@/constants/PodcastType";

const formSchema = z.object({
    podcastTitle: z.string().min(2, {
        message: "Podcast title must be at least 2 characters.",
    }),
    podcastDescription: z.string().min(2, {
        message: "Podcast description must be at least 2 characters.",
    }),
    podcastType: z.string({
        required_error: "Please select a podcast type.",
    }),
});

const voiceCategories = ['Drew', "Rachel", "Sarah"];

const CreatePodcast = () => {
    const router = useRouter()
    //Image States
    const [imagePrompt, setImagePrompt] = useState("");
    const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(null);
    const [imageUrl, setImageUrl] = useState("");

    //Audio States
    const [audioUrl, setAudioUrl] = useState("");
    const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(null);
    const [audioDuration, setAudioDuration] = useState(0);

    //Voice States
    const [voiceType, setVoiceType] = useState<string | null>(null);
    const [voicePrompt, setVoicePrompt] = useState("");

    //AI States
    const [duration, setDuration] = useState([1]);
    const [tone, setTone] = useState('casual');
    const [targetAudience, setTargetAudience] = useState('general');
    const [style, setStyle] = useState('conversational');

    //Form States
    const [isGeneratingContent, setIsGeneratingContent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const createPodcast = useMutation(api.podcasts.createPodcast)

    // 1. Define your form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            podcastTitle: "",
            podcastDescription: "",
            podcastType: "",
        },
    });

    // Add new state for thumbnail prompts
    const [thumbnailPrompts, setThumbnailPrompts] = useState<string[]>([]);

    // Add new state for note
    const [note, setNote] = useState("");

    // Add new state for language
    const [selectedLanguage, setSelectedLanguage] = useState('english');

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
            await createPodcast({
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

            router.push('/'); // or wherever you want to redirect after success

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

        try {
            setIsGeneratingContent(true);
            const Final_Gemini_Prompt = Gemini_Prompt
                .replace('{title}', form.getValues("podcastTitle"))
                .replace('{language}', selectedLanguage)
                .replace('{duration}', duration[0].toString())
                .replace('{tone}', tone)
                .replace('{targetAudience}', targetAudience)
                .replace('{style}', style)
                .replace('{note}', note || 'No additional notes');

            // console.log(Final_Gemini_Prompt);
            const result = await chatSession.sendMessage(Final_Gemini_Prompt);
            const response = await result.response;
            const text = response.text();
            // console.log(text);

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
            <div className="space-y-6">
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
                            {/* Voice Selection - Moved to top */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-1 bg-orange-1 rounded-full" />
                                    <h2 className="text-lg font-semibold text-white-1">Voice Settings</h2>
                                </div>

                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-white-1">AI Voice Selection</Label>
                                        <Select
                                            onValueChange={(value) => {
                                                setVoiceType(value);
                                                const audio = new Audio(`/${value}.mp3`);
                                                audio.play().catch(error => {
                                                    console.error("Error playing voice sample:", error);
                                                });
                                            }}
                                        >
                                            <SelectTrigger className="input-class h-12">
                                                <SelectValue placeholder="Choose an AI voice" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-black-1 text-white-1 border-gray-800">
                                                {voiceCategories.map((category) => (
                                                    <SelectItem
                                                        key={category}
                                                        value={category}
                                                        className="hover:bg-orange-1 hover:text-white"
                                                    >
                                                        {category}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-1 bg-orange-1 rounded-full" />
                                    <h2 className="text-lg font-semibold text-white-1">Basic Information</h2>
                                </div>

                                <div className="bg-black-1/30 rounded-xl p-6 border border-gray-800">
                                    <div className={`flex flex-col gap-6 pt-10`}>
                                        <FormField
                                            control={form.control}
                                            name="podcastTitle"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white-1">
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
                                                    <FormLabel className="text-white-1">
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

                                <div className="space-y-4">

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

                                <FormField
                                    control={form.control}
                                    name="podcastDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white-1">
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

                            {/* Audio Generation - Renamed from Media Generation */}
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
                                        audio={audioUrl}
                                        voicePrompt={voicePrompt}
                                        setVoicePrompt={setVoicePrompt}
                                        setAudioDuration={setAudioDuration}
                                    />
                                </div>
                            </div>

                            {/* Thumbnail Generation - New separate section */}
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

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-orange-1 hover:bg-orange-600 text-white-1 font-bold 
                                    py-4 rounded-lg transition-all duration-300 flex items-center justify-center 
                                    gap-2 h-14 mt-4 disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        Creating Podcast
                                        <Loader size={20} className="animate-spin" />
                                    </>
                                ) : (
                                    "Publish Podcast"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </section>
    );
};

export default CreatePodcast;
