import type { MetadataRoute } from "next"
import { projects, site } from "@/lib/content"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: site.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({
      url: `${site.url}/work/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p.featured ? 0.8 : 0.6,
    })),
    { url: `${site.url}/resume.pdf`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ]
}
