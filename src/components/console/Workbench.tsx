import { useMemo, useState, useEffect, useRef } from "react";
import { LEADS, QUEUE, type Lead } from "@/data/mock";
import { USE_CASES } from "@/data/useCases";
import {
  UseCaseSpotlightStrip,
  UseCaseRailPanel,
  ucBadgeClass,
  type UseCaseId,
} from "@/components/console/UseCaseSpotlight";
import { toast } from "sonner";
import {
  Search,
  Phone,
  PhoneOff,
  Pause,
  MessageSquare,
  Activity,
  ArrowRightLeft,
  CalendarClock,
  FileText,
  Sparkles,
  X,
  Plus,
  CheckCircle2,
  Mail,
  FileCheck2,
  Zap,
  Shield,
  Send,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type CallState = "idle" | "ringing" | "on-call" | "hold";

const FILTERS = ["All", "My Queue", "QC", "ON"] as const;

export function Workbench() {
  const [openTabs, setOpenTabs] = useState<string[]>(["sophie", "raj", "qc8821"]);
  const [activeTab, setActiveTab] = useState<string>("sophie");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [search, setSearch] = useState("");
  const [callState, setCallState] = useState<CallState>("idle");
  const [callSeconds, setCallSeconds] = useState(0);
  const [convertOpen, setConvertOpen] = useState(false);
  const [docOpen, setDocOpen] = useState<{ name: string; tag: string } | null>(null);
  const [extraHistory, setExtraHistory] = useState<Record<string, Lead["history"]>>({});
  const [activeUC, setActiveUC] = useState<UseCaseId>(null);
  const activeUseCase = USE_CASES.find((u) => u.id === activeUC) ?? null;

  const lead = LEADS.find((l) => l.id === activeTab) ?? LEADS[0];

  // Call timer
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    if (callState === "on-call") {
      timerRef.current = window.setInterval(() => setCallSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [callState]);

  const filteredQueue = useMemo(() => {
    return QUEUE.filter((q) => {
      if (filter === "QC" && !q.meta.includes("QC")) return false;
      if (filter === "ON" && !q.meta.includes("ON")) return false;
      if (filter === "My Queue" && !["sophie", "raj", "qc8821"].includes(q.id)) return false;
      if (search && !q.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (activeUC && !q.uc.includes(activeUC)) return false;
      return true;
    });
  }, [filter, search, activeUC]);

  const openLead = (id: string) => {
    if (!LEADS.find((l) => l.id === id)) {
      toast.info("Lead detail not loaded in this demo", { description: "Try Sophie, Raj, or GW Quote #QC-8821." });
      return;
    }
    if (!openTabs.includes(id)) setOpenTabs([...openTabs, id]);
    setActiveTab(id);
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = openTabs.filter((t) => t !== id);
    setOpenTabs(next);
    if (activeTab === id && next.length) setActiveTab(next[0]);
  };

  const startCall = () => {
    setCallState("on-call");
    setCallSeconds(0);
    toast.success(`Five9 — dialing ${lead.phone}`);
  };
  const endCall = () => {
    if (callState === "idle") return;
    setCallState("idle");
    appendHistory({
      icon: "call",
      title: `Outbound Call — ${callSeconds > 5 ? "Connected" : "No Answer"}`,
      sub: `Agent: Sarah Kim · Duration: ${formatDuration(callSeconds)} · Five9`,
      when: "Just now",
    });
    setCallSeconds(0);
    toast("Call ended", { description: "Logged to interaction history." });
  };

  const sendSms = (template: string) => {
    appendHistory({
      icon: "sms",
      title: `Outbound SMS — "${template}"`,
      sub: "Twilio · Delivered",
      when: "Just now",
    });
    toast.success("SMS sent via Twilio", { description: template });
  };

  const appendHistory = (entry: Lead["history"][number]) => {
    setExtraHistory((prev) => ({
      ...prev,
      [lead.id]: [entry, ...(prev[lead.id] ?? [])],
    }));
  };

  const history = [...(extraHistory[lead.id] ?? []), ...lead.history];

  return (
    <>
      {/* Workspace tab bar */}
      <div className="flex h-9 items-center border-b border-slds-border bg-white pl-2 pr-3 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
        <TabButton
          label="Lead Queue"
          active={false}
          onClick={() => toast.info("Lead Queue tab is the left pane in this demo")}
          showClose={false}
        />
        {openTabs.map((id) => {
          const l = LEADS.find((x) => x.id === id);
          if (!l) return null;
          return (
            <TabButton
              key={id}
              label={l.name}
              active={activeTab === id}
              hot={l.hot}
              onClick={() => setActiveTab(id)}
              onClose={(e) => closeTab(id, e)}
            />
          );
        })}
        <button className="ml-auto flex items-center gap-1 px-3 text-[12px] text-slds-blue hover:underline">
          <Plus className="h-3.5 w-3.5" /> Open Tab
        </button>
      </div>

      {/* 3-pane */}
      <div className="grid h-[calc(100vh-12rem)] grid-cols-[280px_1fr_320px]">
        {/* Left queue */}
        <aside className="overflow-y-auto border-r border-slds-border bg-white">
          <div className="border-b border-slds-border px-3 py-3">
            <div className="text-[14px] font-semibold text-slds-ink">Lead Queue</div>
            <div className="mt-0.5 text-[11px] text-slds-ink-soft">
              {filteredQueue.length} active leads · sorted by Einstein score
            </div>
            <div className="mt-2 relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slds-ink-soft" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search leads…"
                className="w-full rounded border border-slds-border bg-slds-neutral-bg py-1.5 pl-7 pr-2 text-[12px] outline-none focus:border-slds-blue"
              />
            </div>
            <div className="mt-2 flex gap-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={[
                    "rounded-full border px-2.5 py-0.5 text-[11px] transition-colors",
                    filter === f
                      ? "border-slds-blue bg-slds-blue text-white"
                      : "border-slds-border bg-white text-slds-ink-soft hover:bg-slds-neutral-bg",
                  ].join(" ")}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <ul>
            {filteredQueue.map((q) => {
              const active = q.id === activeTab;
              return (
                <li
                  key={q.id}
                  onClick={() => openLead(q.id)}
                  className={[
                    "cursor-pointer border-b border-slds-border px-3 py-2.5 transition-colors",
                    active ? "border-l-[3px] border-l-slds-blue bg-slds-blue-light" : "hover:bg-slds-neutral-bg",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-[13px] font-semibold text-slds-blue">{q.name}</div>
                    {q.hot && (
                      <span className="rounded-full bg-slds-hot px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                        Hot
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-[11px] text-slds-ink-soft">{q.meta} · {q.source}</div>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                    <ScoreBadge score={q.score} />
                    <span className="text-slds-ink-soft">{q.status}</span>
                    <span className="text-slds-ink-soft">·</span>
                    <span className="text-slds-ink-soft">{q.ago}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Center */}
        <main className="overflow-y-auto bg-slds-neutral-bg p-4">
          {/* Record header */}
          <section className="rounded border border-slds-border bg-white">
            <div className="flex items-start gap-3 p-4">
              <div className="grid h-10 w-10 place-items-center rounded bg-slds-blue text-[14px] font-semibold text-white">
                {initials(lead.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-[18px] font-semibold text-slds-ink">{lead.name}</h1>
                  <span className="rounded-full bg-slds-blue-light px-2 py-0.5 text-[11px] font-semibold text-slds-blue">
                    ● {lead.status === "New" ? "New Lead" : lead.status}
                  </span>
                </div>
                <div className="mt-0.5 text-[12px] text-slds-ink-soft">
                  Lead · {lead.product} · {lead.province === "QC" ? "Quebec" : lead.province === "ON" ? "Ontario" : lead.province} · Source: {lead.source} · Assigned: Sarah Kim
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ActionBtn tone="hot" icon={<MessageSquare className="h-3.5 w-3.5" />} onClick={() => sendSms("Custom SMS")}>
                  Send SMS
                </ActionBtn>
                <ActionBtn tone="primary" icon={<Phone className="h-3.5 w-3.5" />} onClick={startCall}>
                  Call
                </ActionBtn>
                <ActionBtn tone="ghost" icon={<Activity className="h-3.5 w-3.5" />} onClick={() => toast("Activity logged")}>
                  Log Activity
                </ActionBtn>
                <ActionBtn tone="ghost" icon={<CheckCircle2 className="h-3.5 w-3.5" />} onClick={() => setConvertOpen(true)}>
                  Convert
                </ActionBtn>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-4 border-t border-slds-border px-4 py-3">
              <Field label="Phone" value={lead.phone} link />
              <Field label="Email" value={lead.email} link />
              <Field label="Province" value={lead.province === "QC" ? "QC – Montréal" : lead.province === "ON" ? "ON – Toronto" : lead.province} />
              <Field label="GW Policy #" value={lead.policyId} link />
              <Field label="Einstein Score" value={`${lead.score} / 100`} />
              <Field label="CASL Consent" value={lead.caslVerified ? "✓ Verified" : "Pending"} success={lead.caslVerified} />
            </div>
          </section>

          {/* Guidewire card */}
          <section className="mt-4 overflow-hidden rounded border border-slds-border bg-white">
            <div className="flex items-center justify-between bg-gw px-4 py-2 text-white">
              <div className="flex items-center gap-3 text-[13px] font-semibold">
                <span className="rounded-sm bg-white/20 px-2 py-0.5 text-[10px] font-bold tracking-wider">GUIDEWIRE</span>
                PolicyCenter Quote Summary — {lead.policyId}
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-white" /> Live
              </span>
            </div>
            <div className="grid grid-cols-3 gap-x-6 gap-y-4 p-4">
              <Field label="Quote Status" value={lead.quote.status} tone={lead.quote.statusTone} />
              <Field label="Annual Premium" value={lead.quote.annualPremium} strong />
              <Field label="Product Line" value={lead.quote.productLine} strong />
              <Field label="Dwelling Value" value={lead.quote.dwellingValue} strong />
              <Field label="Deductible" value={lead.quote.deductible} strong />
              <Field label="Quote Expiry" value={lead.quote.quoteExpiry} tone="warn" />
              <Field label="Coverage: Liability" value={lead.quote.coverageLiability} strong />
              <Field label="Coverage: Contents" value={lead.quote.coverageContents} strong />
              <Field label="Underwriter" value={lead.quote.underwriter} success />
            </div>
          </section>

          {/* Five9 CTI */}
          <section className="mt-4 overflow-hidden rounded border border-slds-border bg-white">
            <div className="flex items-center justify-between bg-five9 px-4 py-2 text-white">
              <div className="flex items-center gap-3 text-[13px]">
                <span className="rounded-sm bg-slds-hot px-2 py-0.5 text-[10px] font-bold tracking-wider text-white">FIVE9</span>
                <span className="font-semibold">CTI Adapter — Sarah Kim (Agent)</span>
              </div>
              <span className="flex items-center gap-1.5 text-[11px]">
                <span className={`h-2 w-2 rounded-full ${callState === "on-call" ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
                {callState === "on-call" ? `On Call · ${formatDuration(callSeconds)}` : callState === "hold" ? "On Hold" : "Ready"}
              </span>
            </div>
            <div className="bg-[oklch(0.22_0.03_250)] px-4 py-5 text-white">
              <div className="text-[10px] uppercase tracking-wider text-white/60">Click-to-Dial</div>
              <div className="mt-1 flex items-center justify-between">
                <div className="font-mono text-[28px] font-semibold tracking-wide">{lead.phone}</div>
                <div className="flex items-center gap-3">
                  <CallBubble color="bg-emerald-500" label="Call" onClick={startCall} active={callState === "on-call"}>
                    <Phone className="h-5 w-5 text-white" />
                  </CallBubble>
                  <CallBubble
                    color="bg-amber-500"
                    label="Hold"
                    onClick={() => setCallState((s) => (s === "on-call" ? "hold" : s === "hold" ? "on-call" : s))}
                  >
                    <Pause className="h-5 w-5 text-white" />
                  </CallBubble>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 border-t border-slds-border bg-slds-neutral-bg p-2">
              <CtiAction icon={<FileText className="h-3.5 w-3.5" />} label="Log Call" onClick={() => toast("Call logged")} />
              <CtiAction icon={<ArrowRightLeft className="h-3.5 w-3.5" />} label="Transfer" onClick={() => toast("Opening transfer dialog…")} />
              <CtiAction icon={<CalendarClock className="h-3.5 w-3.5" />} label="Schedule CB" onClick={() => toast("Callback scheduled")} />
              <CtiAction icon={<PhoneOff className="h-3.5 w-3.5" />} label="End Call" tone="danger" onClick={endCall} />
            </div>
            <div className="border-t border-slds-border px-4 py-2 text-[11px] text-slds-ink-soft">
              <strong className="text-slds-ink">Last Call:</strong> Apr 18, 2026, 2:14 PM &nbsp;·&nbsp;
              <strong className="text-slds-ink">Duration:</strong> 4m 22s &nbsp;·&nbsp;
              <strong className="text-slds-ink">Outcome:</strong> Left Voicemail
            </div>
          </section>

          {/* Documents */}
          <section className="mt-4 overflow-hidden rounded border border-slds-border bg-white">
            <div className="flex items-center justify-between border-b border-slds-border px-4 py-2.5">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-slds-ink">
                <FileText className="h-4 w-4 text-slds-ink-soft" /> Document Access Hub
              </div>
              <button className="text-[11px] text-slds-blue hover:underline">{lead.documents.length} Documents</button>
            </div>
            <div className="grid grid-cols-2 gap-3 p-3">
              {lead.documents.map((d) => (
                <button
                  key={d.name}
                  onClick={() => setDocOpen(d)}
                  className="flex items-center justify-between gap-3 rounded border border-slds-border bg-white px-3 py-2.5 text-left transition-colors hover:border-slds-blue hover:bg-slds-blue-light"
                >
                  <div className="flex min-w-0 items-start gap-2.5">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slds-ink-soft" />
                    <div className="min-w-0">
                      <div className="truncate text-[12.5px] font-semibold text-slds-ink">{d.name}</div>
                      <div className="truncate text-[11px] text-slds-ink-soft">{d.sub}</div>
                    </div>
                  </div>
                  <span className="rounded-sm bg-slds-blue-light px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-slds-blue">
                    {d.tag}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </main>

        {/* Right rail */}
        <aside className="overflow-y-auto border-l border-slds-border bg-slds-neutral-bg p-3">
          {/* Einstein */}
          <div className="overflow-hidden rounded border border-slds-border bg-white">
            <div className="flex items-center justify-between border-b border-slds-border px-3 py-2">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-slds-ink">
                <Sparkles className="h-4 w-4 text-slds-blue" /> Einstein Next Best Action
              </div>
              <span className="rounded bg-gradient-to-r from-violet-500 to-blue-500 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white">
                AI
              </span>
            </div>
            <div className="space-y-2 p-2">
              {lead.recommendations.map((r, i) => (
                <div
                  key={i}
                  className={[
                    "rounded border p-3",
                    r.tone === "primary"
                      ? "border-slds-blue bg-slds-blue-light"
                      : "border-slds-border bg-slds-neutral-bg",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-2">
                    <ConfidenceRing value={r.confidence} tone={r.tone} />
                    <div className="min-w-0">
                      <div
                        className={[
                          "text-[10px] font-bold uppercase tracking-wider",
                          r.tone === "primary" ? "text-slds-blue" : "text-amber-600",
                        ].join(" ")}
                      >
                        {r.label}
                      </div>
                      <div className="text-[12.5px] font-semibold text-slds-ink">{r.title}</div>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] leading-snug text-slds-ink-soft">{r.body}</p>
                  <button
                    onClick={() => (r.cta === "Call Now" ? startCall() : toast.success(r.cta + " sent"))}
                    className={[
                      "mt-2 inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-semibold",
                      r.tone === "primary"
                        ? "bg-slds-blue text-white hover:brightness-110"
                        : "bg-slds-ink text-white hover:brightness-110",
                    ].join(" ")}
                  >
                    {r.cta === "Call Now" ? <Phone className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                    {r.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Twilio */}
          <div className="mt-3 overflow-hidden rounded border border-slds-border bg-white">
            <div className="flex items-center justify-between border-b border-slds-border px-3 py-2">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-slds-ink">
                <MessageSquare className="h-4 w-4 text-slds-ink-soft" /> SMS via Twilio (On-Prem)
              </div>
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Connected
              </span>
            </div>
            <div className="p-2">
              <div className="px-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-slds-ink-soft">
                Send Template
              </div>
              {[
                { icon: <Zap className="h-3 w-3" />, label: "Quote Expiry Reminder" },
                { icon: <CalendarClock className="h-3 w-3" />, label: "Callback Confirmation" },
                { icon: <Shield className="h-3 w-3" />, label: "Bundle Offer — Home+Auto" },
              ].map((t) => (
                <div key={t.label} className="mb-1 flex items-center justify-between rounded border border-slds-border px-2.5 py-1.5">
                  <div className="flex items-center gap-2 text-[12px] text-slds-ink">
                    {t.icon}
                    {t.label}
                  </div>
                  <button
                    onClick={() => sendSms(t.label)}
                    className="inline-flex items-center gap-1 rounded bg-slds-blue px-2 py-0.5 text-[11px] font-semibold text-white hover:brightness-110"
                  >
                    <Send className="h-3 w-3" /> Send
                  </button>
                </div>
              ))}
              <div className="mt-2 px-1 text-[10px] text-slds-ink-soft">
                Last SMS sent: Apr 19, 2026 · "Your quote is ready…" Delivered ✓
              </div>
            </div>
          </div>

          {/* History */}
          <div className="mt-3 overflow-hidden rounded border border-slds-border bg-white">
            <div className="flex items-center justify-between border-b border-slds-border px-3 py-2">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-slds-ink">
                <Activity className="h-4 w-4 text-slds-ink-soft" /> Interaction History
              </div>
              <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                Migrated from MongoDB
              </span>
            </div>
            <ul className="divide-y divide-slds-border">
              {history.map((h, i) => (
                <li key={i} className="flex gap-2.5 p-2.5">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slds-neutral-bg text-slds-ink-soft">
                    {h.icon === "call" ? <Phone className="h-3.5 w-3.5" /> :
                     h.icon === "sms" ? <MessageSquare className="h-3.5 w-3.5" /> :
                     h.icon === "email" ? <Mail className="h-3.5 w-3.5" /> :
                     <FileCheck2 className="h-3.5 w-3.5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-[12px] font-semibold text-slds-ink">{h.title}</div>
                      <div className="shrink-0 text-[10.5px] text-slds-ink-soft">{h.when}</div>
                    </div>
                    <div className="text-[11px] text-slds-ink-soft">{h.sub}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Convert modal */}
      <Dialog open={convertOpen} onOpenChange={setConvertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convert Lead to Opportunity</DialogTitle>
            <DialogDescription>
              {lead.name} will be converted into a Salesforce Opportunity and bound to a Guidewire policy.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 rounded border border-slds-border bg-slds-neutral-bg p-3 text-[12px]">
            <Row k="Account" v={lead.name} />
            <Row k="Opportunity Name" v={`${lead.name} — ${lead.product}`} />
            <Row k="Guidewire Policy" v={lead.policyId} />
            <Row k="Annual Premium" v={lead.quote.annualPremium} />
            <Row k="Stage" v="Qualified → Quoted → Bind" />
          </div>
          <DialogFooter>
            <button
              className="rounded border border-slds-border bg-white px-3 py-1.5 text-[12px] font-semibold text-slds-ink hover:bg-slds-neutral-bg"
              onClick={() => setConvertOpen(false)}
            >
              Cancel
            </button>
            <button
              className="rounded bg-slds-blue px-3 py-1.5 text-[12px] font-semibold text-white hover:brightness-110"
              onClick={() => {
                setConvertOpen(false);
                toast.success("Lead converted", { description: "Opportunity created and bound in Guidewire." });
              }}
            >
              Convert & Bind
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document modal */}
      <Dialog open={!!docOpen} onOpenChange={(o) => !o && setDocOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> {docOpen?.name}
            </DialogTitle>
            <DialogDescription>Source: {docOpen?.tag} · Aviva Document Repository</DialogDescription>
          </DialogHeader>
          <div className="rounded border border-slds-border bg-white p-4">
            <div className="border-b border-dashed border-slds-border pb-2 text-[14px] font-semibold">
              AVIVA CANADA — {docOpen?.name}
            </div>
            <div className="mt-3 space-y-1 text-[12px] text-slds-ink-soft">
              <div>Policy Holder: <span className="text-slds-ink">{lead.name}</span></div>
              <div>Policy #: <span className="text-slds-ink">{lead.policyId}</span></div>
              <div>Issued: <span className="text-slds-ink">Apr 18, 2026</span></div>
              <div>Premium: <span className="text-slds-ink">{lead.quote.annualPremium}</span></div>
              <div className="pt-2 italic">— Document preview rendered from GW PolicyCenter binary store —</div>
            </div>
          </div>
          <DialogFooter>
            <button
              className="rounded border border-slds-border bg-white px-3 py-1.5 text-[12px] font-semibold text-slds-ink hover:bg-slds-neutral-bg"
              onClick={() => setDocOpen(null)}
            >
              Close
            </button>
            <button
              className="rounded bg-slds-blue px-3 py-1.5 text-[12px] font-semibold text-white hover:brightness-110"
              onClick={() => toast.success("Download started")}
            >
              Download PDF
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ---------- helpers ---------- */

function TabButton({
  label,
  active,
  hot,
  onClick,
  onClose,
  showClose = true,
}: {
  label: string;
  active: boolean;
  hot?: boolean;
  onClick: () => void;
  onClose?: (e: React.MouseEvent) => void;
  showClose?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "group relative flex h-9 items-center gap-2 border-r border-slds-border px-3 text-[12px]",
        active ? "bg-slds-blue-light text-slds-blue" : "bg-white text-slds-ink hover:bg-slds-neutral-bg",
      ].join(" ")}
    >
      <FileText className="h-3 w-3 opacity-60" />
      <span className={active ? "font-semibold" : ""}>{label}</span>
      {hot && (
        <span className="rounded-full bg-slds-hot px-1.5 py-[1px] text-[9px] font-bold uppercase text-white">
          Hot
        </span>
      )}
      {showClose && (
        <span
          onClick={onClose}
          className="ml-1 grid h-4 w-4 place-items-center rounded text-slds-ink-soft hover:bg-slds-border"
        >
          <X className="h-3 w-3" />
        </span>
      )}
      {active && <span className="absolute inset-x-0 bottom-0 h-[2px] bg-slds-blue" />}
    </button>
  );
}

function Field({
  label,
  value,
  link,
  strong,
  success,
  tone,
}: {
  label: string;
  value: string;
  link?: boolean;
  strong?: boolean;
  success?: boolean;
  tone?: "warn" | "ok" | "danger";
}) {
  const toneClass =
    tone === "warn"
      ? "text-amber-600"
      : tone === "danger"
      ? "text-slds-danger"
      : success
      ? "text-emerald-600"
      : link
      ? "text-slds-blue"
      : "text-slds-ink";
  return (
    <div className="min-w-0">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slds-ink-soft">{label}</div>
      <div className={["mt-0.5 truncate text-[13px]", strong ? "font-semibold" : "", toneClass].join(" ")}>
        {value}
      </div>
    </div>
  );
}

function ActionBtn({
  children,
  icon,
  tone,
  onClick,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  tone: "primary" | "hot" | "ghost";
  onClick: () => void;
}) {
  const cls =
    tone === "primary"
      ? "border-slds-blue bg-slds-blue text-white hover:brightness-110"
      : tone === "hot"
      ? "border-slds-hot bg-slds-hot text-white hover:brightness-110"
      : "border-slds-border bg-white text-slds-blue hover:bg-slds-blue-light";
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-[12px] font-semibold ${cls}`}>
      {icon}
      {children}
    </button>
  );
}

function CallBubble({
  color,
  label,
  children,
  onClick,
  active,
}: {
  color: string;
  label: string;
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1">
      <span className={`grid h-12 w-12 place-items-center rounded-full ${color} shadow-lg transition-transform hover:scale-105 ${active ? "ring-4 ring-white/30" : ""}`}>
        {children}
      </span>
      <span className="text-[10px] text-white/70">{label}</span>
    </button>
  );
}

function CtiAction({
  icon,
  label,
  tone,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  tone?: "danger";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex items-center justify-center gap-1.5 rounded border bg-white py-1.5 text-[11.5px] font-semibold transition-colors",
        tone === "danger"
          ? "border-slds-danger/40 bg-red-50 text-slds-danger hover:bg-red-100"
          : "border-slds-border text-slds-ink hover:bg-slds-neutral-bg",
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 85 ? "bg-emerald-500" : score >= 65 ? "bg-amber-500" : score >= 45 ? "bg-orange-500" : "bg-slate-400";
  return (
    <span className={`inline-flex h-5 min-w-[1.75rem] items-center justify-center rounded-full px-1.5 text-[10.5px] font-bold text-white ${color}`}>
      {score}
    </span>
  );
}

function ConfidenceRing({ value, tone }: { value: number; tone: "primary" | "warn" }) {
  const color = tone === "primary" ? "text-slds-blue" : "text-amber-600";
  const stroke = tone === "primary" ? "stroke-slds-blue" : "stroke-amber-500";
  const c = 2 * Math.PI * 18;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative h-11 w-11 shrink-0">
      <svg viewBox="0 0 44 44" className="h-11 w-11 -rotate-90">
        <circle cx="22" cy="22" r="18" className="stroke-slds-border" strokeWidth="3.5" fill="none" />
        <circle cx="22" cy="22" r="18" className={stroke} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} />
      </svg>
      <div className={`absolute inset-0 grid place-items-center text-[11px] font-bold ${color}`}>{value}%</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slds-ink-soft">{k}</span>
      <span className="font-medium text-slds-ink">{v}</span>
      <ChevronRight className="hidden h-3 w-3 text-slds-ink-soft" />
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r.toString().padStart(2, "0")}s`;
}
