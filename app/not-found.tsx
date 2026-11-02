import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center p-6 text-center">
      <span className="mb-4 inline-flex size-14 items-center justify-center rounded-full border border-studio-icon-border bg-studio-icon-bg text-studio-icon-text">
        <FileQuestion aria-hidden="true" size={26} />
      </span>
      <h2 className="m-0 font-serif text-2xl font-normal text-studio-heading">Page Not Found</h2>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        The page you are trying to reach is unavailable or has been moved.
      </p>
      <Button asChild className="mt-6 text-xs" variant="outline">
        <Link href="/contents">
          <ArrowLeft aria-hidden="true" className="mr-1.5 size-3.5" />
          Back to Pipeline
        </Link>
      </Button>
    </div>
  );
}

