import memory from '@/browser/utilities/memory';
import window from 'global/window';

const getContext: () => AudioContext | null = memory(() => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  return new AudioContext();
});

const getGainNode: () => GainNode | null = memory(() => {
  const context = getContext();
  if (!context) return null;

  const gainNode = context.createGain();
  gainNode.connect(context.destination);
  return gainNode;
});

function avoidTouch(): void {
  window.removeEventListener('touchstart', avoidTouch);
  const context = getContext();
  if (!context) return;

  const buffer = context.createBuffer(1, 1, 22050);
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(0);
}
window.addEventListener('touchstart', avoidTouch);

export default function playNoticeSound(gain: number = 0.25): void {
  const gainNode = getGainNode();
  if (!gainNode) return;

  gainNode.gain.value = gain;

  const context = getContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.value = 523.251;
  oscillator.connect(gainNode);
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
  }, 100);
}
