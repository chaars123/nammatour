import React, { useState, useEffect, useRef } from 'react';

// Use environment variable or fallback to local for development
const FLASK_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/chat';

const CustomModelChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState('general');
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        text: "Hi there! I'm Bangalore AI, your tourism guide. How can I help you explore Bangalore today?",
        sender: 'bot',
        category: 'general',
        id: Date.now()
      }
    ]);
    
    // Set initial suggestions
    updateSuggestedQuestions('general');
  }, []);

  const updateSuggestedQuestions = (category) => {
    // Function implementation remains the same
    let questions = [];
    
    // Questions based on category
    if (category === 'place') {
      questions = [
        "What's the best time to visit Lalbagh?",
        "Tell me about Cubbon Park",
        "Is Wonder La worth visiting?",
        "How far is Nandi Hills from city center?",
        "What are the opening hours for ISKCON Temple?"
      ];
    } else if (category === 'hotel') {
      questions = [
        "Which 5-star hotels are in central Bangalore?",
        "Is Taj MG Road a good place to stay?",
        "What's the price range for Oberoi Bangalore?",
        "Are there good budget hotels near the airport?",
        "Do you recommend Leela Palace or ITC Windsor?"
      ];
    } else if (category === 'restaurant') {
      questions = [
        "Best South Indian restaurants in Bangalore?",
        "Where can I find authentic North Karnataka food?",
        "Is Toit Brewpub good for craft beer?",
        "Recommend vegetarian restaurants in Indiranagar",
        "What's special at Meghana Foods?"
      ];
    } else {
      // General questions
      questions = [
        "What are the must-visit places in Bangalore?",
        "Recommend hotels near MG Road",
        "Best restaurants for local cuisine?",
        "How's the weather in Bangalore now?",
        "What's the best way to get around the city?"
      ];
    }
    
    // Randomly select 3 questions
    const randomQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 3);
    setSuggestedQuestions(randomQuestions);
  };

  const getOfflineResponse = (query) => {
    // Function implementation remains the same
    query = query.toLowerCase();
    
    // Places responses
    if (query.includes('place') || query.includes('visit') || 
        query.includes('see') || query.includes('attraction') ||
        query.includes('lalbagh') || query.includes('cubbon') ||
        query.includes('palace') || query.includes('wonder') ||
        query.includes('nandi') || query.includes('iskcon')) {
      return { 
        text: "Here are some top places to visit in Bangalore: 1) Lalbagh Botanical Garden - A beautiful garden with a glass house inspired by London's Crystal Palace, 2) Cubbon Park - A landmark lung area of the city with abundant greenery, 3) Bangalore Palace - Inspired by England's Windsor Castle, 4) Wonder La - Amusement park with thrilling rides, 5) Nandi Hills - Perfect for watching sunrise, 6) ISKCON Temple - Beautiful temple complex with stunning architecture.", 
        category: 'place' 
      };
    }
    
    // Hotel responses
    if (query.includes('hotel') || query.includes('stay') || 
        query.includes('accommodation') || query.includes('room') ||
        query.includes('taj') || query.includes('oberoi') ||
        query.includes('leela') || query.includes('itc')) {
      return { 
        text: "Here are some recommended hotels in Bangalore: 1) The Leela Palace - Luxury 5-star hotel with beautiful architecture, 2) Taj West End - Historic hotel with colonial charm, 3) ITC Windsor - Business hotel with excellent restaurants, 4) Oberoi Bangalore - Premium hotel in the city center, 5) Radisson Blu - Modern hotel with good amenities, 6) Vivanta by Taj MG Road - Convenient location for tourists.", 
        category: 'hotel' 
      };
    }
    
    // Restaurant responses
    if (query.includes('restaurant') || query.includes('food') || 
        query.includes('eat') || query.includes('cuisine') ||
        query.includes('breakfast') || query.includes('lunch') ||
        query.includes('dinner') || query.includes('cafe') ||
        query.includes('toit') || query.includes('meghana')) {
      return { 
        text: "Here are some great restaurants in Bangalore: 1) MTR - Iconic restaurant famous for South Indian breakfast, 2) Nagarjuna - Known for Andhra cuisine and spicy food, 3) Toit Brewpub - Craft beer and great ambiance, 4) Meghana Foods - Famous for Andhra-style biryanis, 5) Karavalli - Award-winning coastal cuisine, 6) Burma Burma - Excellent vegetarian Burmese food.", 
        category: 'restaurant' 
      };
    }
    
    // General fallback response
    return { 
      text: "Welcome to Bangalore! Known as the 'Garden City' and 'Silicon Valley of India', Bangalore offers a perfect blend of tradition and modernity. You can explore beautiful parks like Lalbagh and Cubbon Park, visit historical sites like Bangalore Palace, experience the tech culture, or enjoy the vibrant food scene. What specific aspect of Bangalore would you like to know more about?", 
      category: 'general' 
    };
  };

  const sendMessage = async (messageText) => {
    // Don't send empty messages
    if (!messageText.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      text: messageText,
      sender: 'user',
      category: 'general',
      id: Date.now()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Call Flask API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(FLASK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API response error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Add bot response to chat
      const botResponse = {
        text: data.response,
        sender: 'bot',
        category: 'general', // Update with actual category if available
        id: Date.now()
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
      setIsLoading(false);
      
      // Update suggested questions based on the response
      if (data.category) {
        updateSuggestedQuestions(data.category);
      }
      
    } catch (error) {
      console.error('Error fetching from API:', error);
      
      // Show error message if it's a connection issue
      if (error.name === 'AbortError' || error.message.includes('Failed to fetch')) {
        const errorResponse = {
          text: "Sorry, I couldn't connect to the server. I'll use my offline knowledge instead. Please check if the Flask server is running.",
          sender: 'bot',
          category: 'general',
          id: Date.now()
        };
        
        setMessages(prevMessages => [...prevMessages, errorResponse]);
      }
      
      // Fallback to offline response
      const offlineResponse = getOfflineResponse(messageText);
      const botResponse = {
        text: offlineResponse.text,
        sender: 'bot',
        category: offlineResponse.category,
        id: Date.now()
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
      setIsLoading(false);
      
      // Update suggested questions based on category
      updateSuggestedQuestions(offlineResponse.category);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleSendClick = () => {
    sendMessage(input);
  };

  const handleSuggestionClick = (question) => {
    sendMessage(question);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    updateSuggestedQuestions(newCategory);
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div className="py-3 px-4 border-b" style={{ borderColor: '#e5e5e5' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="font-bold text-lg" style={{ color: '#4CAF50' }}>NAMMA TOUR AI</h1>
            <div className="ml-2 flex items-center">
              <span className="status-indicator online" style={{ backgroundColor: '#4CAF50', width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' }}></span>
              <span className="text-xs text-gray-500 ml-1">Online</span>
            </div>
          </div>
          
          <div className="hidden sm:flex space-x-2">
            {['general', 'place', 'hotel', 'restaurant'].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-2 py-1 rounded text-sm ${category === cat ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <span className="capitalize">{cat === 'general' ? 'All' : cat + 's'}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto bg-white" style={{ backgroundColor: '#fafafa' }}>
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            {message.sender === 'bot' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#4CAF50', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px', flexShrink: 0, fontWeight: 'bold' }}>
                B
              </div>
            )}
            <div 
              style={{
                maxWidth: '75%',
                padding: '10px 14px',
                borderRadius: '18px',
                backgroundColor: message.sender === 'user' ? '#FF8C00' : '#ffffff',
                color: message.sender === 'user' ? 'white' : '#333333',
                border: message.sender === 'user' ? 'none' : '1px solid #e0e0e0',
                boxShadow: message.sender === 'user' ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                borderBottomRightRadius: message.sender === 'user' ? '4px' : '18px',
                borderBottomLeftRadius: message.sender === 'bot' ? '4px' : '18px'
              }}
            >
              <p style={{ margin: 0, fontWeight: 500, lineHeight: 1.5 }}>{message.text}</p>
            </div>
            {message.sender === 'user' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FF8C00', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '8px', flexShrink: 0, fontWeight: 'bold' }}>
                U
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#4CAF50', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px', flexShrink: 0, fontWeight: 'bold' }}>
              B
            </div>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px',
                borderRadius: '18px',
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                borderBottomLeftRadius: '4px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#4CAF50', borderRadius: '50%', margin: '0 2px', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.32s' }}></div>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#4CAF50', borderRadius: '50%', margin: '0 2px', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.16s' }}></div>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#4CAF50', borderRadius: '50%', margin: '0 2px', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Suggested questions */}
      {suggestedQuestions.length > 0 && (
        <div className="px-4 py-2" style={{ borderTop: '1px solid #f0f0f0', backgroundColor: '#f9f9f9' }}>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(question)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#f0f7f0',
                  border: '1px solid #e0e0e0',
                  borderRadius: '16px',
                  fontSize: '13px',
                  color: '#4CAF50',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input area */}
      <div className="p-3 border-t" style={{ borderColor: '#e5e5e5' }}>
        <div className="relative flex items-center">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about Bangalore..."
            style={{
              width: '100%',
              padding: '12px',
              paddingRight: '44px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              resize: 'none',
              outline: 'none',
              fontSize: '14px',
              lineHeight: '1.5',
              backgroundColor: '#f9f9f9'
            }}
            rows="1"
          />
          <button
            onClick={handleSendClick}
            disabled={!input.trim()}
            style={{
              position: 'absolute',
              right: '8px',
              backgroundColor: input.trim() ? '#4CAF50' : '#e0e0e0',
              color: input.trim() ? 'white' : '#a0a0a0',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: input.trim() ? 'pointer' : 'default',
              transition: 'all 0.2s'
            }}
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
            </svg>
          </button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">Powered by NammaTour AI</p>
          <p className="text-xs text-gray-500">20+ Places • 20+ Hotels • 20+ Restaurants</p>
        </div>
      </div>
    </div>
  );
};

export default CustomModelChatbot;