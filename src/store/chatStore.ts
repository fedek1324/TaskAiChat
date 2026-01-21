import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatState {
  messages: Message[];
  streamingContent: string;
  isGenerating: boolean;
  addMessage: (role: Message['role'], content: string) => void;
  appendChunk: (chunk: string) => void;
  finalizeStream: () => void;
  setGenerating: (value: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  streamingContent: '',
  isGenerating: false,

  addMessage: (role, content) =>
    set((state) => ({
      messages: [...state.messages, { id: crypto.randomUUID(), role, content }],
    })),

  appendChunk: (chunk) =>
    set((state) => ({ streamingContent: state.streamingContent + chunk })),

  finalizeStream: () =>
    set((state) => {
      if (!state.streamingContent) return state;
      const messages = [...state.messages];
      const last = messages[messages.length - 1];
      if (last) {
        messages[messages.length - 1] = {
          ...last,
          content: last.content + state.streamingContent,
        };
      }
      return { messages, streamingContent: '' };
    }),

  setGenerating: (value) => set({ isGenerating: value }),
  clearMessages: () => set({ messages: [], streamingContent: '' }),
}));
