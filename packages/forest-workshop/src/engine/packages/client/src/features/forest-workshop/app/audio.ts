/** Original procedural pentatonic music and soft UI chimes; no remote or third-party recordings. */
export interface AudioPreference {
  music: boolean;
  effects: boolean;
  volume: number;
}
const KEY = "forest-workshop:audio";
let sessionPreference: AudioPreference | null = null;
export function readAudioPreference(): AudioPreference {
  if (sessionPreference) return { ...sessionPreference };
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? "null");
    return {
      music: value?.music !== false,
      effects: value?.effects !== false,
      volume:
        typeof value?.volume === "number" && Number.isFinite(value.volume)
          ? Math.max(0, Math.min(0.6, value.volume))
          : 0.18,
    };
  } catch {
    return { music: true, effects: true, volume: 0.18 };
  }
}
export function writeAudioPreference(value: AudioPreference) {
  sessionPreference = {
    ...value,
    volume: Number.isFinite(value.volume) ? Math.max(0, Math.min(0.6, value.volume)) : 0.18,
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(sessionPreference));
  } catch {
    /* Session changes still apply. */
  }
}
export function createGameAudio() {
  let context: AudioContext | null = null;
  let timer: ReturnType<typeof setInterval> | undefined;
  let bar = 0,
    stopped = false;
  const voices = new Set<OscillatorNode>();
  const note = (frequency: number, start: number, duration: number, volume: number) => {
    if (!context || voices.size >= 32) return;
    const oscillator = context.createOscillator(),
      gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    voices.add(oscillator);
    oscillator.onended = () => {
      voices.delete(oscillator);
      oscillator.disconnect();
      gain.disconnect();
    };
    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
  };
  const quiet = () => {
    clearInterval(timer);
    timer = undefined;
    for (const voice of voices) {
      try {
        voice.stop();
      } catch {
        /* Already ended. */
      }
    }
    voices.clear();
  };
  const phrase = () => {
    if (!context || document.hidden) return;
    const preference = readAudioPreference();
    if (!preference.music) {
      quiet();
      return;
    }
    const start = context.currentTime + 0.03;
    const chords = [
      [130.81, 164.81, 196],
      [110, 130.81, 164.81],
      [87.31, 130.81, 174.61],
      [98, 146.83, 196],
    ];
    for (const frequency of chords[bar % 4]!) note(frequency, start, 5.5, preference.volume * 0.1);
    const melody = [
      [523.25, 659.25, 783.99, 659.25],
      [440, 523.25, 659.25, 587.33],
      [523.25, 587.33, 698.46, 659.25],
      [587.33, 783.99, 659.25, 523.25],
    ][bar % 4]!;
    melody.forEach((frequency, index) => note(frequency, start + index * 1.5, 1.6, preference.volume * 0.2));
    bar++;
  };
  const start = async () => {
    if (stopped || document.hidden || typeof AudioContext === "undefined") return;
    const preference = readAudioPreference();
    if (!preference.music && !preference.effects) {
      quiet();
      return;
    }
    try {
      context ??= new AudioContext();
      if (context.state === "suspended") await context.resume();
      if (stopped || document.hidden) return;
      if (!preference.music) {
        if (timer) quiet();
        return;
      }
      if (!timer) {
        phrase();
        timer = setInterval(phrase, 6000);
      }
    } catch {
      /* Browser gesture policy: retry on the next user interaction. */
    }
  };
  return {
    start,
    async click() {
      await start();
      const preference = readAudioPreference();
      if (context?.state === "running" && preference.effects && !document.hidden && !stopped)
        note(659.25, context.currentTime, 0.16, preference.volume * 0.25);
    },
    sync() {
      quiet();
      void start();
    },
    pause() {
      quiet();
      void context?.suspend().catch(() => {});
    },
    dispose() {
      stopped = true;
      quiet();
      void context?.close().catch(() => {});
      context = null;
    },
  };
}
