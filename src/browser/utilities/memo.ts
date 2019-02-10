import { Memo } from '@/types/data/Memo';

export function parseText(text: string): Memo {
  const m = text.match(/^(.*?)\r?\n--\r?\n((.|\r|\n)*?)(\r?\n--\r?\n((.|\r|\n)*?))?$/);
  if (!m) {
    return {
      title: undefined,
      front: text,
      back: undefined,
    };
  }

  return {
    title: m[1] || undefined,
    front: m[2] || undefined,
    back: m[5] || undefined,
  };
}

export function toText({ title, front, back }: Memo) {
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
