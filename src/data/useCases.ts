export type UseCase = {
  id: string;
  code: string;
  title: string;
  asIs: string;
  toBe: string;
  integrations: string[];
  flowAsIs: string[];
  flowToBe: string[];
  demo: {
    kind: "clicassure" | "qcOnline" | "ontario" | "five9" | "marketo";
  };
};

export const USE_CASES: UseCase[] = [
  {
    id: "uc1",
    code: "UC1",
    title: "ClicAssure Integration",
    asIs: "ClicAssure → GW → LM (3rd party aggregator feeds LM directly)",
    toBe: "ClicAssure → GW PolicyCenter → AWS EventBridge → Salesforce. No LM hop.",
    integrations: ["Guidewire AppEvents", "Qlik", "SMS (Twilio on-prem)"],
    flowAsIs: ["ClicAssure", "Guidewire", "Legacy LM"],
    flowToBe: ["ClicAssure", "GW PolicyCenter", "AWS EventBridge", "Salesforce"],
    demo: { kind: "clicassure" },
  },
  {
    id: "uc2",
    code: "UC2",
    title: "QC Online Quotes",
    asIs: "Online QC quotes land in LM from Guidewire. Agents work in LM.",
    toBe: "GW AppEvent → EventBridge → Salesforce Lead object. French UI for QC agents.",
    integrations: ["Guidewire AppEvents", "Qlik", "SMS on-prem"],
    flowAsIs: ["Online QC Form", "Guidewire", "Legacy LM (FR)"],
    flowToBe: ["Online QC Form", "GW AppEvent", "EventBridge", "Salesforce (FR UI)"],
    demo: { kind: "qcOnline" },
  },
  {
    id: "uc3",
    code: "UC3",
    title: "Ontario / National Quotes",
    asIs: "Inbound quotes land in both LM and GW simultaneously (dual destination).",
    toBe: "Single AppEvent path → EventBridge → Salesforce only. LM decommissioned.",
    integrations: ["Guidewire AppEvents", "Qlik"],
    flowAsIs: ["Inbound Quote", "Guidewire", "Legacy LM (dual write)"],
    flowToBe: ["Inbound Quote", "GW AppEvent", "EventBridge", "Salesforce"],
    demo: { kind: "ontario" },
  },
  {
    id: "uc4",
    code: "UC4",
    title: "Outbound Dialer (Five9)",
    asIs: "GW + Five9 integration routed via LM for outbound dialer campaigns.",
    toBe: "SF Five9 CTI adapter: list sync, auto-dialler, key data fields synced for BI reporting.",
    integrations: ["Guidewire", "Five9 (2-way CTI)"],
    flowAsIs: ["Guidewire", "Legacy LM", "Five9 Dialer"],
    flowToBe: ["Guidewire", "Salesforce", "Five9 CTI Adapter"],
    demo: { kind: "five9" },
  },
  {
    id: "uc5",
    code: "UC5",
    title: "Marketo Integration",
    asIs: "LM adds leads to Marketo. Email & landing page campaigns managed in Marketo.",
    toBe: "SF ↔ Marketo 2-way sync; Salesforce campaigns trigger Marketo; closed-loop attribution.",
    integrations: ["Salesforce ↔ Marketo API", "Qlik", "Twilio SMS"],
    flowAsIs: ["Legacy LM", "Marketo", "Email / Landing"],
    flowToBe: ["Salesforce", "Marketo (2-way)", "Email / Landing", "Closed-loop BI"],
    demo: { kind: "marketo" },
  },
];
