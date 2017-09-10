const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

const gain = audioContext.createGain();
gain.connect(audioContext.destination);

export default function playNoticeSound() {
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.value = 523.251;
  oscillator.connect(gain);
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
  }, 100);
}
