# NammaTour - Bangalore Tourism Platform

NammaTour is a comprehensive tourism platform for Bangalore that connects tourists with verified local tour guides and provides information about the city's attractions, hotels, and restaurants.

## Features

- **User Authentication**: Separate signup and login for tourists and tour guides
- **Explore Tourism**: Browse top places, hotels, and restaurants in Bangalore
- **Tour Guide Booking**: Connect with verified local tour guides and book tours
- **AI Chatbot**: Get personalized trip planning assistance
- **SOS Emergency Feature**: Quick access to emergency contacts for tourists

## Project Structure

```
NammaTour/
│── .env                  # Environment variables  
│── public/               # Static files (logos, images)  
│── src/                  # Main source code  
│   │── components/       # Reusable UI components  
│   │── pages/            # Pages (Landing, ExploreTourism, TourGuide)  
│   │── services/         # API & database functions (Supabase, AI chatbot)  
│   │── styles/           # CSS or Tailwind setup  
│── App.js                # Main React app entry point  
│── index.js              # Renders the app  
│── supabase.js           # Supabase authentication & storage setup  
│── package.json          # Dependencies  
│── README.md             # Project guide
```

## Key Components

1. **Navbar**: Navigation with links to Home, Explore, Tour Guides, Login, and Signup
2. **SOS Button**: Emergency contact information for tourists
3. **AI Chatbot**: Interactive trip planning assistant
4. **Authentication**: User registration and login with Supabase

## Pages

1. **Home Page (/)**: Landing page with hero section, features, and AI chatbot
2. **Explore Tourism (/explore)**: Browse places, hotels, and restaurants in Bangalore
3. **Tour Guide (/tour-guides)**: Find and book verified local tour guides
4. **Login & Signup**: User authentication pages

## Technologies Used

- **Frontend**: React, React Router
- **Styling**: Tailwind CSS
- **Authentication & Database**: Supabase
- **AI Chatbot**: React-based implementation (can be enhanced with real AI APIs)

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Supabase:
   - Create a Supabase account and project
   - Update `.env` file with your Supabase URL and anon key
4. Start the development server: `npm start`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Future Enhancements

- Implement real AI backend for the chatbot
- Add payment gateway for tour bookings
- Implement review and rating system for tour guides
- Add multilingual support
- Develop mobile app version

## License

MIT
