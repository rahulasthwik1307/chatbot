const ChatMessage = ({ prompt, response, isDarkMode }) => {
    return (
      <div className={`message ${isDarkMode ? 'dark' : 'light'}`}>
        {prompt && (
          <div className="user-message">
            <p>{prompt}</p>
          </div>
        )}
        <div className="bot-message">
          <p>{response}</p>
        </div>
      </div>
    );
  };
  
  export default ChatMessage;