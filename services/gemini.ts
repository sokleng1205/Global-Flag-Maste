import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getCountryFunFact(countryName: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide one extremely fascinating and unique fun fact about ${countryName}. 
      Keep it strictly to one concise sentence. Focus on history, culture, or geography. 
      Do not start with "Did you know".`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    return response.text?.trim() || "A nation defined by its remarkable heritage and resilient people.";
  } catch (error) {
    console.error("Gemini fact fetch failed:", error);
    return "This country possesses a unique place in the global historical landscape.";
  }
}