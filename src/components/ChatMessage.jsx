import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatMessage = ({ prompt, response, isDarkMode }) => {
  // Split response into code blocks and regular text
  const codeBlocks = response.split(/(```[\s\S]*?```)/g);

  return (
    <div className={`message ${isDarkMode ? 'dark' : 'light'}`}>
      {prompt && (
        <div className="user-message">
          <p>{prompt}</p>
        </div>
      )}
      <div className="bot-message">
        {codeBlocks.map((block, index) => {
          if (block.startsWith('```')) {
            // Extract language and code
            const languageMatch = block.match(/```(\w+)/);
            const language = languageMatch ? languageMatch[1] : 'javascript';
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
                  margin: '10px 0',
                  fontSize: '14px',
                }}
              >
                {code.trim()}
              </SyntaxHighlighter>
            );
          }
          return <p key={index}>{block}</p>;
        })}
      </div>
    </div>
  );
};

export default ChatMessage;