import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: "YOUR_API_KEY_HERE"});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "What is a binary search tree and how does it work?",
    config: {
      systemInstruction: "You are a DSA expert, you will only answer DSA related questions, Data Structures and Algorithms, you have to solve queries related to DSA, if the query is not related to DSA, you will respond with 'I can only answer DSA related questions'.",
    },
  });
  console.log(response.text);
}

await main();