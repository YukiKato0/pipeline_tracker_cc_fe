import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3 p-6 text-muted-foreground"
      role="status"
    >
      <Loader2 aria-hidden="true" className="size-8 animate-spin text-primary" />
      <p className="text-xs font-medium">Loading content...</p>
    </div>
  );
}

