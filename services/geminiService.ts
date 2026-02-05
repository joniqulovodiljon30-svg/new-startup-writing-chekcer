import { GoogleGenAI } from "@google/genai";
import { AssessmentResult, Annotation, WordCountStatus } from "../types";

// Re-export types for backward compatibility
export type { AssessmentResult, Annotation };

// --- TYPES ---
export interface GeminiConfig {
  apiKey: string;
  model?: string;
}

export interface CriterionAssessment {
  score: number;
  feedback: string;
}

export interface Correction {
  original_sentence: string;
  corrected_sentence: string;
  explanation: string;
}

// --- CONSTANTS ---

const DEFAULT_MODEL = "gemini-2.0-flash";

// --- STRICT IELTS EXAMINER PROMPT ---

const GRADING_SYSTEM_PROMPT = `Role: You are a strict, senior IELTS Examiner. Your task is to grade essays (Task 1 and Task 2) with extreme precision, avoiding score inflation. You must penalize off-topic content, word count violations, and grammatical errors strictly.

**STRICT GRADING RULES:**

1.  **Relevance Check (CRITICAL):**
    - If the essay is NOT related to the Topic, the maximum score for Task Response is 2.0.
    - Length does NOT equal quality. A 1000-word essay that is off-topic or repetitive must receive a low score.

2.  **Word Count Penalties (Apply these strictly):**
    - **For Task 1:**
        - Optimal Range: 150 - 200 words.
        - If < 150 words: Deduct 0.5 - 1.0 band points.
        - If > 250 words: Deduct 0.5 band points (Loss of conciseness).
    - **For Task 2:**
        - Optimal Range: 250 - 300 words.
        - If < 250 words: Deduct 0.5 - 1.0 band points.
        - If > 350 words: Deduct 0.5 band points (Lack of focus).

3.  **Detailed Analysis Requirements:**
    - **Grammar:** Identify every error. Provide a correction.
    - **Vocabulary:** Identify weak/repetitive words. Suggest C1/C2 level synonyms.
    - **Coherence:** Check if linking words are used correctly, not just frequently.

4. **Feedback Quality:**
    - Provide SPECIFIC, ACTIONABLE feedback for each criterion.
    - Reference EXACT phrases from the essay in your feedback.
    - Tell the student exactly what to improve with examples.
    - Compare their writing to what a Band 9 response would include.

5. **Be a strict but fair examiner. Do not inflate scores.**

CRITICAL: You MUST return ONLY valid JSON - no markdown, no text before or after the JSON.`;

// --- MAIN GRADING FUNCTION ---

/**
 * Grades an IELTS essay using Gemini AI with strict scoring.
 * 
 * @param question - The IELTS writing question/prompt
 * @param userEssay - The student's essay response
 * @param config - Configuration object with API key
 * @param taskType - 'task1' or 'task2' for appropriate word count rules
 * @returns AssessmentResult with detailed grading and annotations
 */
export const gradeEssay = async (
  question: string,
  userEssay: string,
  config: GeminiConfig,
  taskType: 'task1' | 'task2' = 'task2'
): Promise<AssessmentResult> => {

  // 1. Resolve API Key
  const apiKey = config?.apiKey || (typeof process !== 'undefined' && process.env?.API_KEY) || (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY);

  if (!apiKey) {
    throw new Error(
      "❌ API Key Missing: No Gemini API key found. Please configure one in the Admin Panel or set the API_KEY environment variable."
    );
  }

  if (apiKey.length < 20) {
    throw new Error(
      "❌ Invalid API Key: The provided API key appears to be invalid."
    );
  }

  // 2. Calculate word count
  const wordCount = userEssay.trim().split(/\s+/).filter(w => w.length > 0).length;

  // 3. Determine word count status
  let wordCountStatus: WordCountStatus = 'Optimal';
  if (taskType === 'task1') {
    if (wordCount < 100) wordCountStatus = 'Severely Under Length';
    else if (wordCount < 150) wordCountStatus = 'Too Short (Penalty Applied)';
    else if (wordCount > 250) wordCountStatus = 'Too Long (Penalty Applied)';
  } else {
    if (wordCount < 200) wordCountStatus = 'Severely Under Length';
    else if (wordCount < 250) wordCountStatus = 'Too Short (Penalty Applied)';
    else if (wordCount > 350) wordCountStatus = 'Too Long (Penalty Applied)';
  }

  // 4. Initialize Gemini Client
  let ai: GoogleGenAI;
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (initError: any) {
    throw new Error(
      `❌ Failed to initialize Gemini: ${initError.message || "Unknown initialization error"}`
    );
  }

  // 5. Build the grading prompt
  const optimalRange = taskType === 'task1' ? '150-200' : '250-300';

  const userPrompt = `Analyze the following IELTS ${taskType === 'task1' ? 'Task 1 (Report/Letter)' : 'Task 2 (Essay)'}.

**Question:** ${question}

**Student's Essay:** 
${userEssay}

**Word Count:** ${wordCount} words (Optimal range: ${optimalRange})
**Word Count Status:** ${wordCountStatus}

RETURN ONLY JSON (No markdown, no text before/after). Use this exact structure:
{
  "overall_band": number,
  "word_count": ${wordCount},
  "word_count_status": "${wordCountStatus}",
  "criteria": {
    "task_response": { 
      "score": number, 
      "feedback": "Detailed feedback referencing specific parts of the essay. Be strict but constructive."
    },
    "coherence_cohesion": { 
      "score": number, 
      "feedback": "Analyze paragraph structure, linking words usage, and logical flow. Reference specific examples."
    },
    "lexical_resource": { 
      "score": number, 
      "feedback": "Evaluate vocabulary range, accuracy, and appropriateness. Suggest better alternatives for weak words."
    },
    "grammatical_range": { 
      "score": number, 
      "feedback": "Identify grammar patterns, accuracy, and sentence variety. Reference specific errors."
    }
  },
  "corrections": [
    { "original_sentence": "exact text from essay", "corrected_sentence": "improved version", "explanation": "why this is better" }
  ],
  "annotations": [
    {
      "original_text": "exact word or phrase to highlight",
      "type": "spelling|grammar|vocabulary_upgrade|style|coherence",
      "correction": "suggested fix",
      "explanation": "brief explanation",
      "ui_color": "red for errors, yellow for vocabulary suggestions, green for style, blue for coherence, orange for spelling"
    }
  ],
  "summary": "Overall assessment with specific advice for improvement. Reference the essay content."
}

IMPORTANT: 
- Include 5-10 annotations for inline highlighting.
- Be STRICT with scoring. Do not inflate.
- Provide SPECIFIC feedback referencing actual content from the essay.`;

  // 6. Call Gemini API
  const modelName = config?.model || DEFAULT_MODEL;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: userPrompt,
      config: {
        systemInstruction: GRADING_SYSTEM_PROMPT,
        temperature: 0.2,
        responseMimeType: "application/json",
      }
    });

    const responseText = response.text;

    if (!responseText) {
      throw new Error("❌ Empty Response: The AI returned an empty response.");
    }

    // 7. Clean response
    let cleanedResponse = responseText.trim();
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse.slice(7);
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse.slice(3);
    }
    if (cleanedResponse.endsWith("```")) {
      cleanedResponse = cleanedResponse.slice(0, -3);
    }
    cleanedResponse = cleanedResponse.trim();

    // 8. Parse JSON
    let rawResult: any;
    try {
      rawResult = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", cleanedResponse);
      throw new Error("❌ Invalid Response Format: The AI response could not be parsed.");
    }

    // 9. Map to AssessmentResult format
    const result: AssessmentResult = {
      overallBand: rawResult.overall_band ?? 5.0,
      wordCount: wordCount,
      wordCountStatus: wordCountStatus,
      taskResponse: {
        score: rawResult.criteria?.task_response?.score ?? 5.0,
        feedback: rawResult.criteria?.task_response?.feedback ?? "No feedback provided."
      },
      coherenceCohesion: {
        score: rawResult.criteria?.coherence_cohesion?.score ?? 5.0,
        feedback: rawResult.criteria?.coherence_cohesion?.feedback ?? "No feedback provided."
      },
      lexicalResource: {
        score: rawResult.criteria?.lexical_resource?.score ?? 5.0,
        feedback: rawResult.criteria?.lexical_resource?.feedback ?? "No feedback provided."
      },
      grammaticalRange: {
        score: rawResult.criteria?.grammatical_range?.score ?? 5.0,
        feedback: rawResult.criteria?.grammatical_range?.feedback ?? "No feedback provided."
      },
      corrections: (rawResult.corrections || []).map((c: any) => ({
        original: c.original_sentence || c.original || "",
        corrected: c.corrected_sentence || c.corrected || "",
        explanation: c.explanation || ""
      })),
      annotations: (rawResult.annotations || []).map((a: any) => ({
        original_text: a.original_text || "",
        type: a.type || "grammar",
        correction: a.correction || "",
        explanation: a.explanation || "",
        ui_color: a.ui_color || "red"
      })),
      summary: rawResult.summary || "Assessment completed."
    };

    return result;

  } catch (apiError: any) {
    const errorMessage = apiError.message || "Unknown API error";

    if (errorMessage.includes("API_KEY_INVALID") ||
      (errorMessage.includes("invalid") && errorMessage.toLowerCase().includes("key"))) {
      throw new Error("❌ Invalid API Key: Your Gemini API key is invalid.");
    }

    if (errorMessage.includes("QUOTA_EXCEEDED") || errorMessage.includes("quota")) {
      throw new Error("❌ Quota Exceeded: Your API quota has been exceeded.");
    }

    if (errorMessage.includes("RATE_LIMIT") || errorMessage.includes("rate")) {
      throw new Error("❌ Rate Limited: Too many requests. Please wait.");
    }

    if (errorMessage.startsWith("❌")) {
      throw apiError;
    }

    throw new Error(`❌ Grading Failed: ${errorMessage}`);
  }
};

// --- LEGACY EXPORTS ---

export const DEFAULT_SYSTEM_INSTRUCTION = GRADING_SYSTEM_PROMPT;

export const resetAI = () => {
  console.log("resetAI called - no longer needed");
};