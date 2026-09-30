import { Composition, Still } from "remotion";
import { Card, CardProps } from "./Card";
import corgi from "../cards/corgi.json";
import { Shorts, ShortsProps } from "./Shorts";
import script from "../lilly/script.json";
import timing from "../lilly/timing.json";

const FPS = 30;

const lilly: ShortsProps = {
  ...script,
  folder: "lilly",
  scenes: script.scenes.map((s, i) => ({ ...s, ...timing.scenes[i] })),
};

export const Root = () => (
  <>
  <Still id="CorgiCover" component={Card} width={1080} height={1080} defaultProps={corgi as CardProps} />
  <Composition
    id="Lilly"
    component={Shorts}
    durationInFrames={Math.ceil(timing.total * FPS)}
    fps={FPS}
    width={1080}
    height={1920}
    defaultProps={lilly}
  />
  </>
);
