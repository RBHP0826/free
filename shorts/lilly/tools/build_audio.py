"""장면별 나레이션 wav를 이어 붙이고 배경음과 믹스, 장면 타이밍 JSON 출력."""
import json, sys, numpy as np, soundfile as sf
from scipy.signal import resample_poly
SR = 44100; LEAD = 0.4; GAP = 0.55; TAIL = 1.8
wavs = sys.argv[1:-3]; bgm_path, out_wav, out_json = sys.argv[-3:]
segs = []
for w in wavs:
    a, sr = sf.read(w, dtype="float32")
    if a.ndim > 1: a = a.mean(1)
    if sr != SR: a = resample_poly(a, SR, sr).astype(np.float32)
    segs.append(a / (np.abs(a).max() + 1e-9) * .9)
timings = []; t = LEAD
for a in segs:
    d = len(a) / SR; timings.append({"start": round(t - (LEAD if not timings else GAP / 2), 3), "voiceStart": round(t, 3), "voiceDur": round(d, 3)}); t += d + GAP
total = t - GAP + TAIL
for i in range(len(timings) - 1): timings[i]["end"] = round(timings[i + 1]["start"], 3)
timings[-1]["end"] = round(total, 3)
voice = np.zeros(int(total * SR), np.float32)
for a, tm in zip(segs, timings):
    s = int(tm["voiceStart"] * SR); voice[s:s + len(a)] += a
bgm, bsr = sf.read(bgm_path, dtype="float32")
bgm = bgm[:len(voice)]
if len(bgm) < len(voice): bgm = np.pad(bgm, ((0, len(voice) - len(bgm)), (0, 0)))
# 나레이션 구간 덕킹
env = np.convolve((np.abs(voice) > .02).astype(float), np.ones(int(.3 * SR)) / int(.3 * SR), "same")
gain = np.clip(0.30 - 0.18 * np.clip(env * 4, 0, 1), 0.12, 0.30)
mix = np.stack([voice, voice], 1) + bgm * gain[:, None]
mix /= max(1, np.abs(mix).max() / .95)
sf.write(out_wav, mix, SR)
json.dump({"total": round(total, 3), "scenes": timings}, open(out_json, "w"), indent=1)
print(total)
