import { cn } from "@/lib/utils";

interface ToggleButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full" | "none";
}

export function ToggleButtonGroup({ 
  children, 
  className,
  maxWidth = "md" 
}: ToggleButtonGroupProps) {
  const maxWidthClasses = {
    sm: "max-w-[400px]",
    md: "max-w-[600px]",
    lg: "max-w-[800px]",
    xl: "max-w-[1200px]",
    full: "max-w-full",
    none: ""
  };

  return (
    <div className={cn(
      "generate_thumbnail flex flex-col sm:flex-row gap-3 sm:gap-4 w-full",
      maxWidth !== "none" && "mx-auto",
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  );
} 