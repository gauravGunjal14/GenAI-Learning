import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyC81HSMoG1SLYJOKFFRxnVyXCGZwNqTNF0"});

let history = [];
async function main(history) {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    history: history,
  });

  async function userPrompt(prompt) {
    const response = await chat.sendMessage({ content: prompt });
    console.log("AI:", response.text);
    history.push({ role: "user", content: prompt });
    history.push({ role: "assistant", content: response.text });
  }
}

await main();