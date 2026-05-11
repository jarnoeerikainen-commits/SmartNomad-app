import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { EcosystemFilm } from "./EcosystemFilm";
import { TeaserV2, EcosystemV2 } from "./v2/Films";

export const RemotionRoot = () => (
  <>
    <Composition id="main" component={MainVideo} durationInFrames={900} fps={30} width={1920} height={1080} />
    <Composition id="ecosystem-film" component={EcosystemFilm} durationInFrames={3080} fps={30} width={1920} height={1080} />
    <Composition id="teaser-v2" component={TeaserV2} durationInFrames={924} fps={30} width={1920} height={1080} />
    <Composition id="ecosystem-v2" component={EcosystemV2} durationInFrames={3080} fps={30} width={1920} height={1080} />
  </>
);
