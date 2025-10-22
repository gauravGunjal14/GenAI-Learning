import { GoogleGenAI } from "https://www.npmjs.com/package/@google/genai";

const input = document.querySelector('.message-input');
const sendBtn = document.querySelector('.send-btn');
const chatBox = document.querySelector('.chats');

const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

async function botMessage(message) {
    history.push({ role: "user", parts: [{ text: message }] });

    chatBox.appendChild(document.createElement('div')).classList.add('chat-bubble', 'sent');
    chatBox.lastChild.textContent = message;
    chatBox.scrollTop = chatBox.scrollHeight;

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
    chatBox.appendChild(document.createElement('div')).classList.add('chat-bubble', 'received');
    chatBox.lastChild.textContent = response.text;
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener('click', sendMessage);

function sendMessage() {
    const message = input.value.trim();
    if (message === '') return;
    botMessage(message);
    input.value = '';
}