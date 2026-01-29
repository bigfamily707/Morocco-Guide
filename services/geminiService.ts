import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are "Aziz", a knowledgeable, friendly, and culturally respectful local guide for Morocco. 
Your goal is to help travelers navigate the country with ease, respect, and joy.
You speak in a warm, welcoming tone. 
You provide practical advice on itinerary planning, cultural etiquette, food recommendations, and simple translations (English to Moroccan Darija).
Keep answers concise and suitable for a mobile screen, but don't sacrifice warmth.
If asked about safety, be reassuring but realistic (e.g., mention common scams but emphasize Morocco is generally safe).
When generating itineraries, consider the user's persona (Family, Solo, Adventure, etc.) if provided.
`;

export const sendMessageToGemini = async (
  message: string, 
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I'm having a little trouble connecting to the desert winds right now. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Something went wrong. Please check your connection and try again.";
  }
};