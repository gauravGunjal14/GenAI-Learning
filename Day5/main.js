import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';
import { exec } from "child_process";
import { promisify } from "util";
import os from 'os'

const platform = os.platform();

const asyncExecute = promisify(exec);

const History = [];
const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });


//  Tool create karte hai, jo kisi bhi terminal/ shell command ko execute kar sakta hai

async function executeCommand({ command }) {

  try {
    const { stdout, stderr } = await asyncExecute(command);

    if (stderr) {
      return `Error: ${stderr}`
    }

    return `Success: ${stdout} || Task executed completely`

  }
  catch (error) {

    return `Error: ${error.message}`;
  }
}

const executeCommandDeclaration = {
  name: "executeCommand",
  description: "Execute a single terminal/shell command. A command can be to create a folder, file, write on a file, edit the file or delete the file",
  parameters: {
    type: 'OBJECT',
    properties: {
      command: {
        type: 'STRING',
        description: 'It will be a single terminal command. Ex: "mkdir calculator"'
      },
    },
    required: ['command']
  }
}

const availableTools = {
  executeCommand
}

async function runAgent(userProblem) {

  History.push({
    role: 'user',
    parts: [{ text: userProblem }]
  });

  while (true) {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: History,
      tools: [{
        functionDeclarations: [executeCommandDeclaration]
      }],
      systemInstruction: `
      You are a professional website builder AI.
      You have access to a tool named "executeCommand" that can run terminal/shell commands on the user's system.

      Your ONLY way to build or modify anything is by using that tool.
      Never explain steps or give instructions to the user.
      Do NOT give plans or guides — directly use terminal commands via the tool.

      The user will say what kind of website to create (e.g., "create portfolio website").
      You must:
      1. Detect user's operating system: ${platform}.
      2. Create a project folder (e.g., "mkdir portfolio").
      3. Create files like index.html, style.css, and script.js.
      4. Write full HTML/CSS/JS code into those files using echo or redirection commands.
      5. Continue until the project is complete.
      6. Finally, respond "Website ready!" after all files are created.

      Important:
      - Never describe what you’re doing.
      - Never explain theory or website creation steps.
      - Just execute the sequence of terminal commands using the executeCommand tool.
      `,
      executionMode: "AUTO",
    },
    );


    if (response.functionCalls && response.functionCalls.length > 0) {

      console.log(response.functionCalls[0]);
      const { name, args } = response.functionCalls[0];

      const funCall = availableTools[name];
      const result = await funCall(args);

      const functionResponsePart = {
        name: name,
        response: {
          result: result,
        },
      };

      // model 
      History.push({
        role: "model",
        parts: [
          {
            functionCall: response.functionCalls[0],
          },
        ],
      });

      // result Ko history daalna

      History.push({
        role: "user",
        parts: [
          {
            functionResponse: {
              name,
              response: { result },
            },
          },
        ],
      });
    }
    else {
      History.push({
        role: 'model',
        parts: [{ text: response.text }]
      })
      if (response.text) {
        console.log("Assistant:", response.text);
      }
      break;
    }
  }
}

async function main() {

  console.log("I am a cursor: let's create a website");
  const userProblem = readlineSync.question("Ask me anything--> ");
  await runAgent(userProblem);
}

main();