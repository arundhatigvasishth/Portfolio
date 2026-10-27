"use client"

import dynamic from "next/dynamic"
import type { VisualKey } from "@/lib/content"
import { FlowDiagram, type FlowLane } from "@/components/work/flow-diagram"
import { WhyroutedSim } from "@/components/work/whyrouted-sim"
import { TokenwiseGrid } from "@/components/work/tokenwise-grid"
import { KnowYorkGauntlet } from "@/components/work/knowyork-gauntlet"
import { FingerSolveQuiz } from "@/components/work/fingersolve-quiz"
import { MedEchoTranslate } from "@/components/work/medecho-translate"

// Three.js only loads on the page that shows the hand.
const HandLandmarks3D = dynamic(
  () => import("@/components/work/hand-landmarks-3d").then((m) => m.HandLandmarks3D),
  { ssr: false, loading: () => <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-secondary" /> },
)

// Simplified for public view: only services already listed on the resume.
const tracifyLanes: FlowLane[] = [
  {
    label: "Ask",
    nodes: [
      { title: "Inspector", sub: "Plain-language question" },
      { title: "Lambda", sub: "Request handling" },
      { title: "Bedrock knowledge base", sub: "Retrieve, then generate", accent: true },
      { title: "Cited answer", sub: "Each claim points to a CMR section" },
    ],
  },
  {
    label: "Index",
    nodes: [
      { title: "CMR regulations", sub: "Official PDFs" },
      { title: "Chunk and embed", sub: "Section-aware" },
      { title: "OpenSearch", sub: "Vector index", accent: true },
    ],
  },
  {
    label: "Measure",
    nodes: [
      { title: "Inspector feedback", sub: "Ratings and flags" },
      { title: "DynamoDB", sub: "Audit log of every exchange" },
      { title: "Quality tracking", sub: "Accuracy, completeness, citations, retrieval", accent: true },
    ],
  },
]

const medechoLanes: FlowLane[] = [
  {
    label: "Before review",
    nodes: [
      { title: "Clinician upload", sub: "Scan, symptoms, language" },
      { title: "DenseNet-121", sub: "Condition, confidence, urgency" },
      { title: "GradCAM", sub: "Where the model looked" },
      { title: "Gemini", sub: "Physician report and patient script", accent: true },
      { title: "Avatar", sub: "First explanation, in the patient's language" },
    ],
  },
  {
    label: "After review",
    nodes: [
      { title: "Physician", sub: "Reviews and adds assessment" },
      { title: "Gemini", sub: "Rewrites it in plain language", accent: true },
      { title: "ElevenLabs + avatar", sub: "Full explanation, face to face" },
    ],
  },
]

export function ProjectVisual({ visual, compact = false }: { visual: VisualKey; compact?: boolean }) {
  switch (visual) {
    case "whyrouted":
      return <WhyroutedSim compact={compact} />
    case "tokenwise":
      return <TokenwiseGrid compact={compact} />
    case "knowyork":
      return <KnowYorkGauntlet compact={compact} />
    case "tracify":
      return <FlowDiagram lanes={tracifyLanes} compact={compact} />
    case "medecho":
      return compact ? <MedEchoTranslate /> : <FlowDiagram lanes={medechoLanes} />
    case "fingersolve":
      return compact ? <FingerSolveQuiz /> : <HandLandmarks3D />
  }
}
