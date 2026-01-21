const WORDS =
  'the be to of and a in that have I it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what function const let var return if else while class import export default async await try catch throw new'.split(
    ' ',
  );

const SNIPPETS = [
  '\n```typescript\nfunction hello() {\n  console.log("Hello");\n}\n```\n',
  '\n```javascript\nconst sum = (a, b) => a + b;\n```\n',
  '\n**Important:** This is a key concept.\n',
];

const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const chance = (p: number) => Math.random() > 1 - p;

export function createTextGenerator(
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  targetWords = 10000,
  intervalMs = 15,
) {
  let count = 0;
  let timer: number | null = null;

  const tick = () => {
    if (count >= targetWords) return onComplete();

    // иногда сниппет
    if (count > 0 && count % 100 === 0 && chance(0.3)) {
      onChunk(pick(SNIPPETS));
    }

    // 3-8 слов за тик
    const words = Array.from(
      { length: 3 + Math.floor(Math.random() * 6) },
      () => (count++ < targetWords ? pick(WORDS) : ''),
    )
      .filter(Boolean)
      .join(' ');

    let chunk = words;
    if (chance(0.15)) chunk += '.';
    if (chance(0.05)) chunk += '\n\n';

    onChunk(chunk + ' ');
    timer = window.setTimeout(tick, intervalMs);
  };

  timer = window.setTimeout(tick, intervalMs);
  return () => timer && clearTimeout(timer);
}
