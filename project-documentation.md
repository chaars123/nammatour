# NammaTour Project Documentation

## Project Overview

NammaTour is a comprehensive tourism platform focused on Karnataka, India. It features an AI-powered chatbot that provides information about tourist places, hotels, and restaurants across the region. The application combines modern web technologies with machine learning to create an interactive experience for tourists planning their visits.

## Project Structure

```
nammaTour/
├── public/
│   ├── index.html
│   ├── model_web/
│   │   ├── model/           # TensorFlow.js model files
│   │   ├── tokenizer.json   # Word tokenizer for text processing
│   │   ├── label_encoder.json # Intent label mapping
│   │   └── tourism_data_for_inference.csv # Tourism data
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/               # Page components
│   │   ├── Home.js          # Landing page
│   │   ├── About.js         # Project information
│   │   ├── ChatAI.js        # AI chatbot implementation
│   │   ├── AISearch.js      # Search functionality
│   │   ├── TouristPlaces.js # Places directory
│   │   ├── Hotels.js        # Hotels directory
│   │   └── Restaurants.js   # Restaurants directory
│   ├── App.js               # Main application component
│   └── index.js             # Application entry point
└── package.json             # Dependencies and scripts
```

## Key Features

### 1. AI-Powered Chatbot

The centerpiece of NammaTour is its intelligent chatbot that:

- **Understands Natural Language**: Processes user queries about tourism in Karnataka
- **Provides Accurate Information**: Delivers details about places, hotels, and restaurants
- **Handles Various Query Types**: Addresses questions about locations, prices, timings, and features
- **Falls Back Gracefully**: Uses rule-based responses when ML model confidence is low

### 2. Comprehensive Tourism Database

NammaTour includes a rich dataset of tourism information:

- **Tourist Places**: Popular attractions like Bangalore Palace, Wonder La, Bannerghatta Park, etc.
- **Hotels**: Range of accommodations from luxury to budget-friendly options
- **Restaurants**: Diverse dining options with cuisine details and price ranges

Each entry contains detailed information including:
- Name and description
- Address and location
- Price range/entry fees
- Features and amenities
- Opening hours

### 3. Interactive User Interface

The application features a modern, responsive UI built with React and Tailwind CSS:

- **Chat Interface**: User-friendly chat window with suggested questions
- **Directory Pages**: Browsable listings of places, hotels, and restaurants
- **Search Functionality**: Quick access to tourism information
- **About Section**: Project and team information

## Page Descriptions

### Home Page

The landing page introduces users to NammaTour and provides navigation to key features. It highlights the chatbot and showcases featured tourist destinations in Karnataka.

### ChatAI Page

This is where users interact with the AI assistant. Key components include:

- Chat message history display
- User input field with submit button
- Suggested questions based on context
- Loading indicators during model processing

The page incorporates the TensorFlow.js model for intent prediction and processes user queries to provide relevant tourism information.

```javascript
// Key functions in ChatAI.js
const predictIntent = async (userInput) => {...}  // Determines user's intent
const getAnswerForIntent = (intent, userQuery) => {...}  // Generates responses
const checkForLocationQuestion = (userQuestion, item) => {...}  // Handles location queries
const formatTourismDataItem = (item) => {...}  // Formats data into readable responses
```

### AISearch Page

Provides a search interface for users to find specific tourism information quickly. It uses the same tourism data as the chatbot but in a more structured search format.

### Tourist Places, Hotels, and Restaurants Pages

These directory pages list and detail the various tourism options. Each uses a card-based layout to present information in an organized manner with filtering options.

## Technical Implementation

### Frontend Technologies

- **React.js**: Library for building the user interface
- **Tailwind CSS**: Utility-first CSS framework for styling
- **TensorFlow.js**: JavaScript library for machine learning in the browser
- **React Router**: For navigation and routing between pages

### Backend Technologies

- **Supabase**: Authentication and database services
- **Machine Learning Model**: Neural network for intent classification
- **Node.js**: Runtime environment

### Data Flow

1. **User Interaction**: User enters a query in the chat interface
2. **Intent Prediction**: ML model processes the query to determine intent
3. **Data Retrieval**: System fetches relevant data from the tourism database
4. **Response Generation**: Constructs a response based on intent and available data
5. **UI Update**: Displays the formatted response to the user

## Tourism Data Structure

The tourism data is stored in a CSV format with the following structure:

- **id**: Unique identifier
- **category**: Type (place, hotel, restaurant)
- **name**: Name of the entity
- **description**: Detailed description
- **address**: Physical location
- **rating**: User rating (1-5 stars)
- **price_range**: Cost indicator
- **features**: Special amenities or attractions
- **timings**: Operating hours
- **image_url**: Photo of the entity

## Recent Enhancements

1. **Improved Model Loading**: Better error handling and fallback mechanisms
2. **Enhanced Entity Matching**: Better partial name recognition for places
3. **CSV Parsing Improvements**: Proper handling of quoted fields with commas
4. **New Tourism Entries**: Addition of 30 new tourism entries (10 each for places, hotels, and restaurants)

## Future Development Roadmap

1. **Expanded Dataset**: Including more tourism options across Karnataka
2. **Personalized Recommendations**: Based on user preferences
3. **Itinerary Planning**: Feature to help users plan multi-day trips
4. **Offline Support**: Progressive Web App capabilities
5. **User Reviews**: Allow users to contribute reviews and ratings

## Team

This project was developed by students of CMR University:

- CHARULATHA M (21BBTIT015) - B.Tech, IT
- MONISHA J (21BBTIT027) - B.Tech, IT
- ANKITHA K J (21BBTCC002) - B.Tech, CCE
- P RICKSHI FEMINA (21BBTCC013) - B.Tech, CCE
