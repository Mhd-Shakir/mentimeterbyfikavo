import * as React from "react";
import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "min-h-11 w-full rounded-xl border border-surface-border bg-white px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-fikavo-500 focus:ring-2 focus:ring-fikavo-500/20",
        props.className
      )}
    />
  );
}
