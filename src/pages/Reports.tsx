import { ConsoleChrome } from "@/components/console/ConsoleChrome";
import { TrendingUp, Target, Sparkles, MessageSquare } from "lucide-react";

const TILES = [
  { label: "Quotes by Province (QTD)", value: "1,284", delta: "+12.4%", icon: TrendingUp, tone: "emerald" },
  { label: "Bind Rate", value: "38.2%", delta: "+2.1 pts", icon: Target, tone: "blue" },
  { label: "Avg Einstein Score", value: "71", delta: "+4", icon: Sparkles, tone: "violet" },
  { label: "SMS Delivery (Twilio)", value: "99.7%", delta: "stable", icon: MessageSquare, tone: "emerald" },
];

const TABLE = [
  { region: "Quebec", quotes: 512, bind: "41%", premium: "$634K" },
  { region: "Ontario", quotes: 488, bind: "37%", premium: "$721K" },
  { region: "British Columbia", quotes: 184, bind: "33%", premium: "$248K" },
  { region: "Alberta", quotes: 100, bind: "29%", premium: "$132K" },
];

export default function ReportsPage() {
  return (
    <ConsoleChrome>
      <div className="space-y-4 bg-slds-neutral-bg p-4">
        <div className="grid grid-cols-4 gap-3">
          {TILES.map((t) => (
            <div key={t.label} className="rounded border border-slds-border bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slds-ink-soft">{t.label}</div>
                <t.icon className="h-4 w-4 text-slds-ink-soft" />
              </div>
              <div className="mt-2 text-[26px] font-semibold text-slds-ink">{t.value}</div>
              <div className="text-[12px] text-emerald-600">{t.delta}</div>
            </div>
          ))}
        </div>
        <div className="overflow-hidden rounded border border-slds-border bg-white">
          <div className="border-b border-slds-border px-4 py-3 text-[14px] font-semibold text-slds-ink">
            Quote Performance by Region
          </div>
          <table className="w-full text-[12.5px]">
            <thead className="bg-slds-neutral-bg text-[10.5px] font-bold uppercase tracking-wider text-slds-ink-soft">
              <tr>
                <th className="px-4 py-2 text-left">Region</th>
                <th className="px-4 py-2 text-left">Quotes</th>
                <th className="px-4 py-2 text-left">Bind Rate</th>
                <th className="px-4 py-2 text-left">Annual Premium</th>
              </tr>
            </thead>
            <tbody>
              {TABLE.map((r) => (
                <tr key={r.region} className="border-t border-slds-border hover:bg-slds-blue-light">
                  <td className="px-4 py-2.5 font-semibold text-slds-blue">{r.region}</td>
                  <td className="px-4 py-2.5">{r.quotes}</td>
                  <td className="px-4 py-2.5">{r.bind}</td>
                  <td className="px-4 py-2.5 font-semibold">{r.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ConsoleChrome>
  );
}
