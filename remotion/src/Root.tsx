import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { EcosystemFilm } from "./EcosystemFilm";

export const RemotionRoot = () => (
  <>
    <Composition
      id="main"
      component={MainVideo}
      durationInFrames={900}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="ecosystem-film"
      component={EcosystemFilm}
      durationInFrames={3080}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
