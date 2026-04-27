import { Link, useLocation } from "react-router-dom";
import { Bell, HelpCircle, Search, Settings, Cloud } from "lucide-react";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Leads", to: "/leads" },
  { label: "Accounts", to: "/accounts" },
  { label: "Reports", to: "/reports" },
  { label: "Dashboards", to: "/dashboards" },
] as const;

export function ConsoleChrome({ children }: { children: React.ReactNode }) {
  const path = useLocation().pathname;

  return (
    <div className="flex min-h-screen flex-col bg-slds-neutral-bg">
      {/* Top nav */}
      <header className="flex h-12 items-center gap-3 bg-slds-blue-dark px-4 text-white">
        <div className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-white/90" fill="currentColor" />
          <span className="text-[15px] font-semibold tracking-tight">Service Console</span>
        </div>
        <nav className="ml-4 flex items-center">
          {NAV.map((n) => {
            const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={[
                  "relative px-4 py-3 text-[13px] font-medium transition-colors",
                  active ? "bg-white/10 text-white" : "text-white/85 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                {n.label}
                {active && (
                  <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t bg-white" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <button className="grid h-8 w-8 place-items-center rounded text-white/85 hover:bg-white/10">
            <Search className="h-4 w-4" />
          </button>
          <button className="grid h-8 w-8 place-items-center rounded text-white/85 hover:bg-white/10">
            <HelpCircle className="h-4 w-4" />
          </button>
          <button className="grid h-8 w-8 place-items-center rounded text-white/85 hover:bg-white/10">
            <Bell className="h-4 w-4" />
          </button>
          <button className="grid h-8 w-8 place-items-center rounded text-white/85 hover:bg-white/10">
            <Settings className="h-4 w-4" />
          </button>
          <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-700 text-[12px] font-semibold text-white">
            SK
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1">{children}</div>

      {/* Footer */}
      <footer className="flex h-9 items-center gap-6 bg-slds-footer px-4 text-[12px] text-white/85">
        <StatusDot color="bg-emerald-400" label="Salesforce connected" />
        <span className="text-white/30">|</span>
        <StatusDot color="bg-emerald-400" label="GW PolicyCenter — Live feed active" />
        <span className="text-white/30">|</span>
        <StatusDot color="bg-emerald-400" label="Five9 — Agent Ready" />
        <span className="text-white/30">|</span>
        <StatusDot color="bg-emerald-400" label="Twilio SMS — Connected" />
        <span className="text-white/30">|</span>
        <StatusDot color="bg-emerald-400" label="Einstein AI — Active" />
        <div className="ml-auto text-white/70">
          Aviva Canada · Salesforce Sales Cloud · April 2026
        </div>
      </footer>
    </div>
  );
}

function StatusDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      <span>{label}</span>
    </span>
  );
}
