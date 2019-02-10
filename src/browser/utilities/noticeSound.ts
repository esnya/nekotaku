import mem from 'mem';

const getContext: () => AudioContext = mem(() => new AudioContext());

const getGainNode: () => GainNode = mem(() => {
  const context = getContext();
  const gainNode = context.createGain();
  gainNode.connect(context.destination);
  return gainNode;
});

function setup() {
  const context = getContext();
  const gainNode = getGainNode();

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
  const gainNode = getGainNode();
  gainNode.gain.value = gain;

  const oscillator = getContext().createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.value = 523.251;
  oscillator.connect(gainNode);
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
  }, 100);
}
