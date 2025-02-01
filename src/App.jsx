

import { useEffect, useState } from "react";
import "./App.css";
import ChatMessage from "./components/ChatMessage";
import useLocalStorage from "./hooks/useLocalStorage";
import { generateResponse } from "./utils/api";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const [prompt, setPrompt] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useLocalStorage('chatbotResponse', [
    {
      prompt: "Hello, how can I help you today?",
      response: "I am a chatbot, ask me anything.",
    },
  ]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const botResponse = await generateResponse(prompt);
      setResponse(prev => [...prev, { prompt, response: botResponse }]);
    } catch (error) {
      setResponse(prev => [...prev, { 
        prompt, 
        response: "⚠️ Failed to fetch response. Please try again." 
      }]);
    }
    setPrompt("");
    setLoading(false);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    const container = document.querySelector('.chatbot_response_container');
    if (container) container.scrollTop = container.scrollHeight;
  }, [response]);

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="header">
        <h1 className="heading">AI Chat Bot</h1>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="theme-toggle"
        >
          {isDarkMode ? "🌙" : "☀️"}
        </button>
      </header>

      <div className="chatbot_container">
        <div className="chatbot_response_container">
          {response.map((res, index) => (
            <ChatMessage 
              key={index} 
              prompt={res.prompt} 
              response={res.response} 
              isDarkMode={isDarkMode}
            />
          ))}
          {loading && <LoadingSpinner />}
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
  );
}

export default App;