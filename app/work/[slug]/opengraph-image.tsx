import { projects, profile } from "@/lib/content"
import { ogSize, renderOg } from "@/lib/og"

export const alt = "Case study by Arundhati Vasishth"
export const size = ogSize
export const contentType = "image/png"

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug) ?? projects[0]
  return renderOg({ eyebrow: `Case study · ${profile.name}`, title: project.name, subtitle: project.tagline })
}
