import { createFileRoute } from "@tanstack/react-router";
import { ConsoleChrome } from "@/components/console/ConsoleChrome";
import { USE_CASES, type UseCase } from "@/data/useCases";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  Play,
  Phone,
  MessageSquare,
  Mail,
  Database,
  Cloud,
  Workflow,
  Users,
  Sparkles,
  ListChecks,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/use-cases")({
  head: () => ({
    meta: [
      { title: "5 Use Cases — Aviva LM Migration" },
      {
        name: "description",
        content:
          "Interactive demos for the 5 LM migration use cases: ClicAssure, QC Online Quotes, Ontario/National, Five9 Outbound Dialer, and Marketo.",
      },
    ],
  }),
  component: UseCasesPage,
});

function UseCasesPage() {
  const [activeId, setActiveId] = useState<string>(USE_CASES[0].id);
  const active = USE_CASES.find((u) => u.id === activeId)!;

  return (
    <ConsoleChrome>
      <div className="bg-slds-neutral-bg p-4">
        {/* Header */}
        <div className="mb-4 flex items-end justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slds-blue">
              Scope · Aviva Canada RFP
            </div>
            <h1 className="text-[20px] font-semibold text-slds-ink">
              5 Use Cases — How We Address Each LM Migration Scenario
            </h1>
            <div className="text-[12px] text-slds-ink-soft">
              Click a use case to see the AS-IS vs TO-BE flows and run a working demo.
            </div>
          </div>
          <div className="flex items-center gap-2 rounded border border-slds-border bg-white px-3 py-1.5 text-[11px] text-slds-ink-soft">
            <Sparkles className="h-3.5 w-3.5 text-slds-blue" />
            Tech Mahindra · Aviva Canada · April 2026
          </div>
        </div>

        {/* Use case selector tabs */}
        <div className="grid grid-cols-5 gap-2">
          {USE_CASES.map((uc) => {
            const isActive = uc.id === activeId;
            return (
              <button
                key={uc.id}
                onClick={() => setActiveId(uc.id)}
                className={[
                  "rounded border px-3 py-2.5 text-left transition-all",
                  isActive
                    ? "border-slds-blue bg-slds-blue text-white shadow-sm"
                    : "border-slds-border bg-white text-slds-ink hover:border-slds-blue hover:bg-slds-blue-light",
                ].join(" ")}
              >
                <div
                  className={[
                    "text-[10px] font-bold uppercase tracking-wider",
                    isActive ? "text-white/80" : "text-slds-blue",
                  ].join(" ")}
                >
                  {uc.code}
                </div>
                <div className="mt-0.5 text-[13px] font-semibold leading-tight">
                  {uc.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Comparison cards */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <FlowCard
            tone="asis"
            title="Current State (AS-IS)"
            description={active.asIs}
            steps={active.flowAsIs}
          />
          <FlowCard
            tone="tobe"
            title="Target State (TO-BE)"
            description={active.toBe}
            steps={active.flowToBe}
          />
        </div>

        {/* Integrations */}
        <div className="mt-4 flex items-center gap-2 rounded border border-slds-border bg-white p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slds-ink-soft">
            Key Integrations
          </span>
          {active.integrations.map((i) => (
            <span
              key={i}
              className="rounded-full border border-slds-border bg-slds-neutral-bg px-2.5 py-0.5 text-[11.5px] font-medium text-slds-ink"
            >
              {i}
            </span>
          ))}
        </div>

        {/* Live demo */}
        <div className="mt-4 overflow-hidden rounded border border-slds-border bg-white">
          <div className="flex items-center justify-between border-b border-slds-border bg-slds-neutral-bg px-4 py-2.5">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-slds-ink">
              <Play className="h-4 w-4 text-slds-blue" /> Live Demo — {active.code}{" "}
              {active.title}
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Sandbox
            </span>
          </div>
          <div className="p-4">
            <UseCaseDemo uc={active} />
          </div>
        </div>

        {/* Scope footer */}
        <div className="mt-4 rounded border-l-4 border-amber-500 bg-amber-50 p-3 text-[11.5px] text-slds-ink">
          <strong className="text-amber-700">OUT OF SCOPE</strong> (Aviva IT-led):
          PII credit / payment data · Web portal development · LDAP decommissioning ·
          Datapower disconnection &nbsp;|&nbsp;{" "}
          <strong className="text-emerald-700">IN SCOPE</strong> (TechM-led): Angular LM
          app decommission · Notification Node / Twilio resolution · Leads Application
          data archival
        </div>
      </div>
      <Toaster position="bottom-right" richColors />
    </ConsoleChrome>
  );
}

/* ---------------- Flow card ---------------- */

function FlowCard({
  tone,
  title,
  description,
  steps,
}: {
  tone: "asis" | "tobe";
  title: string;
  description: string;
  steps: string[];
}) {
  const isAsIs = tone === "asis";
  return (
    <div
      className={[
        "overflow-hidden rounded border bg-white",
        isAsIs ? "border-slate-300" : "border-emerald-300",
      ].join(" ")}
    >
      <div
        className={[
          "flex items-center gap-2 px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-white",
          isAsIs ? "bg-slate-500" : "bg-emerald-600",
        ].join(" ")}
      >
        {isAsIs ? <XCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
        {title}
      </div>
      <div className="p-4">
        <p className="text-[12.5px] text-slds-ink-soft">{description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {steps.map((s, i) => (
            <span key={s} className="flex items-center gap-1.5">
              <span
                className={[
                  "rounded border px-2 py-1 text-[11.5px] font-medium",
                  isAsIs
                    ? "border-slate-300 bg-slate-50 text-slate-700"
                    : "border-emerald-300 bg-emerald-50 text-emerald-800",
                ].join(" ")}
              >
                {s}
              </span>
              {i < steps.length - 1 && (
                <ArrowRight
                  className={[
                    "h-3.5 w-3.5",
                    isAsIs ? "text-slate-400" : "text-emerald-500",
                  ].join(" ")}
                />
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Demo dispatcher ---------------- */

function UseCaseDemo({ uc }: { uc: UseCase }) {
  switch (uc.demo.kind) {
    case "clicassure":
      return <ClicAssureDemo />;
    case "qcOnline":
      return <QcOnlineDemo />;
    case "ontario":
      return <OntarioDemo />;
    case "five9":
      return <Five9Demo />;
    case "marketo":
      return <MarketoDemo />;
  }
}

/* ---------------- Pipeline visualization ---------------- */

type Stage = {
  key: string;
  label: string;
  sub: string;
  icon: React.ReactNode;
  tone?: "legacy" | "ok";
};

function Pipeline({
  stages,
  active,
  done,
}: {
  stages: Stage[];
  active: number;
  done: boolean;
}) {
  return (
    <div className="flex items-stretch gap-2 overflow-x-auto rounded border border-slds-border bg-slds-neutral-bg p-3">
      {stages.map((s, i) => {
        const isActive = i === active && !done;
        const isComplete = done || i < active;
        const isLegacy = s.tone === "legacy";
        return (
          <div key={s.key} className="flex items-center gap-2">
            <div
              className={[
                "min-w-[140px] rounded border p-2.5 transition-all",
                isLegacy
                  ? "border-slate-300 bg-slate-50 opacity-70"
                  : isComplete
                  ? "border-emerald-400 bg-emerald-50"
                  : isActive
                  ? "border-slds-blue bg-slds-blue-light shadow-sm"
                  : "border-slds-border bg-white",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <span
                  className={[
                    "grid h-6 w-6 place-items-center rounded",
                    isLegacy
                      ? "bg-slate-200 text-slate-600"
                      : isComplete
                      ? "bg-emerald-500 text-white"
                      : isActive
                      ? "bg-slds-blue text-white"
                      : "bg-slds-neutral-bg text-slds-ink-soft",
                  ].join(" ")}
                >
                  {isComplete ? <CheckCircle2 className="h-3.5 w-3.5" /> : s.icon}
                </span>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-semibold text-slds-ink">
                    {s.label}
                  </div>
                  <div className="text-[10px] text-slds-ink-soft">{s.sub}</div>
                </div>
              </div>
              {isActive && (
                <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-slds-blue">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slds-blue" />
                  Processing…
                </div>
              )}
            </div>
            {i < stages.length - 1 && (
              <ArrowRight
                className={[
                  "h-4 w-4 shrink-0",
                  isComplete ? "text-emerald-500" : "text-slds-ink-soft",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function useStepRunner(stageCount: number) {
  const [active, setActive] = useState(-1);
  const [done, setDone] = useState(false);
  const [running, setRunning] = useState(false);

  const start = () => {
    setActive(0);
    setDone(false);
    setRunning(true);
  };
  const reset = () => {
    setActive(-1);
    setDone(false);
    setRunning(false);
  };

  useEffect(() => {
    if (!running) return;
    if (active >= stageCount - 1) {
      const t = setTimeout(() => {
        setDone(true);
        setRunning(false);
      }, 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setActive((a) => a + 1), 700);
    return () => clearTimeout(t);
  }, [active, running, stageCount]);

  return { active: active < 0 ? 0 : active, done, running, start, reset, started: active >= 0 };
}

function RunControls({
  onRun,
  onReset,
  running,
  done,
  label,
}: {
  onRun: () => void;
  onReset: () => void;
  running: boolean;
  done: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onRun}
        disabled={running}
        className="inline-flex items-center gap-1.5 rounded bg-slds-blue px-3 py-1.5 text-[12px] font-semibold text-white hover:brightness-110 disabled:opacity-50"
      >
        <Play className="h-3.5 w-3.5" /> {running ? "Running…" : label}
      </button>
      {(done || running) && (
        <button
          onClick={onReset}
          className="rounded border border-slds-border bg-white px-3 py-1.5 text-[12px] font-semibold text-slds-ink hover:bg-slds-neutral-bg"
        >
          Reset
        </button>
      )}
      {done && (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
          <CheckCircle2 className="h-3 w-3" /> Lead in Salesforce
        </span>
      )}
    </div>
  );
}

/* ---------------- UC1: ClicAssure ---------------- */

function ClicAssureDemo() {
  const [batchSize, setBatchSize] = useState(25);
  const stagesAsIs: Stage[] = [
    { key: "ca", label: "ClicAssure", sub: "Aggregator feed", icon: <Cloud className="h-3.5 w-3.5" /> },
    { key: "gw", label: "Guidewire", sub: "PolicyCenter", icon: <Database className="h-3.5 w-3.5" /> },
    { key: "lm", label: "Legacy LM", sub: "Angular UI", icon: <Database className="h-3.5 w-3.5" />, tone: "legacy" },
  ];
  const stagesToBe: Stage[] = [
    { key: "ca", label: "ClicAssure", sub: "Aggregator feed", icon: <Cloud className="h-3.5 w-3.5" /> },
    { key: "gw", label: "GW PolicyCenter", sub: "AppEvent emit", icon: <Database className="h-3.5 w-3.5" /> },
    { key: "eb", label: "AWS EventBridge", sub: "Routing", icon: <Workflow className="h-3.5 w-3.5" /> },
    { key: "sf", label: "Salesforce", sub: "Lead created", icon: <Users className="h-3.5 w-3.5" /> },
  ];

  const r = useStepRunner(stagesToBe.length);

  const runBatch = () => {
    r.start();
    toast.success(`ClicAssure batch received: ${batchSize} leads`, {
      description: "Routed via GW AppEvent → EventBridge → Salesforce",
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 text-[10px] font-bold uppercase tracking-wider text-slds-ink-soft">
        <div>AS-IS Path</div>
        <div>TO-BE Path</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Pipeline stages={stagesAsIs} active={0} done={false} />
        <Pipeline stages={stagesToBe} active={r.active} done={r.done} />
      </div>

      <div className="flex items-end justify-between gap-3 rounded border border-slds-border bg-slds-neutral-bg p-3">
        <div className="flex items-center gap-3">
          <label className="text-[11px] font-semibold text-slds-ink">
            Simulated batch size
            <input
              type="range"
              min={1}
              max={250}
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              className="ml-3 align-middle"
            />
            <span className="ml-2 inline-block w-10 text-right font-mono text-slds-blue">
              {batchSize}
            </span>
          </label>
        </div>
        <RunControls
          onRun={runBatch}
          onReset={r.reset}
          running={r.running}
          done={r.done}
          label="Receive ClicAssure batch"
        />
      </div>

      <DemoLog
        running={r.running || r.done}
        lines={[
          `[ClicAssure] POST /v2/quotes — ${batchSize} records`,
          `[Guidewire] Emit AppEvent: PolicyQuoteCreated x ${batchSize}`,
          `[EventBridge] Rule: ca-quote-router → SF target`,
          `[Salesforce] Lead.upsert ✓ ${batchSize} created · 0 errors`,
          `[Qlik] Stream → BI mart updated`,
        ]}
      />
    </div>
  );
}

/* ---------------- UC2: QC Online Quotes ---------------- */

function QcOnlineDemo() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [form, setForm] = useState({
    nom: "Sophie Tremblay",
    courriel: "s.tremblay@gmail.com",
    code: "H2X 1Y4",
    valeur: "420000",
  });

  const stagesToBe: Stage[] = [
    { key: "form", label: lang === "fr" ? "Formulaire QC" : "QC Form", sub: lang === "fr" ? "Soumis" : "Submitted", icon: <Cloud className="h-3.5 w-3.5" /> },
    { key: "gw", label: "GW AppEvent", sub: "QuoteCreated", icon: <Database className="h-3.5 w-3.5" /> },
    { key: "eb", label: "EventBridge", sub: "QC routing", icon: <Workflow className="h-3.5 w-3.5" /> },
    { key: "sf", label: "Salesforce", sub: "Lead (FR UI)", icon: <Users className="h-3.5 w-3.5" /> },
  ];
  const r = useStepRunner(stagesToBe.length);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    r.start();
    toast.success(lang === "fr" ? "Soumission reçue" : "Quote submitted", {
      description: `${form.nom} · ${form.code}`,
    });
  };

  const t = (fr: string, en: string) => (lang === "fr" ? fr : en);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-[12px] text-slds-ink-soft">
          {t(
            "Formulaire client en français — pipeline de bout en bout vers Salesforce.",
            "French-language customer form — end-to-end pipeline into Salesforce.",
          )}
        </div>
        <div className="inline-flex overflow-hidden rounded border border-slds-border">
          {(["fr", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={[
                "px-2.5 py-1 text-[11px] font-semibold",
                lang === l ? "bg-slds-blue text-white" : "bg-white text-slds-ink",
              ].join(" ")}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[320px_1fr] gap-3">
        <form
          onSubmit={submit}
          className="space-y-2 rounded border border-slds-border bg-white p-3"
        >
          <div className="text-[12px] font-semibold text-slds-ink">
            {t("Devis Habitation — Québec", "Home Quote — Quebec")}
          </div>
          <Field
            label={t("Nom complet", "Full name")}
            value={form.nom}
            onChange={(v) => setForm({ ...form, nom: v })}
          />
          <Field
            label={t("Courriel", "Email")}
            value={form.courriel}
            onChange={(v) => setForm({ ...form, courriel: v })}
          />
          <Field
            label={t("Code postal", "Postal code")}
            value={form.code}
            onChange={(v) => setForm({ ...form, code: v })}
          />
          <Field
            label={t("Valeur de la propriété ($)", "Dwelling value ($)")}
            value={form.valeur}
            onChange={(v) => setForm({ ...form, valeur: v })}
          />
          <button className="w-full rounded bg-slds-blue px-3 py-1.5 text-[12px] font-semibold text-white hover:brightness-110">
            {t("Obtenir un devis", "Get quote")}
          </button>
        </form>

        <div className="space-y-3">
          <Pipeline stages={stagesToBe} active={r.active} done={r.done} />
          <DemoLog
            running={r.running || r.done}
            lines={[
              `[QC Form] submit → ${form.nom} · ${form.code}`,
              `[Guidewire] AppEvent: QC.QuoteCreated · locale=fr_CA`,
              `[EventBridge] Rule: qc-online → SF target`,
              `[Salesforce] Lead.create ✓ assigned to QC queue (FR)`,
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10.5px] font-bold uppercase tracking-wider text-slds-ink-soft">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-0.5 w-full rounded border border-slds-border px-2 py-1.5 text-[12px] outline-none focus:border-slds-blue"
      />
    </label>
  );
}

/* ---------------- UC3: Ontario / National ---------------- */

function OntarioDemo() {
  const [mode, setMode] = useState<"asis" | "tobe">("tobe");
  const stagesAsIs: Stage[] = [
    { key: "in", label: "Inbound Quote", sub: "ON / National", icon: <Cloud className="h-3.5 w-3.5" /> },
    { key: "gw", label: "Guidewire", sub: "PolicyCenter", icon: <Database className="h-3.5 w-3.5" /> },
    { key: "lm", label: "Legacy LM", sub: "Dual write", icon: <Database className="h-3.5 w-3.5" />, tone: "legacy" },
  ];
  const stagesToBe: Stage[] = [
    { key: "in", label: "Inbound Quote", sub: "ON / National", icon: <Cloud className="h-3.5 w-3.5" /> },
    { key: "gw", label: "GW AppEvent", sub: "Single emit", icon: <Database className="h-3.5 w-3.5" /> },
    { key: "eb", label: "EventBridge", sub: "Routing", icon: <Workflow className="h-3.5 w-3.5" /> },
    { key: "sf", label: "Salesforce", sub: "Single source", icon: <Users className="h-3.5 w-3.5" /> },
  ];

  const stages = mode === "asis" ? stagesAsIs : stagesToBe;
  const r = useStepRunner(stages.length);

  const run = () => {
    r.start();
    toast.success(
      mode === "asis"
        ? "Dual-write detected — LM + GW out of sync risk"
        : "Single-path: LM bypassed, Salesforce is system of record",
    );
  };

  const recon = useMemo(
    () => ({
      asis: { lmCount: 487, gwCount: 491, sfCount: 0, drift: 4 },
      tobe: { lmCount: 0, gwCount: 491, sfCount: 491, drift: 0 },
    }),
    [],
  );
  const stats = mode === "asis" ? recon.asis : recon.tobe;

  return (
    <div className="space-y-3">
      <div className="inline-flex overflow-hidden rounded border border-slds-border">
        {(["asis", "tobe"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              r.reset();
            }}
            className={[
              "px-3 py-1.5 text-[11.5px] font-semibold",
              mode === m
                ? m === "asis"
                  ? "bg-slate-600 text-white"
                  : "bg-emerald-600 text-white"
                : "bg-white text-slds-ink",
            ].join(" ")}
          >
            {m === "asis" ? "AS-IS (Dual Write)" : "TO-BE (Single Path)"}
          </button>
        ))}
      </div>

      <Pipeline stages={stages} active={r.active} done={r.done} />

      <div className="grid grid-cols-4 gap-3">
        <KPI label="LM Records" value={stats.lmCount.toString()} tone={stats.lmCount > 0 ? "warn" : "ok"} />
        <KPI label="Guidewire Records" value={stats.gwCount.toString()} tone="ok" />
        <KPI label="Salesforce Records" value={stats.sfCount.toString()} tone="ok" />
        <KPI
          label="Reconciliation Drift"
          value={stats.drift > 0 ? `${stats.drift} mismatches` : "0 — in sync"}
          tone={stats.drift > 0 ? "warn" : "ok"}
        />
      </div>

      <RunControls onRun={run} onReset={r.reset} running={r.running} done={r.done} label="Process inbound quote" />

      <DemoLog
        running={r.running || r.done}
        lines={
          mode === "asis"
            ? [
                "[Inbound] National quote received",
                "[Guidewire] PolicyCenter.upsert ✓",
                "[Legacy LM] sync.write ✓ (duplicate state)",
                "⚠ Reconciliation diff: 4 records out of sync",
              ]
            : [
                "[Inbound] National quote received",
                "[Guidewire] AppEvent emitted",
                "[EventBridge] → SF target only (LM bypassed)",
                "[Salesforce] Lead.upsert ✓ — single source of truth",
              ]
        }
      />
    </div>
  );
}

function KPI({ label, value, tone }: { label: string; value: string; tone: "ok" | "warn" }) {
  return (
    <div className="rounded border border-slds-border bg-white p-3">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slds-ink-soft">
        {label}
      </div>
      <div
        className={[
          "mt-1 text-[18px] font-semibold",
          tone === "warn" ? "text-amber-600" : "text-emerald-600",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}

/* ---------------- UC4: Five9 ---------------- */

type DialItem = { name: string; phone: string; status: "queued" | "dialing" | "connected" | "voicemail" | "done" };

function Five9Demo() {
  const [campaign] = useState("April Renewals — ON/QC");
  const [list, setList] = useState<DialItem[]>([
    { name: "Sophie Tremblay", phone: "+1 (514) 555-0192", status: "queued" },
    { name: "Raj Mehta", phone: "+1 (416) 555-2244", status: "queued" },
    { name: "James Okonkwo", phone: "+1 (613) 555-7710", status: "queued" },
    { name: "Marie-Hélène Roy", phone: "+1 (418) 555-3001", status: "queued" },
    { name: "David Chen", phone: "+1 (647) 555-4422", status: "queued" },
  ]);
  const [running, setRunning] = useState(false);
  const [idx, setIdx] = useState(-1);

  useEffect(() => {
    if (!running) return;
    if (idx >= list.length) {
      setRunning(false);
      toast.success("Dialer campaign complete", {
        description: "Outcomes synced back to Salesforce + Qlik BI",
      });
      return;
    }
    setList((prev) => prev.map((p, i) => (i === idx ? { ...p, status: "dialing" } : p)));
    const t1 = setTimeout(() => {
      const outcome: DialItem["status"] = Math.random() > 0.4 ? "connected" : "voicemail";
      setList((prev) => prev.map((p, i) => (i === idx ? { ...p, status: outcome } : p)));
    }, 900);
    const t2 = setTimeout(() => {
      setList((prev) => prev.map((p, i) => (i === idx ? { ...p, status: "done" } : p)));
      setIdx((x) => x + 1);
    }, 1700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [running, idx, list.length]);

  const start = () => {
    setList((prev) => prev.map((p) => ({ ...p, status: "queued" })));
    setIdx(0);
    setRunning(true);
  };
  const reset = () => {
    setRunning(false);
    setIdx(-1);
    setList((prev) => prev.map((p) => ({ ...p, status: "queued" })));
  };

  const stats = {
    connected: list.filter((l) => l.status === "connected" || (l.status === "done" && false)).length,
    completed: list.filter((l) => l.status === "done").length,
  };
  const completedConnected = list.filter((l) => l.status === "done").length;
  const connectedDone = list.filter((l) => l.status === "connected").length;

  return (
    <div className="space-y-3">
      <div className="rounded border border-slds-border bg-[oklch(0.18_0.02_250)] p-3 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">
              Five9 CTI Adapter — Salesforce Embedded
            </div>
            <div className="text-[14px] font-semibold">{campaign}</div>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span
              className={[
                "h-2 w-2 rounded-full",
                running ? "bg-amber-400 animate-pulse" : "bg-emerald-400",
              ].join(" ")}
            />
            {running ? "Dialing…" : "Ready"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-3">
        <div className="overflow-hidden rounded border border-slds-border">
          <table className="w-full text-[12px]">
            <thead className="bg-slds-neutral-bg text-[10px] font-bold uppercase tracking-wider text-slds-ink-soft">
              <tr>
                <th className="px-3 py-2 text-left">Lead</th>
                <th className="px-3 py-2 text-left">Phone</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map((l, i) => (
                <tr key={l.name} className={i === idx && running ? "bg-slds-blue-light" : "border-t border-slds-border"}>
                  <td className="px-3 py-2 font-semibold text-slds-blue">{l.name}</td>
                  <td className="px-3 py-2 font-mono text-[11.5px]">{l.phone}</td>
                  <td className="px-3 py-2">
                    <DialStatusBadge s={l.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-2">
          <KPI label="Total Dialed" value={`${completedConnected} / ${list.length}`} tone="ok" />
          <KPI label="Connected" value={connectedDone.toString()} tone="ok" />
          <KPI
            label="Voicemail"
            value={list.filter((l) => l.status === "voicemail").length.toString()}
            tone="warn"
          />
        </div>
      </div>

      <RunControls onRun={start} onReset={reset} running={running} done={!running && idx >= list.length} label="Start auto-dialer" />

      <DemoLog
        running={running || idx >= list.length}
        lines={[
          "[Salesforce] List sync → Five9 dialer queue",
          "[Five9] Predictive dialer engaged",
          "[Five9] Outcomes streamed back via CTI adapter",
          "[Salesforce] Activity records auto-created",
          "[Qlik] Campaign performance refreshed",
        ]}
      />
    </div>
  );
}

function DialStatusBadge({ s }: { s: DialItem["status"] }) {
  const map = {
    queued: { label: "Queued", cls: "bg-slate-100 text-slate-700" },
    dialing: { label: "Dialing…", cls: "bg-amber-100 text-amber-800" },
    connected: { label: "Connected", cls: "bg-emerald-100 text-emerald-800" },
    voicemail: { label: "Voicemail", cls: "bg-orange-100 text-orange-800" },
    done: { label: "Logged", cls: "bg-slds-blue-light text-slds-blue" },
  } as const;
  const v = map[s];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${v.cls}`}>
      <Phone className="h-3 w-3" /> {v.label}
    </span>
  );
}

/* ---------------- UC5: Marketo ---------------- */

type Sync = { id: number; type: "lead" | "engagement" | "score"; from: "SF" | "MKT"; to: "SF" | "MKT"; payload: string };

function MarketoDemo() {
  const [logs, setLogs] = useState<Sync[]>([]);
  const [counter, setCounter] = useState(0);

  const triggerCampaign = () => {
    const items: Sync[] = [
      { id: counter + 1, type: "lead", from: "SF", to: "MKT", payload: "Campaign: Spring Bundle 2026 · 1,420 leads" },
      { id: counter + 2, type: "engagement", from: "MKT", to: "SF", payload: "Email opened: s.tremblay@gmail.com" },
      { id: counter + 3, type: "engagement", from: "MKT", to: "SF", payload: "Form fill: r.mehta@outlook.com" },
      { id: counter + 4, type: "score", from: "MKT", to: "SF", payload: "Score updated: Tremblay 78 → 93" },
    ];
    setCounter((c) => c + items.length);
    items.forEach((it, i) => {
      setTimeout(() => {
        setLogs((prev) => [it, ...prev].slice(0, 10));
        toast(it.from + " → " + it.to, { description: it.payload });
      }, i * 500);
    });
  };

  const sendSms = () => {
    setLogs((prev) =>
      [
        {
          id: counter + 100,
          type: "engagement" as const,
          from: "SF" as const,
          to: "MKT" as const,
          payload: "Twilio SMS sent · Quote Reminder · 1,284 recipients",
        },
        ...prev,
      ].slice(0, 10),
    );
    toast.success("Twilio SMS dispatched", { description: "Engagement attribution synced to Marketo" });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <SystemCard
          title="Salesforce"
          sub="Source of truth · Campaigns"
          icon={<Cloud className="h-4 w-4" />}
          color="bg-slds-blue text-white"
          actions={
            <button
              onClick={triggerCampaign}
              className="w-full rounded bg-white/15 px-2 py-1.5 text-[11.5px] font-semibold text-white hover:bg-white/25"
            >
              Trigger Campaign Sync
            </button>
          }
        />
        <SystemCard
          title="Marketo"
          sub="Email + Landing pages"
          icon={<Mail className="h-4 w-4" />}
          color="bg-violet-600 text-white"
          actions={
            <div className="flex items-center justify-center gap-2 text-[11px] text-white/85">
              <span className="flex items-center gap-1">
                <ArrowRight className="h-3 w-3 rotate-180" /> Engagement
              </span>
              <span className="text-white/40">·</span>
              <span className="flex items-center gap-1">
                <ArrowRight className="h-3 w-3" /> Lists
              </span>
            </div>
          }
        />
        <SystemCard
          title="Twilio SMS"
          sub="Closed-loop attribution"
          icon={<MessageSquare className="h-4 w-4" />}
          color="bg-emerald-600 text-white"
          actions={
            <button
              onClick={sendSms}
              className="w-full rounded bg-white/15 px-2 py-1.5 text-[11.5px] font-semibold text-white hover:bg-white/25"
            >
              Send SMS Campaign
            </button>
          }
        />
      </div>

      <div className="overflow-hidden rounded border border-slds-border bg-white">
        <div className="flex items-center justify-between border-b border-slds-border bg-slds-neutral-bg px-3 py-2 text-[12px] font-semibold text-slds-ink">
          <span className="flex items-center gap-2">
            <ListChecks className="h-3.5 w-3.5" /> Live 2-Way Sync Stream
          </span>
          <span className="text-[10.5px] text-slds-ink-soft">{logs.length} events</span>
        </div>
        {logs.length === 0 ? (
          <div className="p-6 text-center text-[12px] text-slds-ink-soft">
            Trigger a campaign or SMS to see the closed-loop sync.
          </div>
        ) : (
          <ul className="max-h-64 divide-y divide-slds-border overflow-y-auto">
            {logs.map((l) => (
              <li key={l.id} className="flex items-center gap-3 px-3 py-2 text-[12px]">
                <span
                  className={[
                    "rounded-full px-2 py-0.5 text-[10px] font-bold",
                    l.from === "SF" ? "bg-slds-blue-light text-slds-blue" : "bg-violet-100 text-violet-700",
                  ].join(" ")}
                >
                  {l.from}
                </span>
                <ArrowRight className="h-3 w-3 text-slds-ink-soft" />
                <span
                  className={[
                    "rounded-full px-2 py-0.5 text-[10px] font-bold",
                    l.to === "SF" ? "bg-slds-blue-light text-slds-blue" : "bg-violet-100 text-violet-700",
                  ].join(" ")}
                >
                  {l.to}
                </span>
                <span className="flex-1 text-slds-ink">{l.payload}</span>
                <Zap className="h-3 w-3 text-amber-500" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SystemCard({
  title,
  sub,
  icon,
  color,
  actions,
}: {
  title: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  actions: React.ReactNode;
}) {
  return (
    <div className={`rounded border border-slds-border ${color} p-3 shadow-sm`}>
      <div className="flex items-center gap-2 text-[13px] font-semibold">
        {icon} {title}
      </div>
      <div className="text-[11px] opacity-90">{sub}</div>
      <div className="mt-2">{actions}</div>
    </div>
  );
}

/* ---------------- Demo log ---------------- */

function DemoLog({ lines, running }: { lines: string[]; running: boolean }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!running) {
      setShown(0);
      return;
    }
    setShown(0);
    const timers = lines.map((_, i) =>
      setTimeout(() => setShown((s) => Math.max(s, i + 1)), 700 * (i + 1)),
    );
    return () => timers.forEach(clearTimeout);
  }, [running, lines]);

  return (
    <div className="rounded border border-slds-border bg-[oklch(0.18_0.02_250)] p-3 font-mono text-[11.5px] text-emerald-300">
      <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-white/50">
        Event log
      </div>
      {lines.slice(0, shown).map((l, i) => (
        <div key={i} className="leading-relaxed">
          <span className="text-white/40">›</span> {l}
        </div>
      ))}
      {shown === 0 && <div className="text-white/40">— awaiting events —</div>}
    </div>
  );
}
