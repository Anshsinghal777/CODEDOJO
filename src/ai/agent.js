import { ChatGoogleGenerativeAI }
from "@langchain/google-genai";
import {
 searchProblemsTool
}
from "./tools/searchProblemsTool.js";


const model =
new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: "AIzaSyBbli9rHu-DPAcLI7qxsT6Tpq_xiN3FJK8",
});

const llmWithTools =
model.bindTools([
  searchProblemsTool
]);



const result =
await llmWithTools.invoke(
 "Recommend binary search problems"
);

console.log(result.tool_calls);
const toolCall = result.tool_calls[0];


const toolResult =
await searchProblemsTool.invoke(
  toolCall.args
);

console.log(toolResult);
console.log("final answer generation...");


const finalAnswer =
await model.invoke(`
You are CodeDojo Mentor.

User Question:
Recommend binary search problems.

Problems:
${toolResult}

Give:
1. Short recommendation
2. One-line reason for each problem
3. Max 80 words total

Be concise.
`);

console.log(finalAnswer.content);