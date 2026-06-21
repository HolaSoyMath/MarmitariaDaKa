"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",

          // success
          "--success-bg": "hsl(143, 85%, 96%)",
          "--success-border": "hsl(145, 92%, 80%)",
          "--success-text": "hsl(140, 100%, 27%)",

          // error
          "--error-bg": "hsl(359, 100%, 97%)",
          "--error-border": "hsl(359, 100%, 87%)",
          "--error-text": "hsl(360, 100%, 40%)",

          // warning
          "--warning-bg": "hsl(49, 100%, 95%)",
          "--warning-border": "hsl(49, 91%, 75%)",
          "--warning-text": "hsl(31, 92%, 35%)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
