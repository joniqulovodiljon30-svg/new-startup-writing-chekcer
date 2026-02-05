import { AssessmentResult, Question } from '../types';
import { gradeEssay, GeminiConfig } from './geminiService';

/**
 * IELTS Essay Analysis Service
 * Connects to Gemini AI for strict grading with annotations
 */

/**
 * Analyzes an essay using Gemini AI with strict IELTS scoring.
 * Falls back to mock data if API key is not configured.
 * 
 * @param question - The IELTS question/prompt
 * @param essay - The student's essay
 * @param topic - Optional topic object to determine task type
 * @param apiKey - Optional API key override
 */
export const analyzeEssay = async (
    question: string,
    essay: string,
    topic?: Question,
    apiKey?: string
): Promise<AssessmentResult> => {

    // Get API key from localStorage (set in Admin Panel) or parameter
    const storedApiKey = localStorage.getItem('gemini_api_key') || localStorage.getItem('custom_api_key');
    const finalApiKey = apiKey || storedApiKey;

    // Calculate word count for validation
    const wordCount = essay.trim().split(/\s+/).filter(w => w.length > 0).length;

    // Pre-validation: Reject extremely short essays without calling API
    if (wordCount < 50) {
        throw new Error('❌ Essay Too Short: Please write at least 50 words to receive grading.');
    }

    // Determine task type from topic or default to task2
    const taskType = topic?.type || 'task2';

    // If no API key, use enhanced mock response
    if (!finalApiKey) {
        console.warn('No API key found. Using mock grading.');
        return getMockAssessment(essay, wordCount, taskType);
    }

    // Call Gemini with strict grading
    const config: GeminiConfig = {
        apiKey: finalApiKey
    };

    try {
        const result = await gradeEssay(question, essay, config, taskType);
        return result;
    } catch (error: any) {
        console.error('Gemini grading failed:', error);

        // If it's our custom error, re-throw it
        if (error.message?.startsWith('❌')) {
            throw error;
        }

        // Otherwise, provide helpful error
        throw new Error(`❌ Grading Failed: ${error.message || 'Unknown error occurred.'}`);
    }
};

/**
 * Enhanced mock assessment for when API key is not available.
 * Provides realistic feedback with annotations.
 */
function getMockAssessment(
    essay: string,
    wordCount: number,
    taskType: 'task1' | 'task2'
): AssessmentResult {
    // Calculate base score based on word count
    const optimalMin = taskType === 'task1' ? 150 : 250;
    const optimalMax = taskType === 'task1' ? 200 : 300;

    let baseScore = 6.0;
    let wordCountStatus: AssessmentResult['wordCountStatus'] = 'Optimal';

    if (wordCount < optimalMin * 0.6) {
        baseScore = 4.5;
        wordCountStatus = 'Severely Under Length';
    } else if (wordCount < optimalMin) {
        baseScore = 5.5;
        wordCountStatus = 'Too Short (Penalty Applied)';
    } else if (wordCount > optimalMax * 1.2) {
        baseScore = 5.5;
        wordCountStatus = 'Too Long (Penalty Applied)';
    }

    // Add slight variation to make it realistic
    const variation = () => (Math.random() - 0.5) * 0.5;
    const taskScore = Math.round((baseScore + variation()) * 2) / 2;
    const coherenceScore = Math.round((baseScore + variation()) * 2) / 2;
    const lexicalScore = Math.round((baseScore + variation()) * 2) / 2;
    const grammarScore = Math.round((baseScore + variation()) * 2) / 2;
    const overallBand = Math.round(((taskScore + coherenceScore + lexicalScore + grammarScore) / 4) * 2) / 2;

    return {
        overallBand: Math.min(9, Math.max(4, overallBand)),
        wordCount: wordCount,
        wordCountStatus: wordCountStatus,
        taskResponse: {
            score: Math.min(9, Math.max(4, taskScore)),
            feedback: `Your essay addresses the main aspects of the question. ${wordCount < optimalMin ? 'However, you have not met the minimum word count requirement, which limits your ability to fully develop your arguments. ' : ''}Consider providing more specific examples and evidence to strengthen your position. A Band 9 response would include detailed, relevant examples and a clear, consistent position throughout.`
        },
        coherenceCohesion: {
            score: Math.min(9, Math.max(4, coherenceScore)),
            feedback: 'The essay shows reasonable organization with clear paragraphing. To improve, use a wider variety of cohesive devices beyond "However" and "Therefore". Try using phrases like "This is exemplified by...", "In stark contrast...", or "Consequently..." to create smoother transitions between ideas.'
        },
        lexicalResource: {
            score: Math.min(9, Math.max(4, lexicalScore)),
            feedback: 'Your vocabulary is adequate for the task. To reach Band 7+, replace common words with more sophisticated alternatives. For example, instead of "important" use "paramount" or "pivotal". Instead of "very good" consider "exceptional" or "outstanding". Avoid word repetition by using synonyms.'
        },
        grammaticalRange: {
            score: Math.min(9, Math.max(4, grammarScore)),
            feedback: 'Grammar is generally accurate with good control of complex structures. Focus on: 1) Ensuring subject-verb agreement in complex sentences, 2) Using a mix of simple, compound, and complex sentences, 3) Checking article usage (a/an/the). Try incorporating conditional structures ("If governments were to...") for more variety.'
        },
        corrections: [
            {
                original: 'The technology is very important in modern life.',
                corrected: 'Technology plays a pivotal role in contemporary society.',
                explanation: 'Remove unnecessary article "The", replace "very important" with more academic vocabulary, and use a more sophisticated phrasing.'
            },
            {
                original: 'Many people thinks that...',
                corrected: 'Many people believe that...',
                explanation: 'Subject-verb agreement: "people" is plural, requiring "think" not "thinks". Also, "believe" is more formal than "think".'
            },
            {
                original: 'In conclusion, I believe that both sides have their merits.',
                corrected: 'In conclusion, while both perspectives present valid arguments, I firmly contend that...',
                explanation: 'Strengthen your conclusion with a clearer stance. Avoid sitting on the fence - take a definitive position.'
            }
        ],
        annotations: [
            {
                original_text: 'very',
                type: 'vocabulary_upgrade',
                correction: 'extremely / highly / remarkably',
                explanation: '"Very" is overused. Use stronger adverbs.',
                ui_color: 'yellow'
            },
            {
                original_text: 'good',
                type: 'vocabulary_upgrade',
                correction: 'beneficial / advantageous / favorable',
                explanation: 'Too basic for IELTS. Use C1-level vocabulary.',
                ui_color: 'yellow'
            },
            {
                original_text: 'But',
                type: 'style',
                correction: 'However, / Nevertheless, / Conversely,',
                explanation: 'Avoid starting sentences with "But" in formal writing.',
                ui_color: 'green'
            },
            {
                original_text: 'thing',
                type: 'vocabulary_upgrade',
                correction: 'factor / aspect / element / consideration',
                explanation: '"Thing" is too vague for academic writing.',
                ui_color: 'yellow'
            },
            {
                original_text: 'a lot of',
                type: 'style',
                correction: 'numerous / a significant number of / considerable',
                explanation: 'Informal phrase. Use academic alternatives.',
                ui_color: 'green'
            }
        ],
        summary: `Your essay demonstrates ${overallBand >= 6.5 ? 'competent' : 'developing'} IELTS writing skills. ${wordCountStatus !== 'Optimal' ? `⚠️ Word count issue: ${wordCountStatus}. ` : ''}Key areas for improvement: 1) Use more specific examples to support your arguments, 2) Expand your vocabulary with C1/C2 level words, 3) Vary your sentence structures more. ${overallBand < 6 ? 'Focus on meeting the minimum word count and addressing all parts of the question.' : 'To reach Band 7+, focus on precision in your vocabulary choices and more sophisticated grammar structures.'}`
    };
}
