
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { systemInstruction, validExpressions } from "./knowledge";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

// Define the expected JSON structure for the AI's response
export interface AIResponse {
    expression: string;
    message: string;
}

// Define the structure for chat history entries
export interface ChatHistoryPart {
    role: 'user' | 'model';
    parts: { text: string }[];
}

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        expression: {
            type: Type.STRING,
            description: "The robot's facial expression.",
            enum: validExpressions
        },
        message: {
            type: Type.STRING,
            description: "The robot's text message to the user."
        }
    },
    required: ["expression", "message"]
};


export const getAIResponse = async (userInput: string, history: ChatHistoryPart[]): Promise<AIResponse> => {
    try {
        const fullHistory = [
            ...history,
            { role: 'user' as const, parts: [{ text: userInput }] }
        ];

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullHistory,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedResponse: AIResponse = JSON.parse(jsonText);
        return parsedResponse;
        
    } catch (error) {
        console.error("Error getting AI response:", error);
        throw new Error("Failed to get response from AI. Please check the console for details.");
    }
};
