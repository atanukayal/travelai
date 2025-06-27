// src/api/gemini.ts
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY!,
});

export const getTravelPlan = async (prompt: string) => {
  const model = 'gemini-2.0-flash';

  const result = await genAI.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('No text response from Gemini model');
  }

  // Remove Markdown code block formatting if present
  let jsonString = text;
  if (jsonString.startsWith('```json')) {
    jsonString = jsonString.slice(7); // Remove ```json
  }
  if (jsonString.endsWith('```')) {
    jsonString = jsonString.slice(0, -3); // Remove ```
  }

  return JSON.parse(jsonString.trim());
};