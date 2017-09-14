const AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();

const gainNode = context.createGain();
gainNode.connect(context.destination);

function avoidTouch() {
  window.removeEventListener('touchstart', avoidTouch);

  const buffer = context.createBuffer(1, 1, 22050);
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(0);
}
window.addEventListener('touchstart', avoidTouch);

export default function playNoticeSound(gain: number = 0.25) {
  gainNode.gain.value = gain;

  const oscillator = context.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.value = 523.251;
  oscillator.connect(gainNode);
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
  }, 100);
}
