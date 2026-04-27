export type Lead = {
  id: string;
  name: string;
  product: string;
  province: string;
  source: string;
  status: "New" | "Working" | "Callback" | "Contacted";
  score: number;
  lastActivity: string;
  hot?: boolean;
  email: string;
  phone: string;
  policyId: string;
  caslVerified: boolean;
  quote: {
    status: string;
    statusTone: "warn" | "ok" | "danger";
    annualPremium: string;
    productLine: string;
    dwellingValue: string;
    deductible: string;
    quoteExpiry: string;
    coverageLiability: string;
    coverageContents: string;
    underwriter: string;
  };
  recommendations: {
    confidence: number;
    label: string;
    title: string;
    body: string;
    cta: string;
    tone: "primary" | "warn";
  }[];
  documents: { name: string; sub: string; tag: string }[];
  history: {
    icon: "call" | "sms" | "email" | "quote";
    title: string;
    sub: string;
    when: string;
  }[];
};

export const LEADS: Lead[] = [
  {
    id: "sophie",
    name: "Sophie Tremblay",
    product: "Home Insurance",
    province: "QC",
    source: "ClicAssure",
    status: "New",
    score: 93,
    lastActivity: "8 min ago",
    hot: true,
    email: "s.tremblay@gmail.com",
    phone: "+1 (514) 555-0192",
    policyId: "QC-HOM-88210",
    caslVerified: true,
    quote: {
      status: "Quoted — Pending",
      statusTone: "warn",
      annualPremium: "$1,284 / yr",
      productLine: "Home (QC)",
      dwellingValue: "$420,000",
      deductible: "$1,000",
      quoteExpiry: "May 4, 2026",
      coverageLiability: "$1M",
      coverageContents: "$85,000",
      underwriter: "Auto-Approved",
    },
    recommendations: [
      {
        confidence: 98,
        label: "TOP RECOMMENDATION",
        title: "Call Now — Quote Expires in 13 Days",
        body: "Tremblay opened quote email 3× this week. High-intent signal. Offer Home + Auto bundle discount to increase bind probability.",
        cta: "Call Now",
        tone: "primary",
      },
      {
        confidence: 74,
        label: "UPSELL OPPORTUNITY",
        title: "Offer Auto Bundle (+$340/yr)",
        body: "QC household profile matches 78% of customers who bundle Home + Auto. Bundle discount: 12% off combined premium.",
        cta: "Offer Bundle",
        tone: "warn",
      },
    ],
    documents: [
      { name: "Policy Certificate — QC-HOM-88210", sub: "GW PolicyCenter · Updated Apr 18", tag: "GW" },
      { name: "Full Quote Package", sub: "Premium breakdown · eligibility · $1,284/yr", tag: "GW" },
      { name: "Home UW Guidelines — QC", sub: "Coverage limits · exclusions · QC rules", tag: "UW" },
      { name: "CASL Consent Record", sub: "Verified Apr 10, 2026 · Source: ClicAssure", tag: "CASL" },
      { name: "Product Sheet — Home QC", sub: "Bilingual EN/FR · current version", tag: "PROD" },
      { name: "Regulatory Disclosure — QC", sub: "AMF compliance · consumer rights", tag: "COMP" },
    ],
    history: [
      { icon: "call", title: "Outbound Call — Left Voicemail", sub: "Agent: Sarah Kim · Duration: 0m 52s · Five9", when: "Today 2:14 PM" },
      { icon: "sms", title: "Inbound SMS — \"Can we talk this evening?\"", sub: "From +1 (514) 555-0192 · Twilio", when: "Today 11:02 AM" },
      { icon: "email", title: "Email Opened — Quote Ready", sub: "Marketing Cloud · 3rd open this week", when: "Yesterday" },
      { icon: "quote", title: "Quote Generated — QC-HOM-88210", sub: "Guidewire PolicyCenter · Auto-approved", when: "Apr 18" },
    ],
  },
  {
    id: "raj",
    name: "Raj Mehta",
    product: "Auto + Home Bundle",
    province: "ON",
    source: "Marketo",
    status: "Working",
    score: 81,
    lastActivity: "32 min ago",
    email: "r.mehta@outlook.com",
    phone: "+1 (416) 555-2244",
    policyId: "ON-BND-44127",
    caslVerified: true,
    quote: {
      status: "Quoted — Reviewing",
      statusTone: "warn",
      annualPremium: "$2,140 / yr",
      productLine: "Home + Auto (ON)",
      dwellingValue: "$685,000",
      deductible: "$1,500",
      quoteExpiry: "May 12, 2026",
      coverageLiability: "$2M",
      coverageContents: "$120,000",
      underwriter: "Tier-2 Review",
    },
    recommendations: [
      {
        confidence: 88,
        label: "TOP RECOMMENDATION",
        title: "Schedule Callback — Decision Maker Available After 6 PM",
        body: "Three previous calls outside work hours. Engagement pattern suggests evenings. Preferred channel: phone.",
        cta: "Schedule CB",
        tone: "primary",
      },
      {
        confidence: 67,
        label: "RETENTION RISK",
        title: "Competitor Quote Detected (Intact)",
        body: "Email referenced competitor pricing. Offer Aviva loyalty match within 48h.",
        cta: "Send Match Offer",
        tone: "warn",
      },
    ],
    documents: [
      { name: "Bundle Quote — ON-BND-44127", sub: "Home + Auto · $2,140/yr", tag: "GW" },
      { name: "Auto UW Guidelines — ON", sub: "Driver record · vehicle class", tag: "UW" },
      { name: "CASL Consent Record", sub: "Verified Mar 22, 2026", tag: "CASL" },
      { name: "Bundle Disclosure — ON", sub: "FSRA compliance", tag: "COMP" },
    ],
    history: [
      { icon: "call", title: "Outbound Call — Connected 3m 12s", sub: "Agent: Sarah Kim · Five9", when: "Today 10:40 AM" },
      { icon: "email", title: "Email Sent — Bundle Comparison", sub: "Marketing Cloud", when: "Yesterday" },
      { icon: "quote", title: "Quote Generated — ON-BND-44127", sub: "Guidewire · Pending Tier-2", when: "Apr 17" },
    ],
  },
  {
    id: "qc8821",
    name: "GW Quote #QC-8821",
    product: "Condo Insurance",
    province: "QC",
    source: "Broker",
    status: "Working",
    score: 76,
    lastActivity: "1 h ago",
    email: "broker@assurex.qc.ca",
    phone: "+1 (450) 555-8821",
    policyId: "QC-CON-08821",
    caslVerified: true,
    quote: {
      status: "Awaiting Broker Confirmation",
      statusTone: "warn",
      annualPremium: "$612 / yr",
      productLine: "Condo (QC)",
      dwellingValue: "$215,000",
      deductible: "$500",
      quoteExpiry: "Apr 30, 2026",
      coverageLiability: "$500K",
      coverageContents: "$45,000",
      underwriter: "Auto-Approved",
    },
    recommendations: [
      {
        confidence: 91,
        label: "TOP RECOMMENDATION",
        title: "Send Bind Confirmation to Broker",
        body: "Broker submitted complete docs. Auto-approve threshold met. Recommend 1-click bind.",
        cta: "Send Bind",
        tone: "primary",
      },
    ],
    documents: [
      { name: "Broker Submission Pack", sub: "Assurex · 6 attachments", tag: "GW" },
      { name: "Condo UW Guidelines — QC", sub: "Strata coverage rules", tag: "UW" },
      { name: "Regulatory Disclosure — QC", sub: "AMF compliance", tag: "COMP" },
    ],
    history: [
      { icon: "email", title: "Broker Email — Submission Complete", sub: "Assurex", when: "Today 9:15 AM" },
      { icon: "quote", title: "Quote Generated — QC-CON-08821", sub: "Guidewire · Auto-approved", when: "Apr 19" },
    ],
  },
];

export type QueueItem = {
  id: string;
  name: string;
  meta: string;
  source: string;
  score: number;
  status: string;
  ago: string;
  hot?: boolean;
  /** Use-case tags this lead belongs to (uc1..uc5). */
  uc: string[];
};

export const QUEUE: QueueItem[] = [
  { id: "sophie", name: "Sophie Tremblay", meta: "Home Insurance · QC", source: "ClicAssure", score: 93, status: "New", ago: "8 min ago", hot: true, uc: ["uc1", "uc4", "uc5"] },
  { id: "james", name: "James Okonkwo", meta: "Auto Insurance · ON", source: "Online Form", score: 87, status: "Working", ago: "22 min ago", uc: ["uc3"] },
  { id: "raj", name: "Raj Mehta", meta: "Home + Auto Bundle · ON", source: "Marketo", score: 81, status: "Working", ago: "32 min ago", uc: ["uc3", "uc4", "uc5"] },
  { id: "marie", name: "Marie-Hélène Roy", meta: "Home + Auto Bundle · QC", source: "Marketo", score: 71, status: "Callback", ago: "1 h ago", uc: ["uc2", "uc5"] },
  { id: "david", name: "David Chen", meta: "Condo Insurance · ON", source: "GW AppEvents", score: 65, status: "New", ago: "2 h ago", uc: ["uc3"] },
  { id: "qc8821", name: "GW Quote #QC-8821", meta: "Condo Insurance · QC", source: "Broker", score: 76, status: "Working", ago: "1 h ago", uc: ["uc2"] },
  { id: "priya", name: "Priya Sharma", meta: "Tenant Insurance · ON", source: "Online Form", score: 58, status: "Contacted", ago: "3 h ago", uc: ["uc3", "uc5"] },
  { id: "francois", name: "François Lavoie", meta: "PPV Insurance · QC", source: "ClicAssure", score: 42, status: "New", ago: "4 h ago", uc: ["uc1", "uc2"] },
  { id: "angela", name: "Angela Petrov", meta: "Home Insurance · BC", source: "Online Form", score: 38, status: "Callback", ago: "5 h ago", uc: ["uc3"] },
];
