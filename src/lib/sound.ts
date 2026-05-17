let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (ctx) return ctx;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType, startOffset: number, peakGain: number): void {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(c.destination);
  const t = c.currentTime + startOffset;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(peakGain, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.start(t);
  osc.stop(t + duration + 0.05);
}

export function playCorrect(): void {
  if (muted) return;
  tone(523.25, 0.18, 'sine', 0, 0.12);     // C5
  tone(783.99, 0.22, 'sine', 0.08, 0.12);  // G5
}

export function playWrong(): void {
  if (muted) return;
  tone(146.83, 0.28, 'triangle', 0, 0.14); // D3
}

export function playClick(): void {
  if (muted) return;
  const c = getCtx();
  if (!c) return;

  const duration = 0.025;
  const bufferSize = Math.max(1, Math.floor(c.sampleRate * duration));
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = c.createBufferSource();
  source.buffer = buffer;

  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1800;
  filter.Q.value = 1;

  const gain = c.createGain();
  const t = c.currentTime;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.18, t + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);

  source.start(t);
  source.stop(t + duration + 0.01);
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
}
