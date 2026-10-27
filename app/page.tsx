import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/sections/hero"
import { About } from "@/components/sections/about"
import { Thread } from "@/components/sections/thread"
import { Projects } from "@/components/sections/projects"
import { Research } from "@/components/sections/research"
import { Experience } from "@/components/sections/experience"
import { Leadership } from "@/components/sections/leadership"
import { Skills } from "@/components/sections/skills"
import { Contact } from "@/components/sections/contact"

export default function Page() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <About />
        <Thread />
        <Projects />
        <Research />
        <Experience />
        <Leadership />
        <Skills />
        <Contact />
      </main>
    </>
  )
}
