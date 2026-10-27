import { profile } from "@/lib/content"
import { ogSize, renderOg } from "@/lib/og"

export const alt = "Arundhati Vasishth: I build software that makes ambitious ideas work in the real world."
export const size = ogSize
export const contentType = "image/png"

export default function Image() {
  return renderOg({ eyebrow: profile.school, title: profile.name, subtitle: profile.tagline })
}
