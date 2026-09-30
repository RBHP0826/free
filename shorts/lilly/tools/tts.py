import sherpa_onnx, soundfile as sf, sys
import os; d=os.environ.get('KO_TTS_DIR','vits-mimic3-ko_KO-kss_low')
cfg=sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=f"{d}/ko_KO-kss_low.onnx",tokens=f"{d}/tokens.txt",data_dir=f"{d}/espeak-ng-data"),num_threads=4))
tts=sherpa_onnx.OfflineTts(cfg)
a=tts.generate(sys.argv[1],sid=0,speed=float(sys.argv[3]) if len(sys.argv)>3 else 1.0)
sf.write(sys.argv[2],a.samples,a.sample_rate); print(a.sample_rate,len(a.samples)/a.sample_rate)
