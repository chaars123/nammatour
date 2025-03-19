// AI service for fetching realistic place information
// This service uses OpenAI API to generate realistic data about places, hotels, and restaurants

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
console.log("API Key available:", !!API_KEY); // Log if API key is available (without showing the key)

/**
 * Fetch AI-generated place data
 * @param {string} area - The area name
 * @returns {Promise<Object|null>} - Object with area information or null if error
 */
export const fetchAIPlaceData = async (area) => {
  try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error("OpenAI API key is missing. Please add it to your .env file as REACT_APP_OPENAI_API_KEY");
      throw new Error("OpenAI API key is missing");
    }
    
    console.log("Sending request to OpenAI API for area:", area);
    
    const prompt = `I want to learn about ${area} in Bangalore, India. Please provide:
    1. A brief description (2-3 sentences)
    2. 3-5 notable places to visit there
    3. 2-3 popular restaurants or cafes
    4. 1-2 accommodation options if relevant
    
    Format your response as JSON with these keys:
    {
      "description": "Brief area description",
      "places": [{"name": "Place name", "description": "Brief description"}],
      "restaurants": [{"name": "Restaurant name", "description": "Brief description", "cuisine": "Type of food"}],
      "accommodations": [{"name": "Hotel name", "description": "Brief description", "priceRange": "Budget/Mid/Luxury"}]
    }`;

    console.log("Sending prompt to OpenAI:", prompt.substring(0, 50) + "...");
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4", // Using more advanced model for better information retrieval
        messages: [
          {
            role: "system", 
            content: "You are a knowledgeable tour guide AI specialized in Bangalore, India. You provide accurate, detailed information about any location in Bangalore. Always use web search capabilities to provide real, up-to-date information. Never make up fake information if you're unsure."
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log("OpenAI response:", data);
    
    if (!data.choices || data.choices.length === 0) {
      console.error("No choices returned from OpenAI API");
      return null;
    }
    
    const content = data.choices[0].message.content;
    
    try {
      // Extract JSON from potential text wrapping
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      
      // Parse the JSON response
      const parsedData = JSON.parse(jsonString);
      console.log("Successfully parsed data:", parsedData);
      return parsedData;
    } catch (jsonError) {
      console.error("Error parsing JSON response:", jsonError);
      console.log("Raw content:", content);
      return null;
    }
  } catch (error) {
    console.error("Error in fetchAIPlaceData:", error);
    return null;
  }
};

/**
 * Fetch area information with AI and web search
 * @param {string} area - The area name
 * @returns {Promise<Object>} - Object with area information
 */
export const fetchAreaInfo = async (area) => {
  try {
    // Get AI-generated data directly without hardcoded fallbacks
    console.log(`Fetching AI-generated information for: ${area}`);
    const aiData = await fetchAIPlaceData(area);
    
    if (aiData) {
      return aiData;
    } else {
      // Return minimal message if AI fails
      return {
        description: `Information about ${area} is currently unavailable. Please try again later.`,
        places: [],
        restaurants: [],
        accommodations: [],
        youtubeLinks: []
      };
    }
  } catch (error) {
    console.error('Error in fetchAreaInfo:', error);
    return {
      description: `Sorry, we couldn't fetch information about ${area}. Please try again later.`,
      places: [],
      restaurants: [],
      accommodations: [],
      youtubeLinks: []
    };
  }
};

/**
 * Fetch all types of places (attractions, hotels, restaurants) for an area
 * @param {string} area - The area name
 * @param {Array} center - Center coordinates [lat, lng]
 * @returns {Promise<Object>} - Object with places, hotels, and restaurants arrays
 */
export const fetchAllAreaData = async (area, center = [12.9716, 77.5946]) => {
  // For specific area types, always try to get real AI data
  const isSpecificLocation = area.toLowerCase().includes("university") || 
                            area.toLowerCase().includes("college") ||
                            area.toLowerCase().includes("temple") ||
                            area.toLowerCase().includes("mall") ||
                            area.toLowerCase().includes("restaurant") ||
                            area.toLowerCase().includes("hotel");
  
  try {
    if (!API_KEY) {
      console.warn("OpenAI API key not set. Using fallback data generation.");
      return generateFallbackData(area, center);
    }

    let attempts = 0;
    const maxAttempts = 2;
    let places = null, hotels = null, restaurants = null;
    
    // Try multiple attempts for important queries
    while (attempts < maxAttempts && (places === null || hotels === null || restaurants === null)) {
      attempts++;
      console.log(`Attempt ${attempts} to fetch AI data for ${area}`);
      
      try {
        [places, hotels, restaurants] = await Promise.all([
          places || fetchAIPlaceData(area),
          hotels || fetchAIPlaceData(area),
          restaurants || fetchAIPlaceData(area)
        ]);
      } catch (error) {
        console.error(`Error in attempt ${attempts}:`, error);
      }
      
      // If this is a specific location query, keep trying
      if (!isSpecificLocation) break;
    }

    // If any of the API calls failed, use fallback data
    if (!places || !hotels || !restaurants) {
      console.warn("Some AI data couldn't be fetched.");
      
      if (isSpecificLocation) {
        console.warn("This is a specific location query, failing rather than showing fake data");
        return {
          places: [],
          hotels: [],
          restaurants: []
        };
      } else {
        console.warn("Using fallback data for general area");
        return generateFallbackData(area, center);
      }
    }

    // Add location, id, and type information for map display
    const processedPlaces = places.map((place, index) => ({
      ...place,
      id: `${area.toLowerCase().replace(/\s+/g, '-')}-place-${index}`,
      location: getRandomLocation(center[0], center[1], 0.01, index),
      type: 'place'
    }));

    const processedHotels = hotels.map((hotel, index) => ({
      ...hotel,
      id: `${area.toLowerCase().replace(/\s+/g, '-')}-hotel-${index}`,
      location: getRandomLocation(center[0], center[1], 0.01, index + 10),
      type: 'hotel'
    }));

    const processedRestaurants = restaurants.map((restaurant, index) => ({
      ...restaurant,
      id: `${area.toLowerCase().replace(/\s+/g, '-')}-restaurant-${index}`,
      location: getRandomLocation(center[0], center[1], 0.01, index + 20),
      type: 'restaurant'
    }));

    return {
      places: processedPlaces,
      hotels: processedHotels,
      restaurants: processedRestaurants
    };
  } catch (error) {
    console.error("Error fetching all area data:", error);
    // Use fallback data on any error
    return generateFallbackData(area, center);
  }
};

// Helper function to generate random locations for map display
const getRandomLocation = (baseLat, baseLng, radius, seed) => {
  // Pseudo-random based on seed for consistency
  const angle = (seed * 137.5) % 360; // Golden angle for good distribution
  const distance = Math.sqrt(seed % 5) * radius; // Square root distribution
  
  // Convert angle and distance to lat/lng offset
  const latOffset = distance * Math.cos(angle * Math.PI / 180);
  const lngOffset = distance * Math.sin(angle * Math.PI / 180);
  
  return [baseLat + latOffset, baseLng + lngOffset];
};

// Fallback function when API key is missing or API calls fail
export const generateFallbackData = (area, center) => {
  // Common place types for urban areas
  const placeTypes = [
    { name: 'Park', description: 'A beautiful green space with walking paths and recreational areas.' },
    { name: 'Temple', description: 'A sacred place of worship with traditional architecture.' },
    { name: 'Mall', description: 'A modern shopping complex with retail stores and entertainment options.' },
    { name: 'Museum', description: 'An educational institution showcasing cultural and historical artifacts.' },
    { name: 'Lake', description: 'A scenic water body suitable for recreation and relaxation.' }
  ];
  
  // Common hotel types
  const hotelTypes = [
    { name: 'Grand Hotel', description: 'A luxurious hotel offering premium amenities and services.', priceRange: '₹5,000 - ₹10,000' },
    { name: 'Comfort Inn', description: 'A comfortable mid-range hotel with good facilities.', priceRange: '₹2,500 - ₹5,000' },
    { name: 'Budget Stay', description: 'An affordable accommodation option with basic amenities.', priceRange: '₹1,000 - ₹2,500' }
  ];
  
  // Common restaurant types
  const restaurantTypes = [
    { name: 'Spice Garden', description: 'A restaurant serving authentic Indian cuisine with a variety of spices.', cuisineType: 'Indian', priceRange: '₹800 for two' },
    { name: 'Green Leaf', description: 'A vegetarian restaurant with healthy and tasty food options.', cuisineType: 'Vegetarian', priceRange: '₹600 for two' },
    { name: 'Royal Biryani', description: 'Famous for its flavorful biryanis and kebabs.', cuisineType: 'Biryani, North Indian', priceRange: '₹700 for two' },
    { name: 'Pasta House', description: 'Italian restaurant specializing in pasta dishes and pizzas.', cuisineType: 'Italian', priceRange: '₹1,000 for two' }
  ];
  
  // Generate places
  const places = placeTypes.map((placeType, index) => ({
    id: `${area.toLowerCase().replace(/\s+/g, '-')}-place-${index}`,
    name: `${area} ${placeType.name}`,
    description: placeType.description,
    address: `${Math.floor(Math.random() * 200) + 1}, ${['1st', '2nd', '3rd'][Math.floor(Math.random() * 3)]} ${['Main', 'Cross', 'Street'][Math.floor(Math.random() * 3)]}, ${area}, Bangalore`,
    timings: '9:00 AM - 6:00 PM',
    entryFee: Math.random() > 0.6 ? 'Free' : `₹${Math.floor(Math.random() * 500)}`,
    location: getRandomLocation(center[0], center[1], 0.01, index),
    type: 'place'
  }));
  
  // Generate hotels
  const hotels = hotelTypes.map((hotelType, index) => ({
    id: `${area.toLowerCase().replace(/\s+/g, '-')}-hotel-${index}`,
    name: `${hotelType.name} ${area}`,
    description: hotelType.description,
    address: `${Math.floor(Math.random() * 200) + 1}, ${['1st', '2nd', '3rd'][Math.floor(Math.random() * 3)]} ${['Main', 'Cross', 'Street'][Math.floor(Math.random() * 3)]}, ${area}, Bangalore`,
    priceRange: hotelType.priceRange,
    amenities: ['Free Wi-Fi', 'Room Service', 'AC', 'Parking'].slice(0, Math.floor(Math.random() * 3) + 2),
    location: getRandomLocation(center[0], center[1], 0.01, index + 10),
    type: 'hotel'
  }));
  
  // Generate restaurants
  const restaurants = restaurantTypes.map((restaurantType, index) => ({
    id: `${area.toLowerCase().replace(/\s+/g, '-')}-restaurant-${index}`,
    name: `${restaurantType.name} ${area}`,
    description: restaurantType.description,
    address: `${Math.floor(Math.random() * 200) + 1}, ${['1st', '2nd', '3rd'][Math.floor(Math.random() * 3)]} ${['Main', 'Cross', 'Street'][Math.floor(Math.random() * 3)]}, ${area}, Bangalore`,
    cuisineType: restaurantType.cuisineType,
    priceRange: restaurantType.priceRange,
    location: getRandomLocation(center[0], center[1], 0.01, index + 20),
    type: 'restaurant'
  }));
  
  return {
    places,
    hotels,
    restaurants
  };
};
