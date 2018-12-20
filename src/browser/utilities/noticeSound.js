let context;
let gainNode;

function setup() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  context = new AudioContext();

  gainNode = context.createGain();
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
}

setup();

export default function playNoticeSound(gain: number = 0.25) {
  if (!context) return;

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
