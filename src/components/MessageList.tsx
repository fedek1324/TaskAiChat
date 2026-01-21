import { useRef, useState } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { useChatStore } from '../store/chatStore';
import { MessageItem } from './MessageItem';

export function MessageList() {
  const messages = useChatStore((s) => s.messages);
  const streamingContent = useChatStore((s) => s.streamingContent);
  const isGenerating = useChatStore((s) => s.isGenerating);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [atBottom, setAtBottom] = useState(true);

  const lastIndex = messages.length - 1;

  return (
    <Virtuoso
      ref={virtuosoRef}
      className="flex-1"
      data={messages}
      atBottomStateChange={setAtBottom}
      followOutput={atBottom && isGenerating ? 'smooth' : false}
      itemContent={(index, message) => (
        <MessageItem
          message={message}
          streamingContent={index === lastIndex ? streamingContent : undefined}
        />
      )}
    />
  );
}
