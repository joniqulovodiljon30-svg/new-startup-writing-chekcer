import { Message, Sender } from "../types";

// --- CONFIGURATION ---
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
// OPTIMIZATION: Switched back to 'deepseek-chat' (V3). 
// It is much cheaper and faster. R1 is 'deepseek-reasoner'.
const DEFAULT_MODEL = "deepseek-chat"; 

// HARDCODED API KEY
const API_KEY = "sk-ec020064fbb7426cb15bffb16902d982";

// LIMIT CONFIGURATION to save tokens
const MAX_HISTORY_MESSAGES = 6; // Only send the last 6 messages to the API.

export const DEFAULT_SYSTEM_INSTRUCTION = `
ROLE:
You are an English Exam Teacher AI designed ONLY for exam preparation in independent learning skills.
You are NOT a chatbot.
You are a strict but helpful human-like teacher.

🔒 VERY IMPORTANT RULES (DO NOT BREAK)
You MUST ask questions ONLY from the provided text.
You MUST NOT create questions outside that text.
Every question already has a model answer in the text — use it ONLY for checking, NOT for copying.
You MUST behave like a HUMAN teacher, not an AI robot.
You MUST NOT mention AI, ChatGPT, model answers, or internal logic.
You MUST NOT give perfect answers immediately.
You MUST guide the student step-by-step until they reach score 5.
There is NO LIMIT on attempts.

📘 INPUT FORMAT YOU WILL RECEIVE
You will receive a TEXT (learning material) containing exam-style questions and correct answers.
You must remember this text for the whole session.

🚀 SESSION FLOW (STRICT ORDER)
1. **ONBOARDING (FIRST MESSAGE)**
   When the session starts, do NOT ask a question yet.
   You MUST greet the student with this EXACT Welcome Message:
   "Welcome.
   This platform is designed to help you prepare for English exam tasks through real practice, not memorisation.
   
   You will receive random exam-style questions taken only from your study material.
   
   You can answer by writing or by speaking — both are accepted.
   
   After each answer, I will:
   • give you a score from 1 to 5
   • explain why you received that score
   • show you how to improve
   • give examples until you can reach score 5
   
   There is no limit here.
   You can try as many times as you need.
   
   Mistakes are normal. This is practice, not an exam.
   
   When you are ready, tell me — and we will start with the first question."
   🛑 STOP HERE. WAIT FOR USER TO SAY "I am ready".

2. **MODE SELECTION**
   When the user says "I am ready" or "Ready", ask EXACTLY:
   "How shall we start the questions?
   
   • Random
   • Sequential (Order 1, 2, 3...)"
   🛑 STOP HERE. WAIT FOR USER CHOICE.

3. **EXAM PRACTICE**
   - If user chooses **Random**: Pick any question from the text randomly.
   - If user chooses **Sequential**: Start from the first question.
   **FORMATTING RULE:**
   "## Question [Number]
   [The Question Text]
   (If you don't have an idea, you can click 'Idea' or 'Example')"

4. **HELPER BUTTONS LOGIC**
   - **"REQUEST_IDEA"**: Provide structural hint. No answer. No grade.
   - **"REQUEST_EXAMPLE"**: Provide ONE model answer. No grade.

🧠 EVALUATION LOGIC (STRICT)
Idea relevance (30%), Logical structure (25%), Grammar (20%), Exam clarity (25%).
Final score 1-5.

🧾 FEEDBACK RULES
After EACH answer:
1. Give score (1–5).
2. Explain WHY.
3. List mistakes.
4. Explain HOW to improve.
5. Give 3–4 HUMAN-LIKE examples.
6. Encourage rewriting if score < 5.

If score < 5: Ask to rewrite.
If score = 5: Praise briefly. Move to NEW question.
`;

// Interface for DeepSeek/OpenAI message format
interface APIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Local state to manage session history since we are managing the REST call manually
let sessionHistory: APIMessage[] = [];
let systemPromptWithMaterial: string = "";

export const resetAI = () => {
  sessionHistory = [];
  systemPromptWithMaterial = "";
};

const getApiKey = () => {
  return API_KEY;
}

// Helper: Wait function for delays (used in retry logic)
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const startTeacherSession = (
  learningMaterial: string, 
  historyMessages: Message[] = [],
  systemInstruction: string = DEFAULT_SYSTEM_INSTRUCTION
): any => {
  
  // 1. Prepare System Prompt
  systemPromptWithMaterial = `${systemInstruction}\n\n=== LEARNING MATERIAL ===\n${learningMaterial}`;

  // 2. Convert App Message History to API Format
  sessionHistory = historyMessages.map(msg => ({
    role: msg.sender === Sender.USER ? 'user' : 'assistant',
    content: msg.text
  }));

  return {}; 
};

export const sendInitialMaterial = async (material: string): Promise<string> => {
  // We trigger the welcome message flow just like before
  const triggerMessage = "Start the session now with the Welcome Message as defined in your instructions.";
  return await sendMessageToTeacher(triggerMessage, true);
};

export const sendMessageToTeacher = async (message: string, isSystemTrigger: boolean = false): Promise<string> => {
  const apiKey = getApiKey();
  
  // 1. Add User Message to History
  sessionHistory.push({ role: 'user', content: message });

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      // 2. OPTIMIZATION: Reduce History Payload
      // Instead of sending 100 messages, we only send the System Prompt + Last N messages.
      // This drastically reduces "Input Tokens" usage.
      const recentHistory = sessionHistory.slice(-MAX_HISTORY_MESSAGES);

      const messagesPayload = [
          { role: 'system', content: systemPromptWithMaterial },
          ...recentHistory
      ];

      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages: messagesPayload,
          stream: false, 
          temperature: 0.6
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error ${response.status}: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      // 3. Extract Response
      const assistantText = data.choices[0]?.message?.content;

      if (!assistantText) {
          throw new Error("Received empty response from DeepSeek.");
      }

      // 4. Update History
      sessionHistory.push({ role: 'assistant', content: assistantText });

      return assistantText;

    } catch (error: any) {
      console.error(`DeepSeek API Error (Attempt ${attempts + 1}):`, error);
      
      let errMsg = error.message || "Unknown error";

      // Case 1: Critical Auth Error
      if (errMsg.includes("401") || errMsg.includes("Key")) {
          sessionHistory.pop(); 
          return "System Error: Invalid API Key. Please contact support.";
      }

      // Case 2: Rate Limit (429) or Server Overload (503)
      if (errMsg.includes("429") || errMsg.includes("503") || errMsg.includes("500")) {
        attempts++;
        if (attempts < maxAttempts) {
            const delayTime = 2000 * Math.pow(2, attempts - 1);
            console.warn(`Server busy. Retrying in ${delayTime}ms...`);
            await wait(delayTime);
            continue;
        } else {
             sessionHistory.pop(); 
            return "System Error: DeepSeek server is currently busy. Please try again in a minute.";
        }
      }

      // Case 3: Other errors
      sessionHistory.pop(); 
      return `Teacher Connection Error: ${errMsg}`;
    }
  }

  sessionHistory.pop();
  return "System Error: Failed to connect after multiple attempts.";
};