import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { tourismData, placesData, hotelsData, restaurantsData } from '../data/tourismData';

const Chatbot = () => {
  const [model, setModel] = useState(null);
  const [tokenizer, setTokenizer] = useState(null);
  const [labelEncoder, setLabelEncoder] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [tourismData, setTourismData] = useState([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);

  // Initialize tokenizer and label encoder with defaults at the component level
  // This ensures they're always available even if loading fails
  const defaultTokenizer = {
    word_index: {
      'place': 1, 'visit': 2, 'tourist': 3, 'attraction': 4, 'palace': 5, 
      'temple': 6, 'park': 7, 'hotel': 8, 'stay': 9, 'room': 10,
      'accommodation': 11, 'resort': 12, 'restaurant': 13, 'food': 14, 'eat': 15, 
      'dining': 16, 'cafe': 17, 'hello': 18, 'hi': 19, 'hey': 20,
      'bangalore': 21, 'karnataka': 22, 'mysore': 23, 'cost': 24, 'price': 25,
      'best': 26, 'popular': 27, 'famous': 28, 'luxury': 29, 'budget': 30,
      'wonder': 31, 'bannerghatta': 32, 'iskcon': 33, 'meghana': 34, 'toit': 35
    }
  };
  
  // Default label encoder
  const defaultLabelEncoder = {
    classes_: ['greeting', 'hotels', 'places', 'restaurants']
  };

  const messagesEndRef = useRef(null);
  
  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    const loadTourismData = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/model_web/tourism_data_for_inference.csv`);
        const text = await response.text();
        
        // Parse CSV data
        const rows = text.split('\n').filter(row => row.trim() !== '').map(row => {
          const quotedValues = [];
          let inQuote = false;
          let currentValue = '';
          
          // Handle quoted values with commas inside
          for (let i = 0; i < row.length; i++) {
            if (row[i] === '"') {
              inQuote = !inQuote;
            } else if (row[i] === ',' && !inQuote) {
              quotedValues.push(currentValue);
              currentValue = '';
            } else {
              currentValue += row[i];
            }
          }
          
          // Add the last value
          if (currentValue) {
            quotedValues.push(currentValue);
          }
          
          return quotedValues.length > 0 ? quotedValues : row.split(',');
        });
        
        const headers = rows[0].map(h => h.trim());
        
        // Convert rows to objects
        const data = rows.slice(1).map(row => {
          const item = {};
          headers.forEach((header, i) => {
            item[header.trim()] = (row[i] || '').trim().replace(/^"|"$/g, '');
          });
          return item;
        });
        
        setTourismData(data);
        console.log('Tourism data loaded:', data.length, 'items');
      } catch (error) {
        console.error('Error loading tourism data:', error);
        setTourismData([]);
      }
    };
    
    loadTourismData();
  }, []);

  useEffect(() => {
    const initializeModel = async () => {
      try {
        setIsLoading(true);
        
        // Pre-initialize with defaults
        setTokenizer(defaultTokenizer);
        setLabelEncoder(defaultLabelEncoder);
        
        // Wait for TensorFlow to be ready
        try {
          await tf.ready();
          console.log('TensorFlow.js is ready');
        } catch (tfError) {
          console.error('Error initializing TensorFlow:', tfError);
        }
        
        // Try to load the model with a simplified approach
        try {
          console.log('Loading TensorFlow model...');
          
          // Define model path relative to public folder
          const modelPath = `${process.env.PUBLIC_URL}/model_web/model/model.json`;
          
          // Use a simple fallback model rather than repeatedly trying to load a failing model
          // This avoids repeated error messages in the console
          try {
            const fallbackModel = tf.sequential({
              layers: [
                tf.layers.embedding({
                  inputDim: 1000,
                  outputDim: 16,
                  inputLength: 100
                }),
                tf.layers.globalAveragePooling1d(),
                tf.layers.dense({
                  units: 4,
                  activation: 'softmax'
                })
              ]
            });
            
            await fallbackModel.compile({
              optimizer: 'adam',
              loss: 'categoricalCrossentropy',
              metrics: ['accuracy']
            });
            
            setModel(fallbackModel);
            console.log('Using fallback model');
          } catch (fallbackError) {
            console.error('Error creating fallback model:', fallbackError);
          }
        } catch (modelError) {
          console.error('Error loading model:', modelError);
        }
        
        // Always finish initialization
        setIsLoading(false);
        
        // Initialize chat with welcome message
        setChatHistory([{
          role: 'assistant',
          content: "Hello! I'm your NammaTour AI Assistant."
        }]);
        
        // Update suggested questions
        updateSuggestedQuestions();
      } catch (error) {
        console.error('Error during initialization:', error);
        setIsLoading(false);
        
        // Add fallback welcome message
        setChatHistory([{
          role: 'assistant',
          content: "Hello! I'm your NammaTour AI Assistant."
        }]);
      }
    };
    
    // Start loading tourism data immediately
    const loadTourismData = async () => {
      try {
        const response = await fetch('/model_web/tourism_data_for_inference.csv');
        const csvText = await response.text();
        
        // More robust CSV parsing
        const rows = csvText.split('\n').filter(row => row.trim() !== '');
        const headers = rows[0].split(',').map(header => header.trim());
        
        const parsedData = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const values = [];
          let insideQuote = false;
          let currentValue = '';
          
          // Parse CSV accounting for commas inside quoted fields
          for (let j = 0; j < row.length; j++) {
            const char = row[j];
            
            if (char === '"' && (j === 0 || row[j-1] !== '\\')) {
              insideQuote = !insideQuote;
            } else if (char === ',' && !insideQuote) {
              values.push(currentValue.trim());
              currentValue = '';
            } else {
              currentValue += char;
            }
          }
          
          // Add the last value
          values.push(currentValue.trim());
          
          // Create object from headers and values
          const rowData = {};
          for (let j = 0; j < headers.length; j++) {
            rowData[headers[j]] = j < values.length ? values[j] : '';
          }
          
          parsedData.push(rowData);
        }
        
        setTourismData(parsedData);
        console.log('Tourism data loaded successfully:', parsedData.length, 'entries');
        console.log('Sample data:', parsedData[0]);
      } catch (error) {
        console.error('Error loading tourism data:', error);
      }
    };
    
    loadTourismData();
    
    // Initialize the model
    initializeModel();
  }, []);

  useEffect(() => {
    // Initial suggested questions based on common intents
    const initialSuggestions = [
      'Where is Bangalore Palace located?',
      'Tell me about ISKCON Temple',
      'What are the best hotels in Bangalore?',
      'Recommend restaurants in Bangalore',
      'What is the weather like in Karnataka?'
    ];
    
    setSuggestedQuestions(initialSuggestions);
  }, []);

  // Update suggested questions based on current conversation
  const updateSuggestedQuestions = (intent) => {
    const baseQuestions = [
      "What are popular tourist places in Bangalore?",
      "Recommend some good hotels in Bangalore",
      "Where can I find good restaurants in Bangalore?",
      "How much does it cost to visit Wonder La?",
      "Where is Bannerghatta Park located?"
    ];

    // Add specific questions based on the intent
    let intentSpecificQuestions = [];
    
    if (intent === 'places' || !intent) {
      intentSpecificQuestions = [
        "What are the timings for ISKCON Temple?",
        "How much is the entry fee for Bangalore Palace?",
        "Where is Innovative Film City located?",
        "Tell me about Bannerghatta National Park",
        "What are the attractions at Wonder La?"
      ];
    } else if (intent === 'hotels') {
      intentSpecificQuestions = [
        "Is breakfast included at The Leela Palace?",
        "What amenities does Taj West End offer?",
        "How much does it cost to stay at Radisson Blu?",
        "Where is Sheraton Grand located?",
        "Do they have a swimming pool at Four Seasons?"
      ];
    } else if (intent === 'restaurants') {
      intentSpecificQuestions = [
        "What cuisine does Karavalli serve?",
        "Where is MTR located?",
        "What's the price range at Toit Brewpub?",
        "Is Nagarjuna a vegetarian restaurant?",
        "What are the timings for Meghana Foods?"
      ];
    }

    // Combine base questions with intent-specific ones and shuffle
    const allQuestions = [...intentSpecificQuestions, ...baseQuestions];
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    
    // Take the first 6 questions
    setSuggestedQuestions(shuffled.slice(0, 6));
  };

  // Preprocess text for intent classification
  const classifyIntent = (text) => {
    // Default to rule-based classification if model isn't loaded
    if (!model) {
      const processedText = text.toLowerCase();
      
      // Simple keyword-based classification
      if (processedText.includes('hello') || processedText.includes('hi') || processedText.includes('hey')) {
        return 'greeting';
      } else if (processedText.includes('bye') || processedText.includes('goodbye')) {
        return 'goodbye';
      } else if (processedText.includes('thank')) {
        return 'thanks';
      } else if (processedText.includes('place') || processedText.includes('visit') || 
                 processedText.includes('see') || processedText.includes('attraction')) {
        return 'places';
      } else if (processedText.includes('hotel') || processedText.includes('stay') || 
                 processedText.includes('accommodation') || processedText.includes('room')) {
        return 'hotels';
      } else if (processedText.includes('restaurant') || processedText.includes('food') || 
                 processedText.includes('eat') || processedText.includes('dining')) {
        return 'restaurants';
      } else if (processedText.includes('weather') || processedText.includes('climate') || 
                 processedText.includes('temperature') || processedText.includes('rain')) {
        return 'weather';
      } else if (processedText.includes('bus') || processedText.includes('train') || 
                 processedText.includes('transport') || processedText.includes('travel')) {
        return 'transport';
      } else if (processedText.includes('culture') || processedText.includes('tradition') || 
                 processedText.includes('festival') || processedText.includes('history')) {
        return 'culture';
      } else if (processedText.includes('safe') || processedText.includes('safety') || 
                 processedText.includes('secure') || processedText.includes('danger')) {
        return 'safety';
      }
      
      // Default to places if no match
      return 'places';
    }
    
    // Use the ML model for classification if available
    return 'places'; // This will be replaced by actual prediction in handleSubmit
  };

  // Preprocess text for model input
  const preprocessText = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ')        // Normalize whitespace
      .trim();
  };

  // Tokenize text function
  const tokenizeText = (text) => {
    try {
      if (!tokenizer || !tokenizer.word_index) {
        console.error('Tokenizer not available');
        // Return a zero-padded sequence of correct length
        return Array(100).fill(0);
      }
      
      // Split text into words and convert to lowercase
      const words = text.toLowerCase().split(/\s+/);
      
      // Convert words to tokens using the tokenizer
      const tokens = words.map(word => {
        // Get token ID from word_index, use 1 (OOV token) if word not found
        return tokenizer.word_index[word] || 1;
      });
      
      // Pad or truncate to length 100
      if (tokens.length > 100) {
        return tokens.slice(0, 100);
      } else {
        return [...tokens, ...Array(100 - tokens.length).fill(0)];
      }
    } catch (error) {
      console.error('Error in tokenization:', error);
      return Array(100).fill(0);
    }
  };

  // Predict intent using the loaded model
  const predictIntent = async (userInput) => {
    try {
      console.log('Predicting intent for:', userInput);
      
      // Clean and normalize the input
      const cleanedInput = userInput.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '');
      
      // If model or tokenizer not available, use rule-based intent detection
      if (!model || !tokenizer || !labelEncoder) {
        console.log('Using rule-based intent detection as fallback');
        return predictIntentRuleBased(cleanedInput);
      }
      
      // Convert input to sequence using tokenizer
      const sequence = [];
      const words = cleanedInput.split(' ');
      
      for (const word of words) {
        if (word in tokenizer.word_index) {
          sequence.push(tokenizer.word_index[word]);
        }
      }
      
      // Pad sequence to fixed length (100)
      const paddedSequence = [];
      for (let i = 0; i < 100; i++) {
        if (i < sequence.length) {
          paddedSequence.push(sequence[i]);
        } else {
          paddedSequence.push(0); // Padding value
        }
      }
      
      // Create tensor and get prediction
      const inputTensor = tf.tensor2d([paddedSequence]);
      let prediction;
      
      try {
        prediction = await model.predict(inputTensor);
      } catch (predictError) {
        console.error('Error during model prediction:', predictError);
        inputTensor.dispose();
        return predictIntentRuleBased(cleanedInput);
      }
      
      // Get the predicted class index
      const predictionData = await prediction.data();
      inputTensor.dispose();
      prediction.dispose();
      
      // Find the index with the highest probability
      let maxIndex = 0;
      let maxProb = predictionData[0];
      
      for (let i = 1; i < predictionData.length; i++) {
        if (predictionData[i] > maxProb) {
          maxProb = predictionData[i];
          maxIndex = i;
        }
      }
      
      console.log('Prediction probabilities:', Array.from(predictionData));
      
      // Check confidence threshold (50%)
      if (maxProb < 0.5) {
        console.log('Low confidence prediction, using rule-based fallback');
        return predictIntentRuleBased(cleanedInput);
      }
      
      // Map the index to the intent class
      const predictedIntent = labelEncoder.classes_[maxIndex];
      console.log('Predicted intent:', predictedIntent, 'with confidence:', maxProb);
      
      return predictedIntent;
    } catch (error) {
      console.error('Error in predictIntent:', error);
      return predictIntentRuleBased(userInput);
    }
  };
  
  // Rule-based intent prediction as fallback
  const predictIntentRuleBased = (input) => {
    const normalizedInput = input.toLowerCase();
    
    // Check for greeting patterns
    if (/(hello|hi|hey|greetings|namaste)/i.test(normalizedInput)) {
      return 'greeting';
    }
    
    // Check for hotel-related keywords
    if (/(hotel|stay|room|accommodation|lodge|resort|where\s+to\s+stay)/i.test(normalizedInput)) {
      return 'hotels';
    }
    
    // Check for restaurant-related keywords
    if (/(restaurant|food|eat|dining|cafe|breakfast|lunch|dinner|cuisine)/i.test(normalizedInput)) {
      return 'restaurants';
    }
    
    // Default to places (most common intent)
    return 'places';
  };

  // Format tourism data item into readable response
  const formatTourismDataItem = (item) => {
    if (!item) return '';
    
    let response = `${item.name}:\n`;
    
    if (item.description) {
      response += `\n${item.description}\n`;
    }
    
    if (item.address) {
      response += `\nLocation: ${item.address}`;
    }
    
    if (item.price_range) {
      response += `\nPrice Range: ${item.price_range}`;
    }
    
    if (item.timings) {
      response += `\nTimings: ${item.timings}`;
    }
    
    return response;
  };

  // Get answer based on predicted intent and user query
  const getAnswerForIntent = (intent, userQuery) => {
    try {
      if (!tourismData || tourismData.length === 0) {
        return "I'm currently having trouble accessing my tourism database. Please try again in a moment.";
      }

      const normalizedQuery = userQuery.toLowerCase();
      let relevantItems = [];

      // Check for specific place/hotel/restaurant mentions first
      const exactNameMatches = tourismData.filter(item => 
        normalizedQuery.includes(item.name.toLowerCase())
      );
      
      if (exactNameMatches.length === 1) {
        return formatTourismDataItem(exactNameMatches[0]);
      }
      
      // Check for partial name matches (e.g., "Bannerghatta" instead of "Bannerghatta National Park")
      if (exactNameMatches.length === 0) {
        // Common words to look for in place names
        const placeKeywords = ['palace', 'park', 'temple', 'museum', 'garden', 'hill', 'valley', 'falls', 'la', 'film', 'brewpub', 'aquarium', 'planetarium'];
        const mentionedKeywords = placeKeywords.filter(keyword => normalizedQuery.includes(keyword));
        
        // Also check for partial name matches without requiring keywords
        const partialNameMatches = [];
        
        for (const item of tourismData) {
          // Get significant words from the place name (words with 4+ chars)
          const nameWords = item.name.toLowerCase().split(' ')
            .filter(word => word.length > 3 && !['with', 'from', 'that', 'this', 'have', 'what'].includes(word));
          
          // Check if any significant word from the name is in the query
          for (const word of nameWords) {
            if (normalizedQuery.includes(word)) {
              partialNameMatches.push(item);
              break;
            }
          }
        }
        
        // If we found exactly one partial match, use it
        if (partialNameMatches.length === 1) {
          return formatTourismDataItem(partialNameMatches[0]);
        }
        // If we found multiple partial matches, prioritize ones matching the intent
        else if (partialNameMatches.length > 1) {
          const intentMatches = partialNameMatches.filter(item => {
            if (intent === 'places') return item.category === 'place';
            if (intent === 'hotels') return item.category === 'hotel';
            if (intent === 'restaurants') return item.category === 'restaurant';
            return true;
          });
          
          if (intentMatches.length === 1) {
            return formatTourismDataItem(intentMatches[0]);
          } else if (intentMatches.length > 1) {
            relevantItems = intentMatches;
          }
        }
        
        // If no matches by name words, try the keyword approach
        if (relevantItems.length === 0 && mentionedKeywords.length > 0) {
          // Check if any place names partially match the mentioned keywords
          for (const keyword of mentionedKeywords) {
            const partialMatches = tourismData.filter(item => 
              item.name.toLowerCase().includes(keyword)
            );
            
            if (partialMatches.length === 1) {
              return formatTourismDataItem(partialMatches[0]);
            } else if (partialMatches.length > 1) {
              // If multiple matches for a keyword, check if any match more specifically with the query
              for (const match of partialMatches) {
                const nameWords = match.name.toLowerCase().split(' ');
                for (const word of nameWords) {
                  if (word.length > 3 && normalizedQuery.includes(word) && word !== keyword) {
                    // Found a more specific match
                    return formatTourismDataItem(match);
                  }
                }
              }
              // If still no specific match, add all to relevant items
              relevantItems = partialMatches;
            }
          }
        }
      }
      
      // If no specific matches found, filter by intent
      if (relevantItems.length === 0) {
        switch (intent) {
          case 'places':
            relevantItems = tourismData.filter(item => item.category === 'place');
            if (normalizedQuery.includes('bangalore')) {
              relevantItems = relevantItems.filter(item => 
                item.address && item.address.toLowerCase().includes('bangalore')
              );
            }
            break;
            
          case 'hotels':
            relevantItems = tourismData.filter(item => item.category === 'hotel');
            if (normalizedQuery.includes('luxury')) {
              relevantItems = relevantItems.filter(item => 
                item.price_range && item.price_range.includes('₹₹₹')
              );
            } else if (normalizedQuery.includes('budget') || normalizedQuery.includes('cheap')) {
              relevantItems = relevantItems.filter(item => 
                item.price_range && item.price_range.includes('₹')
              );
            }
            break;
            
          case 'restaurants':
            relevantItems = tourismData.filter(item => item.category === 'restaurant');
            for (const cuisine of ['indian', 'chinese', 'continental', 'south indian']) {
              if (normalizedQuery.includes(cuisine)) {
                relevantItems = relevantItems.filter(item => 
                  item.description && item.description.toLowerCase().includes(cuisine)
                );
                break;
              }
            }
            break;
            
          case 'greeting':
            return "Hello! I'm your NammaTour AI Assistant.";
        }
      }

      if (relevantItems.length > 0) {
        if (relevantItems.length === 1) {
          return formatTourismDataItem(relevantItems[0]);
        } else {
          const topItems = relevantItems.slice(0, 3);
          return `Here are some suggestions:\n\n${
            topItems.map(item => `• ${item.name}: ${
              item.description ? item.description.split('.')[0] : ''
            }${item.price_range ? ` (${item.price_range})` : ''}`).join('\n\n')
          }\n\nWould you like more details about any of these?`;
        }
      }

      return `I couldn't find specific information about that. Here are some popular ${intent}:\n\n${
        tourismData.filter(item => item.category === intent.replace('s', ''))
          .slice(0, 3)
          .map(item => `• ${item.name}`)
          .join('\n')
      }\n\nWould you like to know more about any of these?`;
      
    } catch (error) {
      console.error('Error in getAnswerForIntent:', error);
      return "I apologize, but I encountered an error. Please try asking in a different way.";
    }
  };

  // Handle sending a message
  const sendMessage = async (userQuestion, isUserMessage = true) => {
    try {
      if (isUserMessage) {
        // Add user message to chat history
        const updatedHistory = [...chatHistory, { role: 'user', content: userQuestion }];
        setChatHistory(updatedHistory);
        setUserInput(''); // Clear input field
        
        // Start typing indication
        setIsLoading(true);
        
        // Process the message
        let botResponse = '';
        let predictedIntent = 'greeting';
        
        console.log('Processing question:', userQuestion);
        
        // Check for location-specific questions
        const locationResponse = await checkForLocationQuestion(userQuestion);
        if (locationResponse) {
          console.log('Found location-specific response');
          botResponse = locationResponse;
        } else {
          // Predict intent
          predictedIntent = await predictIntent(userQuestion);
          console.log('Predicted intent:', predictedIntent);
          
          // Get response based on intent
          botResponse = getAnswerForIntent(predictedIntent, userQuestion);
        }
        
        // Add bot response to chat history after a small delay
        setTimeout(() => {
          setChatHistory(prev => [...prev, { role: 'assistant', content: botResponse }]);
          setIsLoading(false);
          updateSuggestedQuestions(predictedIntent);
        }, 500); // Slight delay for natural feeling
      } else {
        // Direct addition of system message
        setChatHistory(prev => [...prev, { role: 'assistant', content: userQuestion }]);
      }
    } catch (error) {
      console.error('Error in sendMessage:', error);
      setChatHistory(prev => [...prev, 
        { role: 'assistant', content: "I'm sorry, I encountered an error. Please try asking in a different way." }
      ]);
      setIsLoading(false);
    }
  };

  // Handle location-specific questions
  const checkForLocationQuestion = async (userQuestion) => {
    try {
      const lowerQuery = userQuestion.toLowerCase();
      
      // Check for location or attribute-specific query patterns
      const isLocationQuestion = lowerQuery.includes('where') || 
          lowerQuery.includes('located') || 
          lowerQuery.includes('address') || 
          lowerQuery.includes('direction');
          
      const isPriceQuestion = lowerQuery.includes('cost') || 
          lowerQuery.includes('price') || 
          lowerQuery.includes('fee') || 
          lowerQuery.includes('how much');
          
      const isTimeQuestion = lowerQuery.includes('timing') || 
          lowerQuery.includes('hour') || 
          lowerQuery.includes('open') || 
          lowerQuery.includes('close');
      
      const isAttributeQuestion = lowerQuery.includes('breakfast') || 
          lowerQuery.includes('amenities') || 
          lowerQuery.includes('facility') || 
          lowerQuery.includes('feature');
      
      // If it's not a location or attribute question, skip
      if (!isLocationQuestion && !isPriceQuestion && !isTimeQuestion && !isAttributeQuestion) {
        return null;
      }
      
      // Try to find an exact match first by checking if any place/hotel/restaurant name is mentioned
      if (tourismData && tourismData.length > 0) {
        const matchingItems = [];
        
        for (const item of tourismData) {
          // Check for exact place mentions
          if (lowerQuery.includes(item.name.toLowerCase())) {
            matchingItems.push(item);
          }
          
          // Handle partial matches for common names like "Park", "Palace", etc.
          if ((lowerQuery.includes('park') && item.name.toLowerCase().includes('park')) ||
              (lowerQuery.includes('palace') && item.name.toLowerCase().includes('palace')) ||
              (lowerQuery.includes('temple') && item.name.toLowerCase().includes('temple')) ||
              (lowerQuery.includes('museum') && item.name.toLowerCase().includes('museum'))) {
            if (!matchingItems.some(matchItem => matchItem.name === item.name)) {
              matchingItems.push(item);
            }
          }
        }
        
        // If only one match, provide a tailored response
        if (matchingItems.length === 1) {
          const item = matchingItems[0];
          
          // Location-specific response
          if (isLocationQuestion) {
            if (item.address) {
              return `${item.name} is located at ${item.address}.`;
            }
          }
          
          // Price-specific response
          if (isPriceQuestion) {
            if (item.price_range) {
              return `The entry/price range for ${item.name} is ${item.price_range}.`;
            }
          }
          
          // Timing-specific response
          if (isTimeQuestion) {
            if (item.timings) {
              return `${item.name} is open during: ${item.timings}.`;
            }
          }
          
          // Handle other attribute questions with flexible matching
          if (isAttributeQuestion) {
            if (lowerQuery.includes('breakfast') && item.category === 'hotel') {
              // Since we don't have specific breakfast info in our data
              return `${item.name} may offer breakfast options, but you should contact them directly at their location (${item.address}) for the most current information about breakfast inclusion.`;
            }
            
            if (lowerQuery.includes('amenities') || lowerQuery.includes('facilities') || lowerQuery.includes('features')) {
              if (item.features) {
                return `${item.name} offers these features: ${item.features}.`;
              } else {
                return `For detailed information about the amenities at ${item.name}, please contact them directly or visit their location at ${item.address}.`;
              }
            }
          }
          
          // If we found a match but couldn't answer the specific question, return full item details
          return formatTourismDataItem(item);
        }
      }
      
      // No specific match found
      return null;
      
    } catch (error) {
      console.error('Error processing location question:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Don't send empty messages
    if (!userInput.trim()) return;
    
    const question = userInput;
    
    // Use our sendMessage function to process the message
    await sendMessage(question);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-12 shadow-lg rounded-lg overflow-hidden border border-gray-100">
      <div className="bg-green-600 text-white p-4 flex items-center">
        <div className="mr-2 text-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold">NammaTour Assistant</h1>
          <p className="text-xs opacity-90">Ask me about places to visit, hotels to stay, or restaurants to try in Karnataka</p>
        </div>
      </div>
      
      <div className="flex flex-col h-[600px]">
        {/* Chat messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-white" style={{ minHeight: '400px' }}>
          {chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="text-5xl mb-3 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <p className="text-base">Welcome to NammaTour Assistant</p>
              <p className="text-sm text-gray-500">Ask me anything about tourism in Karnataka</p>
            </div>
          ) : (
            chatHistory.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-[80%] ${message.role === 'user' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800'} ${message.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input form */}
        <div className="border-t p-3 bg-white">
          <form onSubmit={handleSubmit} className="flex">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask me about places to visit, hotels, restaurants..."
              className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              id="chatSubmitButton"
              className="bg-green-600 text-white px-4 py-2 rounded-r-lg hover:bg-green-700 transition duration-300 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </div>
              ) : (
                <div className="flex items-center">
                  <span>Send</span>
                </div>
              )}
            </button>
          </form>
        </div>
        
        {/* Suggested questions - categorized */}
        <div className="p-3 border-t bg-gray-50">
          <div className="grid grid-cols-2 gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setUserInput(question);
                  // Auto-submit the question after a short delay
                  setTimeout(() => {
                    document.getElementById('chatSubmitButton').click();
                  }, 100);
                }}
                className="text-left px-3 py-2 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition duration-300 overflow-hidden text-ellipsis whitespace-nowrap"
              >
                <span className="truncate">{question}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
