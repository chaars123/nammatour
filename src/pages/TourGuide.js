import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const TourGuide = () => {
  // Basic state
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Booking state
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    date: '',
    duration: '4',
    groupSize: '1',
    specialRequests: ''
  });
  
  // Guide application state
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    photo: '',
    gender: 'male',
    experience: '',
    languages: '',
    specialties: '',
    description: '',
    contact: '',
    price: ''
  });
  
  // Edit/delete state
  const [isEditing, setIsEditing] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);
  
  // Booked guides
  const [bookedGuides, setBookedGuides] = useState([]);

  // Submission state
  const [submitting, setSubmitting] = useState(false);

  // Load guides when component mounts
  useEffect(() => {
    loadGuides();
    
    // Load booked guides from localStorage
    const bookedData = localStorage.getItem('bookedGuides');
    if (bookedData) {
      try {
        const bookedIds = JSON.parse(bookedData);
        setBookedGuides(bookedIds);
      } catch (err) {
        console.error('Error loading booked guides:', err);
      }
    }
  }, []);

  // Load guides from Supabase
  const loadGuides = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch guides from Supabase
      const { data, error } = await supabase
        .from('tour_guides')
        .select('*')
        .eq('verified', true);
      
      if (error) throw error;
      
      // Format guides data and check if booked
      let formattedGuides = [];
      
      if (data && data.length > 0) {
        formattedGuides = data.map(guide => ({
          id: guide.id,
          name: guide.name,
          photo: guide.photo_url || getRandomPhotoUrl(guide.gender || 'male'),
          gender: guide.gender || 'male',
          experience: guide.experience || '1 year',
          languages: guide.languages ? guide.languages.split(',').map(lang => lang.trim()) : ['English'],
          specialties: guide.specialties ? guide.specialties.split(',').map(spec => spec.trim()) : ['City Tours'],
          rating: guide.rating || 4.5,
          reviews: guide.reviews || 0,
          price: guide.price || '₹2,000/day',
          description: guide.description || 'Local tour guide available for booking.',
          contact: guide.contact || '+91 9876543210',
          verified: guide.verified || false,
          booked: false // Will update from localStorage
        }));
      } else {
        // If no guides from API, use sample data
        formattedGuides = getSampleGuides();
      }
      
      // Update booked status
      const bookedData = localStorage.getItem('bookedGuides');
      if (bookedData) {
        try {
          const bookedIds = JSON.parse(bookedData);
          formattedGuides = formattedGuides.map(guide => ({
            ...guide,
            booked: bookedIds.includes(guide.id)
          }));
        } catch (err) {
          console.error('Error processing booked guides:', err);
        }
      }
      
      setGuides(formattedGuides);
    } catch (err) {
      console.error('Error loading guides:', err);
      setError('Failed to load tour guides. Please try again later.');
      setGuides(getSampleGuides());
    } finally {
      setLoading(false);
    }
  };

  // Handle booking form changes
  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm({
      ...bookingForm,
      [name]: value
    });
  };

  // Submit booking
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedGuide) return;
    
    // In a real app, you would send this to your backend
    console.log('Booking submitted:', {
      guide: selectedGuide,
      booking: bookingForm
    });
    
    // Save booked guide ID to localStorage
    try {
      const bookedData = localStorage.getItem('bookedGuides');
      let bookedIds = bookedData ? JSON.parse(bookedData) : [];
      
      if (!bookedIds.includes(selectedGuide.id)) {
        bookedIds.push(selectedGuide.id);
        localStorage.setItem('bookedGuides', JSON.stringify(bookedIds));
        
        // Update guides state to reflect booking
        setGuides(prevGuides => 
          prevGuides.map(guide => 
            guide.id === selectedGuide.id ? { ...guide, booked: true } : guide
          )
        );
        
        setBookedGuides(bookedIds);
      }
      
      // Show success message
      alert(`Booking confirmed with ${selectedGuide.name}!`);
      
      // Reset form
      setSelectedGuide(null);
      setBookingForm({
        date: '',
        duration: '4',
        groupSize: '1',
        specialRequests: ''
      });
    } catch (err) {
      console.error('Error saving booking:', err);
      alert('There was an error processing your booking. Please try again.');
    }
  };

  // Handle application form changes
  const handleApplicationChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm({
      ...applicationForm,
      [name]: value
    });
  };

  // Submit application
  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Format languages and specialties
      const formattedLanguages = applicationForm.languages
        .split(',')
        .map(lang => lang.trim())
        .filter(lang => lang);
      
      const formattedSpecialties = applicationForm.specialties
        .split(',')
        .map(spec => spec.trim())
        .filter(spec => spec);
      
      // Generate random photo based on gender
      const photoUrl = applicationForm.photo || getRandomPhotoUrl(applicationForm.gender);
      
      // Prepare guide data
      const guideData = {
        name: applicationForm.name,
        gender: applicationForm.gender,
        photo_url: photoUrl,
        experience: applicationForm.experience,
        languages: applicationForm.languages,
        specialties: applicationForm.specialties,
        description: applicationForm.description,
        contact: applicationForm.contact,
        price: applicationForm.price,
        verified: true, // Auto-verify for demo purposes
        rating: 4.5, // Default rating
        reviews: 0 // Default reviews
      };
      
      // Add new guide or update existing guide
      let result;
      
      if (isEditing && editingGuide) {
        // Update existing guide
        result = await supabase
          .from('tour_guides')
          .update(guideData)
          .eq('id', editingGuide.id);
      } else {
        // Insert new guide
        result = await supabase
          .from('tour_guides')
          .insert([guideData]);
      }
      
      if (result.error) throw result.error;
      
      // Success message
      alert(isEditing ? 'Guide updated successfully!' : 'Application submitted successfully!');
      
      // Reset form and state
      setApplicationForm({
        name: '',
        photo: '',
        gender: 'male',
        experience: '',
        languages: '',
        specialties: '',
        description: '',
        contact: '',
        price: ''
      });
      setShowApplicationForm(false);
      setIsEditing(false);
      setEditingGuide(null);
      
      // Reload guides
      loadGuides();
    } catch (err) {
      console.error('Error submitting application:', err);
      alert('There was an error processing your application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit guide
  const handleEditGuide = (guide) => {
    setIsEditing(true);
    setEditingGuide(guide);
    
    // Format languages and specialties for form
    const languagesStr = Array.isArray(guide.languages) ? guide.languages.join(', ') : guide.languages;
    const specialtiesStr = Array.isArray(guide.specialties) ? guide.specialties.join(', ') : guide.specialties;
    
    // Populate form with guide data
    setApplicationForm({
      name: guide.name,
      photo: guide.photo,
      gender: guide.gender || 'male',
      experience: guide.experience,
      languages: languagesStr,
      specialties: specialtiesStr,
      description: guide.description,
      contact: guide.contact,
      price: guide.price
    });
    
    // Show application form
    setShowApplicationForm(true);
  };

  // Handle delete guide
  const handleDeleteGuide = async (guide) => {
    if (!window.confirm(`Are you sure you want to delete ${guide.name}?`)) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('tour_guides')
        .delete()
        .eq('id', guide.id);
      
      if (error) throw error;
      
      // Remove guide from state
      setGuides(prevGuides => prevGuides.filter(g => g.id !== guide.id));
      
      alert('Guide deleted successfully!');
    } catch (err) {
      console.error('Error deleting guide:', err);
      alert('There was an error deleting the guide. Please try again.');
    }
  };

  // Get random photo URL based on gender
  const getRandomPhotoUrl = (gender) => {
    const randomNum = Math.floor(Math.random() * 99) + 1;
    return `https://randomuser.me/api/portraits/${gender === 'male' ? 'men' : 'women'}/${randomNum}.jpg`;
  };

  // Get sample guides data
  const getSampleGuides = () => {
    return [
      {
        id: 1,
        name: 'Rahul Sharma',
        photo: 'https://randomuser.me/api/portraits/men/32.jpg',
        gender: 'male',
        experience: '5 years',
        languages: ['English', 'Hindi', 'Kannada'],
        specialties: ['Historical Sites', 'Local Cuisine', 'Cultural Tours'],
        rating: 4.8,
        reviews: 124,
        price: '₹2,500/day',
        description: 'Passionate about Bangalore\'s history and culture. I specialize in historical tours and can show you the best local food spots.',
        contact: '+91 98765 43210',
        verified: true,
        booked: bookedGuides.includes(1)
      },
      {
        id: 2,
        name: 'Priya Patel',
        photo: 'https://randomuser.me/api/portraits/women/44.jpg',
        gender: 'female',
        experience: '7 years',
        languages: ['English', 'Hindi', 'Kannada', 'Tamil'],
        specialties: ['Shopping Tours', 'Food Tours', 'Photography'],
        rating: 4.9,
        reviews: 156,
        price: '₹3,000/day',
        description: 'I love showing visitors the hidden gems of Bangalore. My tours focus on authentic experiences and great photo opportunities.',
        contact: '+91 98765 43211',
        verified: true,
        booked: bookedGuides.includes(2)
      }
    ];
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Tour Guides</h1>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {/* Loading state */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-xl text-gray-600">Loading tour guides...</p>
        </div>
      ) : (
        <>
          {/* Guides grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {guides.map((guide) => (
              <div key={guide.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={guide.photo} 
                    alt={guide.name} 
                    className="w-full h-full object-cover"
                  />
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
                  
                  {/* Booking Status */}
                  {guide.booked && (
                    <div className="flex items-center text-green-600 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">Booked</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-6">
                    <div className="font-semibold">{guide.price}</div>
                    <button 
                      onClick={() => setSelectedGuide(guide)} 
                      className="btn btn-primary"
                    >
                      {guide.booked ? 'Contact Guide' : 'Book Now'}
                    </button>
                  </div>
                  
                  {/* Edit/Delete buttons in a separate row */}
                  <div className="flex justify-end space-x-2 mt-3">
                    <button 
                      onClick={() => handleEditGuide(guide)} 
                      className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteGuide(guide)} 
                      className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Become a guide button */}
          <div className="text-center mb-12">
            <button 
              onClick={() => {
                setIsEditing(false);
                setEditingGuide(null);
                setApplicationForm({
                  name: '',
                  photo: '',
                  gender: 'male',
                  experience: '',
                  languages: '',
                  specialties: '',
                  description: '',
                  contact: '',
                  price: ''
                });
                setShowApplicationForm(true);
              }}
              className="btn btn-primary btn-lg"
            >
              Apply to Become a Guide
            </button>
          </div>
          
          {/* Guide application form */}
          {showApplicationForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">
                  {isEditing ? 'Edit Guide Profile' : 'Guide Application'}
                </h2>
                
                <form onSubmit={handleApplicationSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={applicationForm.name}
                        onChange={handleApplicationChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Gender</label>
                      <select
                        name="gender"
                        value={applicationForm.gender}
                        onChange={handleApplicationChange}
                        className="w-full p-2 border rounded"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Photo URL (optional)</label>
                      <input
                        type="text"
                        name="photo"
                        value={applicationForm.photo}
                        onChange={handleApplicationChange}
                        className="w-full p-2 border rounded"
                        placeholder="Leave blank for random photo"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Experience</label>
                      <input
                        type="text"
                        name="experience"
                        value={applicationForm.experience}
                        onChange={handleApplicationChange}
                        className="w-full p-2 border rounded"
                        placeholder="e.g. 3 years"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Languages (comma separated)</label>
                      <input
                        type="text"
                        name="languages"
                        value={applicationForm.languages}
                        onChange={handleApplicationChange}
                        className="w-full p-2 border rounded"
                        placeholder="e.g. English, Hindi, Kannada"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Specialties (comma separated)</label>
                      <input
                        type="text"
                        name="specialties"
                        value={applicationForm.specialties}
                        onChange={handleApplicationChange}
                        className="w-full p-2 border rounded"
                        placeholder="e.g. Historical Sites, Food Tours"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Contact</label>
                      <input
                        type="text"
                        name="contact"
                        value={applicationForm.contact}
                        onChange={handleApplicationChange}
                        className="w-full p-2 border rounded"
                        placeholder="e.g. +91 98765 43210"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Price</label>
                      <input
                        type="text"
                        name="price"
                        value={applicationForm.price}
                        onChange={handleApplicationChange}
                        className="w-full p-2 border rounded"
                        placeholder="e.g. ₹2,500/day"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={applicationForm.description}
                      onChange={handleApplicationChange}
                      className="w-full p-2 border rounded"
                      rows="4"
                      placeholder="Tell us about yourself and your tour guide experience"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowApplicationForm(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : (isEditing ? 'Update Profile' : 'Submit Application')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          {/* Booking modal */}
          {selectedGuide && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6">Book {selectedGuide.name}</h2>
                
                <form onSubmit={handleBookingSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={bookingForm.date}
                      onChange={handleBookingChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Duration (hours)</label>
                    <select
                      name="duration"
                      value={bookingForm.duration}
                      onChange={handleBookingChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="4">4 hours</option>
                      <option value="8">8 hours</option>
                      <option value="12">Full day (12 hours)</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Group Size</label>
                    <select
                      name="groupSize"
                      value={bookingForm.groupSize}
                      onChange={handleBookingChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="1">1 person</option>
                      <option value="2">2 people</option>
                      <option value="3-5">3-5 people</option>
                      <option value="6-10">6-10 people</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Special Requests</label>
                    <textarea
                      name="specialRequests"
                      value={bookingForm.specialRequests}
                      onChange={handleBookingChange}
                      className="w-full p-2 border rounded"
                      rows="3"
                      placeholder="Any special requests or information for the guide"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setSelectedGuide(null)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TourGuide;
