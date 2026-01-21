import { useRef, useState, useEffect } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { useChatStore } from '../store/chatStore';
import { MessageItem } from './MessageItem';

export function MessageList() {
  const messages = useChatStore((s) => s.messages);
  const streamingContent = useChatStore((s) => s.streamingContent);
  const isGenerating = useChatStore((s) => s.isGenerating);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // скролл при стриминге
  useEffect(() => {
    if (isGenerating && autoScroll) {
      virtuosoRef.current?.scrollToIndex({
        index: messages.length - 1,
        align: 'end',
        behavior: 'auto',
      });
    }
  }, [streamingContent, isGenerating, autoScroll, messages.length]);

  const lastIndex = messages.length - 1;

  return (
    <div
      className="flex-1 overflow-hidden"
      onWheel={(e) => {
        // скролл вверх — отключаем автоскролл
        if (e.deltaY < 0) {
          setAutoScroll(false);
        }
      }}
    >
      <Virtuoso
        ref={virtuosoRef}
        style={{ height: '100%' }}
        data={messages}
        atBottomStateChange={(atBottom) => {
          // вернулся вниз — включаем
          if (atBottom) {
            setAutoScroll(true);
          }
        }}
        itemContent={(index, message) => (
          <MessageItem
            message={message}
            streamingContent={index === lastIndex ? streamingContent : undefined}
          />
        )}
      />
    </div>
  );
}
