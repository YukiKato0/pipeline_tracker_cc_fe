import { CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BackendErrorAlertProps {
  message: string;
}

export function BackendErrorAlert({ message }: BackendErrorAlertProps) {
  return (
    <Alert className="mb-5 grid-cols-[18px_1fr] items-start rounded-[7px] border-feedback-destructive-border bg-feedback-destructive-bg px-3.75 py-3.25 text-feedback-destructive-text [&>svg]:mt-px [&>svg]:text-feedback-destructive-icon **:data-[slot=alert-title]:text-[11px] **:data-[slot=alert-title]:font-semibold **:data-[slot=alert-description]:text-[10px] **:data-[slot=alert-description]:leading-normal **:data-[slot=alert-description]:text-feedback-destructive-text">
      <CircleAlert aria-hidden="true" />
      <AlertTitle>Koneksi Server Tertunda</AlertTitle>
      <AlertDescription>
        {message}. Pastikan server backend aktif di endpoint yang terkonfigurasi. Anda juga dapat membuka sampel pratinjau di bawah.
      </AlertDescription>
    </Alert>
  );
}