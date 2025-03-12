import React, { useState, useEffect, useRef } from 'react';
import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const ChatAI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [openai, setOpenai] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentAudioMessage, setCurrentAudioMessage] = useState(null);
  const audioRef = useRef(null);

  const messagesEndRef = useRef(null);
  
  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize OpenAI client
  useEffect(() => {
    if (OPENAI_API_KEY) {
      setOpenai(new OpenAI({
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true // For client-side use (not recommended for production)
      }));
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Convert text to speech using OpenAI
  const textToSpeech = async (text) => {
    if (!openai) return;
    
    try {
      // First, stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        // Clear the audio source to prevent conflicts
        audioRef.current.src = "";
        audioRef.current.load();
      }
      
      // Reset states
      setIsAudioPlaying(false);
      setCurrentAudioMessage(null);
      
      const response = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: text,
      });
      
      // Create a new blob URL for each speech response
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Add a small delay to ensure previous audio is fully cleared
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.load();
          
          const playPromise = audioRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsAudioPlaying(true);
                setCurrentAudioMessage(text);
              })
              .catch(error => {
                console.error("Audio play error:", error);
                URL.revokeObjectURL(url);
              });
          }
        }
      }, 100);
      
      // Return cleanup function
      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (err) {
      console.error('Error generating speech:', err);
      setError('Failed to convert text to speech. Please try again.');
      setIsAudioPlaying(false);
      setCurrentAudioMessage(null);
      return null;
    }
  };

  // Send message to OpenAI
  const sendMessage = async () => {
    if (!input.trim() || !openai) return;
    
    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);
    setError(null);
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful travel assistant specializing in Karnataka tourism. Provide helpful, concise information about tourist destinations, guides, and travel tips." },
          ...updatedMessages
        ],
        max_tokens: 500,
      });
      
      const assistantMessage = { 
        role: 'assistant', 
        content: response.choices[0].message.content 
      };
      
      setMessages([...updatedMessages, assistantMessage]);
      
      // Automatically convert new response to speech
      textToSpeech(assistantMessage.content);
      
    } catch (err) {
      console.error('Error sending message to OpenAI:', err);
      setError('Failed to get a response. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Travel Assistant AI</h1>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
        {/* Chat messages */}
        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <p>Ask me anything about travel in Karnataka!</p>
              <p className="text-sm mt-2">Suggestions: Best places to visit, local cuisine, historical sites...</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div 
                  className={`inline-block p-3 rounded-lg max-w-xs sm:max-w-md ${
                    message.role === 'user' 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.content}
                  {message.role === 'assistant' && (
                    <div className="mt-3 flex items-center">
                      {isAudioPlaying && currentAudioMessage === message.content ? (
                        <div className="flex items-center text-primary">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                          <span className="mr-3 text-sm font-medium">Speaking...</span>
                          <button 
                            onClick={() => {
                              if (audioRef.current) {
                                audioRef.current.pause();
                                setIsAudioPlaying(false);
                                setCurrentAudioMessage(null);
                              }
                            }}
                            className="text-white bg-red-500 hover:bg-red-600 flex items-center px-3 py-1.5 rounded shadow"
                            aria-label="Stop audio"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium">Stop</span>
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => textToSpeech(message.content)}
                          className="text-white bg-primary hover:bg-primary-dark flex items-center px-3 py-1.5 rounded shadow"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">Play Voice</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          
          {isTyping && (
            <div className="text-left mb-4">
              <div className="inline-block p-3 rounded-lg bg-gray-200 text-gray-800">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 text-sm">
            {error}
          </div>
        )}
        
        {/* Input area */}
        <div className="p-4 border-t">
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isTyping}
            />
            <button
              onClick={sendMessage}
              disabled={isTyping || !input.trim()}
              className="bg-primary text-white px-4 py-2 rounded-r hover:bg-primary-dark disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
        
        {/* Audio player (hidden but functional) */}
        <audio 
          ref={audioRef} 
          className="hidden" 
          onEnded={() => {
            setIsAudioPlaying(false);
            setCurrentAudioMessage(null);
          }}
        />
      </div>
      
      <div className="mt-4 text-center text-gray-500 text-sm">
        <p>Powered by OpenAI GPT-3.5 and Text-to-Speech technology</p>
      </div>
      
      {/* Add some CSS for the typing indicator */}
      <style jsx="true">{`
        .typing-indicator {
          display: flex;
          align-items: center;
        }
        
        .typing-indicator span {
          height: 8px;
          width: 8px;
          margin: 0 2px;
          background-color: #606060;
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1.2s infinite ease-in-out;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatAI;
