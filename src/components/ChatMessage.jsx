import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { SyncLoader } from 'react-spinners';

const ChatMessage = ({ content, isUser, isLoading, isDarkMode }) => {
  const renderContent = (text) => {
    const codeBlocks = text.split(/(```[\s\S]*?```)/g);
    
    return codeBlocks.map((block, index) => {
      if (block.startsWith('```')) {
        const languageMatch = block.match(/```(\w+)/);
        const language = languageMatch?.[1] || 'javascript';
        const code = block.replace(/```[\s\S]*?\n/, '').replace(/```$/, '');
        
        return (
          <SyntaxHighlighter
            key={index}
            language={language}
            style={isDarkMode ? vscDarkPlus : vs}
            showLineNumbers
            customStyle={{
              background: isDarkMode ? '#1e1e1e' : '#f5f5f5',
              borderRadius: '8px',
              padding: '16px',
              margin: '10px 0'
            }}
          >
            {code.trim()}
          </SyntaxHighlighter>
        );
      }
      return <p key={index}>{block}</p>;
    });
  };

  return (
    <div className={`message ${isUser ? 'user' : 'bot'} ${isDarkMode ? 'dark' : 'light'}`}>
      {isUser ? (
        <div className="message-content">
          <p>{content}</p>
        </div>
      ) : (
        <div className="message-content">
          {isLoading ? (
            <SyncLoader 
              color={isDarkMode ? "#ffffff" : "#333333"} 
              size={8}
              speedMultiplier={0.8}
            />
          ) : (
            renderContent(content)
          )}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
