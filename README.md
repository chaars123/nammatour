# NammaTour - Bangalore Tourism Platform

NammaTour is a comprehensive tourism platform for Bangalore that connects tourists with verified local tour guides and provides information about the city's attractions, hotels, and restaurants.

## Features

- **User Authentication**: Separate signup and login for tourists and tour guides
- **Explore Tourism**: Browse top places, hotels, and restaurants in Bangalore
- **Tour Guide Booking**: Connect with verified local tour guides and book tours
- **AI Chatbot**: Get personalized trip planning assistance
- **SOS Emergency Feature**: Quick access to emergency contacts for tourists
- **Tourism Data**: Extensive database of Bangalore attractions, accommodations, and dining options
- **Location-Based Search**: Find tourism options in specific Bangalore neighborhoods

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- A Supabase account (for authentication)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/nammaTour.git
cd nammaTour
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
   - Create a `.env` file in the root directory
   - Add the following variables:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_KEY=your_supabase_anon_key
REACT_APP_OPENAI_API_KEY=your_openai_api_key (optional for AI features)
```

### Running the Project

#### Development Mode
```bash
npm start
```
This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

#### Production Build
```bash
npm run build
```
Builds the app for production to the `build` folder.

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
│   │── data/             # Tourism data files  
│   │── utils/            # Utility functions and helpers
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
5. **Tourism Explorer**: Browse and filter tourism options by category and location

## Pages

1. **Home Page (/)**: Landing page with hero section, features, and AI chatbot
2. **Explore Tourism (/explore)**: Browse places, hotels, and restaurants in Bangalore
3. **Tour Guide (/tour-guides)**: Find and book verified local tour guides
4. **Login & Signup**: User authentication pages
5. **AI Search (/ai-search)**: AI-powered search for tourism recommendations

## Technologies Used

- **Frontend**: React 18, React Router v7
- **Styling**: Tailwind CSS
- **Authentication & Database**: Supabase
- **AI Features**: OpenAI API integration (optional)

## Authentication Notes

The application uses Supabase for authentication. For demo purposes, you can:
1. Create new accounts with valid email addresses (verification required)
2. Use existing test accounts (if provided by the administrator)

## Deployment

This project can be deployed to any static hosting service such as:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- All tourism data is sourced from public information about Bangalore
- Images used in the application belong to their respective owners
