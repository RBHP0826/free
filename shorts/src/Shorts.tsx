import "@fontsource/noto-sans-kr/900.css";
import "@fontsource/noto-sans-kr/700.css";
import {
  AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";

export type Scene = { image: string; sub: string[]; start: number; end: number };
export type ShortsProps = {
  folder: string; handle: string; quote: string; title: string; disclaimer: string; scenes: Scene[];
};

const FONT = "'Noto Sans KR', sans-serif";
const ORANGE = "#FF9A2E";
const YELLOW = "#FFD83D";
const IMG_TOP = 420;
const IMG_H = 1040;
const FADE = 9; // 장면 전환 크로스페이드 (프레임)

const stroke = (px: number) =>
  Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return `${(Math.cos(a) * px).toFixed(1)}px ${(Math.sin(a) * px).toFixed(1)}px 0 #000`;
  }).join(",");

const SceneView: React.FC<{ scene: Scene; folder: string; len: number; index: number }> = ({ scene, folder, len, index }) => {
  const f = useCurrentFrame();
  const opacity = index === 0 ? 1 : interpolate(f, [0, FADE], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(f, [0, len], [1.0, 1.08]);
  const dir = index % 2 === 0 ? 1 : -1;
  const x = interpolate(f, [0, len], [0, 18 * dir]);
  const subIn = interpolate(f, [FADE, FADE + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{ position: "absolute", top: IMG_TOP, left: 0, width: 1080, height: IMG_H, overflow: "hidden", background: "#000" }}>
        <Img
          src={staticFile(`${folder}/${scene.image}`)}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale}) translateX(${x}px)` }}
        />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 260,
          background: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.55))" }} />
        <div style={{ position: "absolute", left: 30, right: 30, bottom: 60, textAlign: "center", fontFamily: FONT,
          fontWeight: 700, fontSize: 46, lineHeight: 1.35, color: "#fff", textShadow: stroke(3), opacity: subIn,
          transform: `translateY(${(1 - subIn) * 12}px)`, letterSpacing: 0 }}>
          {scene.sub.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Shorts: React.FC<ShortsProps> = (p) => {
  const { fps } = useVideoConfig();
  const f = useCurrentFrame();
  const titleIn = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile(`${p.folder}/audio.wav`)} />
      {p.scenes.map((s, i) => {
        const from = Math.round(s.start * fps);
        const len = Math.round(s.end * fps) - from + (i < p.scenes.length - 1 ? FADE : 0);
        return (
          <Sequence key={i} from={from} durationInFrames={len}>
            <SceneView scene={s} folder={p.folder} len={len} index={i} />
          </Sequence>
        );
      })}
      <div style={{ position: "absolute", top: 150, left: 20, right: 20, textAlign: "center", fontFamily: FONT,
        fontWeight: 900, fontSize: 54, lineHeight: 1.5, letterSpacing: -1, opacity: titleIn }}>
        <div style={{ color: ORANGE }}>{p.quote}</div>
        <div style={{ color: YELLOW }}>{p.title}</div>
      </div>
      <div style={{ position: "absolute", top: IMG_TOP + IMG_H + 40, left: 0, right: 0, textAlign: "center", fontFamily: FONT }}>
        <div style={{ color: YELLOW, fontWeight: 900, fontSize: 40 }}>{p.handle}</div>
        <div style={{ color: "#9a9a9a", fontWeight: 700, fontSize: 26, marginTop: 10 }}>{p.disclaimer}</div>
      </div>
    </AbsoluteFill>
  );
};
