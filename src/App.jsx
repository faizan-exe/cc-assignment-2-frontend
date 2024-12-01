import { useState } from 'react';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;

    const userMessage = {
      type: 'user',
      text: searchQuery,
    };
    setChatHistory((prev) => [...prev, userMessage]);
    setSearchQuery('');
    setLoading(true);

    try {
      const response = await fetch('https://api-gw-prod-4dtc3pwo.uc.gateway.dev/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: searchQuery }),
      });

      const data = await response.json();
      console.log('Response data:', data);

      if (data && data.image_base64) {
        const botMessage = {
          type: 'bot',
          text: '',
          image: data.image_base64,
        };
        setChatHistory((prev) => [...prev, botMessage]);
      } else {
        const botMessage = {
          type: 'bot',
          text: 'Sorry, no image could be generated.',
        };
        setChatHistory((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const botMessage = {
        type: 'bot',
        text: 'An error occurred while processing your request.',
      };
      setChatHistory((prev) => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className='app-title-container '>
        <h1 className="app-title">ChatBot</h1>
      </div>
      <div className="chat-container">
        <div className="chat-box">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${message.type === 'user' ? 'chat-user' : 'chat-bot'}`}
            >
              <div className="chat-bubble">
                {message.text}
                {message.image && (
                  <img
                    src={`data:image/jpeg;base64,${message.image}`}
                    alt="Generated"
                    className="chat-image"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="chat-form">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="chat-input"
          />
          <button
            type="submit"
            className="chat-button"
            disabled={loading}
          >
            {loading ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
