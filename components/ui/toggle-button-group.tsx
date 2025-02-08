import { cn } from "@/lib/utils";
import { ToggleButton } from "./toggle-button";

interface ToggleButtonGroupProps {
  button1text: string;
  button2text: string;
  button1Active: boolean;
  button2Active: boolean;
  setButtonActive: (active: boolean) => void;
  className?: string;
  containerWidth?: string;
}

export function ToggleButtonGroup({
  className,
  containerWidth = "max-w-[600px]", // Default width
  button1text,
  button2text,
  button1Active,
  button2Active,
  setButtonActive
}: ToggleButtonGroupProps) {
  return (
    <div className={cn(
      "generate_thumbnail flex flex-col sm:flex-row gap-3 sm:gap-4 w-full mx-auto",
      containerWidth
    )}>
      <ToggleButton
        isActive={button1Active}
        onClick={() => setButtonActive(true)}
        activeColor="orange"
      >
        {button1text}
      </ToggleButton>

      <ToggleButton
        isActive={button2Active}
        onClick={() => setButtonActive(false)}
        activeColor="blue"
      >
        {button2text}
      </ToggleButton>
    </div>
  );
} 