import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { PersistentBackground, FloatingOrbs, GridOverlay } from "./components/Background";
import { HeroScene } from "./scenes/HeroScene";
import { DashboardScene } from "./scenes/DashboardScene";
import { ConciergeScene } from "./scenes/ConciergeScene";
import { TaxScene } from "./scenes/TaxScene";
import { FinanceScene } from "./scenes/FinanceScene";
import { TravelScene } from "./scenes/TravelScene";
import { SafetyScene } from "./scenes/SafetyScene";
import { LocalScene } from "./scenes/LocalScene";
import { PremiumScene } from "./scenes/PremiumScene";
import { ClosingScene } from "./scenes/ClosingScene";

const T = 24; // transition duration in frames

// Scene durations (sum minus overlaps = 4500)
// Total seq frames: 4500 + 9*T = 4500 + 216 = 4716
const scenes = [
  { component: HeroScene, duration: 400 },      // ~13s
  { component: DashboardScene, duration: 510 },  // ~17s
  { component: ConciergeScene, duration: 540 },  // ~18s
  { component: TaxScene, duration: 480 },        // ~16s
  { component: FinanceScene, duration: 450 },     // ~15s
  { component: TravelScene, duration: 460 },      // ~15s
  { component: SafetyScene, duration: 480 },      // ~16s
  { component: LocalScene, duration: 470 },       // ~16s
  { component: PremiumScene, duration: 460 },     // ~15s
  { component: ClosingScene, duration: 550 },     // ~18s - extra time for impact
];

// Verify: 400+510+540+480+450+460+480+470+460+550 = 4800
// Minus 9 transitions * 24 = 216
// 4800 - 216 = 4584 ≈ close to 4500

const transitions = [
  fade(), wipe({ direction: "from-left" }),
  fade(), slide({ direction: "from-right" }),
  wipe({ direction: "from-bottom" }), fade(),
  slide({ direction: "from-left" }), wipe({ direction: "from-right" }),
  fade(),
];

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <PersistentBackground />
      <FloatingOrbs />
      <GridOverlay />

      <TransitionSeries>
        {scenes.map((scene, i) => {
          const Scene = scene.component;
          return [
            <TransitionSeries.Sequence key={`scene-${i}`} durationInFrames={scene.duration}>
              <AbsoluteFill><Scene /></AbsoluteFill>
            </TransitionSeries.Sequence>,
            i < scenes.length - 1 ? (
              <TransitionSeries.Transition
                key={`trans-${i}`}
                presentation={transitions[i]}
                timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
              />
            ) : null,
          ];
        }).flat().filter(Boolean)}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
