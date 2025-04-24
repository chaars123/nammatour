import React, { useState } from 'react';
import { placesData } from '../data/tourismData';

const About = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!userInput.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: userInput }]);
    setIsLoading(true);

    const place = userInput.trim();
    const placeData = placesData.find(item => item.name.toLowerCase() === place.toLowerCase());
    const prompt = placeData
      ? `Based on the provided data ${JSON.stringify(placeData)}, compose a single professional sentence: "Considering recent visitation metrics and prevailing conditions, I estimate today's crowd level at ${place} to be {Low, Moderate, Busy, or High}." Only return this sentence.`
      : `When detailed data is unavailable, consider time-of-day patterns and compose a professional sentence: "Considering general visitor behaviors and current timing, I forecast today's crowd level at ${place} to be {Low, Moderate, Busy, or High}." Only return this sentence.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a knowledgeable crowd prediction assistant. Provide accurate, data-driven forecasts (Low, Moderate, Busy, High) based on the provided details.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 100,
          temperature: 0.8,
          top_p: 1.0,
          frequency_penalty: 0.2,
          presence_penalty: 0.2
        })
      });
      const data = await response.json();
      const aiMessage = data.choices?.[0]?.message?.content.trim() || 'Unable to fetch prediction.';
      setMessages(prev => [...prev, { role: 'ai', content: aiMessage }]);
    } catch (error) {
      console.error('Error fetching AI prediction:', error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, unable to provide a prediction at this time.' }]);
    }
    setIsLoading(false);
    setUserInput('');
  };

  return (
    <div className="bg-white min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Crowd Prediction</h1>
      <div className="bg-white rounded-md shadow-md p-4 max-w-xl mx-auto">
        <div className="space-y-4 mb-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
              <p className={`inline-block p-2 rounded ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                {msg.content}
              </p>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            placeholder="Enter Bangalore tourist place"
            className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none"
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-r-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
