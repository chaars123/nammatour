import React, { useState, useEffect } from 'react';

const TourGuide = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    date: '',
    duration: '4',
    groupSize: '1',
    specialRequests: ''
  });
  // New state for guide application
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    photo: '',
    experience: '',
    languages: '',
    specialties: '',
    description: '',
    contact: '',
    price: ''
  });

  useEffect(() => {
    const loadGuides = async () => {
      setLoading(true);
      try {
        // Sample data for demonstration, in production these would come from Supabase
        setGuides([
          {
            id: 1,
            name: 'Rahul Sharma',
            photo: 'https://randomuser.me/api/portraits/men/32.jpg',
            experience: '5 years',
            languages: ['English', 'Hindi', 'Kannada'],
            specialties: ['Historical Sites', 'Local Cuisine', 'Cultural Tours'],
            rating: 4.8,
            reviews: 124,
            price: '₹2,500/day',
            description: 'Passionate about Bangalore\'s history and culture. I specialize in historical tours and can show you the best local food spots.',
            contact: '+91 98765 43210'
          },
          {
            id: 2,
            name: 'Priya Patel',
            photo: 'https://randomuser.me/api/portraits/women/44.jpg',
            experience: '7 years',
            languages: ['English', 'Hindi', 'Kannada', 'Tamil'],
            specialties: ['Shopping Tours', 'Food Tours', 'Photography'],
            rating: 4.9,
            reviews: 156,
            price: '₹3,000/day',
            description: 'I love showing visitors the hidden gems of Bangalore. My tours focus on authentic experiences and great photo opportunities.',
            contact: '+91 98765 43211'
          },
          {
            id: 3,
            name: 'Vikram Singh',
            photo: 'https://randomuser.me/api/portraits/men/22.jpg',
            experience: '4 years',
            languages: ['English', 'Hindi', 'Punjabi'],
            specialties: ['Adventure', 'Nightlife', 'Tech Tours'],
            rating: 4.7,
            reviews: 89,
            price: '₹2,800/day',
            description: 'Specializing in tech tours and adventure experiences around Bangalore. I can show you both the modern and traditional side of the city.',
            contact: '+91 98765 43212'
          },
          {
            id: 4,
            name: 'Meera Krishnan',
            photo: 'https://randomuser.me/api/portraits/women/67.jpg',
            experience: '6 years',
            languages: ['English', 'Tamil', 'Malayalam', 'Kannada'],
            specialties: ['Art & Culture', 'Museums', 'Traditional Crafts'],
            rating: 4.9,
            reviews: 132,
            price: '₹2,700/day',
            description: 'I specialize in art and cultural tours. Discover Bangalore\'s rich cultural heritage and vibrant art scene with me.',
            contact: '+91 98765 43213'
          },
          {
            id: 5,
            name: 'Ajay Reddy',
            photo: 'https://randomuser.me/api/portraits/men/88.jpg',
            experience: '3 years',
            languages: ['English', 'Hindi', 'Telugu'],
            specialties: ['Nature Tours', 'Wildlife', 'Photography'],
            rating: 4.6,
            reviews: 68,
            price: '₹2,400/day',
            description: 'Nature enthusiast offering tours to the beautiful natural spots around Bangalore. Great for photography lovers!',
            contact: '+91 98765 43214'
          },
          {
            id: 6,
            name: 'Sunita Desai',
            photo: 'https://randomuser.me/api/portraits/women/33.jpg',
            experience: '8 years',
            languages: ['English', 'Hindi', 'Marathi', 'Kannada'],
            specialties: ['Family Tours', 'Educational Tours', 'Custom Itineraries'],
            rating: 4.9,
            reviews: 178,
            price: '₹3,200/day',
            description: 'Experienced guide specializing in family-friendly and educational tours. I can create custom itineraries based on your interests.',
            contact: '+91 98765 43215'
          }
        ]);
        setLoading(false);
      } catch (err) {
        console.error('Error loading guides:', err);
        setError('Failed to load tour guides. Please try again later.');
        setLoading(false);
      }
    };

    loadGuides();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm({
      ...bookingForm,
      [name]: value
    });
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    // In a real app, we would send this data to the backend
    alert(`Booking request sent for ${selectedGuide.name}! They will contact you shortly.`);
    setSelectedGuide(null);
    setBookingForm({
      date: '',
      duration: '4',
      groupSize: '1',
      specialRequests: ''
    });
  };

  // Handle guide application form changes
  const handleApplicationChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm({
      ...applicationForm,
      [name]: value
    });
  };

  // Handle guide application submission
  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    
    // Create a new guide object
    const newGuide = {
      id: guides.length + 1,
      name: applicationForm.name,
      photo: applicationForm.photo || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
      experience: applicationForm.experience || '1 year',
      languages: applicationForm.languages.split(',').map(lang => lang.trim()),
      specialties: applicationForm.specialties.split(',').map(spec => spec.trim()),
      rating: 4.5, // Default rating
      reviews: 0,   // New guide, no reviews yet
      price: applicationForm.price || '₹2,000/day',
      description: applicationForm.description,
      contact: applicationForm.contact
    };
    
    // Add new guide to the beginning of the guides array
    setGuides([newGuide, ...guides]);
    
    // Clear form and hide it
    setApplicationForm({
      name: '',
      photo: '',
      experience: '',
      languages: '',
      specialties: '',
      description: '',
      contact: '',
      price: ''
    });
    setShowApplicationForm(false);
  };

  // Calculate tomorrow's date for the date input min attribute
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Verified Tour Guides</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Connect with experienced and knowledgeable local guides to enhance your Bangalore experience.
          </p>
          <button 
            onClick={() => setShowApplicationForm(true)} 
            className="btn btn-primary px-8 py-3"
            data-component-name="TourGuide"
          >
            Apply to Become a Guide
          </button>
        </div>

        {/* Guide Application Form Modal */}
        {showApplicationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Apply to Become a Guide</h2>
                <button 
                  onClick={() => setShowApplicationForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleApplicationSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={applicationForm.name}
                    onChange={handleApplicationChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Profile Photo URL (optional)</label>
                  <input
                    type="url"
                    id="photo"
                    name="photo"
                    value={applicationForm.photo}
                    onChange={handleApplicationChange}
                    placeholder="https://example.com/your-photo.jpg"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for a random photo.</p>
                </div>
                
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Years of Experience</label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    value={applicationForm.experience}
                    onChange={handleApplicationChange}
                    placeholder="e.g., 2 years"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="languages" className="block text-sm font-medium text-gray-700">Languages (comma separated)</label>
                  <input
                    type="text"
                    id="languages"
                    name="languages"
                    value={applicationForm.languages}
                    onChange={handleApplicationChange}
                    placeholder="e.g., English, Hindi, Kannada"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="specialties" className="block text-sm font-medium text-gray-700">Specialties (comma separated)</label>
                  <input
                    type="text"
                    id="specialties"
                    name="specialties"
                    value={applicationForm.specialties}
                    onChange={handleApplicationChange}
                    placeholder="e.g., History Tours, Food Tours, Photography"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Daily Rate</label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={applicationForm.price}
                    onChange={handleApplicationChange}
                    placeholder="e.g., ₹2,500/day"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">About Yourself (Bio)</label>
                  <textarea
                    id="description"
                    name="description"
                    value={applicationForm.description}
                    onChange={handleApplicationChange}
                    rows="4"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Describe your experience and what makes your tours special..."
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    value={applicationForm.contact}
                    onChange={handleApplicationChange}
                    placeholder="e.g., +91 98765 43210"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span>{error}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map(guide => (
              <div key={guide.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  <img 
                    src={guide.photo} 
                    alt={guide.name} 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full shadow-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold">{guide.rating}</span>
                    <span className="text-xs text-gray-500 ml-1">({guide.reviews})</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{guide.name}</h3>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{guide.experience} experience</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{guide.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm text-gray-600 mb-2">LANGUAGES</h4>
                    <div className="flex flex-wrap gap-2">
                      {guide.languages.map((language, index) => (
                        <span 
                          key={index} 
                          className="bg-gray-100 px-2 py-1 rounded-full text-xs"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm text-gray-600 mb-2">SPECIALTIES</h4>
                    <div className="flex flex-wrap gap-2">
                      {guide.specialties.map((specialty, index) => (
                        <span 
                          key={index} 
                          className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full text-xs"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6">
                    <div className="font-semibold">{guide.price}</div>
                    <button 
                      onClick={() => setSelectedGuide(guide)} 
                      className="btn btn-primary"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Book a Tour with {selectedGuide.name}</h2>
              <button 
                onClick={() => setSelectedGuide(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  min={tomorrowString}
                  value={bookingForm.date}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (hours)</label>
                <select
                  id="duration"
                  name="duration"
                  value={bookingForm.duration}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="2">2 hours</option>
                  <option value="4">4 hours</option>
                  <option value="6">6 hours</option>
                  <option value="8">8 hours (full day)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="groupSize" className="block text-sm font-medium text-gray-700">Group Size</label>
                <select
                  id="groupSize"
                  name="groupSize"
                  value={bookingForm.groupSize}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="1">Just me</option>
                  <option value="2">2 people</option>
                  <option value="3-5">3-5 people</option>
                  <option value="6-10">6-10 people</option>
                  <option value="10+">More than 10 people</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">Special Requests</label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={bookingForm.specialRequests}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Any special requirements or interests..."
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedGuide(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Book Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourGuide;
