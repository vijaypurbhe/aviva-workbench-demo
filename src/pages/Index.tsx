import { ConsoleChrome } from "@/components/console/ConsoleChrome";
import { Workbench } from "@/components/console/Workbench";
import { Toaster } from "@/components/ui/sonner";

export default function IndexPage() {
  return (
    <ConsoleChrome>
      <Workbench />
      <Toaster position="bottom-right" richColors />
    </ConsoleChrome>
  );
}
