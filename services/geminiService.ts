import { GoogleGenAI, Type } from "@google/genai";
import { FALLBACK_BENEFITS, FALLBACK_FINANCING_SCENARIOS, FALLBACK_FAQ, FALLBACK_IMAGE_URL } from '../constants';
import type { FinancingScenario, FAQItem } from '../types';

let ai: GoogleGenAI | null = null;

export const updateApiKey = (key: string) => {
    if (key) {
        try {
            ai = new GoogleGenAI({ apiKey: key });
        } catch (error) {
            console.error("Error initializing Gemini AI with the provided key:", error);
            ai = null;
        }
    } else {
        ai = null;
    }
};

export const isAiReady = (): boolean => !!ai;

export const generateBenefits = async (personaPrompt: string): Promise<string> => {
  if (!ai) return FALLBACK_BENEFITS;
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a short, easy-to-read paragraph (around 100 words) explaining the primary benefits of residential solar panels for the following customer type: "${personaPrompt}". Focus on what they care about most. Use a positive and trustworthy tone.`,
        config: {
            temperature: 0.7,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating benefits:", error);
    return FALLBACK_BENEFITS;
  }
};

export const generateImage = async (benefitsText: string): Promise<string> => {
  if (!ai) return FALLBACK_IMAGE_URL;
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Create a vibrant, photorealistic lifestyle image of happy homeowners enjoying the benefits of solar energy, inspired by this theme: "${benefitsText}". The image should feel warm, optimistic, and modern. Show a clean, beautiful home with subtle solar panels. Focus on the people feeling happy and secure.`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });
    
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error("Error generating image:", error);
    return FALLBACK_IMAGE_URL;
  }
};

export const generateFinancingScenarios = async (personaPrompt: string): Promise<FinancingScenario[]> => {
  if (!ai) return FALLBACK_FINANCING_SCENARIOS;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate three distinct solar financing scenarios (e.g., Loan, Cash Purchase, Lease/PPA) tailored for a customer described as: "${personaPrompt}". For each scenario, provide a name, 2-3 brief 'pros', 2 'cons', and a 'best for' summary. The tone should be clear, objective, and helpful.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              option: { type: Type.STRING },
              pros: { type: Type.ARRAY, items: { type: Type.STRING } },
              cons: { type: Type.ARRAY, items: { type: Type.STRING } },
              bestFor: { type: Type.STRING }
            },
            required: ['option', 'pros', 'cons', 'bestFor']
          }
        }
      }
    });
    
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error generating financing scenarios:", error);
    return FALLBACK_FINANCING_SCENARIOS;
  }
};

export const generateFaq = async (personaPrompt: string, benefitsText: string): Promise<FAQItem[]> => {
    if (!ai) return FALLBACK_FAQ;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a concise FAQ with 3 questions and answers for a potential solar customer described as "${personaPrompt}", who has just learned about these benefits: "${benefitsText}". The questions should anticipate their primary concerns. Answers should be reassuring and easy to understand.`,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING }
                  },
                  required: ['question', 'answer']
                }
              }
            }
        });

        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error generating FAQ:", error);
        return FALLBACK_FAQ;
    }
};