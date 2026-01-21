import { useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { createTextGenerator } from '../utils/textGenerator';

export function ChatInput() {
  const {
    addMessage,
    appendChunk,
    finalizeStream,
    isGenerating,
    setGenerating,
  } = useChatStore();
  const stopRef = useRef<(() => void) | null>(null);

  const handleClick = () => {
    if (isGenerating) {
      stopRef.current?.();
      stopRef.current = null;
      finalizeStream();
      setGenerating(false);
    } else {
      addMessage('user', 'Generate a long response');
      addMessage('assistant', '');
      setGenerating(true);
      stopRef.current = createTextGenerator(
        appendChunk,
        () => {
          finalizeStream();
          setGenerating(false);
        },
        10000,
        15,
      );
    }
  };

  return (
    <div className="p-4 border-t border-gray-700">
      <div className="max-w-3xl mx-auto flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleClick}
          className={`px-4 py-2 text-white rounded-lg ${
            isGenerating
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isGenerating ? 'Stop' : 'Generate'}
        </button>
      </div>
    </div>
  );
}
