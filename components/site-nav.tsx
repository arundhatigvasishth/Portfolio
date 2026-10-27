"use client"

import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { nav, profile } from "@/lib/content"
import { ThemeToggle } from "@/components/theme-toggle"
import { CommandPaletteTrigger } from "@/components/site-command"

const iconButton =
  "inline-flex h-8 w-8 items-center justify-center rounded-full text-foreground/70 transition-colors duration-200 ease-apple hover:bg-foreground/[0.06] hover:text-foreground"

export function SiteNav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const frosted = scrolled || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ease-apple ${
        frosted ? "glass border-border" : "border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-8">
        <a href="/#top" className="text-[15px] font-semibold tracking-tight text-foreground">
          Arundhati Vasishth
        </a>

        <div className="hidden items-center gap-6 lg:flex">
          <ul className="flex items-center gap-1 text-[13px]">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-3 py-1.5 text-foreground/70 transition-colors duration-200 ease-apple hover:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-1">
            <CommandPaletteTrigger className={iconButton} />
            <ThemeToggle />
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer noopener"
              className="ml-2 rounded-full bg-primary px-3.5 py-1.5 text-[13px] font-medium text-primary-foreground transition-opacity duration-200 ease-apple hover:opacity-90"
            >
              Resume
            </a>
          </div>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <CommandPaletteTrigger className={iconButton} />
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={iconButton}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border lg:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-8">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-border py-3.5 text-lg font-medium tracking-tight text-foreground/90 transition-colors hover:text-primary"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={profile.resume}
                onClick={() => setOpen(false)}
                className="block py-3.5 text-lg font-medium tracking-tight text-primary"
              >
                Resume
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
