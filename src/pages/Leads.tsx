import { ConsoleChrome } from "@/components/console/ConsoleChrome";
import { QUEUE } from "@/data/mock";
import { Search, Filter, Download, Plus } from "lucide-react";

export default function LeadsPage() {
  return (
    <ConsoleChrome>
      <div className="bg-slds-neutral-bg p-4">
        <div className="overflow-hidden rounded border border-slds-border bg-white">
          <div className="flex items-center justify-between border-b border-slds-border px-4 py-3">
            <div>
              <h1 className="text-[16px] font-semibold text-slds-ink">Leads</h1>
              <div className="text-[11px] text-slds-ink-soft">All open leads · sorted by Einstein score</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slds-ink-soft" />
                <input className="w-56 rounded border border-slds-border py-1.5 pl-7 pr-2 text-[12px] outline-none focus:border-slds-blue" placeholder="Search leads…" />
              </div>
              <button className="inline-flex items-center gap-1.5 rounded border border-slds-border bg-white px-2.5 py-1.5 text-[12px] font-semibold text-slds-ink hover:bg-slds-neutral-bg">
                <Filter className="h-3.5 w-3.5" /> Filter
              </button>
              <button className="inline-flex items-center gap-1.5 rounded border border-slds-border bg-white px-2.5 py-1.5 text-[12px] font-semibold text-slds-ink hover:bg-slds-neutral-bg">
                <Download className="h-3.5 w-3.5" /> Export
              </button>
              <button className="inline-flex items-center gap-1.5 rounded bg-slds-blue px-2.5 py-1.5 text-[12px] font-semibold text-white hover:brightness-110">
                <Plus className="h-3.5 w-3.5" /> New Lead
              </button>
            </div>
          </div>
          <table className="w-full text-[12.5px]">
            <thead className="bg-slds-neutral-bg text-[10.5px] font-bold uppercase tracking-wider text-slds-ink-soft">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Source</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Einstein</th>
                <th className="px-4 py-2 text-left">Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {QUEUE.map((q) => (
                <tr key={q.id} className="border-t border-slds-border hover:bg-slds-blue-light">
                  <td className="px-4 py-2.5">
                    <span className="font-semibold text-slds-blue">{q.name}</span>
                    {q.hot && <span className="ml-2 rounded-full bg-slds-hot px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">Hot</span>}
                  </td>
                  <td className="px-4 py-2.5 text-slds-ink">{q.meta}</td>
                  <td className="px-4 py-2.5 text-slds-ink-soft">{q.source}</td>
                  <td className="px-4 py-2.5 text-slds-ink">{q.status}</td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex h-5 min-w-[1.75rem] items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[10.5px] font-bold text-white">
                      {q.score}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slds-ink-soft">{q.ago}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ConsoleChrome>
  );
}
