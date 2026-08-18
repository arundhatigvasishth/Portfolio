"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { TextPlate } from "@/components/text-plate"

export function CopyEmailButton({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false)

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      toast.success("Email copied to clipboard")
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      toast.error("Couldn't copy — select the address manually")
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Copy email address ${email}`}
      className={cn(
        "group inline-flex items-center gap-1.5 font-mono text-sm text-muted-foreground transition-colors hover:text-accent",
        className,
      )}
    >
      <TextPlate className="px-1 py-0.5 -mx-1 -my-0.5">{email}</TextPlate>
      {copied ? (
        <Check className="h-3.5 w-3.5 text-accent" />
      ) : (
        <Copy className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </button>
  )
}
