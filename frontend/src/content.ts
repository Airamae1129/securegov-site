export const site = {
  name: "SecureGov",
  company: "CyberHealth",
  country: "Ireland",
  url: "securegov.eu",
  email: "info@securegov.eu",
  phone: "+353 (046) 924 6769",
  phoneHref: "+353469246769",
  year: new Date().getFullYear(),
};

export const nav = [
  { label: "Features", href: "features" },
  { label: "Product Tour", href: "product-tour" },
  { label: "Use Cases", href: "use-cases" },
  { label: "Security", href: "security" },
  { label: "Pricing", href: "pricing" },
  { label: "Roadmap", href: "roadmap" },
];

export const hero = {
  eyebrow: "BUILT IN EUROPE · FOR EUROPEAN BUSINESSES",
  lines: ["Automated Governance.", "Instant Compliance.", "Audit-Ready."],
  sub: "SecureGov is AI-powered governance automation for policies, risks, controls and evidence — built for European SMEs and ready for NIS2, the Cyber Resilience Act and ISO 27001.",
  tagline: "No cybersecurity team? No problem.",
  cards: [
    { label: "Compliance Index", value: "78", chip: "Medium" },
    { label: "Open findings", value: "24 → 6", chip: "Improving" },
    { label: "Regulations in scope", value: "7", chip: "Auto-mapped" },
    { label: "Roadmap", value: "Month 1–3", chip: "Active" },
  ],
};

export const frameworks = ["ISO 27001", "ISO 42001", "NIS2", "CyFun", "GDPR", "CRA", "DORA"];

export const problem = {
  eyebrow: "THE PROBLEM",
  title: "EU cyber rules overlap. Your time does not.",
  body: "NIS2 and its national transpositions, the Cyber Resilience Act, DORA, GDPR, ISO 27001 — each asks for something slightly different, in slightly different words. For an SME with 10–250 staff, no security team and a real business to run, that overlap is the risk.",
  chips: ["NIS2", "Belgian NIS2 Law", "Austrian NIS Act", "KRITIS", "CRA", "DORA", "GDPR", "ISO 27001", "Cyber Solidarity Act"],
  resolution: "One control framework",
  resolutionSub: "SecureGov consolidates every obligation into a single, prioritised set of controls. One place. One plan.",
};

export const modules = [
  { id: "01", name: "Requirements Consolidation", desc: "One integrated control framework across every regulation that applies to you." },
  { id: "02", name: "Cyber Risk & Readiness Dashboard", desc: "Honest scores, live posture, and what to fix first." },
  { id: "03", name: "Strategy Builder & Roadmap Generator", desc: "A tailored 12-month plan, sequenced by impact and effort." },
  { id: "04", name: "Virtual Cyber Advisor", desc: "An AI compliance chatbot that answers in plain language, any time." },
];

export const capabilities = [
  {
    id: "evidence",
    title: "Audit Evidence Hub",
    desc: "Upload, tag and file evidence once — reuse it across every framework.",
    anim: "evidence",
  },
  {
    id: "frameworks",
    title: "Compliance Frameworks",
    desc: "Ready-made structures for ISO 27001, ISO 42001, NIS2, CyFun and GDPR.",
    anim: "frameworks",
  },
  {
    id: "ai",
    title: "AI Assistant",
    desc: "Instant answers, templates and control-mapping help, always available.",
    anim: "ai",
  },
  {
    id: "strategy",
    title: "Strategy & Roadmap Generator",
    desc: "A tailored strategy aligned to EU regulation, not a generic checklist.",
    anim: "strategy",
  },
];

export const howItWorks = [
  { step: 1, title: "Answer seven questions", desc: "About ten minutes. No preparation needed." },
  { step: 2, title: "AI builds your risk profile", desc: "It decides which regulations apply and assembles your controls framework." },
  { step: 3, title: "Self-assessment", desc: "Guided questions in plain language, with help at every step." },
  { step: 4, title: "Advisor throughout", desc: "The Virtual Cyber Advisor explains, drafts and maps controls as you go." },
  { step: 5, title: "Strategy & 12-month roadmap", desc: "A prioritised, actionable plan your board can actually read." },
];

export const useCases = [
  {
    id: "certification",
    title: "Certification readiness in 30 days",
    tags: ["CyFun", "ISO 27001"],
    problem: "Certification feels like a six-month consulting project — and it isn't obvious whether CyFun or ISO 27001 is the right fit.",
    solution: "Pick CyFun or ISO 27001 and SecureGov builds the control set for you, then tracks every control until you're ready for the assessor.",
    points: [
      "CyFun Basic, Important or Essential — or ISO 27001",
      "Statement of Applicability structured for you",
      "Readiness rises day by day as controls close",
    ],
    stat: "30 days",
    statLabel: "to an audit-ready structure",
  },
  {
    id: "gap",
    title: "Gap analysis across every regulation",
    tags: ["NIS2", "DORA", "GDPR", "CRA"],
    problem: "NIS2, DORA, GDPR, sector rules, national laws and the Cyber Resilience Act overlap — and read differently in every country.",
    solution: "Applicability rules work out which regulations and national laws apply to you, then one gap heat map shows exactly where you stand.",
    points: [
      "NIS2 and its national transpositions",
      "DORA, GDPR and sector-specific rules",
      "Cyber Resilience Act for products with digital elements",
    ],
    stat: "1 heat map",
    statLabel: "across every regime that applies",
  },
  {
    id: "self-assessment",
    title: "Guided self-assessment",
    tags: ["Plain language"],
    problem: "Security questionnaires are written for experts, not for the people actually running the business.",
    solution: "Plain-language questions with help at every step, and an honest score at the end — what's proven, what's missing and what hasn't been checked yet.",
    points: [
      "Seven questions build your risk profile",
      "Virtual Cyber Advisor explains each requirement",
      "No cybersecurity team needed",
    ],
    stat: "~10 min",
    statLabel: "to your first risk profile",
  },
  {
    id: "roadmap",
    title: "A 12-month roadmap you can follow",
    tags: ["Strategy"],
    problem: "Knowing your gaps isn't a plan — and the board wants priorities, owners and dates.",
    solution: "SecureGov turns every gap into a prioritised 12-month roadmap, sequenced by impact and effort, that your board can actually read.",
    points: [
      "Actions sequenced by impact and effort",
      "Owners and milestones for every step",
      "Progress tracked month by month",
    ],
    stat: "12 months",
    statLabel: "prioritised, actionable plan",
  },
];

export const securityPoints = [
  { title: "Platform Security", desc: "SecureGov enforces end-to-end encryption and role-based access controls to ensure only authorised users can access sensitive governance data." },
  { title: "Data Protection & Privacy", desc: "All customer data is processed and stored within EU jurisdictions, following strict GDPR-aligned privacy and retention principles." },
  { title: "Governance & Compliance", desc: "The platform is designed around ISO 27001, ISO 42001, NIS2 and GDPR governance standards, providing mapped controls and audit-ready documentation." },
  { title: "Operational Integrity", desc: "SecureGov maintains high-availability infrastructure with automated backups and tamper-resistant evidence storage to protect operational continuity." },
  { title: "AI Safety & Governance", desc: "AI features operate within strict guardrails, never training on customer data and always requiring human validation for generated governance artefacts." },
  { title: "Trust & Reliability", desc: "SecureGov follows a transparent governance model with clear incident reporting, enterprise-grade reliability and dedicated compliance support." },
];

export const securityTagline = "Built in Europe. AI-driven, validated by human experts.";

export const pricing = [
  {
    name: "Starter",
    price: "Free",
    desc: "See where you stand today.",
    features: ["1 entity (your organisation)", "Readiness dashboard", "Basic AI advisor", "Self-assessment", "1 framework"],
    cta: "Request Full Demo",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "from €99/month",
    desc: "The full platform for your whole organisation.",
    features: ["All 4 modules", "Your whole organisation (1 entity)", "Multiple frameworks", "Strategy & roadmap generator"],
    cta: "Request Full Demo",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "from €499/month",
    desc: "For groups of companies.",
    features: ["Group of companies (multi-entity)", "Expert guidance", "Audit prep", "Internal audit support"],
    cta: "Talk to us",
    highlighted: false,
  },
];

export const cta = {
  title: "Don't wait for a cyber incident or an audit.",
  sub: "Be proactive with SecureGov.",
  sizes: ["1–10", "11–50", "51–250", "250+"],
  frameworkOptions: ["NIS2", "ISO 27001", "GDPR", "DORA", "CRA", "ISO 42001", "CyFun"],
};

export const roadmapItems = [
  { title: "Automated control testing", quarter: "Q2 2027" },
  { title: "AI-driven audit remediation", quarter: "Q2 2027" },
  { title: "Multi-framework mapping", quarter: "Q3 2027" },
  { title: "Continuous compliance scoring", quarter: "Q4 2027" },
];

export const chatScripts: Record<string, { q: string; a: string }> = {
  policy: {
    q: "Generate a policy section",
    a: "Password Management (v1.3 draft)\n\nAll user accounts must be protected by unique passwords of at least 12 characters. Multi-factor authentication is required for remote access and administrator accounts. Passwords must not be reused across systems, and a password manager is provided to all staff.\n\nMapped to: ISO 27001 A.5.17 · NIS2 Art. 21(2)(j)",
  },
  risk: {
    q: "Summarise a risk",
    a: "Phishing leading to credential theft — Likelihood: High · Impact: High · Score: 16 (Critical).\n\nA targeted phishing campaign could give an attacker access to email and cloud documents. Recommended treatment: enforce MFA, run quarterly phishing simulations, and deploy email filtering with link rewriting.\n\nOwner: IT Manager · Review: monthly",
  },
  controls: {
    q: "Suggest controls for remote access",
    a: "For remote access under NIS2 and ISO 27001, we recommend:\n\n1. Multi-factor authentication on all remote sessions\n2. VPN or zero-trust network access (ZTNA)\n3. Device compliance checks before connection\n4. Quarterly access reviews with sign-off\n\nAll four map to ISO 27001 A.8.20–A.8.22 and NIS2 Art. 21(2).",
  },
};

export const supportChat = {
  agent: "SecureGov Assistant",
  status: "Online · replies in 1 working day",
  greeting:
    "Hi — I'm the SecureGov support assistant. Pick a question below, type your own, or leave a message and one of the team will come back to you within one working day.",
  footnote: "Answers here are automated. Leave a message and one of the team replies personally.",
  handoffIntro:
    "That one is best answered by a person who can look at your situation. Leave your details and one of the CyberHealth team will reply within one working day.",
  fallback:
    "I'm not sure I have a good automated answer for that, and it may be specific to you. Let's get one of the team to reply personally.",
  faqs: [
    {
      id: "what",
      q: "What is SecureGov?",
      a: "SecureGov is AI-powered governance automation for European SMEs, built in Ireland by CyberHealth. It brings policies, risks, controls and audit evidence into one place, and turns overlapping EU rules — NIS2, the Cyber Resilience Act, DORA, GDPR and ISO 27001 — into one prioritised action plan.",
      keywords: ["what is securegov", "what does securegov", "about securegov", "what do you do", "platform", "product", "who are you", "cyberhealth"],
      action: "product-tour",
    },
    {
      id: "frameworks",
      q: "Which regulations and frameworks do you cover?",
      a: "ISO 27001, ISO 42001, NIS2 (including national laws like the Belgian NIS2 Law, Austrian NIS Act and KRITIS), CyFun, GDPR, the Cyber Resilience Act and DORA. They're all consolidated into a single control framework, so one piece of evidence can count across several regulations.",
      keywords: ["regulation", "framework", "cover", "do you support", "dora", "gdpr", "cra", "cyber resilience", "42001", "kritis", "standard"],
      action: "features",
    },
    {
      id: "price",
      q: "How much does SecureGov cost?",
      a: "Starter is free for one entity, with the readiness dashboard, a basic AI advisor, self-assessment and one framework. Professional starts from €99/month with all 4 modules and multiple frameworks for your whole organisation. Enterprise starts from €499/month for groups of companies, with expert guidance, audit prep and internal audit support.",
      keywords: ["cost", "price", "pricing", "how much", "fee", "€", "euro", "plans", "free", "subscription", "cheap", "expensive", "per month"],
      action: "pricing",
    },
    {
      id: "team",
      q: "Do we need a cybersecurity team to use it?",
      a: "No — that's who it's built for. SecureGov is designed for SMEs with 10–250 staff and no dedicated security team. The Virtual Cyber Advisor explains each requirement in plain language, drafts policies and maps controls as you go.",
      keywords: ["security team", "cybersecurity team", "expert", "no security", "technical", "it person", "need someone", "small business", "sme"],
      action: null,
    },
    {
      id: "start",
      q: "How does it work and how long does setup take?",
      a: "You answer seven questions (about ten minutes, no preparation needed). SecureGov then builds your risk profile, works out which regulations apply, guides you through a plain-language self-assessment and produces a prioritised 12-month strategy and roadmap.",
      keywords: ["how does it work", "how does securegov work", "how it works", "setup", "set up", "get started", "getting started", "onboard", "how long", "minutes", "steps", "process"],
      action: "how-it-works",
    },
    {
      id: "security",
      q: "Is our data secure? Where is it hosted?",
      a: "Yes. SecureGov enforces end-to-end encryption and role-based access controls, and all customer data is processed and stored within EU jurisdictions under GDPR-aligned privacy and retention principles. Evidence storage is tamper-resistant with automated backups, and AI features never train on customer data.",
      keywords: ["secure", "safe", "data", "hosted", "hosting", "encrypt", "privacy", "data centre", "data center", "stored"],
      action: "security",
    },
    {
      id: "iso",
      q: "Can SecureGov help us get certification ready?",
      a: "Yes — ISO 27001 or CyFun. SecureGov builds your control set, structures your Statement of Applicability and tracks every control as it closes. Most teams reach an audit-ready structure in about 30 days. The certification itself is still issued by an accredited certification body.",
      keywords: ["iso 27001", "27001", "cyfun", "certif", "audit", "statement of applicability", "soa"],
      action: "use-cases",
    },
    {
      id: "nis2",
      q: "Does NIS2 apply to my company?",
      a: "It depends on your sector, size and country — and each EU country transposes NIS2 differently. SecureGov's applicability rules check this for you during setup, then show a gap heat map of exactly where you stand against your national law. For a definite answer on your own business, the team can review it with you.",
      keywords: ["nis2", "nis 2", "apply", "applies", "in scope", "essential", "important entit", "national law", "transposition"],
      action: "use-cases",
    },
  ],
  // Phrases that signal an account-, billing- or incident-specific question: these always go to a person.
  personalKeywords: [
    "my account", "our account", "login", "log in", "sign in", "password", "invoice", "billing", "refund",
    "cancel", "delete my", "complaint", "contract", "breach", "hacked", "incident", "attack",
    "ransomware", "urgent", "speak to", "talk to", "human", "a person", "real person", "call me", "phone me", "quote",
  ],
};

export const overviewVideo = {
  src: "/video/securegov-overview-v2.mp4",
  poster: "/video/securegov-overview-v2-poster.jpg",
  cta: "Watch the product overview",
  title: "SecureGov · Product overview",
};
