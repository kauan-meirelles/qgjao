"use client";

import { Toaster as SonnerToaster } from "sonner";

type SonnerProps = React.ComponentProps<typeof SonnerToaster>;

const Toaster = ({ ...props }: SonnerProps) => {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      duration={4000}
      {...props}
    />
  );
};

export { Toaster };