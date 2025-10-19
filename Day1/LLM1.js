// dosent store history
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyC81HSMoG1SLYJOKFFRxnVyXCGZwNqTNF0"});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "What is array, explain with example?",
  });
  console.log(response.text);
}

await main();