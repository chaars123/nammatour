import React, { useState } from 'react';

const SosButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const emergencyContacts = [
    { name: 'Police', number: '100', icon: '👮‍♂️' },
    { name: 'Ambulance', number: '108', icon: '🚑' },
    { name: 'Tourist Helpline', number: '1363', icon: '🆘' },
    { name: 'Women Helpline', number: '1091', icon: '👩' },
    { name: 'Fire', number: '101', icon: '🔥' }
  ];

  return (
    <div className="sos-container">
      {isOpen && (
        <div className="fixed bottom-24 right-6 bg-white rounded-lg shadow-xl p-4 z-50 w-64">
          <h3 className="text-lg font-bold mb-3 text-red-600">Emergency Contacts</h3>
          <ul className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-xl mr-2">{contact.icon}</span>
                  <span>{contact.name}</span>
                </div>
                <a 
                  href={`tel:${contact.number}`}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  {contact.number}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="sos-button flex items-center justify-center"
        aria-label="Emergency SOS"
      >
        <span className="text-xl">SOS</span>
      </button>
    </div>
  );
};

export default SosButton;
