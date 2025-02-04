import { useEffect, useState } from "react";
import "./App.css";
import ChatMessage from "./components/ChatMessage";
import useLocalStorage from "./hooks/useLocalStorage";
import { generateResponse } from "./utils/api";

function App() {
  const [prompt, setPrompt] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [chatHistory, setChatHistory] = useLocalStorage('chatbotHistory', []); // All chat sessions
  const [currentChat, setCurrentChat] = useState([
    {
      id: Date.now(),
      content: "I am a chatbot, ask me anything.",
      isUser: false,
    },
  ]); // Current chat session with default message
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    const userMessageId = Date.now();
    const botMessageId = userMessageId + 1;
    // Add user message to current chat
    const updatedChat = [
      ...currentChat,
      { id: userMessageId, content: prompt, isUser: true },
      { id: botMessageId, content: "", isUser: false, loading: true }
    ];
    setCurrentChat(updatedChat);
    setLoadingId(botMessageId);

    try {
      const botResponse = await generateResponse(prompt);
      const finalChat = updatedChat.map(item =>
        item.id === botMessageId ? { ...item, content: botResponse, loading: false } : item
      );
      setCurrentChat(finalChat);
      setChatHistory(prev => [...prev, ...finalChat]); // Save to history
    } catch (error) {
      const finalChat = updatedChat.map(item =>
        item.id === botMessageId ? { ...item, content: "⚠️ Failed to fetch response", loading: false } : item
      );
      setCurrentChat(finalChat);
      setChatHistory(prev => [...prev, ...finalChat]); // Save to history
    }

    setLoadingId(null);
    setPrompt("");
  };

  const startNewChat = () => {
    setCurrentChat([
      {
        id: Date.now(),
        content: "I am a chatbot, ask me anything.",
        isUser: false,
      },
    ]); // Reset to default message
    setIsSidebarOpen(false); // Close sidebar after starting a new chat
  };

  // Auto-scroll to bottom
  useEffect(() => {
    const container = document.querySelector('.chatbot_response_container');
    if (container) container.scrollTop = container.scrollHeight;
  }, [currentChat]);

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Sidebar Toggle Button */}
      <div
        className="sidebar-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
      >
        {isSidebarOpen ? "✕" : "☰"}
      </div>
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button
          onClick={startNewChat}
          className="new-chat-button"
          title="Start a New Chat" // Tooltip for clarity
        >
          💬 {/* Message Bubble Icon */}
        </button>
      </div>
      {/* Main Chat Interface */}
      <div className="main-content">
        <header className="header">
          <h1 className="heading">AI Chat Bot</h1>
          {/* Theme Toggle Button */}
          <div
            className="theme-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? "🌙" : "☀️"}
          </div>
        </header>
        <div className="chatbot_container">
          <div className="chatbot_response_container">
            {currentChat.map((message) => (
              <ChatMessage
                key={message.id}
                content={message.content || ""}
                isUser={message.isUser}
                isLoading={message.id === loadingId}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
          <div className="chatbot_input">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Enter your question..."
            />
            <button onClick={handleSubmit}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
