import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';

const ai = new GoogleGenAI({apiKey: "YOUR_API_KEY_HERE"});

const history = [];

function sum({ num1, num2 }) {
    return num1 + num2;
}

function multiply({ num1, num2 }) {
    return num1 * num2;
}

function prime({ num }) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

const sumDeclaration = {
    name: 'sum',
    description: 'Returns the sum of two numbers.',
    parameters: {
        type: 'object',
        properties: {
            num1: {
                type: 'number',
                description: 'The first number.'
            },
            num2: {
                type: 'number',
                description: 'The second number.'
            }
        },
        required: ['num1', 'num2']
    }
}

const multiplyDeclaration = {
    name: 'multiply',
    description: 'Returns the product of two numbers.',
    parameters: {
        type: 'object',
        properties: {
            num1: {
                type: 'number',
                description: 'The first number.'
            },
            num2: {
                type: 'number',
                description: 'The second number.'
            }
        },
        required: ['num1', 'num2']
    }
}

const primeDeclaration = {
    name: 'prime',
    description: 'Determines if a number is prime.',
    parameters: {
        type: 'object',
        properties: {
            num: {
                type: 'number',
                description: 'The number to check.'
            }
        },
        required: ['num']
    }
}

const availabelTools = {
    sum: sum,
    multiply: multiply,
    prime: prime
};

async function runAgent(userProblem) {
    history.push({
        role: 'user',
        parts: [{ text: userProblem }]
    });

    while (true) {

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: history,
            config: {
                systemInstruction: "You are an AI assistant that can perform mathematical operations using tools when necessary. Use the tools to answer user queries about sums, products, and prime numbers. if your asked general knowledge questions, then answer them directly without using tools.",
                tools: [{
                    functionDeclaration: [sumDeclaration, multiplyDeclaration, primeDeclaration],
                }]
            },
        });

        if (response.functionCalls && response.functionCalls.length > 0) {
            
            console.log("Function call:", response.functionCalls[0]);
            const { name, args } = response.functionCalls[0];

            const funCall = availabelTools[name];
            const result = funCall(args);

            const functionResponsePart = {
                name: name,
                response: {
                    result: result,
                },
            };

            // Record the function call and its result in history
            history.push({
                role: 'model',
                parts: {
                    functionCall: response.functionCalls[0],
                },
            });

            // Also add the function response to history
            history.push({
                role: 'user',
                parts: {
                    functionResponse: functionResponsePart,
                },
            });


            if (name === 'sum') {
                sum(args);
            }
            else if (name === 'multiply') {
                multiply(args);
            }
        }
        else {
            history.push({
                role: 'model',
                parts: [{ text: response.text }]
            });
            console.log("Assistant:", response.text);
            break;
        }
    }
}

async function main() {
    const userProblem = readlineSync.question("Ask me anything: ");
    await runAgent(userProblem);
    main();
}

main();