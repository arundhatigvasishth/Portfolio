"use client"

import { useState } from "react"
import { ArrowUpRight, Play } from "lucide-react"

// Click-to-load, so LinkedIn's player and trackers only load when someone
// actually wants the video.
export function VideoEmbed({ title, src, href, caption }: { title: string; src: string; href: string; caption: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <figure className="flex flex-col items-center gap-3">
      {loaded ? (
        <iframe
          src={src}
          title={title}
          className="h-[640px] w-full max-w-[520px] rounded-2xl border border-border bg-card"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="group flex aspect-video w-full max-w-[720px] flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-secondary/60 transition-colors duration-300 ease-apple hover:bg-secondary"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lift transition-transform duration-300 ease-apple group-hover:scale-105">
            <Play className="ml-1 h-7 w-7" />
          </span>
          <span className="text-sm font-medium text-foreground">Play the demo</span>
          <span className="text-xs text-muted-foreground">Loads the video from LinkedIn</span>
        </button>
      )}
      <figcaption className="flex flex-wrap items-center justify-center gap-x-3 text-xs text-muted-foreground">
        {caption}
        <a href={href} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-0.5 text-primary hover:underline">
          Open the post on LinkedIn
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </figcaption>
    </figure>
  )
}
