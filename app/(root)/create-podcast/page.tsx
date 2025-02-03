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
import { cn } from "@/lib/utils";
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
import { languageOptions } from "@/constants/Language_Options";

const formSchema = z.object({
    podcastTitle: z.string().min(2),
    podcastDescription: z.string().min(2),
});

const voiceCategories = ['Drew', "Rachel", "Sarah"];

const CreatePodcast = () => {
    const router = useRouter()
    const [imagePrompt, setImagePrompt] = useState("");
    const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(
        null
    );
    const [imageUrl, setImageUrl] = useState("");

    const [audioUrl, setAudioUrl] = useState("");
    const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(
        null
    );
    const [audioDuration, setAudioDuration] = useState(0);

    const [voiceType, setVoiceType] = useState<string | null>(null);
    const [voicePrompt, setVoicePrompt] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    const createPodcast = useMutation(api.podcasts.createPodcast)

    // 1. Define your form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            podcastTitle: "",
            podcastDescription: "",
        },
    });

    const [selectedLanguage, setSelectedLanguage] = useState('english');

    // 2. Define a submit handler.
    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            setIsSubmitting(true);
            if (!audioUrl || !imageUrl || !voiceType) {
                toast({
                    title: 'Please generate audio and image, and select a voice type',
                    variant: 'destructive'
                })
                setIsSubmitting(false);
                throw new Error('Missing required fields')
            }
            await createPodcast({
                podcastTitle: data.podcastTitle,
                podcastDescription: data.podcastDescription,
                audioUrl,
                imageUrl,
                voiceType: voiceType,
                imagePrompt,
                voicePrompt,
                views: 0,
                audioDuration,
                audioStorageId: audioStorageId!,
                imageStorageId: imageStorageId!,
            })
            toast({ title: 'Podcast created' })
            setIsSubmitting(false);
            router.push('/')
        } catch (error) {
            console.log(error);
            toast({
                title: 'Error',
                variant: 'destructive',
            })
            setIsSubmitting(false);
        }
    }

    return (
        <section className="container max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-white-1 mb-8">Create New Podcast</h1>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <div className="grid gap-6">
                        <FormField
                            control={form.control}
                            name="podcastTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg font-semibold text-white-1">
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

                        <div className="space-y-4">
                            <Label className="text-lg font-semibold text-white-1">
                                AI Voice Selection
                            </Label>
                            <Select
                                onValueChange={(value) => setVoiceType(value)}
                            >
                                <SelectTrigger
                                    className={cn(
                                        "text-base w-full border border-gray-700 bg-black-1 text-gray-1 focus-visible:ring-offset-orange-1 h-12"
                                    )}
                                >
                                    <SelectValue placeholder="Choose an AI voice" />
                                </SelectTrigger>
                                <SelectContent className="text-base border-none bg-black-1 font-medium text-white-1">
                                    {voiceCategories.map((category) => (
                                        <SelectItem
                                            key={category}
                                            value={category}
                                            className="capitalize hover:bg-orange-1 hover:text-white transition-colors"
                                        >
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-lg font-semibold text-white-1">
                                Content Language
                            </Label>
                            <Select
                                onValueChange={setSelectedLanguage}
                                defaultValue="english"
                            >
                                <SelectTrigger
                                    className={cn(
                                        "text-base w-full border border-gray-700 bg-black-1 text-gray-1 focus-visible:ring-offset-orange-1 h-12"
                                    )}
                                >
                                    <SelectValue placeholder="Select Language" />
                                </SelectTrigger>
                                <SelectContent
                                    className="max-h-[300px] overflow-y-auto text-base border-none bg-black-1 font-medium text-white-1"
                                >
                                    {languageOptions.map((lang) => (
                                        <SelectItem
                                            key={lang.value}
                                            value={lang.value}
                                            className="hover:bg-orange-1 hover:text-white transition-colors"
                                        >
                                            {lang.label} ({lang.native})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <GenerateAIContent 
                            title={form.getValues("podcastTitle")} 
                            selectedLanguage={selectedLanguage} 
                            setSelectedLanguage={setSelectedLanguage} 
                            form={form} 
                            setVoicePrompt={setVoicePrompt} 
                        />

                        <div className="grid">
                            <FormField
                                control={form.control}
                                name="podcastDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg font-semibold text-white-1">
                                            Podcast Description
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="input-class focus-visible:ring-offset-orange-1 min-h-[120px]"
                                                placeholder="Write a compelling description for your podcast..."
                                                suppressHydrationWarning
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-white-1" />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-4">
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
                                <GenerateThumbnail
                                    setImage={setImageUrl}
                                    setImageStorageId={setImageStorageId}
                                    image={imageUrl}
                                    imagePrompt={imagePrompt}
                                    setImagePrompt={setImagePrompt}
                                />
                                
                                <Button
                                    type="submit"
                                    className="w-full bg-orange-1 hover:bg-orange-600 text-white-1 font-bold py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 h-14 mt-4"
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
                        </div>
                    </div>
                </form>
            </Form>
        </section>
    );
};

export default CreatePodcast;
