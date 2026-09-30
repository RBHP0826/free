# zoofact 쇼츠·카드뉴스 템플릿 (Remotion)

## 쇼츠 (1080×1920)
1. `<이야기>/script.json`에 제목·장면 이미지·자막·나레이션 문장 작성, 이미지는 `public/<이야기>/`에 둠
2. 나레이션: `python3 lilly/tools/tts.py "문장" n_1.wav 0.95` (임시 오프라인 음성, sherpa-onnx KSS 모델)
3. 배경음: `python3 lilly/tools/make_bgm.py bgm.wav 50` (직접 합성, 저작권 없음)
4. 믹스+타이밍: `python3 lilly/tools/build_audio.py n_*.wav bgm.wav public/lilly/audio.wav lilly/timing.json`
5. 렌더: `npx remotion render src/index.ts Lilly out/lilly_zoofact.mp4 --codec=h264 --color-space=bt709`

## 카드뉴스 표지 (1080×1080)
`cards/<이름>.json` 작성 후 `npx remotion still src/index.ts CorgiCover out/corgi_1.png`
(`{"hl": "단어"}`로 노란색 강조)

클라우드 환경에서는 `REMOTION_BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell` 지정.
