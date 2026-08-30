import { AppShell } from "@/components/shell/app-shell";

/** Routes that live inside the standard workspace chrome. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
