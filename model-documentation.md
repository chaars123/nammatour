# NammaTour AI Model Documentation

## Overview

The NammaTour application integrates an AI-powered chatbot that assists users with tourism-related queries about Karnataka, India. This document explains the machine learning model implementation, its architecture, and how it's integrated into the application.

## Model Development and Export Process

### Training in Google Colab

The intent classification model was originally developed and trained in Google Colab using Python and TensorFlow/Keras. The training process involved:

1. **Data Preparation**:
   - Collection of sample tourism queries and labeling them with intents (places, hotels, restaurants, greeting)
   - Text preprocessing including lowercasing, removing special characters, and tokenization
   - Converting text data into numerical sequences using a word index tokenizer

2. **Model Architecture**:
   - Sequential neural network with the following layers:
   ```python
   model = Sequential([
       Embedding(vocab_size, 16, input_length=max_length),
       GlobalAveragePooling1D(),
       Dense(4, activation='softmax')
   ])
   ```

3. **Training**:
   - Optimization using Adam optimizer
   - Categorical cross-entropy loss function
   - Training for 20 epochs with validation split of 20%
   - Early stopping to prevent overfitting

### Exporting for TensorFlow.js

To use the trained model in a web application, it was converted to TensorFlow.js format:

1. **Model Conversion**:
   ```python
   # Save the Keras model
   model.save('tourism_intent_model')
   
   # Convert to TensorFlow.js format
   !tensorflowjs_converter --input_format=keras /content/tourism_intent_model /content/model_web/model
   ```

2. **Tokenizer and Label Encoder Export**:
   ```python
   # Save tokenizer
   tokenizer_json = tokenizer.to_json()
   with open('/content/model_web/tokenizer.json', 'w') as f:
       f.write(tokenizer_json)
   
   # Save label encoder
   label_encoder_json = {'classes_': label_encoder.classes_.tolist()}
   with open('/content/model_web/label_encoder.json', 'w') as f:
       json.dump(label_encoder_json, f)
   ```

3. **File Structure**:
   The exported files include:
   - `model.json`: Model architecture and metadata
   - `group1-shard1of1.bin`: Model weights as binary file
   - `tokenizer.json`: Word index mapping for text preprocessing
   - `label_encoder.json`: Intent class mapping

## Project Files and Structure

### Model Files

The TensorFlow.js model and related files are stored in the `public/model_web/` directory:

```
public/model_web/
├── model/
│   ├── model.json               # Model architecture
│   └── group1-shard1of1.bin     # Model weights
├── tokenizer.json               # Word tokenizer
├── label_encoder.json           # Intent labels
└── tourism_data_for_inference.csv # Tourism data
```

### Implementation Files

The main files involved in the AI implementation are:

1. **`src/pages/ChatAI.js`**: Core implementation of the chatbot interface and model integration
   - Model loading and initialization
   - Intent prediction logic
   - Response generation based on intents
   - User interaction handling

2. **`src/pages/AISearch.js`**: Search functionality using the same tourism data
   - Text-based search across tourism entries
   - Filtering and sorting results

## Machine Learning Algorithm

The model uses a **text classification** approach with the following techniques:

### 1. Word Embeddings

The first layer of the model is an embedding layer that converts words (represented as integers) into dense vector representations. This is a form of **representation learning** where:

- Each word is mapped to a 16-dimensional vector
- Words with similar meanings have vectors that are closer in the embedding space
- This reduces dimensionality and captures semantic relationships

### 2. Global Average Pooling

After embedding, a global average pooling layer computes the mean of all word vectors in the sequence. This:

- Reduces the variable-length input to a fixed-length representation
- Makes the model robust to input length variations
- Captures the overall semantic meaning of the text

### 3. Dense Classification Layer

The final layer is a dense layer with softmax activation that performs multi-class classification:

- 4 output neurons corresponding to the 4 intent classes
- Softmax activation ensures outputs sum to 1 (interpretable as probabilities)
- The highest probability intent is selected as the prediction

### Algorithm Classification

This is a **Neural Network** approach, specifically a shallow neural network for text classification. It combines elements of:

- **Natural Language Processing** (NLP) for text understanding
- **Deep Learning** through the use of neural network layers
- **Transfer Learning** concepts in the word embedding space

## Detailed Implementation Workflow

### 1. Model Loading Process

```javascript
// Model loading in ChatAI.js
const modelPath = `${process.env.PUBLIC_URL}/model_web/model/model.json`;

try {
  loadedModel = await tf.loadLayersModel(modelPath, {
    strict: false,
    onProgress: (fraction) => {
      console.log(`Model loading progress: ${(fraction * 100).toFixed(1)}%`);
    }
  });
} catch (error) {
  // Fallback to alternative loading or create a simple backup model
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
}
```

### 2. Tokenization Process

```javascript
// Convert user input to token sequence
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
```

### 3. Prediction Process

```javascript
// Create tensor and get prediction
const inputTensor = tf.tensor2d([paddedSequence]);
const prediction = await model.predict(inputTensor);

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

// Map to intent class
const predictedIntent = labelEncoder.classes_[maxIndex];
```

### 4. Response Generation

After intent prediction, the system uses the `getAnswerForIntent` function to generate appropriate responses:

```javascript
const getAnswerForIntent = (intent, userQuery) => {
  // Check for specific location/entity mentions
  const exactNameMatches = tourismData.filter(item => 
    userQuery.toLowerCase().includes(item.name.toLowerCase())
  );
  
  if (exactNameMatches.length === 1) {
    return formatTourismDataItem(exactNameMatches[0]);
  }
  
  // Check for partial matches
  // ... partial matching logic ...
  
  // Filter by intent if no specific match
  if (relevantItems.length === 0) {
    switch (intent) {
      case 'places':
        // Return relevant places
      case 'hotels':
        // Return relevant hotels
      case 'restaurants':
        // Return relevant restaurants
      case 'greeting':
        // Return greeting message
    }
  }
  
  // Format and return response
}
```

## Usage Instructions

To use the AI model in the NammaTour application:

1. **Setup**:
   - Ensure the model files are in the correct directories under public/model_web/
   - The application must have access to TensorFlow.js library (included in package.json)

2. **Running the Model**:
   - The model loads automatically when the ChatAI component mounts
   - User queries are processed through the predictIntent function
   - Responses are generated based on intent and tourism data

3. **Testing**:
   - Test with various tourism queries about Karnataka
   - Monitor console logs for prediction probabilities and confidence levels
   - The system should gracefully handle cases where the model fails to load

## Performance and Limitations

1. **Performance**:
   - The model is lightweight enough to run in a browser environment
   - Initial loading may take a few seconds depending on network speed
   - Inference time is typically under 100ms per query

2. **Limitations**:
   - Limited to four intent categories
   - May struggle with complex or ambiguous queries
   - Requires fallback mechanisms for low-confidence predictions

3. **Error Handling**:
   - Multiple fallback layers ensure the chatbot functions even if model loading fails
   - Rule-based intent detection serves as a reliable backup
   - Default responses are provided when specific information isn't found

## Enhancement Opportunities

1. **Model Improvements**:
   - Train on a larger and more diverse dataset
   - Implement more complex model architectures (LSTM or Transformer-based)
   - Add more intent categories for finer-grained understanding

2. **Technical Enhancements**:
   - Implement model quantization to reduce size
   - Add support for offline usage with IndexedDB
   - Implement progressive loading for better user experience

## Model Architecture

### Intent Classification Model

The core AI functionality of NammaTour's chatbot is built using a neural network implemented with TensorFlow.js for intent classification. The model architecture consists of:

1. **Input Layer**: Accepts tokenized and padded text sequences of length 100
2. **Embedding Layer**: Converts token IDs into dense vector representations (embedding dimension: 16)
3. **Global Average Pooling Layer**: Reduces the dimensionality by taking the average of the embedding vectors
4. **Output Layer**: Dense layer with softmax activation to classify intents into four categories

```javascript
const model = tf.sequential({
  layers: [
    tf.layers.embedding({
      inputDim: 1000,  // Vocabulary size
      outputDim: 16,   // Embedding dimension
      inputLength: 100 // Max sequence length
    }),
    tf.layers.globalAveragePooling1d(),
    tf.layers.dense({
      units: 4,        // Number of intent classes
      activation: 'softmax'
    })
  ]
});
```

## AI Components

### 1. Tokenizer

The tokenizer converts text into numerical sequences that the model can process:

- **Word Index**: Maps words to unique integer IDs
- **Sequence Creation**: Converts input text into sequences of token IDs
- **Padding**: Ensures all sequences are of uniform length (100)

### 2. Label Encoder

The label encoder maps between intent labels and their numerical representations:

- **Classes**: ['greeting', 'hotels', 'places', 'restaurants']
- **Mapping**: Converts model output indices back to meaningful intent labels

### 3. Intent Prediction

The intent prediction flow works as follows:

1. User input is cleaned and tokenized
2. Tokens are converted to a numeric sequence
3. Sequence is padded to a fixed length
4. TensorFlow.js model performs prediction
5. Prediction probabilities are analyzed
6. Highest probability intent is selected if confidence is above threshold (50%)
7. Fallback to rule-based intent detection if confidence is low

```javascript
const predictIntent = async (userInput) => {
  // Clean input
  const cleanedInput = userInput.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '');
  
  // Tokenize and pad
  const sequence = [];
  // ... tokenization logic ...
  
  // Model prediction
  const inputTensor = tf.tensor2d([paddedSequence]);
  const prediction = await model.predict(inputTensor);
  
  // Get highest probability intent
  // ... probability analysis ...
  
  return predictedIntent;
};
```

### 4. Rule-Based Fallback

For cases where the model's confidence is low or the model fails to load, a rule-based intent classification system is implemented:

```javascript
const predictIntentRuleBased = (input) => {
  const normalizedInput = input.toLowerCase();
  
  // Check for greeting patterns
  if (/(hello|hi|hey|greetings|namaste)/i.test(normalizedInput)) {
    return 'greeting';
  }
  
  // Check for hotel-related keywords
  if (/(hotel|stay|room|accommodation|lodge|resort)/i.test(normalizedInput)) {
    return 'hotels';
  }
  
  // ... other intent patterns ...
  
  // Default to places
  return 'places';
};
```

## Tourism Data Integration

The AI model works in conjunction with structured tourism data to provide specific information about places, hotels, and restaurants in Karnataka:

- **Data Format**: CSV with categories, names, descriptions, locations, ratings, etc.
- **Entity Matching**: The system uses partial name matching to identify entities mentioned in user queries
- **Response Generation**: Based on the identified intent and entities, the system generates appropriate responses

## Model Loading and Initialization

The model is loaded and initialized when the ChatAI component mounts:

1. Pre-initialization with default tokenizer and label encoder
2. TensorFlow.js initialization
3. Model loading from JSON file with fallback mechanisms
4. Error handling for model loading failures
5. Creation of a fallback model if needed

## Optimization Techniques

1. **Early Initialization**: Default structures are set up immediately
2. **Error Handling**: Comprehensive error catching at all stages
3. **Fallback Mechanisms**: Multiple approaches to ensure the system works even if components fail
4. **Confidence Thresholds**: Only use model predictions when confidence is high enough

## Integration with UI

The model is integrated into the ChatAI component, which handles:

1. User input processing
2. Intent prediction using the TensorFlow.js model
3. Response generation based on intent and query analysis
4. Displaying responses to the user with appropriate formatting

## Future Improvements

1. **Model Retraining**: Capability to retrain the model with user interactions
2. **Enhanced Entity Recognition**: Improved matching for places and attractions
3. **Multi-turn Conversations**: Better context handling for follow-up questions
4. **Multilingual Support**: Adding Kannada language capabilities
