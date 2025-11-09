import { GoogleGenerativeAI } from '@google/generative-ai';

// Google Gemini API Key
const GEMINI_API_KEY = 'AIzaSyCaqNblz24c7M2nX0XtAzZxGxByfhKdWsY';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Using Gemini 2.5 Flash - Best price-performance model for text generation
export const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp', // Latest experimental model
  generationConfig: {
    temperature: 0.9,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048,
  },
});
