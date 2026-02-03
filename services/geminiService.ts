import { GoogleGenAI } from "@google/genai";
import { AssessmentResult, GeminiConfig, Correction, CriterionAssessment } from "../types";

// Re-export types for backward compatibility
export type { AssessmentResult, GeminiConfig, Correction, CriterionAssessment };

// --- CONSTANTS ---

const DEFAULT_MODEL = "gemini-2.0-flash";

// --- HARDCODED SYSTEM PROMPT FOR JSON OUTPUT ---

const GRADING_SYSTEM_PROMPT = `You are a strict IELTS Examiner. Your only task is to analyze essays and return structured JSON assessments.

CRITICAL RULES:
1. You MUST return ONLY valid JSON - no markdown, no text before or after the JSON.
2. Do NOT wrap the JSON in code blocks or backticks.
3. Be strict but fair in your scoring.
4. Scores must be on the IELTS band scale (0-9, with 0.5 increments).
5. Provide specific, actionable feedback for each criterion.
6. Identify and correct at least 3-5 grammar/vocabulary mistakes if present.
7. Always compare the essay to what a Band 9 response would look like.`;

// --- MAIN GRADING FUNCTION ---

/**
 * Grades an IELTS essay using Gemini AI.
 * 
 * @param question - The IELTS writing question/prompt
 * @param userEssay - The student's essay response
 * @param config - Configuration object with API key (from Admin Panel or env)
 * @returns AssessmentResult with detailed grading
 * @throws Error if API key is invalid or missing, or if response parsing fails
 */
export const gradeEssay = async (
  question: string,
  userEssay: string,
  config: GeminiConfig
): Promise<AssessmentResult> => {

  // 1. Resolve API Key (Admin Panel takes priority, then env)
  const apiKey = config?.apiKey || (typeof process !== 'undefined' && process.env?.API_KEY) || (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY);

  if (!apiKey) {
    throw new Error(
      "❌ API Key Missing: No Gemini API key found. Please configure one in the Admin Panel or set the API_KEY environment variable."
    );
  }

  // 2. Validate API Key format (basic check)
  if (apiKey.length < 20) {
    throw new Error(
      "❌ Invalid API Key: The provided API key appears to be invalid. Please check your Admin Panel configuration."
    );
  }

  // 3. Initialize Gemini Client
  let ai: GoogleGenAI;
  try {
    ai = new GoogleGenAI({ apiKey });
  } catch (initError: any) {
    throw new Error(
      `❌ Failed to initialize Gemini: ${initError.message || "Unknown initialization error"}`
    );
  }

  // 4. Build the grading prompt
  const userPrompt = `Analyze the following essay based on the question.

Question: ${question}

Essay: ${userEssay}

RETURN ONLY JSON (No markdown, no text before/after). Structure:
{
  "overall_band": number (e.g. 6.5),
  "criteria": {
    "task_response": { "score": number, "feedback": "string" },
    "coherence_cohesion": { "score": number, "feedback": "string" },
    "lexical_resource": { "score": number, "feedback": "string" },
    "grammatical_range": { "score": number, "feedback": "string" }
  },
  "corrections": [
    { "original_sentence": "string", "corrected_sentence": "string", "explanation": "string" }
  ],
  "model_essay_comparison": "Brief comparison with a band 9 answer"
}`;

  // 5. Call Gemini API
  const modelName = config?.model || DEFAULT_MODEL;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: userPrompt,
      config: {
        systemInstruction: GRADING_SYSTEM_PROMPT,
        temperature: 0.3, // Lower temperature for more consistent grading
        responseMimeType: "application/json", // Force JSON output
      }
    });

    // 6. Extract and parse response
    const responseText = response.text;

    if (!responseText) {
      throw new Error(
        "❌ Empty Response: The AI returned an empty response. Please try again."
      );
    }

    // 7. Clean the response (remove any accidental markdown formatting)
    let cleanedResponse = responseText.trim();

    // Remove markdown code blocks if present
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
    let result: AssessmentResult;
    try {
      result = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", cleanedResponse);
      throw new Error(
        "❌ Invalid Response Format: The AI response could not be parsed. Please try again."
      );
    }

    // 9. Validate the result structure
    if (!validateAssessmentResult(result)) {
      console.error("Invalid assessment structure:", result);
      throw new Error(
        "❌ Incomplete Assessment: The AI response is missing required fields. Please try again."
      );
    }

    return result;

  } catch (apiError: any) {
    // Handle specific Gemini API errors
    const errorMessage = apiError.message || "Unknown API error";

    if (errorMessage.includes("API_KEY_INVALID") ||
      errorMessage.includes("invalid") && errorMessage.toLowerCase().includes("key")) {
      throw new Error(
        "❌ Invalid API Key: Your Gemini API key is invalid or has been revoked. Please update it in the Admin Panel."
      );
    }

    if (errorMessage.includes("QUOTA_EXCEEDED") || errorMessage.includes("quota")) {
      throw new Error(
        "❌ Quota Exceeded: Your API quota has been exceeded. Please check your Google Cloud billing or wait for quota reset."
      );
    }

    if (errorMessage.includes("RATE_LIMIT") || errorMessage.includes("rate")) {
      throw new Error(
        "❌ Rate Limited: Too many requests. Please wait a moment and try again."
      );
    }

    // Re-throw our custom errors
    if (errorMessage.startsWith("❌")) {
      throw apiError;
    }

    // Generic error
    throw new Error(
      `❌ Grading Failed: ${errorMessage}. Please try again or contact support.`
    );
  }
};

// --- VALIDATION HELPER ---

function validateAssessmentResult(result: any): result is AssessmentResult {
  if (!result || typeof result !== "object") return false;

  // Check overall_band
  if (typeof result.overall_band !== "number") return false;

  // Check criteria object
  if (!result.criteria || typeof result.criteria !== "object") return false;

  const requiredCriteria = [
    "task_response",
    "coherence_cohesion",
    "lexical_resource",
    "grammatical_range"
  ];

  for (const criterion of requiredCriteria) {
    if (!result.criteria[criterion]) return false;
    if (typeof result.criteria[criterion].score !== "number") return false;
    if (typeof result.criteria[criterion].feedback !== "string") return false;
  }

  // Check corrections array
  if (!Array.isArray(result.corrections)) return false;

  // Check model_essay_comparison
  if (typeof result.model_essay_comparison !== "string") return false;

  return true;
}

// --- LEGACY EXPORTS (for backward compatibility) ---

export const DEFAULT_SYSTEM_INSTRUCTION = GRADING_SYSTEM_PROMPT;

export const resetAI = () => {
  // No-op for backward compatibility
  console.log("resetAI called - no longer needed for gradeEssay");
};