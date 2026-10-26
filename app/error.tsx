"use client";

import { useEffect } from "react";
import { CircleAlert, RotateCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log unexpected errors
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center p-6 text-center">
      <Alert className="mb-6 text-left" role="alert" variant="destructive">
        <CircleAlert aria-hidden="true" className="size-4" />
        <AlertTitle>Terjadi Kesalahan</AlertTitle>
        <AlertDescription className="text-xs">
          {error.message || "Terjadi kendala saat memuat halaman ini. Silakan coba kembali."}
        </AlertDescription>
      </Alert>
      <div className="flex gap-3">
        <Button onClick={() => reset()} size="sm" type="button">
          <RotateCcw aria-hidden="true" className="mr-1.5 size-3.5" />
          Coba lagi
        </Button>
      </div>
    </div>
  );
}

