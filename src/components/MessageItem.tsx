import { memo } from 'react';
import type { Message } from '../store/chatStore';
import { Markdown } from '../utils/markdown';

interface Props {
  message: Message;
  streamingContent?: string;
}

export const MessageItem = memo(function MessageItem({
  message,
  streamingContent = '',
}: Props) {
  const isUser = message.role === 'user';
  const content = message.content + streamingContent;

  return (
    <div className={`px-4 py-3 ${isUser ? 'bg-gray-800' : 'bg-gray-900'}`}>
      <div className="max-w-3xl mx-auto">
        <span className="text-xs text-gray-500 mb-1 block">
          {isUser ? 'You' : 'AI'}
        </span>
        <div className="text-gray-100 whitespace-pre-wrap break-words">
          {isUser ? content : <Markdown content={content} />}
        </div>
      </div>
    </div>
  );
});
