import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { AssessmentResult } from "./geminiService";

// --- TYPE DEFINITIONS ---

export interface Submission {
  id?: string;
  user_id: string;
  question: string;
  essay: string;
  overall_band: number;
  task_response_score: number;
  task_response_feedback: string;
  coherence_cohesion_score: number;
  coherence_cohesion_feedback: string;
  lexical_resource_score: number;
  lexical_resource_feedback: string;
  grammatical_range_score: number;
  grammatical_range_feedback: string;
  corrections: object[]; // JSON array stored as JSONB
  model_essay_comparison: string;
  created_at?: string;
  updated_at?: string;
}

// --- SUPABASE CLIENT INITIALIZATION ---

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Create real Supabase client if credentials exist, otherwise use mock
const isSupabaseConfigured = supabaseUrl && supabaseKey && supabaseUrl !== "";

let supabaseClient: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl!, supabaseKey!);
    console.log("✅ Supabase connected:", supabaseUrl);
  } catch (error) {
    console.warn("⚠️ Failed to initialize Supabase, using localStorage fallback");
    supabaseClient = null;
  }
}

// --- MOCK CLIENT FOR LOCALSTORAGE FALLBACK ---

const SUBMISSIONS_STORAGE_KEY = "exam_prep_submissions";

const mockClient = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        order: (col: string, opts?: { ascending: boolean }) =>
          Promise.resolve({
            data: getLocalSubmissions().filter((s: any) => s[column] === value),
            error: null
          }),
        single: () => {
          const items = getLocalSubmissions().filter((s: any) => s[column] === value);
          return Promise.resolve({
            data: items.length > 0 ? items[0] : null,
            error: items.length === 0 ? { message: "Not found" } : null
          });
        },
      }),
      order: (column: string, opts?: { ascending: boolean }) =>
        Promise.resolve({ data: getLocalSubmissions(), error: null }),
    }),
    insert: (data: any) => ({
      select: () => ({
        single: () => {
          const newItem = { ...data, id: crypto.randomUUID(), created_at: new Date().toISOString() };
          const items = getLocalSubmissions();
          items.unshift(newItem);
          localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(items));
          return Promise.resolve({ data: newItem, error: null });
        },
      }),
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => {
        const items = getLocalSubmissions();
        const index = items.findIndex((s: any) => s[column] === value);
        if (index >= 0) {
          items[index] = { ...items[index], ...data, updated_at: new Date().toISOString() };
          localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(items));
        }
        return Promise.resolve({ data: items[index] || null, error: null });
      },
    }),
    delete: () => ({
      eq: (column: string, value: any) => {
        let items = getLocalSubmissions();
        items = items.filter((s: any) => s[column] !== value);
        localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(items));
        return Promise.resolve({ data: null, error: null });
      },
    }),
  }),
};

function getLocalSubmissions(): Submission[] {
  try {
    return JSON.parse(localStorage.getItem(SUBMISSIONS_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

// Export the appropriate client
export const supabase = supabaseClient || (mockClient as any);

// --- SUBMISSION HELPER FUNCTIONS ---

/**
 * Saves an essay assessment result to the database.
 * 
 * @param userId - The user's ID
 * @param question - The IELTS question
 * @param essay - The user's essay
 * @param assessment - The AI grading result
 * @returns The saved submission or throws error
 */
export const saveSubmission = async (
  userId: string,
  question: string,
  essay: string,
  assessment: AssessmentResult
): Promise<Submission> => {
  const submission: Omit<Submission, "id" | "created_at" | "updated_at"> = {
    user_id: userId,
    question,
    essay,
    overall_band: assessment.overall_band,
    task_response_score: assessment.criteria.task_response.score,
    task_response_feedback: assessment.criteria.task_response.feedback,
    coherence_cohesion_score: assessment.criteria.coherence_cohesion.score,
    coherence_cohesion_feedback: assessment.criteria.coherence_cohesion.feedback,
    lexical_resource_score: assessment.criteria.lexical_resource.score,
    lexical_resource_feedback: assessment.criteria.lexical_resource.feedback,
    grammatical_range_score: assessment.criteria.grammatical_range.score,
    grammatical_range_feedback: assessment.criteria.grammatical_range.feedback,
    corrections: assessment.corrections,
    model_essay_comparison: assessment.model_essay_comparison,
  };

  const { data, error } = await supabase
    .from("submissions")
    .insert(submission)
    .select()
    .single();

  if (error) {
    console.error("Failed to save submission:", error);
    throw new Error(`Failed to save submission: ${error.message}`);
  }

  return data;
};

/**
 * Retrieves all submissions for a user.
 * 
 * @param userId - The user's ID
 * @returns Array of submissions ordered by creation date (newest first)
 */
export const getUserSubmissions = async (userId: string): Promise<Submission[]> => {
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to get submissions:", error);
    throw new Error(`Failed to get submissions: ${error.message}`);
  }

  return data || [];
};

/**
 * Retrieves a single submission by ID.
 * 
 * @param submissionId - The submission's ID
 * @returns The submission or null
 */
export const getSubmissionById = async (submissionId: string): Promise<Submission | null> => {
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("id", submissionId)
    .single();

  if (error) {
    console.error("Failed to get submission:", error);
    return null;
  }

  return data;
};

/**
 * Deletes a submission by ID.
 * 
 * @param submissionId - The submission's ID
 */
export const deleteSubmission = async (submissionId: string): Promise<void> => {
  const { error } = await supabase
    .from("submissions")
    .delete()
    .eq("id", submissionId);

  if (error) {
    console.error("Failed to delete submission:", error);
    throw new Error(`Failed to delete submission: ${error.message}`);
  }
};

/**
 * Gets statistics for a user's submissions.
 * 
 * @param userId - The user's ID
 * @returns Statistics object
 */
export const getUserStats = async (userId: string): Promise<{
  totalSubmissions: number;
  averageBand: number;
  highestBand: number;
  lowestBand: number;
}> => {
  const submissions = await getUserSubmissions(userId);

  if (submissions.length === 0) {
    return {
      totalSubmissions: 0,
      averageBand: 0,
      highestBand: 0,
      lowestBand: 0,
    };
  }

  const bands = submissions.map(s => s.overall_band);

  return {
    totalSubmissions: submissions.length,
    averageBand: Math.round((bands.reduce((a, b) => a + b, 0) / bands.length) * 10) / 10,
    highestBand: Math.max(...bands),
    lowestBand: Math.min(...bands),
  };
};
