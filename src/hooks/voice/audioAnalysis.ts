const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

export interface SpeechAnalyzerController {
  resume: () => Promise<void>;
  stop: () => void;
}

export const createSpeechAnalyzer = (
  audio: HTMLAudioElement,
  onLevel: (level: number) => void,
): SpeechAnalyzerController => {
  const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextCtor) {
    return {
      resume: async () => undefined,
      stop: () => onLevel(0),
    };
  }

  try {
    const context = new AudioContextCtor();
    const source = context.createMediaElementSource(audio);
    const analyser = context.createAnalyser();

    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.12;

    source.connect(analyser);
    analyser.connect(context.destination);

    const timeData = new Uint8Array(analyser.fftSize);
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);

    let animationFrame = 0;
    let smoothed = 0;
    let hold = 0;
    let previousBandEnergy = 0;

    const sample = () => {
      analyser.getByteTimeDomainData(timeData);
      analyser.getByteFrequencyData(frequencyData);

      let rmsTotal = 0;
      for (let i = 0; i < timeData.length; i++) {
        const centered = (timeData[i] - 128) / 128;
        rmsTotal += centered * centered;
      }
      const rms = Math.sqrt(rmsTotal / timeData.length);

      let lowMidEnergy = 0;
      let lowMidCount = 0;
      for (let i = 2; i < 42; i++) {
        lowMidEnergy += frequencyData[i];
        lowMidCount++;
      }

      let presenceEnergy = 0;
      let presenceCount = 0;
      for (let i = 18; i < 96; i++) {
        presenceEnergy += frequencyData[i];
        presenceCount++;
      }

      const rmsNorm = clamp((rms - 0.012) / 0.18);
      const bandNorm = clamp((lowMidEnergy / Math.max(lowMidCount, 1) / 255 - 0.035) / 0.42);
      const presenceNorm = clamp((presenceEnergy / Math.max(presenceCount, 1) / 255 - 0.02) / 0.35);
      const attackBoost = clamp((bandNorm - previousBandEnergy) * 2.4, 0, 0.3);
      previousBandEnergy = bandNorm;

      const rawLevel = clamp(
        rmsNorm * 0.7 +
          bandNorm * 0.48 +
          presenceNorm * 0.22 +
          attackBoost,
      );

      hold = Math.max(rawLevel, hold * 0.86);
      const target = Math.max(rawLevel, hold * 0.72);
      smoothed = target > smoothed
        ? lerp(smoothed, target, 0.46)
        : lerp(smoothed, target, 0.2);

      const mouthLevel = clamp(Math.pow(smoothed, 0.72) * 1.18);
      onLevel(mouthLevel < 0.02 ? 0 : mouthLevel);

      animationFrame = requestAnimationFrame(sample);
    };

    animationFrame = requestAnimationFrame(sample);

    return {
      resume: async () => {
        if (context.state === 'suspended') {
          await context.resume().catch(() => undefined);
        }
      },
      stop: () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
        source.disconnect();
        analyser.disconnect();
        context.close().catch(() => undefined);
        onLevel(0);
      },
    };
  } catch (error) {
    console.warn('[Voice] Speech analyzer unavailable, continuing without audio envelope sync.', error);
    return {
      resume: async () => undefined,
      stop: () => onLevel(0),
    };
  }
};
