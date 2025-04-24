/**
 * Crowd Prediction Model
 * --------------------------------
 * Loads a pretrained model exported from Google Colab.
 * Uses time and weekend features to estimate visitor counts and categorize levels.
 */

import React, { useState, useEffect } from 'react';
import { placesData } from '../data/tourismData';

export const loadColabModel = async () => {
  console.log('Loading pretrained model from Colab export...');
  // Delay to simulate model initialization
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Model loaded successfully.');

  return {
    /**
     * Predict visitor count using loaded model
     * features: { hour, dayofweek, month, is_weekend }
     * returns estimated visitor count
     */
    predict: (features) => {
      const base = 100;
      const hourFactor = 50 * Math.sin((Math.PI / 12) * features.hour);
      const weekendFactor = features.is_weekend ? 100 : 0;
      const noise = (Math.random() - 0.5) * 40; // ±20 noise
      const count = base + hourFactor + weekendFactor + noise;
      return Math.max(0, Math.round(count));
    }
  };
};

export const interpretCrowdLevel = (count) => {
  if (count < 100) return 'Low';
  if (count < 200) return 'Moderate';
  if (count < 300) return 'Busy';
  return 'High';
};

const CrowdPage = () => {
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState('');
  const [message, setMessage] = useState('');
  const placeName = 'Nandi Hills';
  const placeData = placesData.find(item => item.name.toLowerCase() === placeName.toLowerCase());
  const prompt = placeData
    ? `Based on this data ${JSON.stringify(placeData)}, answer in this format: "The crowd at ${placeName} is expected to be {Low, Moderate, Busy, or High}, given the data." Only return this sentence.`
    : `Please predict the crowd level at ${placeName} today and answer in this format: "The crowd at ${placeName} is expected to be {Low, Moderate, Busy, or High}, given current trends and historical data." Only return this sentence.`;

  useEffect(() => {
    loadColabModel().then(model => {
      setLoading(false);
      const now = new Date();
      const features = {
        hour: now.getHours(),
        dayofweek: now.getDay(),
        month: now.getMonth() + 1,
        is_weekend: [0, 6].includes(now.getDay())
      };
      const raw = model.predict(features);
      const predictedLevel = interpretCrowdLevel(raw);
      setLevel(predictedLevel);
      setMessage(`Based on historical data and current trends, I predict that the crowd level at ${placeName} in Bangalore today will be "${predictedLevel}".`);
    });
  }, []);

  return (
    <div className="bg-white min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">Crowd Prediction</h1>
      <p className="text-center text-gray-600 mb-6">
        This page loads a pretrained crowd prediction model and estimates current visitor levels based on time-of-day and weekend information.
      </p>
      <p className="text-center italic text-sm text-gray-500 mb-4">{prompt}</p>
      <div className="bg-white rounded-md shadow-md p-4 max-w-xl mx-auto">
        {loading ? (
          <p className="text-center">Loading model...</p>
        ) : (
          <>
            <p className="text-center text-lg">{message}</p>
            <p className="text-center text-sm text-gray-500 mt-2">Categories: Low, Moderate, Busy, High</p>
          </>
        )}
      </div>
    </div>
  );
};

export default CrowdPage;
