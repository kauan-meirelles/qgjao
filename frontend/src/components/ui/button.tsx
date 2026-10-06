// frontend/src/components/ui/button.tsx
import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | string;
  size?: "default" | "sm" | "lg" | "xs" | string;
}

// Sobrecarga 1: Chamado com objeto de opções (ex: buttonVariants({ variant: "outline" }))
export function buttonVariants(options?: { variant?: string; size?: string; className?: string; [key: string]: any }): string;
// Sobrecarga 2: Chamado com string direta (ex: buttonVariants("outline", "sm"))
export function buttonVariants(variant?: string, size?: string, className?: string): string;

// Implementação real da função
export function buttonVariants(
  arg1?: string | { variant?: string; size?: string; className?: string; [key: string]: any },
  arg2?: string,
  arg3?: string
): string {
  let variant = "default";
  let size = "default";
  let className = "";

  if (typeof arg1 === "object" && arg1 !== null) {
    variant = arg1.variant || "default";
    size = arg1.size || "default";
    className = arg1.className || "";
  } else {
    if (arg1) variant = arg1;
    if (arg2) size = arg2;
    if (arg3) className = arg3;
  }

  let styles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ";
  
  if (variant === "outline") {
    styles += "border border-input bg-background hover:bg-accent hover:text-accent-foreground ";
  } else if (variant === "secondary") {
    styles += "bg-secondary text-secondary-foreground hover:bg-secondary/80 ";
  } else if (variant === "ghost") {
    styles += "hover:bg-accent hover:text-accent-foreground ";
  } else if (variant === "link") {
    styles += "text-primary underline-offset-4 hover:underline ";
  } else {
    styles += "bg-primary text-primary-foreground hover:bg-primary/90 ";
  }
  
  if (size === "xs") {
    styles += "h-7 px-2 text-xs ";
  } else if (size === "sm") {
    styles += "h-8 px-3 text-xs ";
  } else if (size === "lg") {
    styles += "h-10 px-8 ";
  } else {
    styles += "h-9 px-4 py-2 ";
  }
  
  return `${styles} ${className}`;
}

export function Button({ children, variant, size, className, ...props }: ButtonProps) {
  return (
    <button className={buttonVariants({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}