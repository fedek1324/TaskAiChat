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
  const wasGeneratingRef = useRef(false);

  // запоминаем состояние при старте генерации
  useEffect(() => {
    if (isGenerating && !wasGeneratingRef.current) {
      wasGeneratingRef.current = true;
    }
    if (!isGenerating && wasGeneratingRef.current) {
      wasGeneratingRef.current = false;
    }
  }, [isGenerating]);

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

  // обновляем autoScroll только когда не генерируем
  const handleAtBottomChange = (bottom: boolean) => {
    if (!isGenerating) {
      setAutoScroll(bottom);
    }
  };

  const lastIndex = messages.length - 1;

  return (
    <Virtuoso
      ref={virtuosoRef}
      className="flex-1"
      data={messages}
      atBottomStateChange={handleAtBottomChange}
      itemContent={(index, message) => (
        <MessageItem
          message={message}
          streamingContent={index === lastIndex ? streamingContent : undefined}
        />
      )}
    />
  );
}
