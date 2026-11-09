import { useState, type ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export const inputCls =
  "w-full rounded-xl border border-[#CFCFCF] bg-background px-3 py-2 text-[15px] text-ink outline-none focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-ink";

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5 type-small font-medium text-ink", className)}>
      {label}
      {children}
    </label>
  );
}

export function AdminTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-[28px] font-medium tracking-tight text-ink md:text-[34px]">{title}</h1>
      {action}
    </div>
  );
}

export function Box({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-background p-5", className)}>
      {children}
    </div>
  );
}

/** Confirm dialog wrapper: renders trigger, asks before running onConfirm. */
export function ConfirmButton({
  label,
  title,
  description,
  onConfirm,
  className,
}: {
  label: ReactNode;
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "type-small font-medium text-destructive underline underline-offset-4",
          className,
        )}
      >
        {label}
      </button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void onConfirm()}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
