"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  return (
    <ToastProvider>
      <ToastViewport />
      <Toast>
        <div className="grid gap-1">
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastClose />
      </Toast>
    </ToastProvider>
  );
}
