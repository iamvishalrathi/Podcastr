import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toneOptions, targetAudienceOptions, styleOptions } from "@/constants/AIContent";
interface GenerateAIContentProps {
    title: string;
    setTone: (value: string) => void;
    tone: string;
    setTargetAudience: (value: string) => void;
    targetAudience: string;
    setStyle: (value: string) => void;
    style: string;
    setDuration: (value: number[]) => void;
    duration: number[];
    generateAIContent: () => void;
    isGeneratingContent: boolean;
}


const GenerateAIContent = ({
    title,
    setTone,
    tone,
    setTargetAudience,
    targetAudience,
    setStyle,
    style,

    setDuration,
    duration,
    generateAIContent,
    isGeneratingContent,
}: GenerateAIContentProps) => {
    const [isAiContent, setIsAiContent] = useState(false);


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