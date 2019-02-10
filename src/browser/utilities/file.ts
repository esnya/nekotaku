export default function openFile(accept: string): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.addEventListener('input', () => {
      const { files } = input;
      if (!files) return resolve(null);
      return resolve(files[0] || null);
    });

    const event = new MouseEvent('click');
    input.dispatchEvent(event);
  });
}
