// ---------------------------------------------------------------------------
// All site content lives here so it is easy to find and edit in one place.
// No copy is duplicated inside components.
// ---------------------------------------------------------------------------

export const profile = {
  name: "Arundhati Vasishth",
  location: "Amherst, MA",
  tagline: "CS @ UMass Amherst, building AI systems powered by rhythm.",
  email: "avasishth@umass.edu",
  github: "https://github.com/arundhatigvasishth",
  linkedin: "https://www.linkedin.com/in/arundhatigv",
  resume: "/resume.pdf",
}

export const about: string[] = [
  "I'm a computer science student at UMass Amherst focused on applied AI: RAG pipelines, LLM systems, and machine learning that has to hold up in front of real stakes, from public health enforcement to medical imaging.",
  "Outside of code, I train in Bharatanatyam and Kathak, two classical Indian dance forms, and dance Western styles for fun. Both worlds run on the same discipline: precise timing, deliberate repetition, and a lot of quiet practice before anything looks effortless.",
  "The two aren't as separate as they sound. Bharatanatyam and Kathak are built on mudras, codified hand gestures that carry meaning. FingerSolve, one of the projects below, is a real-time hand-gesture recognition system. Different vocabulary, same underlying question: what can a hand's shape communicate, and how precisely can that be read.",
]

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
}

export const experience: Experience[] = [
  {
    id: "eohhs",
    org: "Massachusetts Executive Office of Health & Human Services (EOHHS)",
    place: "Boston, MA",
    role: "AI Software Engineer",
    period: "Spring to Summer 2026",
    points: [
      "Built an AI-powered regulatory chatbot for Massachusetts DPH's statewide public health platform (Metrik), targeting 85%+ accuracy across 351 local health departments and 5 inspection domains.",
      "Architected a RAG pipeline on AWS Bedrock with Amazon Kendra, grounding all responses in official Massachusetts CMR documents to eliminate hallucination risk for court-level enforcement decisions.",
      "Conducted stakeholder interviews with DPH to define KPI benchmarks, reducing inspector document search time from 2 to 10 minutes per query to near-instantaneous AI responses.",
      "Designed audit logging, inspector feedback, and flagging systems to continuously monitor response accuracy, completeness, and recall across all inspection domains statewide.",
    ],
    feature: {
      image: "/experience/aws-ai-training.jpg",
      alt: "AI for the Commonwealth interns and AWS trainers outside the UMass Amherst Computer Science Laboratories building",
      caption: "AWS AI training for Commonwealth Interns",
      href: "https://www.linkedin.com/posts/umass-amherst-public-interest-technology-initiative_thank-you-to-amazon-web-services-aws-for-activity-7473459493683585025-9U7o",
    },
  },
  {
    id: "uca",
    org: "Manning College of Information and Computer Sciences, UMass Amherst",
    place: "Amherst, MA",
    role: "Undergraduate Course Assistant, COMPSCI 198C",
    period: "Spring 2026",
    points: [
      "Supported a hands-on practicum focused on systems-level programming in C, assisting students with core concepts including data types, functions, macros, formatted I/O, and pointer manipulation using linked lists.",
      "Guided students through development workflows using tools such as gcc and make.",
      "Reinforced programming fundamentals and debugging skills through labs, office hours, and one-on-one guidance.",
    ],
  },
  {
    id: "maif",
    org: "MAIF (Quant Arm)",
    place: "Amherst, MA",
    role: "Junior Analyst",
    period: "Fall 2025 to Present",
    points: [],
    pointGroups: [
      {
        period: "Fall 2025",
        points: [
          "Built and evaluated a volatility research pipeline, backtesting forecasting models and trading strategies with performance metrics (Sharpe ratio, drawdown, PnL) to assess risk-return trade-offs and robustness across market regimes.",
          "Automated data workflows to improve reliability and efficiency, and worked with senior analysts to interpret results and refine execution logic that informed strategy decisions.",
        ],
      },
      {
        period: "Spring 2026",
        points: [
          "Built a multi-agent NLP pipeline semantically matching prediction-market contracts across 4 exchanges (Kalshi, Polymarket, Manifold, Metaculus) to identify deterministic arbitrage pairs instead of directional bets.",
          "Designed a pipeline embedding market questions into a Qdrant vector DB, clustering via KNN, and using an LLM (Groq/Llama) to classify semantic relationships, then built a live polling service that alerts when profit edge exceeds a configurable threshold.",
        ],
      },
    ],
  },
  {
    id: "hackumass",
    org: "HackUMass",
    place: "Amherst, MA",
    role: "Organizer, Technical & Public Relations Team",
    period: "Fall 2025 to Present",
    points: [
      "Engineering and expanding the PERN (PostgreSQL, Express.js, React.js, and Node.js) platform that powers HackUMass, developing participant portals, organizer dashboards, and internal tools that support end-to-end event operations.",
      "Designing and implementing full-stack features while collaborating with cross-functional organizer teams to deliver scalable, reliable, and user-focused experiences across the HackUMass platform.",
      "Coordinating technical development alongside public relations initiatives to support the planning, execution, and community engagement efforts for one of UMass Amherst's flagship hackathons.",
    ],
  },
  {
    id: "iisc",
    org: "Indian Institute of Science (IISc)",
    place: "Bangalore, India",
    role: "Machine Learning Research Intern",
    period: "Summer 2025",
    points: [
      "Conducted a comparative study of 6 machine learning and deep learning pipelines (SVM, PCA-SVM, CNN, XGBoost, PCA-XGBoost, and CNN-XGBoost) for medical image classification using 8,700+ chest X-ray and brain MRI images across binary and multi-class tasks.",
      "Implemented VGG16 transfer learning and hybrid CNN-XGBoost pipelines, achieving up to 96% test accuracy on brain MRI classification and 95% on chest X-ray classification.",
      "Evaluated model robustness across multiple train-validation-test splits and collaborated with 11 researchers to publish findings identifying hybrid deep learning architectures as the most reliable approach for limited-data medical imaging.",
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
  },
]

export type Project = {
  id: string
  name: string
  tagline: string
  meta: string
  teamNote?: string
  callout?: string
  points: string[]
  tech: string[]
  link?: { label: string; href: string }
}

export const projects: Project[] = [
  {
    id: "fingersolve",
    name: "FingerSolve",
    tagline: "AI-powered hand gesture recognition for touch-free math quizzes.",
    meta: "Spring 2025 · Amherst, MA",
    teamNote: "Team-built. Repository belongs to a teammate.",
    callout:
      "Mudras in Bharatanatyam and Kathak are codified hand gestures with fixed meaning. This project reads gesture shape in real time for the same reason.",
    points: [
      "Built a real-time gesture-recognition learning tool for touch-free math quizzes, improving engagement for children and users with disabilities by 40% during pilot testing.",
      "Engineered a React/Flask platform using MediaPipe Hands and TensorFlow/Keras, achieving 94% gesture-classification accuracy across 12 gestures.",
      "Designed a dynamic UI with confidence scoring, reducing user input errors by 30%. Earned 2nd place at the MassAI ML Conference.",
    ],
    tech: ["React", "Flask", "MediaPipe", "TensorFlow/Keras"],
    link: { label: "View repository", href: "https://github.com/junaid-pathan/fingersolve" },
  },
  {
    id: "medecho",
    name: "MedEcho",
    tagline: "AI-powered medical results translator with a talking avatar.",
    meta: "Spring 2026 · Amherst, MA",
    teamNote: "Team-built.",
    points: [
      "Built a 3-portal system where a DenseNet-121 CNN classifies chest X-ray findings and GradCAM highlights the region driving the prediction, turning raw scans into plain-language explanations.",
      "Used Gemini to generate patient scripts and ElevenLabs + HeyGen's LiveAvatar to deliver diagnoses out loud, face-to-face, in 4 languages, before and after physician review.",
      "Added a clinical-trial matching feature using the ClinicalTrials.gov API; built the full Flask/React prototype in 24 hours.",
    ],
    tech: ["React", "Flask", "DenseNet-121", "Gemini", "ElevenLabs"],
    link: { label: "View repository", href: "https://github.com/Sanshiv123/MedEcho" },
  },
  {
    id: "ecoforecast",
    name: "EcoForecast",
    tagline: "Full-stack sustainability analytics platform for small businesses.",
    meta: "Spring 2026 · Amherst, MA",
    points: [
      "Built a full-stack sustainability platform simulating 20-year financial ROI and carbon impact of green investments for small businesses using custom TypeScript/Node.js financial models.",
      "Developed backend APIs and MongoDB workflows to process quarterly utility data (electricity, water, fuel) and generate cost projections, break-even analysis, and carbon reduction estimates.",
      "Integrated a React analytics dashboard with 4+ visualizations and a LLaMA 3.3-powered AI advisor to provide context-aware sustainability insights.",
    ],
    tech: ["TypeScript", "Node.js", "MongoDB", "React", "LLaMA 3.3"],
    link: { label: "View repository", href: "https://github.com/arundhatigvasishth/EcoForecast" },
  },
]

export type SkillGroup = { label: string; items: string[] }

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["Python", "Java", "C", "TypeScript", "JavaScript", "HTML/CSS"],
  },
  {
    label: "Frameworks & Cloud",
    items: [
      "React.js",
      "Node.js",
      "Express",
      "Flask",
      "TensorFlow/Keras",
      "AWS (Bedrock, Kendra)",
      "PostgreSQL",
      "MongoDB",
      "REST APIs",
      "GCC/Make",
      "Git",
    ],
  },
  {
    label: "Data & AI",
    items: [
      "RAG pipelines",
      "LLM integration",
      "Statistical analysis",
      "Data modeling",
      "Visualization",
      "Hypothesis testing",
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
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
]
