import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

// Solid, borderless patch in the page background color. Sits behind text so
// the fixed MudraField canvas is never visible through any letter.
export function TextPlate({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span className={cn("bg-background box-decoration-clone px-1 -mx-1 py-0.5 -my-0.5", className)}>
      {children}
    </span>
  )
}
