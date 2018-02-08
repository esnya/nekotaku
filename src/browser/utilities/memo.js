export function parseText(text) {
  if (typeof text !== 'string') return {};

  const m = text.match(/^(.*?)\r?\n--\r?\n((.|\r|\n)*?)(\r?\n--\r?\n((.|\r|\n)*?))?$/);
  if (!m) {
    return {
      title: null,
      front: text,
      back: null,
    };
  }

  return {
    title: m[1] || null,
    front: m[2] || null,
    back: m[5] || null,
  };
}

export function toText({ title, front, back }) {
  return [
    title || '',
    front || '',
    back || null,
  ].filter(a => a !== null).join('\n--\n');
}

export const InitialText = `<タイトル>
--
<表面の本文>
--
<裏面の本文>
※裏面を開くとチャットにメッセージが表示されます。
`;
