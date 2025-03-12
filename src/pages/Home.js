import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ user }) => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Vidhana Soudha image on right corner */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-7/12 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Discover Bangalore Like Never Before
              </h1>
              <p className="text-xl mb-8">
                Connect with local tour guides, explore top attractions, and plan your perfect trip with NammaTour.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {!user ? (
                  <>
                    <Link 
                      to="/signup" 
                      className="btn bg-white text-primary hover:bg-gray-100 font-bold"
                    >
                      Sign Up as Tourist
                    </Link>
                    <Link 
                      to="/signup" 
                      className="btn bg-transparent border-2 border-white hover:bg-white hover:text-primary font-bold"
                    >
                      Sign Up as Guide
                    </Link>
                  </>
                ) : (
                  <Link 
                    to="/explore" 
                    className="btn bg-white text-primary hover:bg-gray-100 font-bold"
                  >
                    Explore Bangalore
                  </Link>
                )}
              </div>
            </div>
            <div className="md:w-5/12 flex justify-end relative">
              <div className="bg-white p-2 rounded-lg shadow-xl w-full max-w-md">
                <img 
                  src="/images/backgroung.jpg" 
                  alt="Vidhana Soudha" 
                  className="rounded-md h-auto w-full object-cover"
                />
                <p className="text-center text-gray-700 text-sm mt-2 font-medium">
                  Vidhana Soudha - Bangalore's Iconic Landmark
                </p>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary-light rounded-full opacity-30 z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose NammaTour?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Local Guides</h3>
              <p className="text-gray-600">Connect with verified local guides who know the city inside out and can provide unique insights.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Experience</h3>
              <p className="text-gray-600">Tailor your tour based on your interests, time availability, and preferred pace of exploration.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-lg p-6 shadow-md">
              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">Book tours on-demand, cancel or reschedule with ease, and enjoy hassle-free tourism planning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center max-w-xs text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl">1</div>
              <h3 className="text-xl font-semibold mb-2">Browse Guides</h3>
              <p className="text-gray-600">Explore profiles of local tour guides, read reviews, and find someone who matches your interests.</p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center max-w-xs text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl">2</div>
              <h3 className="text-xl font-semibold mb-2">Book Your Tour</h3>
              <p className="text-gray-600">Select a guide, choose your preferred time and date, and book your personalized tour experience.</p>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center max-w-xs text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl">3</div>
              <h3 className="text-xl font-semibold mb-2">Enjoy Bangalore</h3>
              <p className="text-gray-600">Meet your guide and discover the hidden gems and top attractions of Bangalore with a local expert.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
