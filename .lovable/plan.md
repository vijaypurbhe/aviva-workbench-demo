## Aviva Canada — Salesforce-Style Service Console Workbench Demo

A pixel-faithful, clickable demo of an insurance agent workbench that recreates the Salesforce Service Console look and feel from the mockup. Built for Aviva Canada's home/auto lead handling workflow, integrating (visually) Guidewire PolicyCenter, Five9 CTI, Twilio SMS, and Einstein AI.

### Look & Feel (Salesforce Lightning native)

- Top global nav bar in Salesforce blue (`#0176D3`-ish) with Aviva cloud logo, app name "Service Console", primary nav (Home, Leads, Accounts, Reports, Dashboards), and right-side icons + user avatar "SK".
- Multi-tab workspace bar directly under the nav (Lead Queue, Sophie Tremblay [HOT badge], Raj Mehta, GW Quote #QC-8821, "+ Open Tab"). Active tab underlined in SLDS blue.
- Three-pane console layout:
  - Left: Lead Queue list (search, filter chips: All / My Queue / QC / ON, lead cards with Einstein score badge, status, time).
  - Center: Active record workspace.
  - Right: AI + integration utility rail.
- Bottom utility footer with colored status dots: Salesforce connected · GW PolicyCenter Live feed · Five9 Agent Ready · Twilio SMS Connected · Einstein AI Active. Right side: "Aviva Canada · Salesforce Sales Cloud · April 2026".
- SLDS-style typography (system sans), tight spacing, subtle borders, white cards with thin shadows, color-coded section header bars (Guidewire = blue, Five9 = black).

### Center Workspace (Sophie Tremblay tab)

- Record header: avatar tile, name, "New Lead" pill, breadcrumb (Lead · Home Insurance · Quebec · Source: ClicAssure · Assigned: Sarah Kim). Quick-action buttons top-right: Send SMS (pink), Call (blue), Log Activity, Convert.
- Key field strip: Phone, Email, Province, GW Policy #, Einstein Score 93/100, CASL Consent ✓ Verified.
- **Guidewire PolicyCenter Quote Summary card** (blue header with "LIVE" pill): grid of Quote Status, Annual Premium, Product Line, Dwelling Value, Deductible, Quote Expiry, Coverage Liability/Contents, Underwriter.
- **Five9 CTI Adapter card** (black header, Ready dot): click-to-dial number display, large Call (green) and Hold (orange) circular buttons, action row (Log Call, Transfer, Schedule CB, End Call), last-call metadata line.
- **Document Access Hub**: 2-column grid of document tiles with type tags (GW, UW, CASL, PROD, COMP), each clickable to open a modal preview.

### Right Rail

- **Einstein Next Best Action** card (AI badge): top recommendation "Call Now — Quote Expires in 13 Days" with 98% confidence ring + reasoning + Call Now button. Secondary: "Upsell Opportunity — Offer Auto Bundle (+$340/yr)" 74% with Offer Bundle button.
- **SMS via Twilio (On-Prem)** card with Connected pill: send-template list (Quote Expiry Reminder, Callback Confirmation, Bundle Offer — Home+Auto) each with Send button; last-SMS status footer.
- **Interaction History** card with "Migrated from MongoDB" pill: timeline entries (Outbound Call — Left Voicemail, Inbound SMS, Email Open, Quote Generated).

### Interactive Behavior (demo-grade, all client-side mock data)

- Switching tabs in the workspace bar swaps the center+right content (each tab has its own mocked lead/quote).
- Selecting a lead in the left queue opens/focuses its tab.
- Clicking Call animates the Five9 adapter to "On Call" with a running timer; End Call returns to Ready and appends a row to Interaction History.
- Send SMS / template Send buttons append to history and show an SLDS-style toast.
- Convert button opens an SLDS modal "Convert Lead to Opportunity" with Guidewire policy binding preview.
- Document tiles open a modal with a faux PDF preview (header, sample fields, download stub).
- Einstein "Call Now" triggers the same call flow as the Five9 Call button.
- Filter chips and search filter the lead queue live.

### Pages / Routes

- `/` — Service Console (the workbench, default tab = Sophie Tremblay).
- `/leads` — Full Leads list view (SLDS data table with sortable columns, Einstein score column).
- `/accounts` — Accounts list (placeholder SLDS table with Aviva-style sample accounts).
- `/reports` — Simple SLDS dashboard tiles (Quotes by Province, Bind Rate, Avg Einstein Score, SMS Delivery).
- `/dashboards` — Chart cards (bar + line) using existing Recharts.

The top nav links route between these; the workspace tab bar is specific to the console route.

### Mock Data

Hard-coded TypeScript fixtures for:
- 8 leads (matching the queue in the mockup, plus a couple extra).
- 4 open workspace tabs with full quote/contact/history payloads.
- Document set per lead.
- Einstein recommendations per lead.
- Interaction history entries.

No backend, no auth, no Lovable Cloud — pure front-end demo so it loads instantly and is safe to share.

### Technical Notes

- TanStack Start file routes: `index.tsx` (console), `leads.tsx`, `accounts.tsx`, `reports.tsx`, `dashboards.tsx`. Each with its own `head()` metadata.
- Shared `ConsoleChrome` component renders the top nav + footer status bar across all routes.
- `WorkbenchLayout` component renders the 3-pane console + workspace tab bar (used only on `/`).
- State via React `useState`/`useReducer` in a `ConsoleProvider` context for active tab, call state, history, toasts.
- SLDS-flavored colors added as CSS variables in `styles.css` (`--slds-blue`, `--slds-blue-dark`, `--slds-hot-pink`, `--slds-success`, `--slds-warning`, `--slds-neutral-bg`) alongside existing tokens; reused via Tailwind arbitrary values.
- Reuse shadcn primitives: `card`, `button`, `badge`, `dialog`, `input`, `tabs`, `table`, `sonner` (toasts), `avatar`, `separator`, `tooltip`.
- Lucide icons for nav, actions, status dots, document types.
- Fully responsive down to ~1280px (console UIs aren't expected to be mobile); graceful collapse of right rail under 1024px.
- No new npm dependencies required.
