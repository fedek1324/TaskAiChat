import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <header className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-semibold">AI Chat</h1>
      </header>
      <MessageList />
      <ChatInput />
    </div>
  );
}

export default App;
