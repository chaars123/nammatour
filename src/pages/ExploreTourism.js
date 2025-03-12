import React, { useState, useEffect } from 'react';
import { fetchTouristSpots, fetchHotels, fetchRestaurants } from '../supabase';

const ExploreTourism = () => {
  const [places, setPlaces] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activeTab, setActiveTab] = useState('places');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Sample data for demonstration, in production these would come from Supabase
        setPlaces([
          { id: 1, name: 'Lalbagh Botanical Garden', description: 'A renowned botanical garden with a diverse collection of plant species and a famous glass house.', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1000', location: 'Lalbagh Main Rd, Mavalli' },
          { id: 2, name: 'Bangalore Palace', description: 'A magnificent palace inspired by England\'s Windsor Castle, featuring Tudor-style architecture.', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1000', location: 'Vasanth Nagar' },
          { id: 3, name: 'Cubbon Park', description: 'A historic landmark offering lush greenery in the heart of the city.', image: 'https://images.unsplash.com/photo-1596001516950-278f77ee4434?q=80&w=1000', location: 'Kasturba Road' },
          { id: 4, name: 'ISKCON Temple', description: 'A beautiful temple complex dedicated to Lord Krishna.', image: 'https://images.unsplash.com/photo-1592549585867-474dd3829ee6?q=80&w=1000', location: 'Rajajinagar' },
          { id: 5, name: 'Bannerghatta National Park', description: 'A wildlife sanctuary offering safari experiences and housing a variety of animals.', image: 'https://images.unsplash.com/photo-1590418606746-018840f9cd0f?q=80&w=1000', location: 'Bannerghatta' },
          { id: 6, name: 'Wonderla Amusement Park', description: 'A popular amusement park with thrilling rides and water attractions.', image: 'https://images.unsplash.com/photo-1620298875698-74bd4bb9e6da?q=80&w=1000', location: 'Mysore Road' },
          { id: 7, name: 'Vidhana Soudha', description: 'The impressive seat of Karnataka\'s state legislature.', image: 'https://images.unsplash.com/photo-1599384654042-30be83948011?q=80&w=1000', location: 'Dr. Ambedkar Veedhi' },
          { id: 8, name: 'Commercial Street', description: 'A bustling shopping district offering everything from street fashion to luxury brands.', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000', location: 'Shivaji Nagar' },
          { id: 9, name: 'UB City', description: 'A luxury shopping mall featuring high-end brands and fine dining.', image: 'https://images.unsplash.com/photo-1614065613125-17cab7e9dbd0?q=80&w=1000', location: 'Vittal Mallya Road' },
          { id: 10, name: 'Nandi Hills', description: 'A scenic hill station offering stunning views, especially at sunrise.', image: 'https://images.unsplash.com/photo-1647936968208-fc2bbc95b073?q=80&w=1000', location: 'Nandi Hills, Chikkaballapur' }
        ]);
        
        setHotels([
          { id: 1, name: 'The Leela Palace', description: 'Luxury 5-star hotel with palatial architecture and world-class amenities.', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000', price: '₹15,000/night', rating: 4.8 },
          { id: 2, name: 'Taj MG Road', description: 'Elegant 5-star hotel located in the heart of Bangalore\'s business district.', image: 'https://images.unsplash.com/photo-1529290130-4ca3753253ae?q=80&w=1000', price: '₹12,000/night', rating: 4.7 },
          { id: 3, name: 'ITC Gardenia', description: 'Luxury hotel with sustainable design elements and excellent dining options.', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1000', price: '₹13,500/night', rating: 4.6 },
          { id: 4, name: 'Radisson Blu Atria', description: 'Contemporary 4-star hotel with modern amenities and convenient location.', image: 'https://images.unsplash.com/photo-1562778612-e1e0cda9915c?q=80&w=1000', price: '₹8,000/night', rating: 4.4 },
          { id: 5, name: 'Vivanta Bangalore', description: '4-star hotel offering stylish accommodation and excellent service.', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000', price: '₹7,500/night', rating: 4.5 },
          { id: 6, name: 'Ibis Bengaluru City Centre', description: 'Modern 3-star hotel with comfortable rooms and central location.', image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1000', price: '₹5,000/night', rating: 4.2 },
          { id: 7, name: 'Treebo Trip Hotel Woodsvilla Suites', description: '3-star hotel offering value for money and essential amenities.', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1000', price: '₹3,500/night', rating: 4.0 },
          { id: 8, name: 'FabHotel Pentagon Suites Koramangala', description: 'Budget-friendly hotel in the tech hub of Bangalore.', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000', price: '₹2,500/night', rating: 3.9 },
          { id: 9, name: 'OYO Townhouse', description: 'Mid-range hotel with standardized quality and essential amenities.', image: 'https://images.unsplash.com/photo-1515362655824-9a74989f318e?q=80&w=1000', price: '₹2,000/night', rating: 3.8 },
          { id: 10, name: 'Zostel Bangalore', description: 'Modern hostel offering dormitory and private rooms for budget travelers.', image: 'https://images.unsplash.com/photo-1520277739336-7bf67edfa768?q=80&w=1000', price: '₹800/night', rating: 4.1 }
        ]);
        
        setRestaurants([
          { id: 1, name: 'Karavalli', description: 'Authentic South Indian seafood in an elegant setting.', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000', cuisine: 'South Indian', contact: '+91 98765 43210' },
          { id: 2, name: 'Jamavar', description: 'Sophisticated North Indian cuisine with royal influences.', image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1000', cuisine: 'North Indian', contact: '+91 98765 43211' },
          { id: 3, name: 'Toit', description: 'Popular brewpub with craft beers and wood-fired pizzas.', image: 'https://images.unsplash.com/photo-1587899897387-091eeb83be4a?q=80&w=1000', cuisine: 'International, Craft Beer', contact: '+91 98765 43212' },
          { id: 4, name: 'CTR (Central Tiffin Room)', description: 'Iconic eatery famous for its crispy butter masala dosas.', image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?q=80&w=1000', cuisine: 'South Indian', contact: '+91 98765 43213' },
          { id: 5, name: 'Meghana Foods', description: 'Popular restaurant known for its flavorful biryanis.', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000', cuisine: 'Andhra, Biryani', contact: '+91 98765 43214' },
          { id: 6, name: 'Burma Burma', description: 'Vegetarian Burmese cuisine with unique flavors.', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1000', cuisine: 'Burmese', contact: '+91 98765 43215' },
          { id: 7, name: 'Truffles', description: 'Casual dining restaurant famous for its burgers.', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=1000', cuisine: 'Continental, Burgers', contact: '+91 98765 43216' },
          { id: 8, name: 'Vidyarthi Bhavan', description: 'Historic eatery serving traditional South Indian breakfast.', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000', cuisine: 'South Indian', contact: '+91 98765 43217' },
          { id: 9, name: 'The Permit Room', description: 'Modern take on South Indian cuisine with creative cocktails.', image: 'https://images.unsplash.com/photo-1526234179348-3068d7142b30?q=80&w=1000', cuisine: 'South Indian Fusion', contact: '+91 98765 43218' },
          { id: 10, name: 'Fenny\'s Lounge', description: 'Stylish lounge serving continental cuisine and cocktails.', image: 'https://images.unsplash.com/photo-1540304453527-62f979142a17?q=80&w=1000', cuisine: 'Continental', contact: '+91 98765 43219' }
        ]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // In a real app, we would use these functions to fetch data from Supabase
  // const fetchData = async () => {
  //   const [placesRes, hotelsRes, restaurantsRes] = await Promise.all([
  //     fetchTouristSpots(),
  //     fetchHotels(),
  //     fetchRestaurants()
  //   ]);
  //
  //   if (placesRes.error) setError(placesRes.error.message);
  //   else setPlaces(placesRes.data || []);
  //
  //   if (hotelsRes.error) setError(hotelsRes.error.message);
  //   else setHotels(hotelsRes.data || []);
  //
  //   if (restaurantsRes.error) setError(restaurantsRes.error.message);
  //   else setRestaurants(restaurantsRes.data || []);
  //
  //   setLoading(false);
  // };

  const renderPlaces = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {places.map(place => (
        <div key={place.id} className="card overflow-hidden">
          <img 
            src={place.image} 
            alt={place.name} 
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{place.name}</h3>
            <p className="text-gray-600 mb-3">{place.description}</p>
            <div className="flex items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{place.location}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderHotels = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hotels.map(hotel => (
        <div key={hotel.id} className="card overflow-hidden">
          <img 
            src={hotel.image} 
            alt={hotel.name} 
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{hotel.name}</h3>
              <div className="flex items-center bg-primary bg-opacity-10 px-2 py-1 rounded text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span>{hotel.rating}</span>
              </div>
            </div>
            <p className="text-gray-600 mb-3">{hotel.description}</p>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-primary">{hotel.price}</span>
              <a href="#" className="text-blue-500 hover:underline">Book Now</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderRestaurants = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map(restaurant => (
        <div key={restaurant.id} className="card overflow-hidden">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1">{restaurant.name}</h3>
            <div className="text-sm text-gray-500 mb-2">{restaurant.cuisine}</div>
            <p className="text-gray-600 mb-3">{restaurant.description}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{restaurant.contact}</span>
              </div>
              <a href="#" className="text-blue-500 hover:underline">View Menu</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore Bangalore</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the best places, hotels, and restaurants that Bangalore has to offer.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setActiveTab('places')}
              className={`px-6 py-3 text-sm font-medium rounded-l-lg ${
                activeTab === 'places'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Places to Visit
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('hotels')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'hotels'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Hotels
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('restaurants')}
              className={`px-6 py-3 text-sm font-medium rounded-r-lg ${
                activeTab === 'restaurants'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Restaurants
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span>{error}</span>
          </div>
        ) : (
          <div>
            {activeTab === 'places' && renderPlaces()}
            {activeTab === 'hotels' && renderHotels()}
            {activeTab === 'restaurants' && renderRestaurants()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreTourism;
