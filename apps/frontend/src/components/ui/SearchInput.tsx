"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props extends React.ComponentProps<typeof Input> {
  containerClassName?: string;
}

export function SearchInput({ className, containerClassName, ...props }: Props) {
  return (
    <div className={cn("relative w-full rounded-sm", containerClassName)}>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={16}
      />
      <Input className={cn("pl-9 bg-card rounded-sm", className)} {...props} />
    </div>
  );
}
