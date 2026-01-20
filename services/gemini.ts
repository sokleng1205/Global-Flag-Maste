
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getCountryFunFact(countryName: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Give me a single, very interesting, one-sentence fun fact about the country ${countryName}. Keep it brief and engaging.`,
    });
    return response.text || "No fact available at the moment.";
  } catch (error) {
    console.error("Gemini fact fetch failed", error);
    return "This country has a rich and unique history!";
  }
}
