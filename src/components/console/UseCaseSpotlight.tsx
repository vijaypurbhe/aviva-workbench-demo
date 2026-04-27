import { useEffect, useState } from "react";
import { USE_CASES, type UseCase } from "@/data/useCases";
import {
  ArrowRight,
  CheckCircle2,
  Cloud,
  Database,
  Mail,
  MessageSquare,
  Phone,
  Play,
  Sparkles,
  Users,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

/* -----------------------------------------------------------
   Public types
------------------------------------------------------------ */

export type UseCaseId = "uc1" | "uc2" | "uc3" | "uc4" | "uc5" | null;

export type SpotlightContext = {
  active: UseCase | null;
  activeId: UseCaseId;
  setActiveId: (id: UseCaseId) => void;
};

/* -----------------------------------------------------------
   Spotlight strip — sits between the workspace tab bar and
   the 3-pane layout. Selecting a UC filters the queue and
   activates a contextual rail panel.
------------------------------------------------------------ */

const UC_ACCENT: Record<string, { ring: string; chip: string; ink: string }> = {
  uc1: { ring: "ring-sky-400", chip: "bg-sky-50 text-sky-700 border-sky-200", ink: "text-sky-700" },
  uc2: { ring: "ring-violet-400", chip: "bg-violet-50 text-violet-700 border-violet-200", ink: "text-violet-700" },
  uc3: { ring: "ring-emerald-400", chip: "bg-emerald-50 text-emerald-700 border-emerald-200", ink: "text-emerald-700" },
  uc4: { ring: "ring-amber-400", chip: "bg-amber-50 text-amber-800 border-amber-200", ink: "text-amber-700" },
  uc5: { ring: "ring-rose-400", chip: "bg-rose-50 text-rose-700 border-rose-200", ink: "text-rose-700" },
};

export function UseCaseSpotlightStrip({
  activeId,
  onChange,
}: {
  activeId: UseCaseId;
  onChange: (id: UseCaseId) => void;
}) {
  return (
    <div className="flex items-stretch gap-2 border-b border-slds-border bg-white px-3 py-2">
      <div className="flex flex-col justify-center pr-2">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slds-blue">
          <Sparkles className="h-3 w-3" /> Use-Case Spotlight
        </div>
        <div className="text-[11px] text-slds-ink-soft">
          Filter the workbench by migration scenario
        </div>
      </div>
      <button
        onClick={() => onChange(null)}
        className={[
          "rounded border px-2.5 py-1 text-[11.5px] font-semibold transition-colors",
          activeId === null
            ? "border-slds-blue bg-slds-blue text-white"
            : "border-slds-border bg-white text-slds-ink hover:bg-slds-neutral-bg",
        ].join(" ")}
      >
        All Leads
      </button>
      {USE_CASES.map((uc) => {
        const isActive = uc.id === activeId;
        const accent = UC_ACCENT[uc.id] ?? UC_ACCENT.uc1;
        return (
          <button
            key={uc.id}
            onClick={() => onChange(uc.id as UseCaseId)}
            className={[
              "group flex min-w-[150px] flex-col items-start rounded border px-2.5 py-1 text-left transition-all",
              isActive
                ? `border-slds-blue bg-slds-blue-light shadow-sm ring-2 ${accent.ring}`
                : "border-slds-border bg-white hover:border-slds-blue hover:bg-slds-blue-light",
            ].join(" ")}
          >
            <div className="flex items-center gap-1.5">
              <span
                className={[
                  "rounded px-1.5 py-[1px] text-[9.5px] font-bold tracking-wider",
                  accent.chip,
                  "border",
                ].join(" ")}
              >
                {uc.code}
              </span>
              {isActive && (
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-slds-blue">
                  Active
                </span>
              )}
            </div>
            <div className="mt-0.5 truncate text-[12px] font-semibold text-slds-ink">
              {uc.title}
            </div>
          </button>
        );
      })}
      {activeId && (
        <button
          onClick={() => onChange(null)}
          className="ml-auto flex items-center gap-1 self-center rounded px-2 py-1 text-[11px] text-slds-ink-soft hover:bg-slds-neutral-bg"
          title="Clear use-case filter"
        >
          <X className="h-3 w-3" /> Clear
        </button>
      )}
    </div>
  );
}

/* -----------------------------------------------------------
   Rail panel — replaces / augments the right rail when a UC
   is active. Shows AS-IS vs TO-BE pipelines + a Run button
   that emits log entries and toasts.
------------------------------------------------------------ */

type Stage = {
  key: string;
  label: string;
  sub?: string;
  icon: React.ReactNode;
  legacy?: boolean;
};

const ICON_FOR: Record<string, React.ReactNode> = {
  ClicAssure: <Cloud className="h-3 w-3" />,
  Guidewire: <Database className="h-3 w-3" />,
  "GW PolicyCenter": <Database className="h-3 w-3" />,
  "GW AppEvent": <Database className="h-3 w-3" />,
  "AWS EventBridge": <Workflow className="h-3 w-3" />,
  EventBridge: <Workflow className="h-3 w-3" />,
  Salesforce: <Users className="h-3 w-3" />,
  "Salesforce (FR UI)": <Users className="h-3 w-3" />,
  "Online QC Form": <Cloud className="h-3 w-3" />,
  "Inbound Quote": <Cloud className="h-3 w-3" />,
  "Five9 Dialer": <Phone className="h-3 w-3" />,
  "Five9 CTI Adapter": <Phone className="h-3 w-3" />,
  Marketo: <Mail className="h-3 w-3" />,
  "Marketo (2-way)": <Mail className="h-3 w-3" />,
  "Email / Landing": <Mail className="h-3 w-3" />,
  "Closed-loop BI": <Sparkles className="h-3 w-3" />,
};

function toStages(steps: string[], legacyLabels: string[] = []): Stage[] {
  return steps.map((s) => ({
    key: s,
    label: s,
    icon: ICON_FOR[s] ?? <Workflow className="h-3 w-3" />,
    legacy: legacyLabels.some((l) => s.includes(l)),
  }));
}

export function UseCaseRailPanel({
  uc,
  onLog,
}: {
  uc: UseCase;
  onLog: (entry: { icon: "call" | "sms" | "email" | "quote"; title: string; sub: string; when: string }) => void;
}) {
  const [active, setActive] = useState(-1);
  const [done, setDone] = useState(false);
  const [running, setRunning] = useState(false);

  const toBe = toStages(uc.flowToBe);
  const asIs = toStages(uc.flowAsIs, ["Legacy LM", "LM"]);

  useEffect(() => {
    setActive(-1);
    setDone(false);
    setRunning(false);
  }, [uc.id]);

  useEffect(() => {
    if (!running) return;
    if (active >= toBe.length - 1) {
      const t = setTimeout(() => {
        setDone(true);
        setRunning(false);
        const summary = LOG_FOR_UC[uc.id];
        if (summary) onLog(summary);
        toast.success(`${uc.code} demo complete`, { description: uc.title });
      }, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setActive((a) => a + 1), 600);
    return () => clearTimeout(t);
  }, [running, active, toBe.length, uc, onLog]);

  const accent = UC_ACCENT[uc.id] ?? UC_ACCENT.uc1;

  return (
    <div className="overflow-hidden rounded border border-slds-border bg-white">
      <div className="flex items-center justify-between border-b border-slds-border bg-gradient-to-r from-slds-blue to-slds-blue-dark px-3 py-2 text-white">
        <div className="flex items-center gap-2 text-[12.5px] font-semibold">
          <Sparkles className="h-3.5 w-3.5" /> {uc.code} · {uc.title}
        </div>
        <span className={`rounded border px-1.5 py-[1px] text-[9.5px] font-bold tracking-wider ${accent.chip}`}>
          Spotlight
        </span>
      </div>

      <div className="space-y-2 p-2">
        {/* AS-IS */}
        <div className="rounded border border-slate-200 bg-slate-50 p-2">
          <div className="mb-1 flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider text-slate-600">
            AS-IS · Legacy LM
          </div>
          <MiniPipeline stages={asIs} />
          <p className="mt-1.5 text-[10.5px] leading-snug text-slate-600">{uc.asIs}</p>
        </div>

        {/* TO-BE */}
        <div className="rounded border border-emerald-200 bg-emerald-50/60 p-2">
          <div className="mb-1 flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider text-emerald-700">
            TO-BE · Salesforce-Native
          </div>
          <MiniPipeline stages={toBe} active={active} done={done} live />
          <p className="mt-1.5 text-[10.5px] leading-snug text-emerald-800">{uc.toBe}</p>
        </div>

        {/* Run controls */}
        <div className="flex items-center gap-2 rounded border border-slds-border bg-slds-neutral-bg p-2">
          <button
            disabled={running}
            onClick={() => {
              setActive(0);
              setDone(false);
              setRunning(true);
            }}
            className="inline-flex items-center gap-1.5 rounded bg-slds-blue px-2.5 py-1 text-[11px] font-semibold text-white hover:brightness-110 disabled:opacity-50"
          >
            <Play className="h-3 w-3" /> {running ? "Running…" : `Run ${uc.code}`}
          </button>
          {(running || done) && (
            <button
              onClick={() => {
                setActive(-1);
                setDone(false);
                setRunning(false);
              }}
              className="rounded border border-slds-border bg-white px-2.5 py-1 text-[11px] font-semibold text-slds-ink hover:bg-slds-neutral-bg"
            >
              Reset
            </button>
          )}
          {done && (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              <CheckCircle2 className="h-3 w-3" /> Logged to lead
            </span>
          )}
        </div>

        {/* Integrations */}
        <div className="flex flex-wrap items-center gap-1 px-1">
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-slds-ink-soft">
            Integrations:
          </span>
          {uc.integrations.map((i) => (
            <span
              key={i}
              className="rounded-full border border-slds-border bg-white px-1.5 py-0.5 text-[10px] text-slds-ink"
            >
              {i}
            </span>
          ))}
        </div>

        {/* UC-specific quick action */}
        <UseCaseQuickAction uc={uc} onLog={onLog} />
      </div>
    </div>
  );
}

function MiniPipeline({
  stages,
  active = -1,
  done = false,
  live = false,
}: {
  stages: Stage[];
  active?: number;
  done?: boolean;
  live?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {stages.map((s, i) => {
        const isActive = live && i === active && !done;
        const isComplete = live && (done || i < active);
        return (
          <span key={s.key} className="flex items-center gap-1">
            <span
              className={[
                "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10.5px] font-medium transition-all",
                s.legacy
                  ? "border-slate-300 bg-white text-slate-500 line-through decoration-slate-400"
                  : isComplete
                    ? "border-emerald-400 bg-emerald-100 text-emerald-800"
                    : isActive
                      ? "border-slds-blue bg-slds-blue-light text-slds-blue shadow-sm"
                      : "border-slds-border bg-white text-slds-ink",
              ].join(" ")}
            >
              <span
                className={[
                  "grid h-3.5 w-3.5 place-items-center rounded-sm",
                  isComplete
                    ? "bg-emerald-500 text-white"
                    : isActive
                      ? "bg-slds-blue text-white animate-pulse"
                      : "text-slds-ink-soft",
                ].join(" ")}
              >
                {isComplete ? <CheckCircle2 className="h-2.5 w-2.5" /> : s.icon}
              </span>
              {s.label}
            </span>
            {i < stages.length - 1 && (
              <ArrowRight
                className={[
                  "h-3 w-3 shrink-0",
                  isComplete ? "text-emerald-500" : "text-slds-ink-soft",
                ].join(" ")}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}

const LOG_FOR_UC: Record<string, { icon: "call" | "sms" | "email" | "quote"; title: string; sub: string; when: string }> = {
  uc1: {
    icon: "quote",
    title: "Lead ingested via ClicAssure → EventBridge",
    sub: "GW AppEvent: PolicyQuoteCreated · LM bypassed",
    when: "Just now",
  },
  uc2: {
    icon: "quote",
    title: "QC Online quote routed to Salesforce (FR locale)",
    sub: "GW AppEvent → EventBridge → SF Lead",
    when: "Just now",
  },
  uc3: {
    icon: "quote",
    title: "Single-source quote landed in Salesforce",
    sub: "Dual-write disabled · LM decommissioned for this lead",
    when: "Just now",
  },
  uc4: {
    icon: "call",
    title: "Five9 dialer outcome synced to Salesforce",
    sub: "Predictive dial · CTI adapter · BI-ready",
    when: "Just now",
  },
  uc5: {
    icon: "email",
    title: "Marketo engagement attributed to SF campaign",
    sub: "2-way sync · Email opened · Score updated",
    when: "Just now",
  },
};

function UseCaseQuickAction({
  uc,
  onLog,
}: {
  uc: UseCase;
  onLog: (entry: { icon: "call" | "sms" | "email" | "quote"; title: string; sub: string; when: string }) => void;
}) {
  if (uc.id === "uc4") {
    return (
      <button
        onClick={() => {
          onLog({
            icon: "call",
            title: "Added to Five9 outbound dialer queue",
            sub: "Campaign: April Renewals · Predictive mode",
            when: "Just now",
          });
          toast.success("Lead queued in Five9 dialer");
        }}
        className="flex w-full items-center justify-center gap-1.5 rounded border border-amber-300 bg-amber-50 px-2 py-1.5 text-[11.5px] font-semibold text-amber-800 hover:bg-amber-100"
      >
        <Phone className="h-3 w-3" /> Add to Dialer Campaign
      </button>
    );
  }
  if (uc.id === "uc5") {
    return (
      <button
        onClick={() => {
          onLog({
            icon: "email",
            title: "Added to Marketo nurture program",
            sub: "Spring Bundle 2026 · 2-way sync enabled",
            when: "Just now",
          });
          toast.success("Synced to Marketo");
        }}
        className="flex w-full items-center justify-center gap-1.5 rounded border border-rose-300 bg-rose-50 px-2 py-1.5 text-[11.5px] font-semibold text-rose-800 hover:bg-rose-100"
      >
        <Mail className="h-3 w-3" /> Push to Marketo Program
      </button>
    );
  }
  if (uc.id === "uc1") {
    return (
      <button
        onClick={() => {
          onLog({
            icon: "quote",
            title: "ClicAssure batch refreshed",
            sub: "25 new aggregator leads ingested",
            when: "Just now",
          });
          toast.success("ClicAssure batch ingested");
        }}
        className="flex w-full items-center justify-center gap-1.5 rounded border border-sky-300 bg-sky-50 px-2 py-1.5 text-[11.5px] font-semibold text-sky-800 hover:bg-sky-100"
      >
        <Cloud className="h-3 w-3" /> Pull ClicAssure Batch
      </button>
    );
  }
  if (uc.id === "uc2") {
    return (
      <button
        onClick={() => {
          onLog({
            icon: "quote",
            title: "QC Online quote received (FR)",
            sub: "Routed via GW AppEvent → SF QC queue",
            when: "Just now",
          });
          toast.success("Devis QC reçu", { description: "Routé vers Salesforce" });
        }}
        className="flex w-full items-center justify-center gap-1.5 rounded border border-violet-300 bg-violet-50 px-2 py-1.5 text-[11.5px] font-semibold text-violet-800 hover:bg-violet-100"
      >
        <Zap className="h-3 w-3" /> Simulate QC Online Submission
      </button>
    );
  }
  if (uc.id === "uc3") {
    return (
      <button
        onClick={() => {
          onLog({
            icon: "quote",
            title: "ON/National quote — single-source path",
            sub: "EventBridge → SF only · LM bypassed",
            when: "Just now",
          });
          toast.success("Quote routed via single path");
        }}
        className="flex w-full items-center justify-center gap-1.5 rounded border border-emerald-300 bg-emerald-50 px-2 py-1.5 text-[11.5px] font-semibold text-emerald-800 hover:bg-emerald-100"
      >
        <MessageSquare className="h-3 w-3" /> Receive ON/National Quote
      </button>
    );
  }
  return null;
}

/* Re-export accent map for queue badge use */
export function ucBadgeClass(ucId: string): string {
  return UC_ACCENT[ucId]?.chip ?? "bg-slds-neutral-bg text-slds-ink border-slds-border";
}
