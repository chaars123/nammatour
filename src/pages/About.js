import React, { useEffect, useState } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';

const About = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWord, setCurrentWord] = useState(-1);
  const [highlightedText, setHighlightedText] = useState(null);
  const { speak, cancel, speaking, voices } = useSpeechSynthesis();

  const thankYouMessage = "We would like to express our sincere gratitude to all the faculty members and mentors at CMR University who guided us throughout this project. Your expertise, patience, and encouragement were invaluable in helping us bring this vision to life. Special thanks to our project guide and teachers for their continuous support and valuable feedback.";
  
  const words = thankYouMessage.split(' ');

  // Animation for the college name
  useEffect(() => {
    const letters = document.querySelectorAll('.animate-letter');
    
    letters.forEach((letter, index) => {
      setTimeout(() => {
        letter.classList.add('animate-in');
      }, 100 * index);
    });
  }, []);

  // Create highlighted text when currentWord changes
  useEffect(() => {
    if (currentWord >= 0) {
      const newHighlightedText = words.map((word, index) => {
        if (index === currentWord) {
          return <span key={index} className="text-primary font-bold">{word} </span>;
        }
        return <span key={index}>{word} </span>;
      });
      setHighlightedText(newHighlightedText);
    } else {
      setHighlightedText(null);
    }
  }, [currentWord, words]);

  // Find a female voice with error handling
  const getFemaleVoice = () => {
    try {
      // Check if voices are available
      if (!voices || voices.length === 0) {
        console.log("No voices available, using default voice");
        return null;
      }
      
      // Find a female voice by name patterns
      const femaleVoice = voices.find(voice => 
        voice.name.includes('female') || 
        voice.name.includes('Zira') || 
        voice.name.includes('Microsoft Heera') ||
        voice.name.toLowerCase().includes('woman') ||
        voice.name.includes('Samantha') ||
        voice.name.includes('Victoria') ||
        voice.name.includes('Karen') ||
        voice.name.includes('Veena')
      );
      
      // If no specific female voice found, try to use one with higher pitch
      if (!femaleVoice && voices.length > 1) {
        // Just select a non-default voice as fallback
        console.log("No specific female voice found, using alternative");
        return voices.find(v => !v.default) || voices[1] || null;
      }
      
      return femaleVoice || null;
    } catch (error) {
      console.error("Error selecting voice:", error);
      return null; // Fallback to default voice
    }
  };

  // Speak the entire message at once
  const handleSpeak = () => {
    try {
      if (speaking) {
        cancel();
        setIsPlaying(false);
        setCurrentWord(-1);
        return;
      }

      setIsPlaying(true);
      
      // Use a female voice if available
      const femaleVoice = getFemaleVoice();
      
      // Set up speech options with better parameters for female voice
      const speechOptions = {
        text: thankYouMessage,
        rate: 0.9, // Slightly slower for better clarity
        pitch: 1.1, // Higher pitch for more feminine sound
        onEnd: () => {
          setIsPlaying(false);
          setCurrentWord(-1);
        }
      };
      
      // Only add voice if we found a suitable one
      if (femaleVoice) {
        speechOptions.voice = femaleVoice;
      }
      
      speak(speechOptions);
    } catch (error) {
      console.error("Error with speech synthesis:", error);
      setIsPlaying(false);
      setCurrentWord(-1);
      // Show an alert to the user
      alert("Sorry, there was an error with the voice feature. Please try again.");
    }
  };

  const renderMessage = () => {
    if (isPlaying && highlightedText) {
      return highlightedText;
    }
    return thankYouMessage;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-primary mb-12">About NammaTour</h1>
            
          {/* College Name with Animation */}
          <div className="text-center mb-8">
            <div className="mb-2 text-gray-600 text-lg">A project by students of</div>
            <div className="text-4xl font-bold text-primary mb-6 overflow-hidden">
              {Array.from("CMR UNIVERSITY").map((letter, index) => (
                <span 
                  key={index} 
                  className={`animate-letter inline-block transition-all duration-300 ease-in-out transform opacity-0 translate-y-8 ${letter === ' ' ? 'mx-2' : ''}`}
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>

          {/* Project Description */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Project Overview</h3>
            <p className="text-gray-700 mb-6">
              NammaTour is a comprehensive tourism platform designed specifically for Bangalore. This college project aims to connect tourists with local guides, 
              showcase the city's attractions, and provide an immersive experience for visitors planning their Bangalore trip.
            </p>
            
            <h3 className="text-2xl font-semibold mb-4 text-primary">Technologies Used</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-xl font-medium mb-2">Frontend</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>React.js</li>
                  <li>Tailwind CSS</li>
                  <li>React Router</li>
                  <li>React Speech Kit</li>
                  <li>JavaScript ES6+</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-xl font-medium mb-2">Backend</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Supabase (Authentication, Database)</li>
                  <li>PostgreSQL</li>
                  <li>RESTful APIs</li>
                  <li>Serverless Functions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-2xl font-semibold mb-6 text-primary">Meet Our Team</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center bg-gray-50 p-6 rounded-md transition-all hover:shadow-md">
                <h4 className="text-xl font-bold mb-1">CHARULATHA M</h4>
                <p className="text-gray-600 mb-1">21BBTIT015</p>
                <p className="text-primary">B.Tech, IT</p>
              </div>
              <div className="flex flex-col items-center bg-gray-50 p-6 rounded-md transition-all hover:shadow-md">
                <h4 className="text-xl font-bold mb-1">MONISHA J</h4>
                <p className="text-gray-600 mb-1">21BBTIT027</p>
                <p className="text-primary">B.Tech, IT</p>
              </div>
              <div className="flex flex-col items-center bg-gray-50 p-6 rounded-md transition-all hover:shadow-md">
                <h4 className="text-xl font-bold mb-1">ANKITHA K J</h4>
                <p className="text-gray-600 mb-1">21BBTCC002</p>
                <p className="text-primary">B.Tech, CCE</p>
              </div>
              <div className="flex flex-col items-center bg-gray-50 p-6 rounded-md transition-all hover:shadow-md">
                <h4 className="text-xl font-bold mb-1">P RICKSHI FEMINA</h4>
                <p className="text-gray-600 mb-1">21BBTCC013</p>
                <p className="text-primary">B.Tech, CCE</p>
              </div>
            </div>
          </div>

          {/* Thank You Note with Voice Reading */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-center">Acknowledgements</h3>
              <button 
                className="flex items-center bg-white text-primary px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={handleSpeak}
              >
                {isPlaying ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                    </svg>
                    Stop Voice
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Play Female Voice
                  </>
                )}
              </button>
            </div>
            
            <div className="bg-white/10 p-4 rounded-md mb-4 min-h-[100px]">
              <p className="text-white leading-relaxed">
                {renderMessage()}
              </p>
            </div>
            
            <p className="text-center font-medium text-lg mt-4">
              From the NammaTour Team
            </p>
          </div>
        </div>
      </div>
      
      {/* Add CSS for animation */}
      <style jsx="true">{`
        .animate-letter {
          opacity: 0;
          transform: translateY(20px);
        }
        .animate-letter.animate-in {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.5s ease;
        }
      `}</style>
    </div>
  );
};

export default About;
