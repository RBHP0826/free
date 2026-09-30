"""저작권 걱정 없는 잔잔한 피아노+패드 배경음 합성 (Am-F-C-G, 70bpm)."""
import numpy as np, soundfile as sf, sys
SR = 44100
dur = float(sys.argv[2]) if len(sys.argv) > 2 else 45.0
out = sys.argv[1] if len(sys.argv) > 1 else "bgm.wav"
n = int(SR * dur)
L = np.zeros(n); R = np.zeros(n)
def hz(m): return 440 * 2 ** ((m - 69) / 12)
def piano(m, t0, length, vel=0.25, pan=0.0):
    s = int(t0 * SR); ln = int(length * SR)
    if s >= n: return
    ln = min(ln, n - s); t = np.arange(ln) / SR; f = hz(m)
    w = sum(a * np.sin(2 * np.pi * f * k * t) for k, a in [(1, 1), (2, .45), (3, .2), (4, .1)])
    env = np.exp(-t * 2.2) * np.minimum(1, t / .005)
    x = w * env * vel
    L[s:s+ln] += x * (1 - pan) ; R[s:s+ln] += x * (1 + pan)
def pad(ms, t0, length, vel=0.05):
    s = int(t0 * SR); ln = min(int(length * SR), n - s)
    if ln <= 0: return
    t = np.arange(ln) / SR
    env = np.minimum(1, t / 1.2) * np.minimum(1, (length - t) / 1.2)
    for m in ms:
        f = hz(m)
        L[s:s+ln] += vel * env * np.sin(2*np.pi*f*t + .3*np.sin(2*np.pi*.2*t))
        R[s:s+ln] += vel * env * np.sin(2*np.pi*f*1.003*t)
beat = 60 / 70; bar = beat * 4
prog = [(57, [57,60,64]), (53, [53,57,60]), (48, [52,55,60]), (55, [55,59,62])]  # Am F C G
arp = [0, 1, 2, 1, 2, 1]
t = 0.0; i = 0
while t < dur:
    root, ch = prog[i % 4]
    pad([root - 12] + ch, t, bar + .8)
    piano(root - 12, t, 3.5, .18)
    for j, k in enumerate(arp + [2, 1]):
        piano(ch[k] + 12, t + j * beat / 2, 2.5, .10, pan=(-.3 if j % 2 else .3))
    if i % 2 == 1:
        piano(ch[2] + 24, t + 2 * beat, 3, .07)
    t += bar; i += 1
# 간단한 리버브(딜레이 합)
for d, g in [(.083, .3), (.131, .25), (.197, .2), (.271, .15)]:
    k = int(d * SR); L[k:] += g * R[:-k]; R[k:] += g * L[:-k]
st = np.stack([L, R], 1)
fade = int(2 * SR); st[:fade] *= np.linspace(0, 1, fade)[:, None]; st[-fade*2:] *= np.linspace(1, 0, fade*2)[:, None]
st /= np.abs(st).max() / .8
sf.write(out, st.astype(np.float32), SR)
print(out, dur)
