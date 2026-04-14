import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "bg-card border border-border text-foreground shadow-lg rounded-xl text-sm font-body",
          title: "font-semibold",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-foreground",
          success: "border-primary/40",
          error: "border-destructive/40",
        },
        duration: 4000,
      }}
    />
  );
}

export { toast } from "sonner";
