export default function openFile(accept: string): Promise<?File> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.addEventListener('input', () => {
      const [file] = input.files;
      resolve(file);
    });

    const event = new MouseEvent('click');
    input.dispatchEvent(event);
  });
}
