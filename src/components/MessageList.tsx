import { useRef, useCallback } from 'react';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { useChatStore } from '../store/chatStore';
import { MessageItem } from './MessageItem';

export function MessageList() {
  const messages = useChatStore((s) => s.messages);
  const streamingContent = useChatStore((s) => s.streamingContent);
  const isGenerating = useChatStore((s) => s.isGenerating);
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const autoScrollRef = useRef(true);
  const frozenStreamingContentRef = useRef<string>('');

  const handleAtBottomStateChange = useCallback((atBottom: boolean) => {
    autoScrollRef.current = atBottom;
    // Когда уходим от низа - замораживаем текущий streamingContent
    if (!atBottom) {
      frozenStreamingContentRef.current = streamingContent;
    }
  }, [streamingContent]);

  const followOutput = useCallback(() => {
    if (isGenerating && autoScrollRef.current) {
      return 'auto';
    }
    return false;
  }, [isGenerating]);

  const lastIndex = messages.length - 1;

  return (
    <div className="flex-1 overflow-hidden">
      <Virtuoso
        ref={virtuosoRef}
        style={{ height: '100%' }}
        data={messages}
        followOutput={followOutput}
        alignToBottom
        atBottomStateChange={handleAtBottomStateChange}
        atBottomThreshold={50}
        itemContent={(index, message) => {
          if (index !== lastIndex) {
            return <MessageItem message={message} />;
          }

          // Для последнего элемента показываем либо актуальный текст (внизу),
          // либо замороженный (не внизу)
          const displayContent = autoScrollRef.current
            ? streamingContent
            : frozenStreamingContentRef.current;

          return (
            <MessageItem
              message={message}
              streamingContent={displayContent}
            />
          );
        }}
      />
    </div>
  );
}
