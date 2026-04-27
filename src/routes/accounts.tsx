import { createFileRoute } from "@tanstack/react-router";
import { ConsoleChrome } from "@/components/console/ConsoleChrome";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [
      { title: "Accounts — Aviva Service Console" },
      { name: "description", content: "Aviva Canada customer accounts." },
    ],
  }),
  component: AccountsPage,
});

const ACCOUNTS = [
  { name: "Tremblay Household", city: "Montréal, QC", policies: 1, ltv: "$1,284", segment: "Home" },
  { name: "Mehta Family", city: "Mississauga, ON", policies: 2, ltv: "$2,140", segment: "Bundle" },
  { name: "Okonkwo, James", city: "Ottawa, ON", policies: 1, ltv: "$1,560", segment: "Auto" },
  { name: "Roy, Marie-Hélène", city: "Québec, QC", policies: 2, ltv: "$1,980", segment: "Bundle" },
  { name: "Chen, David", city: "Toronto, ON", policies: 1, ltv: "$612", segment: "Condo" },
  { name: "Sharma, Priya", city: "Hamilton, ON", policies: 1, ltv: "$418", segment: "Tenant" },
  { name: "Lavoie, François", city: "Sherbrooke, QC", policies: 1, ltv: "$2,210", segment: "PPV" },
  { name: "Petrov, Angela", city: "Vancouver, BC", policies: 1, ltv: "$1,420", segment: "Home" },
];

function AccountsPage() {
  return (
    <ConsoleChrome>
      <div className="bg-slds-neutral-bg p-4">
        <div className="overflow-hidden rounded border border-slds-border bg-white">
          <div className="flex items-center justify-between border-b border-slds-border px-4 py-3">
            <div>
              <h1 className="text-[16px] font-semibold text-slds-ink">Accounts</h1>
              <div className="text-[11px] text-slds-ink-soft">{ACCOUNTS.length} accounts · all regions</div>
            </div>
          </div>
          <table className="w-full text-[12.5px]">
            <thead className="bg-slds-neutral-bg text-[10.5px] font-bold uppercase tracking-wider text-slds-ink-soft">
              <tr>
                <th className="px-4 py-2 text-left">Account</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Segment</th>
                <th className="px-4 py-2 text-left">Active Policies</th>
                <th className="px-4 py-2 text-left">Annual Premium</th>
              </tr>
            </thead>
            <tbody>
              {ACCOUNTS.map((a) => (
                <tr key={a.name} className="border-t border-slds-border hover:bg-slds-blue-light">
                  <td className="px-4 py-2.5 font-semibold text-slds-blue">{a.name}</td>
                  <td className="px-4 py-2.5 text-slds-ink">{a.city}</td>
                  <td className="px-4 py-2.5 text-slds-ink-soft">{a.segment}</td>
                  <td className="px-4 py-2.5 text-slds-ink">{a.policies}</td>
                  <td className="px-4 py-2.5 font-semibold text-slds-ink">{a.ltv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ConsoleChrome>
  );
}
