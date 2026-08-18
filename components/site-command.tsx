"use client"

import * as React from "react"
import { Compass, FileText, Mail, Search } from "lucide-react"
import { nav, profile } from "@/lib/content"
import { IconGithub, IconLinkedin } from "@/components/icons"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

const OPEN_EVENT = "open-command-palette"

function go(href: string) {
  if (href.startsWith("#")) {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
    history.replaceState(null, "", href)
  } else if (href.startsWith("mailto:")) {
    window.location.href = href
  } else {
    window.open(href, "_blank", "noopener,noreferrer")
  }
}

// Global, keyboard-first navigator: Cmd/Ctrl+K jumps to any section or
// external link without breaking flow. Mounted once in the root layout.
export function SiteCommand() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    const onOpenEvent = () => setOpen(true)
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener(OPEN_EVENT, onOpenEvent)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener(OPEN_EVENT, onOpenEvent)
    }
  }, [])

  const select = (href: string) => {
    setOpen(false)
    go(href)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Jump to"
      description="Navigate the site or connect"
    >
      <Command>
        <CommandInput placeholder="Jump to a section, or connect..." />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Navigate">
            {nav.map((item) => (
              <CommandItem key={item.href} onSelect={() => select(item.href)}>
                <Compass />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Connect">
            <CommandItem onSelect={() => select(`mailto:${profile.email}`)}>
              <Mail />
              Email
            </CommandItem>
            <CommandItem onSelect={() => select(profile.github)}>
              <IconGithub className="h-4 w-4" />
              GitHub
            </CommandItem>
            <CommandItem onSelect={() => select(profile.linkedin)}>
              <IconLinkedin className="h-4 w-4" />
              LinkedIn
            </CommandItem>
            <CommandItem onSelect={() => select(profile.resume)}>
              <FileText />
              Resume
              <CommandShortcut>PDF</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

export function CommandPaletteTrigger({ className }: { className?: string }) {
  return (
    <button
      type="button"
      aria-label="Open command menu"
      onClick={() => document.dispatchEvent(new CustomEvent(OPEN_EVENT))}
      className={className}
    >
      <Search className="h-4 w-4" />
    </button>
  )
}
