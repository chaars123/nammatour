import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { areaDataMap } from '../data/areaSpecificData';
import { fetchAllAreaData } from '../utils/aiService';
import L from 'leaflet';

// Fix the default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom icons for different types of locations
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const placeIcon = createCustomIcon('#3b82f6'); // blue
const hotelIcon = createCustomIcon('#10b981'); // green
const restaurantIcon = createCustomIcon('#ef4444'); // red

// Function to move the map view to a new location
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

const MapSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ places: [], hotels: [], restaurants: [] });
  const [totalResults, setTotalResults] = useState(0);
  const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]); // Bangalore center
  const [zoomLevel, setZoomLevel] = useState(12);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showNoResults, setShowNoResults] = useState(false);
  const [currentArea, setCurrentArea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef(null);
  const [fromAddress, setFromAddress] = useState('');

  // Sample districts and areas in Bangalore with their coordinates
  const bangaloreAreas = {
    'Indiranagar': [12.9719, 77.6412],
    'Koramangala': [12.9279, 77.6271],
    'MG Road': [12.9747, 77.6138],
    'Jayanagar': [12.9299, 77.5845],
    'Malleshwaram': [13.0035, 77.5712],
    'Whitefield': [12.9698, 77.7500],
    'Electronic City': [12.8452, 77.6602],
    'JP Nagar': [12.9077, 77.5876],
    'HSR Layout': [12.9116, 77.6389],
    'Bannerghatta Road': [12.8933, 77.5977],
    'Marathahalli': [12.9567, 77.6992],
    'Hebbal': [13.0356, 77.5965],
    'Yelahanka': [13.1004, 77.5963],
    'Basavanagudi': [12.9422, 77.5757],
    'Rajajinagar': [12.9910, 77.5523],
  };

  // Get icon based on item type
  const getIconForType = (type) => {
    switch (type) {
      case 'place':
        return placeIcon;
      case 'hotel':
        return hotelIcon;
      case 'restaurant':
        return restaurantIcon;
      default:
        return new L.Icon.Default();
    }
  };

  // Generate random places for areas without specific data
  const generateRandomPlaces = async (center, areaName) => {
    // Use AI service to generate realistic data
    const data = await fetchAllAreaData(areaName, center);
    return data;
  };

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowNoResults(false);
    
    const normalizedQuery = searchQuery.trim().toLowerCase();
    
    if (!normalizedQuery) {
      setIsLoading(false);
      return;
    }
    
    // Check if the search query matches any of the known areas
    const matchedArea = Object.keys(bangaloreAreas).find(
      area => area.toLowerCase().includes(normalizedQuery)
    );
    
    if (matchedArea) {
      const center = bangaloreAreas[matchedArea];
      setMapCenter(center);
      setZoomLevel(15);
      setCurrentArea(matchedArea);

      // Check if we have specific data for this area
      const areaKey = matchedArea.toLowerCase().replace(' ', '');
      if (areaDataMap[areaKey]) {
        const areaData = areaDataMap[areaKey];
        
        // Add location coordinates to each item
        const processedData = {
          places: areaData.places.map((place, index) => ({
            ...place,
            location: getRandomPointNear(center, 0.005, index),
            type: 'place'
          })),
          hotels: areaData.hotels.map((hotel, index) => ({
            ...hotel,
            location: getRandomPointNear(center, 0.005, index + 10),
            type: 'hotel'
          })),
          restaurants: areaData.restaurants.map((restaurant, index) => ({
            ...restaurant,
            location: getRandomPointNear(center, 0.005, index + 20),
            type: 'restaurant'
          }))
        };
        
        setSearchResults(processedData);
        setTotalResults(
          processedData.places.length + 
          processedData.hotels.length + 
          processedData.restaurants.length
        );
      } else {
        // If no specific data, generate random places using AI service
        const randomPlaces = await generateRandomPlaces(center, matchedArea);
        setSearchResults(randomPlaces);
        setTotalResults(
          randomPlaces.places.length + 
          randomPlaces.hotels.length + 
          randomPlaces.restaurants.length
        );
      }
    } else {
      // Try to use Nominatim to search for the location
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(normalizedQuery)}+Bangalore&format=json&limit=1`
        );
        
        if (!response.ok) {
          throw new Error('Nominatim search failed');
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          const location = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          setMapCenter(location);
          setZoomLevel(15);
          setCurrentArea(data[0].display_name.split(',')[0]);
          
          // Generate random places for this location using AI service
          const randomPlaces = await generateRandomPlaces(location, data[0].display_name.split(',')[0]);
          setSearchResults(randomPlaces);
          setTotalResults(
            randomPlaces.places.length + 
            randomPlaces.hotels.length + 
            randomPlaces.restaurants.length
          );
        } else {
          // No matching location found
          // Try to use it as a custom location anyway, with a default center
          setMapCenter([12.9716, 77.5946]); // Bangalore center
          setZoomLevel(14);
          setCurrentArea(normalizedQuery.charAt(0).toUpperCase() + normalizedQuery.slice(1));
          
          // Generate random places for this query using AI service
          const randomPlaces = await generateRandomPlaces([12.9716, 77.5946], normalizedQuery.charAt(0).toUpperCase() + normalizedQuery.slice(1));
          setSearchResults(randomPlaces);
          setTotalResults(
            randomPlaces.places.length + 
            randomPlaces.hotels.length + 
            randomPlaces.restaurants.length
          );
        }
      } catch (error) {
        console.error('Error searching location:', error);
        // Use the search query as a location name anyway
        setMapCenter([12.9716, 77.5946]); // Bangalore center
        setZoomLevel(14);
        setCurrentArea(normalizedQuery.charAt(0).toUpperCase() + normalizedQuery.slice(1));
        
        // Generate random places for this query using AI service
        const randomPlaces = await generateRandomPlaces([12.9716, 77.5946], normalizedQuery.charAt(0).toUpperCase() + normalizedQuery.slice(1));
        setSearchResults(randomPlaces);
        setTotalResults(
          randomPlaces.places.length + 
          randomPlaces.hotels.length + 
          randomPlaces.restaurants.length
        );
      }
    }
    
    setIsLoading(false);
  };

  // Get directions to a place
  const getDirections = () => {
    if (!selectedPlace || !fromAddress) return;
    
    const destination = `${selectedPlace.location[0]},${selectedPlace.location[1]}`;
    const origin = encodeURIComponent(fromAddress);
    
    // Open Google Maps in a new tab with directions
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`, '_blank');
  };

  // Helper function to get a random point near a center point
  const getRandomPointNear = (centerPoint, maxDistance = 0.01, seed = 0) => {
    // Use seed to make the randomness consistent for the same index
    const randomFactor = Math.sin(seed) * 0.5 + 0.5;
    const angle = randomFactor * Math.PI * 2;
    const distance = randomFactor * maxDistance;
    
    const lat = centerPoint[0] + distance * Math.cos(angle);
    const lng = centerPoint[1] + distance * Math.sin(angle);
    
    return [lat, lng];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Map Search</h1>
      
      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex shadow-md rounded-lg overflow-hidden">
          <input
            type="text"
            className="flex-grow py-3 px-4 focus:outline-none"
            placeholder="Search for an area in Bangalore (e.g., Indiranagar, Koramangala, or any place/hotel/restaurant)"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition-colors flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="inline-block mr-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            ) : null}
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
      
      {/* API Key Notice */}
      <div className="mb-4 p-3 bg-yellow-50 rounded shadow-sm border border-yellow-200">
        <h3 className="text-sm font-semibold text-yellow-800">AI-Powered Search Feature</h3>
        <p className="text-xs text-yellow-700 mt-1">
          This feature uses OpenAI's GPT-4 with web browsing capability to provide real-time information about places in Bangalore.
          Try searching for specific places like "CMR University", "Indiranagar", or any restaurant or hotel name.
        </p>
      </div>
      
      {/* Search results summary */}
      {currentArea && totalResults > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded shadow-sm">
          <h2 className="text-lg font-semibold">
            Showing {totalResults} results for "{currentArea}"
          </h2>
          <p className="text-gray-600">
            {searchResults.places.length} Places • {searchResults.hotels.length} Hotels • {searchResults.restaurants.length} Restaurants
          </p>
          {!areaDataMap[currentArea.toLowerCase().replace(' ', '')] && (
            <p className="text-sm text-blue-600 mt-1">
              Showing AI-generated information based on real-time web search data. The results are as accurate and up-to-date as possible.
            </p>
          )}
        </div>
      )}
      
      {/* No results message */}
      {showNoResults && (
        <div className="mb-4 p-3 bg-amber-50 rounded shadow-sm">
          <p className="text-amber-800">
            No specific data available for "{currentArea}". Try searching for Indiranagar, Koramangala, MG Road, Malleshwaram, or Whitefield.
          </p>
        </div>
      )}
      
      {/* Map container */}
      <div className="mb-6" style={{ height: '500px', width: '100%' }}>
        <MapContainer center={mapCenter} zoom={zoomLevel} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeView center={mapCenter} zoom={zoomLevel} />
          
          {/* Render markers for all locations */}
          {[...searchResults.places, ...searchResults.hotels, ...searchResults.restaurants].map((item) => (
            <Marker
              key={item.id}
              position={item.location}
              icon={getIconForType(item.type)}
              eventHandlers={{
                click: () => {
                  setSelectedPlace(item);
                }
              }}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.address}</p>
                  <button
                    onClick={() => setSelectedPlace(item)}
                    className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    More Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* Legend */}
      <div className="mb-6 p-3 bg-gray-50 rounded shadow-sm flex flex-wrap gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 rounded-full bg-blue-500"></div>
          <span>Places</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 rounded-full bg-green-500"></div>
          <span>Hotels</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 rounded-full bg-red-500"></div>
          <span>Restaurants</span>
        </div>
      </div>
      
      {/* Selected place details */}
      {selectedPlace && (
        <div className="bg-white rounded shadow-lg p-4 mb-6">
          <h2 className="text-2xl font-bold mb-2">{selectedPlace.name}</h2>
          <p className="text-gray-700 mb-4">{selectedPlace.description}</p>
          
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Address:</h3>
            <p className="text-gray-600">{selectedPlace.address}</p>
          </div>
          
          {selectedPlace.type === 'place' && (
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Timings:</h3>
              <p className="text-gray-600">{selectedPlace.timings || 'Timings not available'}</p>
              <h3 className="font-semibold mb-1 mt-2">Entry Fee:</h3>
              <p className="text-gray-600">{selectedPlace.entryFee || 'Not available'}</p>
            </div>
          )}
          
          {selectedPlace.type === 'hotel' && (
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Price Range:</h3>
              <p className="text-gray-600">{selectedPlace.priceRange || 'Not available'}</p>
              <h3 className="font-semibold mb-1 mt-2">Amenities:</h3>
              <p className="text-gray-600">
                {selectedPlace.amenities ? selectedPlace.amenities.join(', ') : 'Not available'}
              </p>
            </div>
          )}
          
          {selectedPlace.type === 'restaurant' && (
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Cuisine:</h3>
              <p className="text-gray-600">{selectedPlace.cuisineType || 'Not available'}</p>
              <h3 className="font-semibold mb-1 mt-2">Price Range:</h3>
              <p className="text-gray-600">{selectedPlace.priceRange || 'Not available'}</p>
            </div>
          )}
          
          {/* Get directions form */}
          <div className="mt-4 border-t pt-4">
            <h3 className="font-semibold mb-2">Get Directions:</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={fromAddress}
                onChange={(e) => setFromAddress(e.target.value)}
                placeholder="Enter your starting point"
                className="flex-grow p-2 border rounded"
              />
              <button
                onClick={getDirections}
                disabled={!fromAddress}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Get Directions
              </button>
            </div>
          </div>
          
          <button
            onClick={() => setSelectedPlace(null)}
            className="mt-4 text-gray-600 hover:text-gray-800"
          >
            &larr; Back to results
          </button>
        </div>
      )}
      
      {/* Results cards */}
      {totalResults > 0 && !selectedPlace && (
        <div>
          {/* Places */}
          {searchResults.places.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Places ({searchResults.places.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.places.map((place) => (
                  <div
                    key={place.id}
                    className="bg-white rounded shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition duration-200"
                    onClick={() => setSelectedPlace(place)}
                  >
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{place.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{place.address}</p>
                      <p className="text-gray-700 line-clamp-2">{place.description}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-sm text-blue-600">{place.timings || 'Timings not available'}</span>
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">Place</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Hotels */}
          {searchResults.hotels.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Hotels ({searchResults.hotels.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.hotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="bg-white rounded shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition duration-200"
                    onClick={() => setSelectedPlace(hotel)}
                  >
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{hotel.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{hotel.address}</p>
                      <p className="text-gray-700 line-clamp-2">{hotel.description}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-sm text-green-600">{hotel.priceRange || 'Price not available'}</span>
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">Hotel</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Restaurants */}
          {searchResults.restaurants.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Restaurants ({searchResults.restaurants.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="bg-white rounded shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition duration-200"
                    onClick={() => setSelectedPlace(restaurant)}
                  >
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{restaurant.address}</p>
                      <p className="text-gray-700 line-clamp-2">{restaurant.description}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-sm text-red-600">{restaurant.cuisineType || 'Cuisine not available'}</span>
                        <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">Restaurant</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapSearch;
