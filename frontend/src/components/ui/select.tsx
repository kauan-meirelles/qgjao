import React from "react";

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  placeholder?: string;
}

export function Select({ children, value, onValueChange }: SelectProps) {
  return <div data-value={value}>{children}</div>;
}

export function SelectTrigger({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}

export interface SelectValueProps {
  placeholder?: string;
  children?: React.ReactNode | ((value: string) => React.ReactNode);
}

export function SelectValue({ placeholder, children }: SelectValueProps) {
  return (
    <span>
      {typeof children === "function" ? children("") : children || placeholder}
    </span>
  );
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

export function SelectItem({ children, value, ...props }: SelectItemProps) {
  return <div data-value={value} {...props}>{children}</div>;
}