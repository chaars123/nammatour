import React, { useState } from 'react';

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm your Bangalore trip planner. How can I help you plan your perfect trip?", 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sampleResponses = {
    'places to visit': "Here are some popular places to visit in Bangalore:\n1. Lalbagh Botanical Garden\n2. Cubbon Park\n3. Bangalore Palace\n4. ISKCON Temple\n5. Bannerghatta National Park\n6. Wonderla Amusement Park\n7. Vidhana Soudha\n8. Commercial Street for shopping\n9. UB City for luxury shopping\n10. Nandi Hills (outskirts)",
    'hotels': "Here are some recommended hotels in Bangalore:\n1. The Leela Palace (5-star)\n2. Taj MG Road (5-star)\n3. ITC Gardenia (5-star)\n4. Radisson Blu Atria (4-star)\n5. Vivanta Bangalore (4-star)\n6. Ibis Bengaluru City Centre (3-star)\n7. Treebo Trip Hotel Woodsvilla Suites (3-star)\n8. FabHotel Pentagon Suites Koramangala (Budget)\n9. OYO Townhouse (Budget)\n10. Zostel Bangalore (Hostel)",
    'restaurants': "Here are some must-try restaurants in Bangalore:\n1. Karavalli - South Indian seafood\n2. Jamavar - North Indian cuisine\n3. Toit - Craft brewery & pizzas\n4. CTR (Central Tiffin Room) - Famous for dosas\n5. Meghana Foods - Biryani\n6. Burma Burma - Burmese cuisine\n7. Truffles - Burgers\n8. Vidyarthi Bhavan - Traditional breakfast\n9. The Permit Room - Modern South Indian\n10. Fenny's Lounge - Continental cuisine",
    'weather': "Bangalore has a pleasant climate throughout the year. The best time to visit is from October to February when temperatures range from 15°C to 27°C. Summers (March to May) can get warm with temperatures around 20°C to 36°C. The monsoon season (June to September) brings moderate rainfall.",
    'transport': "You can get around Bangalore using:\n1. Namma Metro - Clean and efficient for major routes\n2. BMTC buses - Extensive network covering the whole city\n3. Auto rickshaws - Available everywhere but negotiate fare\n4. Ola/Uber - Convenient and widely available\n5. Rapido bike taxis - Good for quick rides\n6. Rental bikes/cars - Yulu, Royal Brothers, Zoomcar etc.",
    'budget': "For a 3-day trip to Bangalore, budget approximately:\n- Budget traveler: ₹5,000-8,000 (hostel, public transport, street food)\n- Mid-range: ₹10,000-15,000 (3-star hotel, auto/cab, casual dining)\n- Luxury: ₹25,000+ (5-star hotel, private cab, fine dining)"
  };

  const sendMessage = () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user'
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      let botResponse = "I'm sorry, but I don't have specific information about that. As a trip planner for Bangalore, I can help with places to visit, hotel recommendations, restaurants, weather, transportation, or budget planning. What would you like to know about?";
      
      // Check for keywords in user input
      const lowerInput = input.toLowerCase();
      for (const [key, response] of Object.entries(sampleResponses)) {
        if (lowerInput.includes(key)) {
          botResponse = response;
          break;
        }
      }
      
      // Add bot message
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot'
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md max-w-lg mx-auto overflow-hidden">
      <div className="bg-primary text-white p-4">
        <h3 className="font-bold text-lg">NammaTour AI Trip Planner</h3>
        <p className="text-sm opacity-80">Ask me anything about planning your Bangalore trip!</p>
      </div>
      
      <div className="h-96 overflow-y-auto p-4 space-y-4" style={{ scrollBehavior: 'smooth' }}>
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-xs p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-line">{message.text}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none max-w-xs">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t p-3 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about places, hotels, restaurants, etc."
          className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          className="bg-primary text-white px-4 py-2 rounded-r-lg disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AIChatbot;
