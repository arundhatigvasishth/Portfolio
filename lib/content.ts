// ---------------------------------------------------------------------------
// All site content lives here so it is easy to find and edit in one place.
// No copy is duplicated inside components.
//
// Sources: the October 2026 resume, each project's README and team table,
// git history, and the linked posts. Anything not backed by one of those is
// left out rather than guessed.
// ---------------------------------------------------------------------------

export const site = {
  url: "https://portfolio-khaki-psi-46.vercel.app",
  title: "Arundhati Vasishth",
  description:
    "Computer Science student at UMass Amherst building AI infrastructure, distributed systems, applied ML, and quantitative research tools that hold up outside a demo.",
}

export const profile = {
  name: "Arundhati Vasishth",
  location: "Amherst, MA",
  school: "Computer Science · UMass Amherst",
  tagline: "I build software that makes ambitious ideas work in the real world.",
  intro:
    "Right now that means a load balancer that can explain its own routing decisions, an LLM router that shifts down when the power grid peaks, and a regulatory assistant for Massachusetts public health inspectors.",
  email: "avasishth@umass.edu",
  github: "https://github.com/arundhatigvasishth",
  linkedin: "https://www.linkedin.com/in/arundhatigv",
  resume: "/resume.pdf",
  resumeFileName: "Arundhati-Vasishth-Resume.pdf",
}

export const about: string[] = [
  "I study computer science at UMass Amherst. Most of what I build sits where a model meets a system around it: retrieval that has to cite its sources, routers that have to stay up when a replica dies, agents that are allowed to move money only inside limits they can't talk their way out of.",
  "Outside of code, I train in Bharatanatyam and Kathak, two classical Indian dance forms, and dance Western styles for fun. Both worlds run on the same discipline: precise timing, deliberate repetition, and a lot of quiet practice before anything looks effortless.",
  "The two aren't as separate as they sound. Bharatanatyam and Kathak are built on mudras, codified hand gestures that carry meaning. FingerSolve, one of the projects below, reads hand shape in real time. Different vocabulary, same underlying question: what can a hand's shape communicate, and how precisely can that be read.",
]

// ---------------------------------------------------------------------------
// Work: featured case studies, then smaller additional projects.
// ---------------------------------------------------------------------------

export type LinkKind = "repo" | "demo" | "video" | "post" | "evidence" | "writeup"
export type WorkLink = { label: string; href: string; kind: LinkKind; note?: string }
export type Metric = { value: string; label: string; note?: string }
export type Challenge = { title: string; body: string }
export type VisualKey = "tracify" | "whyrouted" | "tokenwise" | "knowyork" | "fingersolve" | "medecho"

export type Project = {
  slug: string
  name: string
  tagline: string
  period: string
  context: string
  status?: string
  featured: boolean
  summary: string
  stack: string[]
  links: WorkLink[]
  // Case-study body.
  problem: string[]
  role: { team: string; built: string[]; note?: string }
  architecture: {
    intro: string
    visual: VisualKey
    caption: string
    image?: { src: string; alt: string; width: number; height: number; credit: string }
  }
  challenges: Challenge[]
  results: Metric[]
  resultsNote?: string
  embed?: { title: string; src: string; href: string; caption: string }
}

export const projects: Project[] = [
  {
    slug: "tracify",
    name: "Tracify",
    tagline: "A cited regulatory assistant for Massachusetts public health inspectors.",
    period: "Spring to Summer 2026",
    context: "Massachusetts EOHHS · AI for the Commonwealth",
    status: "Proof of concept",
    featured: true,
    summary:
      "A retrieval-augmented assistant for the state's Metrik inspection platform that answers questions from the official Massachusetts CMR regulations and shows where each answer came from.",
    stack: ["AWS Bedrock", "Lambda", "DynamoDB", "OpenSearch", "Python", "RAG"],
    links: [
      {
        label: "AWS AI training for Commonwealth interns",
        href: "https://www.linkedin.com/posts/umass-amherst-public-interest-technology-initiative_thank-you-to-amazon-web-services-aws-for-activity-7473459493683585025-9U7o",
        kind: "post",
      },
    ],
    problem: [
      "Local health inspectors enforce the state sanitary code, and the rules live in long regulatory PDFs. Finding the right section by hand took inspectors 2 to 10 minutes per question, often in the middle of an inspection.",
      "The answers end up in enforcement decisions that can be contested in court. A chatbot that sounds confident but invents a rule is worse than no chatbot, so every answer had to be grounded in the regulation itself and traceable back to it.",
    ],
    role: {
      team: "Built during my AI Software Engineer role at the Massachusetts Executive Office of Health & Human Services, with the AI for the Commonwealth intern team and DPH stakeholders.",
      built: [
        "Architected the AWS Bedrock RAG pipeline that grounds answers in official Massachusetts CMR documents.",
        "Ran stakeholder interviews with DPH to set the KPI benchmarks the system is measured against.",
        "Designed the audit logging, inspector feedback, and response-flagging workflows that track accuracy, completeness, citations, and retrieval quality.",
      ],
      note: "The code base belongs to the Commonwealth and is not public, so this page stays at the level of the design.",
    },
    architecture: {
      intro:
        "Regulation PDFs are chunked and embedded into a vector index. A question goes through a Lambda to a Bedrock knowledge base, which retrieves the matching sections and generates an answer that carries its citations. Every exchange is logged with the inspector's feedback, so quality is measured on real use, not just a test set.",
      visual: "tracify",
      caption: "High-level request and ingestion paths. Simplified for public view.",
    },
    challenges: [
      {
        title: "Grounded or nothing",
        body: "Answers come only from retrieved regulation text, and each one cites the section it used. When retrieval comes back thin, the right move is to say so rather than fill the gap.",
      },
      {
        title: "Measuring quality in the field",
        body: "Accuracy on a fixed question set is only part of it. Inspector feedback and flagging feed an audit log, so accuracy, completeness, citation quality, and retrieval quality can be tracked across real interactions.",
      },
      {
        title: "Defining success with the people who use it",
        body: "Before building, we interviewed DPH staff to pin down what a good answer looks like and which benchmarks matter, so the system is judged against the inspectors' workflow.",
      },
    ],
    results: [
      { value: "351", label: "local health departments in scope" },
      { value: "85%+", label: "accuracy target", note: "Benchmark set with DPH" },
      { value: "2–10 min", label: "manual search per question, replaced by a near-instant cited answer" },
    ],
    resultsNote: "The accuracy figure is a target agreed with stakeholders, not a reported production result.",
  },
  {
    slug: "whyrouted",
    name: "whyrouted",
    tagline: "A load balancer for LLM serving fleets that can explain every routing decision.",
    period: "Fall 2026",
    context: "Two-person project",
    status: "Ongoing",
    featured: true,
    summary:
      "Routes inference traffic across model replicas, survives replica failures without dropping requests, and exposes its own decision log through an MCP server so any client can ask why a request went where it did.",
    stack: ["TypeScript", "Node.js", "Express", "MCP", "Vitest"],
    links: [{ label: "Repository", href: "https://github.com/arundhatigvasishth/whyrouted", kind: "repo" }],
    problem: [
      "LLM replicas fail in ways a normal load balancer doesn't expect: a replica can pass its health check and still time out on real requests. Waiting for the next health poll means dropped requests.",
      "When something does go wrong, operators usually get a metric, not an answer. We wanted the router to keep a record of every decision, including which replicas were scored, which were excluded and why, so the question \"why did this request go there?\" has a real answer.",
    ],
    role: {
      team: "Built with Junaid Pathan. We split each milestone into two tracks against a shared contract.",
      built: [
        "Failover: request-driven ejection, the retry loop against the next-best replica, and the failover event log.",
        "Decision log: capturing the full candidate set and exclusion reasons inside the routing engine, and recording one decision per request.",
        "MCP read tools: the grounded response envelope, explain_routing_decision, and query_decisions.",
        "MCP action tools: drain and restore, the drained state in the registry, and gating all five action tools behind bearer-token auth.",
        "The integration tests for failover, the decision log, and the action tools, which drive real traffic through real replica processes.",
      ],
    },
    architecture: {
      intro:
        "A health scheduler polls every replica every 500 ms and moves it between healthy and unhealthy with hysteresis, so one bad probe can't flap it. The routing engine scores the healthy replicas with one of three strategies. If a live request fails, that replica is ejected at once and the request retries on the next-best one. Every decision lands in a log, and an MCP server answers questions from that log and the live registry.",
      visual: "whyrouted",
      caption: "Live simulation of the routing path. Click a replica to fail it and watch traffic route around it.",
    },
    challenges: [
      {
        title: "Failing faster than the health check",
        body: "Health-check ejection alone takes up to 1.5 s at the defaults. A failed live request now ejects its replica immediately and retries elsewhere, which brought detection under one second with no client-visible failures in the kill-and-revive test.",
      },
      {
        title: "Answers without guessing",
        body: "There is no LLM inside the MCP server. Every answer carries where it came from and the ids of the records it was built from. If the data can't answer a question, the tool returns no_data with what it searched, never a plausible-sounding guess.",
      },
      {
        title: "Recording what actually happened",
        body: "A retried request can take several rounds. Each round stores the scored candidates, the exclusions, and the failure that ended it, and the chosen replica is the one whose response the client actually received.",
      },
    ],
    results: [
      { value: "391", label: "automated tests passing", note: "38 files, run Oct 27, 2026" },
      { value: "<1 s", label: "failure detection with zero lost requests in the kill-and-revive test" },
      { value: "3", label: "routing strategies, swappable live" },
      { value: "9", label: "MCP tools: 4 read, 5 action" },
    ],
  },
  {
    slug: "tokenwise",
    name: "Tokenwise",
    tagline: "Energy-aware LLM routing that sizes the model to the prompt and shifts down when the grid peaks.",
    period: "Fall 2026",
    context: "Hackachusetts 2026 · Climate Tech track · Two-person team",
    featured: true,
    summary:
      "A trained classifier sorts each prompt into one of five tiers so easy questions go to small models, and a set of agents negotiates load cuts with a simulated utility when real grid demand turns red.",
    stack: ["Python", "FastAPI", "scikit-learn", "AWS Bedrock", "Ollama", "Chrome extension", "Three.js"],
    links: [
      { label: "Repository", href: "https://github.com/junaid-pathan/tokenwise", kind: "repo" },
      {
        label: "Demo video on LinkedIn",
        href: "https://www.linkedin.com/posts/arundhatigv_activity-7520341043217600512-JQuL",
        kind: "video",
      },
    ],
    problem: [
      "Every prompt runs at full power, whatever the question and whatever the grid is doing. \"What's 15% of 80?\" doesn't need the same model as \"design a distributed database\", but both usually get the big one.",
      "AI is one of the fastest-growing loads on the grid and it has no dimmer. Nothing lowers it when demand peaks.",
    ],
    role: {
      team: "Built in one day with Junaid Pathan. We worked in parallel through frozen contracts and an event bus, so the agents could still negotiate live at the end.",
      built: [
        "The triage classifier: sentence embeddings plus prompt features into a logistic regression, with a rules fallback.",
        "The grid agent that turns load into green, yellow, and red, and the coordinator that shifts traffic down a tier, defers batch work, and reports what it actually saved.",
        "The answer API, the GPU power meter reading nvidia-smi on a Colab T4, the metrics scorecard, and the Colab model host.",
        "The claude.ai content script that classifies prompts as you type, and the classic HUD.",
      ],
      note: "Junaid built the grid replay, the Bedrock client, the utility and narrator agents, the 351-town crowd simulator, the 3D Grid Room, and the side panel.",
    },
    architecture: {
      intro:
        "Prompts from the browser extension or the simulated crowd go to Triage, which picks a tier. The grid agent watches a replay of real ISO New England demand. When it goes red twice in a row, the utility agent asks for a 25% cut, the coordinator predicts what it can deliver, commits, and reports back with measured energy.",
      visual: "tokenwise",
      caption:
        "Real hourly demand for ISO New England on June 24, 2025 (EIA), the heat-wave day the demo replays, with the grid agent's thresholds.",
    },
    embed: {
      title: "Tokenwise demo",
      src: "https://www.linkedin.com/embed/feed/update/urn:li:activity:7520341043217600512",
      href: "https://www.linkedin.com/posts/arundhatigv_activity-7520341043217600512-JQuL",
      caption: "Demo from the launch post.",
    },
    challenges: [
      {
        title: "Being honest about what is real",
        body: "The classifier, the agents, the routing, and the model answers are real. The crowd and the grid day are replays. We labelled that on screen instead of letting a simulation pass as live data.",
      },
      {
        title: "Committing only to what it can deliver",
        body: "The coordinator predicts the cut from recent traffic and commits the smaller of predicted and requested, then reports achieved against baseline using measured energy, so the utility can accept or push back.",
      },
      {
        title: "Measuring energy, not assuming it",
        body: "Energy comes from nvidia-smi on the GPU when it's available and falls back to estimates that are labelled as estimates.",
      },
    ],
    results: [
      { value: "88.7%", label: "within-one-tier accuracy", note: "5-fold CV on 1,794 labelled prompts, target 85%" },
      { value: "59.2%", label: "exact-tier accuracy" },
      { value: "9", label: "models across 5 tiers, local and on AWS Bedrock" },
      { value: "25%", label: "load cut negotiated during the peak" },
    ],
    resultsNote: "We didn't make finalists at Hackachusetts. We're still working on it.",
  },
  {
    slug: "knowyork",
    name: "KnowYork",
    tagline: "An AI agent that pays people for real NYC visits, and is physically unable to overspend.",
    period: "Fall 2026",
    context: "DivHacks 2026 · Four-person team",
    featured: true,
    summary:
      "Grok decides each payout, but fixed rules, a second reviewer, and the XRPL ledger itself all get to say no. Rewards settle in RLUSD on the XRPL with soulbound stamps on Solana.",
    stack: ["TypeScript", "Node.js", "Grok", "XRPL", "RLUSD", "Solana / Metaplex", "SQLite", "Jest"],
    links: [
      { label: "Repository", href: "https://github.com/Rudra1729/KnowYork", kind: "repo" },
      {
        label: "Live evidence reports",
        href: "https://github.com/Rudra1729/KnowYork/tree/main/evidence",
        kind: "evidence",
      },
    ],
    problem: [
      "New York's overlooked places need foot traffic the most and get the least of it.",
      "Everyone talks about AI agents acting on their own, but almost nobody lets one touch real money, because a tricked agent means the money is gone. We wanted to show an agent can move money safely as long as you never fully trust it.",
    ],
    role: {
      team: "Built in one night with Rudra Patel, Tanish Gupta, and Junaid Pathan.",
      built: [
        "The Grok payout agent, the policy engine, and the orchestrator that runs every visit through the checks in order.",
        "The independent reviewer, which never sees the user's caption and can lower or reject a payout but never raise it.",
        "The solvency gate and the audit trail recorded at every step.",
        "The live check runner and evidence reports that test the system on the real XRPL testnet and Solana devnet.",
      ],
    },
    architecture: {
      intro:
        "Every visit runs a gauntlet from left to right, and any step can stop it before money moves. Grok's output is treated as untrusted input. The agent wallet's RLUSD trust line is capped at 10 on the ledger itself, and a separate guardian process holds the only treasury key.",
      visual: "knowyork",
      caption: "Choose an attack to see which layer stops it.",
      image: {
        src: "/work/knowyork-pipeline.png",
        alt: "KnowYork payment pipeline: the user sends a photo and location, Sentinel checks place, freshness, reuse and prior claims, Grok proposes an amount, a fixed-rule policy engine checks caps and recipient, the agent wallet pays RLUSD on the XRPL capped at 10, a soulbound Solana stamp is minted, a guardian refills the agent wallet from the treasury, and one decision ID links the database, payment, and stamp.",
        width: 2000,
        height: 476,
        credit: "Diagram from the KnowYork repository (MIT).",
      },
    },
    challenges: [
      {
        title: "Our own test found a real bug",
        body: "The first live run on the real networks caught a wallet being paid twice for the same place after the server restarted with an empty database. The fix made Solana the source of truth: the check now asks the chain whether the wallet already holds that stamp.",
      },
      {
        title: "Prompt injection can't redirect money",
        body: "A caption that tries to talk the agent into paying someone else changes nothing. The recipient and caps are enforced in plain code, and the reviewer never sees the caption at all.",
      },
      {
        title: "Proving the worst case",
        body: "With every app-level check deliberately bypassed, a forced 50 RLUSD payment is still refused by the XRPL, because the trust line limit lives on the ledger.",
      },
    ],
    results: [
      { value: "698", label: "automated tests in 82 suites" },
      { value: "25 / 25", label: "live checks passed on XRPL testnet and Solana devnet" },
      { value: "10 RLUSD", label: "maximum loss if the AI is fully fooled, enforced by the ledger" },
      { value: "<4 s", label: "median decision latency, with 90%+ validation accuracy" },
    ],
  },
  {
    slug: "fingersolve",
    name: "FingerSolve",
    tagline: "Touch-free math quizzes, answered with hand gestures.",
    period: "Spring 2025",
    context: "Team project · 2nd place, MassAI ML Conference",
    featured: false,
    summary:
      "MediaPipe reads 21 hand landmarks per frame and a TensorFlow classifier turns them into answers, so children and users with motor disabilities can take a quiz without a keyboard.",
    stack: ["React", "Flask", "MediaPipe", "TensorFlow / Keras"],
    links: [
      { label: "Live demo", href: "https://fingersolveai-m3py.onrender.com/", kind: "demo", note: "Free hosting, may take a minute to wake up" },
      { label: "Repository", href: "https://github.com/junaid-pathan/fingersolve", kind: "repo" },
    ],
    problem: [
      "Typing an answer is a barrier for young children and for people with limited fine motor control. A gesture is often easier than a keyboard.",
    ],
    role: {
      team: "Team project. The repository belongs to a teammate.",
      built: [
        "Real-time React and Flask platform for gesture-based math quizzes.",
        "MediaPipe Hands plus a TensorFlow/Keras classifier across 12 gestures, with a confidence-scored UI to cut input errors.",
      ],
    },
    architecture: {
      intro:
        "MediaPipe extracts 21 keypoints per hand, 63 coordinates per frame. A small neural network classifies those coordinates into a gesture, and the Flask API checks it against the quiz.",
      visual: "fingersolve",
      caption: "The 21-point hand model MediaPipe tracks. Drag to rotate. Illustrative pose, not recorded data.",
    },
    challenges: [],
    results: [
      { value: "94%", label: "classification accuracy across 12 gestures" },
      { value: "40%", label: "higher engagement in pilot testing" },
      { value: "30%", label: "fewer input errors" },
      { value: "2nd", label: "place, MassAI ML Conference", note: "Plus interest from 50+ educators" },
    ],
  },
  {
    slug: "medecho",
    name: "MedEcho",
    tagline: "Chest X-ray results explained in the patient's own language, before and after a doctor reviews them.",
    period: "Spring 2026",
    context: "HackPrinceton 2026 · Built in 24 hours",
    featured: false,
    summary:
      "A DenseNet-121 model classifies the scan, GradCAM shows the region behind the prediction, and Gemini turns findings into plain-language scripts delivered by a talking avatar in four languages.",
    stack: ["React", "Flask", "DenseNet-121", "GradCAM", "Gemini", "ElevenLabs"],
    links: [
      { label: "Demo video", href: "https://youtu.be/29njRzQxPsA", kind: "video" },
      { label: "Devpost", href: "https://devpost.com/software/medecho-8eycon", kind: "writeup" },
      { label: "Repository", href: "https://github.com/Sanshiv123/MedEcho", kind: "repo" },
    ],
    problem: [
      "Patients now often see test results before their doctor does. Reading \"opacity suggesting possible malignancy\" alone at 11pm causes panic, and for non-English speakers it can be meaningless.",
    ],
    role: {
      team: "Five-person team. The repository belongs to a teammate.",
      built: [
        "The AI explanation engine: Gemini prompts and the medical context that turn model findings into a physician report and two patient scripts, wired into every route.",
        "Shared environment configuration for the team.",
      ],
    },
    architecture: {
      intro:
        "Three portals: clinicians upload a scan, physicians review AI findings and add their assessment, and patients hear the explanation from an avatar. ClinicalTrials.gov matching runs alongside.",
      visual: "medecho",
      caption: "The path from upload to patient.",
    },
    challenges: [],
    results: [
      { value: "3", label: "portals: clinician, physician, patient" },
      { value: "4", label: "languages for patient delivery" },
      { value: "24 h", label: "from idea to working prototype" },
    ],
  },
]

export const featuredProjects = projects.filter((p) => p.featured)
export const additionalProjects = projects.filter((p) => !p.featured)

// ---------------------------------------------------------------------------
// Quantitative research at MAIF.
// ---------------------------------------------------------------------------

export type ResearchStage = "Exploratory" | "Built" | "In progress"

export type Research = {
  id: string
  title: string
  period: string
  stage: ResearchStage
  question: string
  approach: string[]
  status: string
  // Where each step of the work actually stands.
  track: { label: string; state: "done" | "active" | "open" }[]
  stack: string[]
  links?: WorkLink[]
  teamNote?: string
}

export const research = {
  org: "Minutemen Alternative Investment Fund (MAIF) · Quant Arm",
  intro:
    "As a junior analyst in MAIF's quant arm I work on research that starts with a market question and ends with code that can test it. Each project below is labelled with where it actually stands.",
  items: [
    {
      id: "edgar",
      title: "Earnings propagation across company networks",
      period: "Fall 2026",
      stage: "In progress",
      question:
        "When one company reports an earnings surprise, does it move the companies connected to it, and can a model learn that spillover from public filings?",
      approach: [
        "Investigating SEC EDGAR filing timestamps to know exactly when each piece of information became public.",
        "Building a point-in-time data pipeline, so any later model only ever sees what was knowable on that date and can't learn from the future.",
        "Planning a head-to-head evaluation: XGBoost on hand-built features against graph neural networks (GCN and GAT) that learn from the company network directly.",
      ],
      status: "Data pipeline under construction. No models have been trained yet.",
      track: [
        { label: "Research question", state: "done" },
        { label: "Point-in-time EDGAR data", state: "active" },
        { label: "XGBoost baseline", state: "open" },
        { label: "GCN / GAT comparison", state: "open" },
      ],
      stack: ["Python", "SEC EDGAR", "XGBoost (planned)", "GCN / GAT (planned)"],
    },
    {
      id: "arbitrage",
      title: "Multi-agent prediction-market arbitrage",
      period: "Spring 2026",
      stage: "Built",
      question:
        "The same question often trades on several prediction markets at different prices. Can we find pairs whose prices are inconsistent by the laws of probability, instead of betting on outcomes?",
      approach: [
        "Pull open markets from Kalshi, Polymarket, Manifold, and Metaculus into one schema.",
        "Embed every question in Qdrant and cluster close matches with KNN search.",
        "Have Groq-hosted Llama classify each cross-exchange pair into one of five relationships, then score the price gap that relationship implies.",
        "Poll live quotes for confirmed pairs and alert when the edge clears a configurable threshold.",
      ],
      status: "Working pipeline with live polling and alerts.",
      track: [
        { label: "Ingest 4 exchanges", state: "done" },
        { label: "Semantic matching", state: "done" },
        { label: "LLM relation labels", state: "done" },
        { label: "Live alerts", state: "done" },
      ],
      stack: ["Python", "Qdrant", "Groq / Llama", "httpx", "Pydantic"],
      links: [{ label: "Repository", href: "https://github.com/armaan-71/maif-prediction-market", kind: "repo" }],
      teamNote: "Team project. I wrote the semantic matcher and its classifier tests.",
    },
    {
      id: "neural-sde",
      title: "Neural SDEs for implied volatility",
      period: "Fall 2025",
      stage: "Exploratory",
      question:
        "Classic volatility models like Heston and SABR assume a fixed form and need daily recalibration. Can a neural stochastic differential equation learn how the implied-volatility surface moves directly from data?",
      approach: [
        "Recover implied volatility from option prices with Black–Scholes and lay it out across strike and expiry as a surface.",
        "Explore a Neural SDE that produces a fair-value surface for today and a forecast for tomorrow.",
        "Map the gap between model and market to options structures: straddles and strangles when volatility looks cheap, short premium when it looks rich.",
      ],
      status: "Exploratory research in Python and Jupyter notebooks. No live trading results.",
      track: [
        { label: "IV surfaces", state: "done" },
        { label: "Neural SDE exploration", state: "done" },
        { label: "Strategy mapping", state: "done" },
        { label: "Backtested results", state: "open" },
      ],
      stack: ["Python", "Jupyter", "Neural SDEs", "Options"],
      links: [
        {
          label: "Strategy write-up",
          href: "https://github.com/aahanagarg/Neural-SDE-Based-Implied-Volatility-Strategy",
          kind: "writeup",
        },
      ],
      teamNote: "Team research. The repository belongs to a teammate.",
    },
  ] satisfies Research[],
}

// The five relationships the arbitrage classifier labels, from the repo README.
export const arbRelations = [
  { name: "Identical", rule: "Same question, different price", condition: "P(A) ≠ P(B)" },
  { name: "Complement", rule: "Buy both for a guaranteed payout", condition: "P(A) + P(B) < 1" },
  { name: "Mutually exclusive", rule: "Sell both", condition: "P(A) + P(B) > 1" },
  { name: "Subset", rule: "A can't be likelier than B", condition: "A ⊂ B, P(A) > P(B)" },
  { name: "Superset", rule: "A can't be less likely than B", condition: "A ⊃ B, P(A) < P(B)" },
]

// ---------------------------------------------------------------------------
// Experience and leadership.
// ---------------------------------------------------------------------------

export type Experience = {
  id: string
  org: string
  place: string
  role: string
  period: string
  points: string[]
  pointGroups?: { period: string; points: string[] }[]
  link?: { label: string; href: string }
  feature?: { image: string; alt: string; caption: string; href: string; aspect?: "3/2" | "3/4" }
  logo?: { src: string; alt: string }
}

export const experience: Experience[] = [
  {
    id: "eohhs",
    org: "Massachusetts Executive Office of Health & Human Services (EOHHS)",
    place: "Boston, MA",
    role: "AI Software Engineer",
    period: "Spring to Summer 2026",
    points: [
      "Built an AI regulatory assistant for the Department of Public Health's statewide Metrik platform, targeting 85%+ accuracy across 351 local health departments and 5 inspection domains.",
      "Architected an AWS Bedrock RAG pipeline grounded in official Massachusetts CMR documents, giving near-instant answers in place of 2 to 10 minute manual document searches.",
      "Designed statewide audit logging, inspector feedback, and response-flagging workflows to track accuracy, completeness, citations, and retrieval quality.",
    ],
    link: { label: "Read the Tracify case study", href: "/work/tracify" },
    feature: {
      image: "/experience/aws-ai-training.jpg",
      alt: "AI for the Commonwealth interns and AWS trainers outside the UMass Amherst Computer Science Laboratories building",
      caption: "AWS AI training for Commonwealth interns",
      href: "https://www.linkedin.com/posts/umass-amherst-public-interest-technology-initiative_thank-you-to-amazon-web-services-aws-for-activity-7473459493683585025-9U7o",
    },
    logo: { src: "/logos/eohhs.jpg", alt: "Massachusetts Executive Office of Health & Human Services seal" },
  },
  {
    id: "maif",
    org: "Minutemen Alternative Investment Fund (MAIF)",
    place: "Amherst, MA",
    role: "Junior Analyst, Quant Arm",
    period: "Fall 2025 to Present",
    points: [],
    pointGroups: [
      {
        period: "Fall 2026",
        points: [
          "Researching earnings-surprise spillovers across company networks: building a point-in-time SEC EDGAR pipeline and planning an XGBoost vs. GCN/GAT evaluation.",
        ],
      },
      {
        period: "Spring 2026",
        points: [
          "Built a multi-agent NLP pipeline across Kalshi, Polymarket, Manifold, and Metaculus using Qdrant embeddings, KNN clustering, and Groq/Llama classification of 5 semantic relationships, with live quote polling and profit-threshold alerts.",
        ],
      },
      {
        period: "Fall 2025",
        points: [
          "Explored neural stochastic differential equations for implied-volatility modeling and options strategy research in Python and Jupyter.",
        ],
      },
    ],
    link: { label: "See the research", href: "/#research" },
    logo: { src: "/logos/maif.jpg", alt: "Minutemen Alternative Investment Fund logo" },
  },
  {
    id: "iisc",
    org: "Indian Institute of Science (IISc)",
    place: "Bangalore, India",
    role: "Machine Learning Research Intern",
    period: "Summer 2025",
    points: [
      "Evaluated 6 ML and deep learning pipelines (SVM, CNN, XGBoost, PCA hybrids, and VGG16 transfer learning) on 8,700+ chest X-ray and brain MRI images.",
      "Reached up to 96% test accuracy on brain MRI and 95% on chest X-rays, measuring accuracy, F1, ROC-AUC, and log-loss across multiple splits with a group of 11 researchers.",
    ],
    link: {
      label: "View repository",
      href: "https://github.com/arundhatigvasishth/Comparitive-Ananlysis-of-Hybrid-ML-and-DL-Models-for-Medical-Image-Classification",
    },
    feature: {
      image: "/experience/iisc-summer-internship.jpg",
      alt: "Arundhati Vasishth standing in front of the main building at the Indian Institute of Science, Bangalore",
      caption: "Medical AI research internship at IISc",
      href: "https://www.linkedin.com/posts/arundhatigv_iisc-medicalai-summerinternship-ugcPost-7352349538302545920-oAGJ/",
      aspect: "3/4",
    },
    logo: { src: "/logos/iisc.svg", alt: "Indian Institute of Science crest" },
  },
]

export type Leadership = {
  id: string
  role: string
  org: string
  period?: string
  summary: string
  link?: { label: string; href: string }
  logo?: { src: string; alt: string }
}

export const leadership: Leadership[] = [
  {
    id: "uca",
    role: "Undergraduate Course Assistant, COMPSCI 198C",
    org: "Manning College of Information and Computer Sciences, UMass Amherst",
    period: "Spring 2026",
    summary:
      "Helped students through a hands-on C practicum: data types, macros, formatted I/O, pointers and linked lists, and building with gcc and make, through labs, office hours, and one-on-one debugging.",
    logo: { src: "/logos/umass-m.png", alt: "UMass Amherst Collegiate M" },
  },
  {
    id: "hackumass",
    role: "Organizer, Technical and Public Relations Teams",
    org: "HackUMass",
    period: "Fall 2025 to Present",
    summary:
      "Build on the PostgreSQL, Express, React, and Node platform behind the hackathon, including participant portals, organizer dashboards, and internal tools, and help run outreach for one of UMass Amherst's flagship events.",
    link: { label: "hackumass.com", href: "https://hackumass.com" },
    logo: { src: "/logos/hackumass.jpg", alt: "HackUMass logo" },
  },
  {
    id: "codecollab",
    role: "Head of Sponsorship and Tech Team Member",
    org: "UMass CodeCollab",
    summary:
      "Lead sponsor relationships for the club and contribute to its tech team. CodeCollab runs FinHack$, a fintech hackathon at UMass.",
  },
  {
    id: "admissions",
    role: "International Admissions Fellow",
    org: "UMass Amherst",
    summary: "Help prospective international students understand what studying at UMass Amherst is actually like.",
  },
]

// ---------------------------------------------------------------------------
// Proof: numbers that can be checked against a public source.
// ---------------------------------------------------------------------------

export const proof = [
  { value: "391", label: "tests passing in whyrouted", href: "https://github.com/arundhatigvasishth/whyrouted" },
  { value: "25 / 25", label: "KnowYork live checks on real networks", href: "https://github.com/Rudra1729/KnowYork/tree/main/evidence" },
  { value: "88.7%", label: "Tokenwise within-one-tier accuracy", href: "https://github.com/junaid-pathan/tokenwise" },
  { value: "2nd", label: "place at the MassAI ML Conference for FingerSolve", href: "/work/fingersolve" },
]

// ---------------------------------------------------------------------------
// Skills, education, contact, navigation.
// ---------------------------------------------------------------------------

export type SkillGroup = { label: string; items: string[] }

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["Python", "TypeScript", "Java", "C", "JavaScript", "SQL", "HTML/CSS"],
  },
  {
    label: "Systems & Cloud",
    items: [
      "Node.js",
      "Express",
      "React",
      "Flask",
      "FastAPI",
      "AWS Bedrock",
      "Lambda",
      "DynamoDB",
      "OpenSearch",
      "PostgreSQL",
      "MongoDB",
      "Git",
    ],
  },
  {
    label: "AI & Data",
    items: [
      "RAG",
      "LLM integration",
      "MCP",
      "Qdrant",
      "TensorFlow/Keras",
      "MediaPipe",
      "XGBoost",
      "Grok",
      "XRPL",
      "Solana/Metaplex",
    ],
  },
]

export const education = {
  school: "University of Massachusetts, Amherst",
  degree: "BS, Computer Science",
  place: "Amherst, MA",
  honors: ["GPA: 3.83", "Chancellor's Award", "Dean's List Honoree"],
  expected: "Expected Fall 2028",
}

export const contact = {
  heading: "Let's talk",
  subtext: "Reach out about work, research, or a project idea.",
}

export const nav = [
  { label: "Work", href: "/#projects" },
  { label: "Research", href: "/#research" },
  { label: "Experience", href: "/#experience" },
  { label: "Leadership", href: "/#leadership" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
]
