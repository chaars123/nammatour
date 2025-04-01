from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import os
import re
import pickle
import spacy
import nltk
from sklearn.preprocessing import LabelEncoder

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes and origins
CORS(app, resources={r"/*": {"origins": "*", "allow_headers": "*", "methods": "*"}})

# Define paths relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model')
DATAFILE_PATH = os.path.join(BASE_DIR, 'data')

# Global variables for model and tokenizer
model = None
tokenizer = None
label_encoder = None
tourism_df = None
qa_df = None
nlp = None

# Function to load spaCy model
def load_spacy():
    global nlp
    try:
        nlp = spacy.load('en_core_web_sm')
        print("SpaCy model loaded successfully")
    except OSError:
        print("Downloading SpaCy model...")
        spacy.cli.download('en_core_web_sm')
        nlp = spacy.load('en_core_web_sm')
    except Exception as e:
        print(f"Error loading SpaCy model: {e}")
        # Fallback to simple tokenization if spaCy fails
        nlp = None

# NLTK downloads
def download_nltk_data():
    try:
        nltk.data.find('tokenizers/punkt')
    except LookupError:
        nltk.download('punkt')
    
    try:
        nltk.data.find('corpora/stopwords')
    except LookupError:
        nltk.download('stopwords')

# Function to load model and dependencies
def load_dependencies():
    global model, tokenizer, label_encoder, tourism_df, qa_df
    
    # Download NLTK data if needed
    download_nltk_data()
    
    # Load tokenizer
    with open(os.path.join(MODEL_PATH, 'tokenizer.pickle'), 'rb') as handle:
        tokenizer = pickle.load(handle)
    
    # Load label encoder
    with open(os.path.join(MODEL_PATH, 'label_encoder.pickle'), 'rb') as handle:
        label_encoder = pickle.load(handle)
    
    # Load TensorFlow model
    model = load_model(os.path.join(MODEL_PATH, 'bangalore_tourism_model.h5'))
    
    # Load tourism data
    tourism_df = pd.read_csv(os.path.join(DATAFILE_PATH, 'tourism_data_for_inference.csv'))
    qa_df = pd.read_csv(os.path.join(DATAFILE_PATH, 'qa_data_for_inference.csv'))
    
    print("Model and dependencies loaded successfully!")

# Predict category function
def predict_category(text):
    # Preprocess text
    sequence = tokenizer.texts_to_sequences([text])
    padded_sequence = pad_sequences(sequence, maxlen=50)
    
    # Predict category
    prediction = model.predict(padded_sequence)
    predicted_class = np.argmax(prediction, axis=1)[0]
    category = label_encoder.inverse_transform([predicted_class])[0]
    
    return category

# Get tourism information based on category and query
def get_tourism_info(category, query):
    if category == 'general':
        # For general queries, return a welcome message
        return {
            "response": "Welcome to Bangalore! Known as the 'Garden City' and 'Silicon Valley of India', Bangalore offers a perfect blend of tradition and modernity. The city is famous for its pleasant climate, beautiful parks, historic sites, and vibrant food scene. What specific aspect of Bangalore would you like to know more about?",
            "category": "general"
        }
    
    # Check if it's a question-answering query that matches our QA dataset
    for _, row in qa_df.iterrows():
        question = row['question'].lower()
        if similar_text(query.lower(), question) >= 0.7:  # Threshold for similarity
            return {
                "response": row['answer'],
                "category": category
            }
    
    # Filter tourism data by category
    if category in ['place', 'hotel', 'restaurant']:
        category_df = tourism_df[tourism_df['category'] == category]
        
        # Check if query mentions a specific name
        for _, row in category_df.iterrows():
            name = row['name'].lower()
            if name in query.lower() or similar_text(query.lower(), name) >= 0.8:
                return {
                    "response": generate_response_for_item(row),
                    "category": category
                }
        
        # If no specific name is mentioned, return top recommendations
        return {
            "response": generate_recommendations(category_df, category),
            "category": category
        }
    
    # Fallback response for unknown categories
    return {
        "response": "I'm not sure about that aspect of Bangalore. Would you like to know about popular places, hotels, or restaurants?",
        "category": "general"
    }

# Function to check text similarity
def similar_text(a, b):
    if nlp:
        # Use spaCy for better similarity comparison if available
        doc_a = nlp(a)
        doc_b = nlp(b)
        return doc_a.similarity(doc_b)
    else:
        # Basic word overlap similarity as fallback
        words_a = set(a.lower().split())
        words_b = set(b.lower().split())
        intersection = words_a.intersection(words_b)
        union = words_a.union(words_b)
        return len(intersection) / max(len(union), 1)

# Function to generate a response for a specific tourism item
def generate_response_for_item(item):
    if pd.isna(item['name']) or pd.isna(item['description']):
        return f"Sorry, I don't have enough information about this {item['category']}."
    
    response = f"**{item['name']}** - {item['description']}\n\n"
    
    if not pd.isna(item['address']):
        response += f"📍 **Address**: {item['address']}\n\n"
    
    if not pd.isna(item['timings_price']):
        response += f"⏰ **Hours/Price**: {item['timings_price']}\n\n"
    
    if not pd.isna(item['directions']):
        response += f"🚗 **Getting There**: {item['directions']}\n\n"
    
    if not pd.isna(item['map_url']):
        response += f"🗺️ [View on Map]({item['map_url']})"
    
    return response

# Function to generate recommendations for a category
def generate_recommendations(category_df, category_name):
    # Limit to top 5 recommendations
    top_items = category_df.head(5)
    
    category_plural = category_name + 's'  # Simple pluralization
    response = f"Here are some top {category_plural} in Bangalore:\n\n"
    
    for i, (_, item) in enumerate(top_items.iterrows(), 1):
        response += f"{i}. **{item['name']}** - {item['description'][:100]}...\n"
        if not pd.isna(item['address']):
            response += f"   📍 {item['address']}\n"
        response += "\n"
    
    response += f"\nWould you like more details about any of these {category_plural}?"
    
    return response

# API routes
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400
    
    try:
        # Predict category
        category = predict_category(user_message)
        print(f"Predicted category: {category}")
        
        # Get tourism information response
        result = get_tourism_info(category, user_message)
        
        return jsonify(result)
    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({
            "response": "Sorry, I encountered an error processing your request. Please try again.",
            "category": "general"
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Bangalore Tourism API is running"}), 200

# Main entry point
if __name__ == '__main__':
    # Create directories if they don't exist
    os.makedirs(MODEL_PATH, exist_ok=True)
    os.makedirs(DATAFILE_PATH, exist_ok=True)
    
    # Load spaCy and dependencies
    load_spacy()
    load_dependencies()
    
    # Get port from environment variable (for Render deployment)
    port = int(os.environ.get("PORT", 5000))
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=port, debug=False)