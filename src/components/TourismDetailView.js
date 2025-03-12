import React from 'react';
import VoiceReader from './VoiceReader';

const TourismDetailView = ({ item, type, onClose }) => {
  // Construct the detailed description text to be read by the voice reader
  const getReadingText = () => {
    let baseText = `${item.name}. ${item.description}. `;
    
    if (type === 'place') {
      baseText += `Located at ${item.address}. Open during ${item.timings}. Entry fee: ${item.entryFee}. `;
      baseText += `Directions: ${item.directions}.`;
    } else if (type === 'hotel') {
      baseText += `Located at ${item.address}. Price range: ${item.priceRange}. `;
      baseText += `Amenities include ${item.amenities}. Directions: ${item.directions}.`;
    } else if (type === 'restaurant') {
      baseText += `Located at ${item.address}. ${item.cuisine} cuisine. Price range: ${item.priceRange}. `;
      baseText += `Open during ${item.timings}. Directions: ${item.directions}.`;
    }
    
    return baseText;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{item.name}</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            {type === 'restaurant' && (
              <span className="inline-block bg-primary-50 text-primary px-3 py-1 rounded-full text-sm font-medium mr-2">
                {item.cuisine}
              </span>
            )}
            <span className="inline-block bg-primary-50 text-primary px-3 py-1 rounded-full text-sm font-medium">
              {type === 'place' ? item.entryFee : item.priceRange}
            </span>
          </div>
          <VoiceReader text={getReadingText()} />
        </div>

        <h3 className="text-xl font-semibold mb-2">Description</h3>
        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
          {item.description}
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Location</h3>
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600 mr-2 mt-1 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-gray-700">{item.address}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">
              {type === 'hotel' ? 'Amenities' : 'Hours'}
            </h3>
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600 mr-2 mt-1 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {type === 'hotel' ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                )}
              </svg>
              <p className="text-gray-700">
                {type === 'hotel' ? item.amenities : item.timings}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">How to Get There</h3>
            <p className="text-gray-700">{item.directions}</p>
          </div>

          <div className="pt-4">
            <a
              href={item.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              View on Map
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourismDetailView;
