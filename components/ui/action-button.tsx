import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  onClick: (e: React.MouseEvent) => void;
  icon: LucideIcon;
  label: string;
  className?: string;
  size?: "default" | "large";
}

export const ActionButton = ({
  onClick,
  icon: Icon,
  label,
  className = "",
  size = "default"
}: ActionButtonProps) => (
  <Button
    variant="secondary"
    size="icon"
    className={cn(
      "rounded-full",
      "bg-black/40 hover:bg-black/60",
      "backdrop-blur-xl border border-white/30",
      "transition-all duration-300",
      "hover:scale-110 hover:rotate-3",
      "shadow-[0_4px_16px_rgba(0,0,0,0.5)]",
      "hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)]",
      "hover:border-white/40",
      "group/button",
      size === "large" ? "h-12 w-12" : "h-11 w-11",
      className
    )}
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(e);
    }}
    aria-label={label}
  >
    <Icon 
      className={cn(
        "transition-transform duration-300",
        "group-hover/button:scale-110",
        size === "large" ? "h-6 w-6" : "h-5 w-5",
        className.includes("text-") ? "" : "text-white"
      )} 
    />
  </Button>
); 