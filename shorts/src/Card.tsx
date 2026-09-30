import "@fontsource/noto-sans-kr/900.css";
import "@fontsource/noto-sans-kr/500.css";
import { AbsoluteFill, Img, staticFile } from "remotion";

type Part = string | { hl: string };
export type CardProps = { image: string; handle: string; lines: Part[][]; sub: string; tag?: string };

const FONT = "'Noto Sans KR', sans-serif";
const YELLOW = "#FFD83D";
const stroke = (px: number) =>
  Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return `${(Math.cos(a) * px).toFixed(1)}px ${(Math.sin(a) * px).toFixed(1)}px 0 rgba(0,0,0,.85)`;
  }).join(",");

export const Card: React.FC<CardProps> = ({ image, handle, lines, sub, tag }) => (
  <AbsoluteFill style={{ background: "#000", fontFamily: FONT }}>
    <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,.78) 66%, rgba(0,0,0,.985) 76%, #000 100%)" }} />
    {tag ? (
      <div style={{ position: "absolute", top: 40, right: 40, padding: "8px 20px", borderRadius: 30,
        background: "rgba(0,0,0,.55)", color: "#fff", fontWeight: 500, fontSize: 26 }}>{tag}</div>
    ) : null}
    <div style={{ position: "absolute", left: 80, top: 782, color: YELLOW, fontWeight: 900, fontSize: 30, lineHeight: "40px", textShadow: stroke(2) }}>{handle}</div>
    <div style={{ position: "absolute", left: 80, right: 60, top: 820, color: "#fff", fontWeight: 900, fontSize: 56, lineHeight: "60px", letterSpacing: -1, textShadow: stroke(3) }}>
      {lines.map((l, i) => (
        <div key={i}>{l.map((p, j) => (typeof p === "string" ? p : <span key={j} style={{ color: YELLOW }}>{p.hl}</span>))}</div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 80, right: 80, top: 954, height: 3, background: "rgba(255,255,255,.9)" }} />
    <div style={{ position: "absolute", left: 80, right: 60, top: 984, color: "#e8e8e8", fontWeight: 500, fontSize: 30, lineHeight: "40px", letterSpacing: -0.5, textShadow: stroke(2) }}>{sub}</div>
  </AbsoluteFill>
);
