// frontend/src/components/ui/badge.tsx
import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive" | string;
}

export function Badge({ children, className = "", variant = "default", ...props }: BadgeProps) {
  let baseStyles = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  if (variant === "secondary") {
    baseStyles += " border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80";
  } else if (variant === "outline") {
    baseStyles += " text-foreground border-border";
  } else if (variant === "destructive") {
    baseStyles += " border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80";
  } else {
    baseStyles += " border-transparent bg-primary text-primary-foreground hover:bg-primary/80";
  }

  return (
    <div className={`${baseStyles} ${className}`} {...props}>
      {children}
    </div>
  );
}