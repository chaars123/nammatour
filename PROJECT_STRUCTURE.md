# NammaTour Project Structure

## Overview
NammaTour is a tourism guide application for Bangalore with an AI chatbot assistant. The application has:
- A React frontend with various pages and components
- A Flask backend with a custom TensorFlow ML model
- Integration with Supabase for authentication

## File Structure & Feature Connections

### Frontend (React)

#### Main Pages
- `src/pages/Home.js`: Landing page with intro to Bangalore tourism
- `src/pages/Tourism.js`: Main tourism information with tabs for Places, Hotels, and Restaurants
- `src/pages/CustomChatPage.js`: Chat interface page that houses the AI assistant
- `src/pages/About.js`: Information about the project and technologies used

#### Key Components
- `src/components/CustomModelChatbot.js`: The core AI chatbot interface with the orange/green theme
  - Connects to Flask API at `http://localhost:5000/api/chat`
  - Has fallback offline responses if API is unavailable
  - Manages message display, user input, and suggested questions

- `src/components/ThemeSwitcher.js`: Allows switching between different themes (light, dark, grey, blue)
  - Used by `ThemeContext.js` to manage global theme state

- `src/components/TourismTabs.js`: Tab navigation for Places, Hotels, and Restaurants in Tourism page
  - Displays counts and manages filtering of tourism data

#### Styling Files
- `src/styles/chatInterface.css`: Styling for chat bubbles, avatars, and other chat UI elements
- `src/styles/immersive.css`: Styling for immersive sections with parallax effects

#### Data & Services
- `src/data/tourismData.js`: Contains 30 entries (20 places, 20 hotels, 20 restaurants)
- `src/utils/aiService.js`: Integration with external AI services (OpenAI, Groq)

### Backend (Flask API)

#### Main Files
- `api/app.py`: Core Flask API server
  - Loads TensorFlow model from `api/model/bangalore_tourism_model.h5`
  - Processes chat requests through `/api/chat` endpoint
  - Uses NLP to understand and categorize user queries
  - Returns tourism information based on categories (place, hotel, restaurant)

- `api/data/`: Contains CSV files with tourism data for the model
  - `tourism_data_for_inference.csv`: Places, Hotels, Restaurants database
  - `qa_data_for_inference.csv`: Common Q&A pairs for the chatbot

### Configuration Files
- `.env`: Environment variables including:
  - Supabase credentials for authentication
  - API keys for OpenAI and Groq (alternative AI backends)

- `package.json`: NPM dependencies and scripts for the React frontend

## Feature → File Mapping

1. **Chat Interface with Orange/Green Theme**
   - `src/components/CustomModelChatbot.js` (Component logic)
   - `src/styles/chatInterface.css` (Styling)
   - `src/pages/CustomChatPage.js` (Container page)

2. **Tourism Data with Search**
   - `src/pages/Tourism.js` (UI & search functionality)
   - `src/data/tourismData.js` (Data source)

3. **AI Chat Assistant**
   - `src/components/CustomModelChatbot.js` (Frontend)
   - `api/app.py` (Backend API)
   - `api/model/bangalore_tourism_model.h5` (Custom ML model)

4. **Theme Switching**
   - `src/context/ThemeContext.js` (State management)
   - `src/components/ThemeSwitcher.js` (UI control)

## Data Flow

1. User enters a message in the chat interface (`CustomModelChatbot.js`)
2. Frontend sends request to Flask backend (`app.py`) via the `/api/chat` endpoint
3. Backend uses TensorFlow model to:
   - Categorize the query (place, hotel, restaurant)
   - Find relevant tourism information
4. Response is sent back to frontend and displayed in the chat
5. If backend is unavailable, fallback to offline responses in `CustomModelChatbot.js`

## Deployment Considerations

- **Frontend**: Can be deployed to Vercel
- **Backend**: Best deployed to a service that supports Python & ML (Railway, Render, or PythonAnywhere)
- **Database**: Currently using local files, can be migrated to Supabase for production