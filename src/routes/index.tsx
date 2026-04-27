import { createFileRoute } from "@tanstack/react-router";
import { ConsoleChrome } from "@/components/console/ConsoleChrome";
import { Workbench } from "@/components/console/Workbench";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Service Console — Aviva Canada" },
      { name: "description", content: "Salesforce-native agent workbench for Aviva Canada — Guidewire, Five9, Twilio, and Einstein in one console." },
      { property: "og:title", content: "Service Console — Aviva Canada" },
      { property: "og:description", content: "Salesforce-native agent workbench for Aviva Canada." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ConsoleChrome>
      <Workbench />
      <Toaster position="bottom-right" richColors />
    </ConsoleChrome>
  );
}
