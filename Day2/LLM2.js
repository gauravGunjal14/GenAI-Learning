import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';

const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

const history = [];

async function userMessage(prompt) {
  history.push({ role: "user", parts: [{ text: prompt }] });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: history,
  })

  history.push({ role: "model", parts: [{ text: response.text }] });

  console.log(`AI: ${response.text}`);
}

async function main() {
  while (true) {
    const prompt = readlineSync.question("You: ");
    if (prompt.toLowerCase() === "exit") break; // Allow exit
    await userMessage(prompt);
  }
}

await main();