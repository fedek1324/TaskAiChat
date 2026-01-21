import { memo, useMemo } from 'react';

interface MarkdownProps {
  content: string;
}

// простой markdown: **bold** и ```code blocks```
export const Markdown = memo(function Markdown({ content }: MarkdownProps) {
  const elements = useMemo(() => parse(content), [content]);
  return <>{elements}</>;
});

function parse(text: string): React.ReactNode[] {
  // флаг s — точка матчит переносы строк
  const parts = text.split(/(```.*?```)/gs);

  return parts.map((part, i) => {
    if (part.startsWith('```')) {
      // убираем ``` с обеих сторон и язык
      const code = part.slice(3, -3).replace(/^\w*\n?/, '');
      return (
        <pre key={i} className="bg-gray-800 p-3 rounded my-2 overflow-x-auto text-sm">
          <code>{code}</code>
        </pre>
      );
    }
    return <span key={i}>{parseBold(part)}</span>;
  });
}

function parseBold(text: string): React.ReactNode[] {
  return text.split(/(\*\*.+?\*\*)/g).map((part, i) => {
    if (part.startsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
