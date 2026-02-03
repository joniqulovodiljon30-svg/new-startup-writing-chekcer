import { Question } from '../types';

/**
 * IELTS Writing Task 2 Questions Database
 */
import writing9Data from './writing9_dump.json';

// JSON dagi ma'lumotlarni bizning Type ga moslaymiz
export const EXAM_TOPICS: Question[] = writing9Data.map((item: any) => ({
    id: item.id,
    category: item.category || 'IELTS Writing',
    title: item.title,
    question: item.questionText,
    modelAnswer: item.modelAnswer,
    tips: item.tips,
    difficulty: 'Hard' as const // Hammasini default Hard qilib turamiz
}));

// Export default question for legacy compatibility
export const DEFAULT_EXAM_CONTENT = EXAM_TOPICS[0].question;
