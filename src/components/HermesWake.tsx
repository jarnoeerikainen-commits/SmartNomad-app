// ═══════════════════════════════════════════════════════════════════════════
// HermesWake — invisible global component that wakes Hermes on:
//   • demo persona activity
//   • admin page visits
//   • anomaly signals (safety alerts, failed bookings)
// Mount once near the top of the app tree. Renders nothing.
// ═══════════════════════════════════════════════════════════════════════════
import { useDemoPersona } from "@/contexts/DemoPersonaContext";
import { useHermesWake } from "@/hooks/useHermesWake";

export default function HermesWake() {
  const { isDemo, activePersona } = useDemoPersona();
  useHermesWake({
    isDemo,
    persona: activePersona?.id ?? null,
    enabled: true,
  });
  return null;
}
