import React, { useState } from 'react';
import { placesData, hotelsData, restaurantsData } from '../data/tourismData';
import TourismDetailView from '../components/TourismDetailView';

const EnhancedTourism = () => {
  const [activeTab, setActiveTab] = useState('places');
  const [expandedItem, setExpandedItem] = useState(null);
  const [expandedType, setExpandedType] = useState(null);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);

  const handleExpand = (id, type) => {
    if (expandedItem === id && expandedType === type) {
      setExpandedItem(null);
      setExpandedType(null);
    } else {
      setExpandedItem(id);
      setExpandedType(type);
    }
  };

  const openFullScreen = (item, type) => {
    setSelectedItem(item);
    setSelectedItemType(type);
    setIsFullScreenOpen(true);
    // Prevent scrolling when full screen is open
    document.body.style.overflow = 'hidden';
  };

  const closeFullScreen = () => {
    setIsFullScreenOpen(false);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };

  const renderTabs = () => {
    return (
      <div className="flex flex-wrap border-b">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'places'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 hover:text-primary'
          }`}
          onClick={() => setActiveTab('places')}
        >
          Tourist Places
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'hotels'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 hover:text-primary'
          }`}
          onClick={() => setActiveTab('hotels')}
        >
          Hotels
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'restaurants'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 hover:text-primary'
          }`}
          onClick={() => setActiveTab('restaurants')}
        >
          Restaurants
        </button>
      </div>
    );
  };

  const renderPlaces = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        {placesData.map((place) => (
          <div key={place.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <h3 className="absolute bottom-0 left-0 text-white font-bold text-xl p-4">
                {place.name}
              </h3>
            </div>
            <div className="p-4">
              <p className="text-gray-600 mt-2">{place.description.substring(0, 100)}...</p>
              
              {expandedItem === place.id && expandedType === 'place' ? (
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-600">{place.address}</p>
                  </div>
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-600">{place.timings}</p>
                  </div>
                  <div className="flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600">{place.entryFee}</p>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">How to Get There:</h4>
                    <p className="text-gray-600">{place.directions}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <a 
                      href={place.mapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center text-primary hover:text-primary-dark"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Open in OpenStreetMap
                    </a>
                    <button
                      onClick={() => openFullScreen(place, 'place')}
                      className="text-primary hover:text-primary-dark inline-flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                      </svg>
                      Full View
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex items-center justify-between">
                  <button 
                    onClick={() => handleExpand(place.id, 'place')}
                    className="text-primary hover:text-primary-dark inline-flex items-center"
                  >
                    <span>View Details</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => openFullScreen(place, 'place')}
                    className="text-primary hover:text-primary-dark inline-flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    </svg>
                    Full View
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderHotels = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        {hotelsData.map((hotel) => (
          <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <h3 className="absolute bottom-0 left-0 text-white font-bold text-xl p-4">
                {hotel.name}
              </h3>
            </div>
            <div className="p-4">
              <div className="flex items-center mb-2">
                <span className="bg-primary-50 text-primary px-2 py-1 rounded text-xs font-medium">
                  {hotel.priceRange}
                </span>
              </div>
              <p className="text-gray-600 mt-2">{hotel.description.substring(0, 100)}...</p>
              
              {expandedItem === hotel.id && expandedType === 'hotel' ? (
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-600">{hotel.address}</p>
                  </div>
                  <div className="flex items-start mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <p className="text-gray-600">{hotel.amenities}</p>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">How to Get There:</h4>
                    <p className="text-gray-600">{hotel.directions}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <a 
                      href={hotel.mapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center text-primary hover:text-primary-dark"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Open in OpenStreetMap
                    </a>
                    <button
                      onClick={() => openFullScreen(hotel, 'hotel')}
                      className="text-primary hover:text-primary-dark inline-flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                      </svg>
                      Full View
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex items-center justify-between">
                  <button 
                    onClick={() => handleExpand(hotel.id, 'hotel')}
                    className="text-primary hover:text-primary-dark inline-flex items-center"
                  >
                    <span>View Details</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => openFullScreen(hotel, 'hotel')}
                    className="text-primary hover:text-primary-dark inline-flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    </svg>
                    Full View
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderRestaurants = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
        {restaurantsData.map((restaurant) => (
          <div key={restaurant.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <h3 className="absolute bottom-0 left-0 text-white font-bold text-xl p-4">
                {restaurant.name}
              </h3>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary-50 text-primary px-2 py-1 rounded text-xs font-medium">
                  {restaurant.cuisine}
                </span>
                <span className="bg-primary-50 text-primary px-2 py-1 rounded text-xs font-medium">
                  {restaurant.priceRange}
                </span>
              </div>
              <p className="text-gray-600 mt-2">{restaurant.description.substring(0, 100)}...</p>
              
              {expandedItem === restaurant.id && expandedType === 'restaurant' ? (
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-600">{restaurant.address}</p>
                  </div>
                  <div className="flex items-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-600">{restaurant.timings}</p>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">How to Get There:</h4>
                    <p className="text-gray-600">{restaurant.directions}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <a 
                      href={restaurant.mapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center text-primary hover:text-primary-dark"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Open in OpenStreetMap
                    </a>
                    <button
                      onClick={() => openFullScreen(restaurant, 'restaurant')}
                      className="text-primary hover:text-primary-dark inline-flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                      </svg>
                      Full View
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex items-center justify-between">
                  <button 
                    onClick={() => handleExpand(restaurant.id, 'restaurant')}
                    className="text-primary hover:text-primary-dark inline-flex items-center"
                  >
                    <span>View Details</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => openFullScreen(restaurant, 'restaurant')}
                    className="text-primary hover:text-primary-dark inline-flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    </svg>
                    Full View
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h2 className="text-2xl font-bold mb-4">Tourism in Manipal</h2>
      {renderTabs()}
      
      {activeTab === 'places' && renderPlaces()}
      {activeTab === 'hotels' && renderHotels()}
      {activeTab === 'restaurants' && renderRestaurants()}

      {isFullScreenOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <TourismDetailView 
              item={selectedItem} 
              type={selectedItemType} 
              onClose={closeFullScreen} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTourism;
