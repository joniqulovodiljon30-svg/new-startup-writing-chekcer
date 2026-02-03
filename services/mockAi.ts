import { AssessmentResult } from '../types';

/**
 * Mock AI Service for testing purposes
 * Replace with real Gemini API later
 */

/**
 * Simulates AI essay analysis with a 2-second delay
 * Returns realistic-looking mock assessment data
 */
export const analyzeEssay = async (
    question: string,
    essay: string
): Promise<AssessmentResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Calculate word count for scoring simulation
    const wordCount = essay.trim().split(/\s+/).length;

    // Generate mock scores based on essay length (for demo purposes)
    const baseScore = Math.min(9, Math.max(4, 5 + (wordCount - 200) / 100));
    const randomVariation = () => (Math.random() - 0.5) * 1;

    const taskScore = Math.round((baseScore + randomVariation()) * 2) / 2;
    const coherenceScore = Math.round((baseScore + randomVariation()) * 2) / 2;
    const lexicalScore = Math.round((baseScore + randomVariation()) * 2) / 2;
    const grammarScore = Math.round((baseScore + randomVariation()) * 2) / 2;

    const overallBand = Math.round(((taskScore + coherenceScore + lexicalScore + grammarScore) / 4) * 2) / 2;

    return {
        overallBand: Math.min(9, Math.max(4, overallBand)),
        taskResponse: {
            score: Math.min(9, Math.max(4, taskScore)),
            feedback: 'Your essay addresses the main aspects of the question. Consider developing your arguments with more specific examples and evidence to strengthen your response.'
        },
        coherenceCohesion: {
            score: Math.min(9, Math.max(4, coherenceScore)),
            feedback: 'The essay demonstrates reasonable organization with clear paragraphing. Work on using a wider range of cohesive devices to improve the flow between ideas.'
        },
        lexicalResource: {
            score: Math.min(9, Math.max(4, lexicalScore)),
            feedback: 'You demonstrate adequate vocabulary for the topic. Try to incorporate more sophisticated vocabulary and avoid repetition of common words.'
        },
        grammaticalRange: {
            score: Math.min(9, Math.max(4, grammarScore)),
            feedback: 'Your grammar shows competent control of complex structures. Focus on maintaining accuracy while attempting more varied sentence patterns.'
        },
        corrections: [
            {
                original: 'The technology is very important in modern life.',
                corrected: 'Technology plays a vital role in modern life.',
                explanation: 'Avoid unnecessary articles and use more varied vocabulary instead of "very important".'
            },
            {
                original: 'Many people thinks that...',
                corrected: 'Many people think that...',
                explanation: 'Subject-verb agreement: "people" is plural, so use "think" not "thinks".'
            },
            {
                original: 'In conclusion, I believe that both sides have their merits.',
                corrected: 'In conclusion, while both perspectives have merit, I firmly believe that...',
                explanation: 'Strengthen your conclusion with a clearer personal stance.'
            }
        ],
        summary: `Overall, this is a ${overallBand >= 7 ? 'strong' : overallBand >= 5.5 ? 'competent' : 'developing'} essay that ${overallBand >= 7 ? 'effectively addresses' : 'adequately responds to'} the question. ${wordCount >= 250 ? 'You have met the minimum word count requirement.' : 'Consider writing at least 250 words to fully develop your ideas.'} Focus on ${overallBand < 6.5 ? 'developing your arguments with more specific examples and improving grammatical accuracy' : 'refining your vocabulary choices and strengthening cohesive devices'} to improve your band score.`
    };
};
