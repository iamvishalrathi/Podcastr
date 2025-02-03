import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { chatSession } from "@/service/Gemini";
import { Gemini_Prompt } from "@/constants/Gemini_Prompt";
import { toast } from "@/components/ui/use-toast";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GenerateAIContentProps {
    title: string;
    selectedLanguage: string;
    setSelectedLanguage: (value: string) => void;
    form: UseFormReturn<{
        podcastTitle: string;
        podcastDescription: string;
    }>;
    setVoicePrompt: (value: string) => void;
}

const toneOptions = [
    { value: 'casual', label: 'Casual & Friendly' },
    { value: 'professional', label: 'Professional & Formal' },
    { value: 'humorous', label: 'Humorous & Light' },
    { value: 'educational', label: 'Educational & Informative' },
    { value: 'storytelling', label: 'Storytelling & Narrative' },
    { value: 'motivational', label: 'Motivational & Inspiring' }
];

const targetAudienceOptions = [
    { value: 'general', label: 'General Audience' },
    { value: 'beginners', label: 'Beginners' },
    { value: 'intermediate', label: 'Intermediate Level' },
    { value: 'advanced', label: 'Advanced Level' },
    { value: 'professionals', label: 'Professionals' },
    { value: 'students', label: 'Students' },
    { value: 'elderly', label: 'Elderly' },
    { value: 'youth', label: 'Youth' }
];

const styleOptions = [
    { value: 'conversational', label: 'Conversational' },
    { value: 'interview', label: 'Interview Style' },
    { value: 'monologue', label: 'Monologue' },
    { value: 'debate', label: 'Debate Style' },
    { value: 'tutorial', label: 'Tutorial/How-to' },
    { value: 'storytelling', label: 'Storytelling' }
];

const GenerateAIContent = ({
    title,
    selectedLanguage,
    form,
    setVoicePrompt,
}: GenerateAIContentProps) => {
    const [isGeneratingContent, setIsGeneratingContent] = useState(false);
    const [duration, setDuration] = useState([1]);
    const [isAiContent, setIsAiContent] = useState(false);
    const [tone, setTone] = useState('casual');
    const [targetAudience, setTargetAudience] = useState('general');
    const [style, setStyle] = useState('conversational');

    const generateAIContent = async () => {
        if (!title) {
            toast({
                title: 'Please enter a title first',
                variant: 'destructive'
            });
            return;
        }

        try {
            setIsGeneratingContent(true);
            const Final_Gemini_Prompt = Gemini_Prompt
                .replace('{title}', title)
                .replace('{language}', selectedLanguage)
                .replace('{duration}', duration[0].toString())
                .replace('{tone}', tone)
                .replace('{targetAudience}', targetAudience)
                .replace('{style}', style);

            console.log(Final_Gemini_Prompt);
            const result = await chatSession.sendMessage(Final_Gemini_Prompt);
            const response = await result.response;
            const text = response.text();

            const content = JSON.parse(text);

            form.setValue("podcastDescription", content.description);
            setVoicePrompt(content.script);

            toast({
                title: 'AI content generated successfully',
                description: 'Description and script have been updated'
            });
        } catch (error) {
            console.error('Error generating content:', error);
            toast({
                title: 'Error generating content',
                description: 'Please try again',
                variant: 'destructive'
            });
        } finally {
            setIsGeneratingContent(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="generate_content">
                <Button
                    type="button"
                    variant="plain"
                    onClick={() => setIsAiContent(true)}
                    className={cn('', {
                        'bg-black-6': isAiContent
                    })}
                >
                    Use AI to generate content
                </Button>
                <Button
                    type="button"
                    variant="plain"
                    onClick={() => setIsAiContent(false)}
                    className={cn('', {
                        'bg-black-6': !isAiContent
                    })}
                >
                    Write custom content
                </Button>
            </div>

            {isAiContent && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2.5">
                            <Label className="text-16 font-bold text-white-1">
                                Content Tone
                            </Label>
                            <Select onValueChange={setTone} defaultValue={tone}>
                                <SelectTrigger className="bg-black-1 border-none text-gray-1">
                                    <SelectValue placeholder="Select tone" />
                                </SelectTrigger>
                                <SelectContent className="bg-black-1 text-white-1">
                                    {toneOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                            className="focus:bg-orange-1"
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2.5">
                            <Label className="text-16 font-bold text-white-1">
                                Target Audience
                            </Label>
                            <Select onValueChange={setTargetAudience} defaultValue={targetAudience}>
                                <SelectTrigger className="bg-black-1 border-none text-gray-1">
                                    <SelectValue placeholder="Select audience" />
                                </SelectTrigger>
                                <SelectContent className="bg-black-1 text-white-1">
                                    {targetAudienceOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                            className="focus:bg-orange-1"
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2.5">
                            <Label className="text-16 font-bold text-white-1">
                                Content Style
                            </Label>
                            <Select onValueChange={setStyle} defaultValue={style}>
                                <SelectTrigger className="bg-black-1 border-none text-gray-1">
                                    <SelectValue placeholder="Select style" />
                                </SelectTrigger>
                                <SelectContent className="bg-black-1 text-white-1">
                                    {styleOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                            className="focus:bg-orange-1"
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-16 font-bold text-white-1">
                                    Script Duration
                                </Label>
                                <span className="px-3 py-1 rounded-full bg-black-1 text-orange-1 font-bold text-sm">
                                    {duration[0]} {duration[0] === 1 ? 'minute' : 'minutes'}
                                </span>
                            </div>
                            <div className="px-1">
                                <Slider
                                    value={duration}
                                    onValueChange={setDuration}
                                    min={1}
                                    max={10}
                                    step={1}
                                    className="w-full"
                                    aria-label="Script Duration"
                                />
                                <div className="flex justify-between mt-2 text-xs text-gray-1">
                                    <span>1 min</span>
                                    <span>5 min</span>
                                    <span>10 min</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={generateAIContent}
                        disabled={isGeneratingContent || !title}
                        className="bg-orange-1 text-white-1 hover:bg-orange-2 w-full mt-2"
                    >
                        {isGeneratingContent ? (
                            <>
                                Generating
                                <Loader size={16} className="animate-spin ml-2" />
                            </>
                        ) : (
                            "Generate AI Content"
                        )}
                    </Button>
                </>
            )}
        </div>
    );
};

export default GenerateAIContent;