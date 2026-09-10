import { Info } from "lucide-react";

import { DISCLAIMER } from "@/lib/prompts";
import { cn } from "@/lib/utils";

export function Disclaimer({ className }: { className?: string }) {
  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/8 px-4 py-3",
        className,
      )}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <p className="text-xs leading-relaxed text-foreground/80 sm:text-sm">{DISCLAIMER}</p>
    </div>
  );
}
