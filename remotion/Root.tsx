import { Composition } from "remotion";
import { Reel } from "./Reel";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./brand";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="DigiimarkReel"
        component={Reel}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
