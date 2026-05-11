import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { C } from "./theme";
import { ClosingSceneV2, ConciergeSceneV2, DocsSceneV2, HeroSceneV2, TaxSceneV2, ThreatSceneV2 } from "./scenes";

// Subtle vignette + film grain overlay so frames look cinematic, not flat HTML.
const FilmGrain: React.FC = () => {
  const frame = useCurrentFrame();
  const o = 0.04 + Math.abs(Math.sin(frame * 0.6)) * 0.02;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: o, background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), transparent 60%), radial-gradient(circle at 70% 70%, rgba(0,0,0,0.5), transparent 70%)" }} />
  );
};

const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)" }} />
);

// Teaser: 30s → 924 frames. 5 beats.
//   Hero 130 · Tax 180 · Threat 180 · Docs 160 · Concierge 174 · Closing 100  (+ 5×20f transitions = 100 overlap)
//   Effective = 924f. Each transition 20f.
export const TeaserV2: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.deep, fontFamily: '"Inter", sans-serif' }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={150}><HeroSceneV2 /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 18 })} />
        <TransitionSeries.Sequence durationInFrames={170}><TaxSceneV2 /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: 22 })} />
        <TransitionSeries.Sequence durationInFrames={170}><ThreatSceneV2 /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: 22 })} />
        <TransitionSeries.Sequence durationInFrames={150}><DocsSceneV2 /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 18 })} />
        <TransitionSeries.Sequence durationInFrames={170}><ConciergeSceneV2 /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 18 })} />
        <TransitionSeries.Sequence durationInFrames={265}><ClosingSceneV2 /></TransitionSeries.Sequence>
      </TransitionSeries>
      <Vignette />
      <FilmGrain />
      <Sequence from={0}>
        <Audio src={staticFile("audio/supernomad_teaser_voice.mp3")} volume={0.92} />
      </Sequence>
    </AbsoluteFill>
  );
};

// Full ecosystem film: 102.6s → 3080 frames.
// Hero 320 · Tax 460 · Threat 460 · Docs 440 · Concierge 480 · 2nd Tax-context 0 · Closing 460  → 2620 + transitions
export const EcosystemV2: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.deep, fontFamily: '"Inter", sans-serif' }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={360}><HeroSceneV2 /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 24 })} />
        <TransitionSeries.Sequence durationInFrames={500}><TaxSceneV2 /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: 28 })} />
        <TransitionSeries.Sequence durationInFrames={520}><ThreatSceneV2 /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: 28 })} />
        <TransitionSeries.Sequence durationInFrames={460}><DocsSceneV2 /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 24 })} />
        <TransitionSeries.Sequence durationInFrames={560}><ConciergeSceneV2 /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 26 })} />
        <TransitionSeries.Sequence durationInFrames={870}><ClosingSceneV2 /></TransitionSeries.Sequence>
      </TransitionSeries>
      <Vignette />
      <FilmGrain />
      <Sequence from={0}>
        <Audio src={staticFile("audio/supernomad_ecosystem_voice.mp3")} volume={0.92} />
      </Sequence>
    </AbsoluteFill>
  );
};
