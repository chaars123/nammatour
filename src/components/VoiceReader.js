import React, { useState } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';

const VoiceReader = ({ text }) => {
  const [isReading, setIsReading] = useState(false);
  const { speak, cancel, speaking } = useSpeechSynthesis();

  const handleSpeak = () => {
    if (speaking) {
      cancel();
      setIsReading(false);
    } else {
      speak({ text });
      setIsReading(true);
    }
  };

  // Reset reading state when speech ends
  React.useEffect(() => {
    if (!speaking && isReading) {
      setIsReading(false);
    }
  }, [speaking, isReading]);

  return (
    <button
      onClick={handleSpeak}
      className="inline-flex items-center text-primary hover:text-primary-dark px-3 py-1 rounded-md bg-primary-50 hover:bg-primary-100 transition-colors"
    >
      {isReading ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" />
          </svg>
          Stop Reading
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" clipRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" />
          </svg>
          Read Aloud
        </>
      )}
    </button>
  );
};

export default VoiceReader;
