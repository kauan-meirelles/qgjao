import React from "react";

export interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Dialog = ({ children, open }: DialogProps) => (
  <div data-state={open ? "open" : "closed"}>{children}</div>
);

export const DialogContent = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props}>
    {children}
  </div>
);

export const DialogHeader = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props}>
    {children}
  </div>
);

export const DialogTitle = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={className} {...props}>
    {children}
  </h2>
);

export const DialogDescription = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={className} {...props}>
    {children}
  </p>
);