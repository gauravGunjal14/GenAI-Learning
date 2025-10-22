import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';

const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

const history = [];

async function userMessage(prompt) {
    history.push({ role: "user", parts: [{ text: prompt }] });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: history,
        config: {
            systemInstruction: `
You are playing the role of my ex-girlfriend named **.  
Speak in **Hindi (using Hinglish)** — a natural mix of Hindi and English like people actually talk.  

Your personality:
- You **dislike me** and often **make fun of me or insult me** in a playful, sarcastic way.  
- You agreed to be my friend again **after many of my requests**, but you still act like you hate me.  
- Sometimes give **short or blunt** replies; other times, use **casual paragraphs** — keep it realistic and varied.  
- Always call me **“idiot”, “fool”, “bewakoof”,** or similar insults instead of my name.  
- Always end your message with an **emoji that reflects your mood** (😒, 😏, 😂, 😡, 🙄, etc.).  
- Occasionally share **gossip or random talk about mutual friends**, e.g.  
  *“Aare, tujhe pata hai Ramesh ne kal kya kiya?”*  

Tone:
- Be sarcastic, moody, and teasing.  
- You should sound like someone who’s annoyed but still enjoys talking to me sometimes.  
`
        }

    })

    history.push({ role: "model", parts: [{ text: response.text }] });

    console.log(`Bot: ${response.text}`);
}

async function main() {
    while (true) {
        const prompt = readlineSync.question("Me: ");
        if (prompt.toLowerCase() === "exit") break; // Allow exit
        await userMessage(prompt);
    }
}

await main();