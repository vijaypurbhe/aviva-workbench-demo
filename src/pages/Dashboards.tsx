import { ConsoleChrome } from "@/components/console/ConsoleChrome";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const QUOTES = [
  { m: "Nov", v: 720 },
  { m: "Dec", v: 810 },
  { m: "Jan", v: 920 },
  { m: "Feb", v: 1040 },
  { m: "Mar", v: 1180 },
  { m: "Apr", v: 1284 },
];
const BIND = [
  { m: "Nov", v: 32 },
  { m: "Dec", v: 33 },
  { m: "Jan", v: 35 },
  { m: "Feb", v: 36 },
  { m: "Mar", v: 37 },
  { m: "Apr", v: 38 },
];

export default function DashboardsPage() {
  return (
    <ConsoleChrome>
      <div className="grid grid-cols-2 gap-4 bg-slds-neutral-bg p-4">
        <Card title="Quote Volume — Last 6 Months">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={QUOTES}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 250)" />
              <XAxis dataKey="m" stroke="oklch(0.5 0.03 250)" fontSize={11} />
              <YAxis stroke="oklch(0.5 0.03 250)" fontSize={11} />
              <Tooltip />
              <Bar dataKey="v" fill="oklch(0.55 0.17 250)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Bind Rate Trend (%)">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={BIND}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 250)" />
              <XAxis dataKey="m" stroke="oklch(0.5 0.03 250)" fontSize={11} />
              <YAxis stroke="oklch(0.5 0.03 250)" fontSize={11} domain={[28, 42]} />
              <Tooltip />
              <Line type="monotone" dataKey="v" stroke="oklch(0.7 0.17 150)" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Channel Mix (Quotes Inbound)">
          <div className="space-y-3 p-2">
            {[
              { c: "ClicAssure", v: 38 },
              { c: "Online Form", v: 27 },
              { c: "Marketo", v: 18 },
              { c: "Broker", v: 12 },
              { c: "GW AppEvents", v: 5 },
            ].map((r) => (
              <div key={r.c}>
                <div className="flex justify-between text-[12px]"><span>{r.c}</span><span className="text-slds-ink-soft">{r.v}%</span></div>
                <div className="mt-1 h-2 rounded bg-slds-neutral-bg">
                  <div className="h-2 rounded bg-slds-blue" style={{ width: `${r.v * 2.5}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Einstein Recommendation Acceptance">
          <div className="grid grid-cols-3 gap-3 p-2 text-center">
            {[
              { k: "Suggested", v: "2,140" },
              { k: "Accepted", v: "1,612" },
              { k: "Rate", v: "75.3%" },
            ].map((s) => (
              <div key={s.k} className="rounded border border-slds-border bg-slds-neutral-bg p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slds-ink-soft">{s.k}</div>
                <div className="mt-1 text-[22px] font-semibold text-slds-blue">{s.v}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ConsoleChrome>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded border border-slds-border bg-white">
      <div className="border-b border-slds-border px-4 py-2.5 text-[13px] font-semibold text-slds-ink">{title}</div>
      <div className="p-3">{children}</div>
    </div>
  );
}
