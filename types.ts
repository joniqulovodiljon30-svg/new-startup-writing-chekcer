/**
 * IELTS Writing Simulator - Type Definitions
 * SINGLE SOURCE OF TRUTH FOR ALL TYPES
 */

// ============================================
// IELTS QUESTION TYPES
// ============================================

export interface Question {
  id: string;
  category: string;
  title: string;
  question: string;
  type?: 'task1' | 'task2';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tips: string[];
  band9Answer: string;
  band7Answer: string;
}

export type EssayTopic = Question;

// ============================================
// ASSESSMENT TYPES
// ============================================

export interface CriterionScore {
  score: number;
  feedback: string;
}

export interface Correction {
  original: string;
  corrected: string;
  explanation: string;
}

export interface AssessmentResult {
  overallBand: number;
  taskResponse: CriterionScore;
  coherenceCohesion: CriterionScore;
  lexicalResource: CriterionScore;
  grammaticalRange: CriterionScore;
  corrections: Correction[];
  summary: string;
}

// ============================================
// ESSAY SUBMISSION
// ============================================

export interface EssaySubmission {
  id: string;
  oderId: string;
  questionId: string;
  essay: string;
  wordCount: number;
  timeSpent: number;
  assessment: AssessmentResult;
  submittedAt: Date;
}

// ============================================
// USER MANAGEMENT
// ============================================

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  name: string;
  surname: string;
  username?: string;
  password?: string;
  role: UserRole;
  isPaid: boolean;
  registrationDate: number;
  questionsAnswered: number;
}

// ============================================
// APPLICATION STATE
// ============================================

export enum AppState {
  LOGIN_SELECTION = 'LOGIN_SELECTION',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  STUDENT_AUTH = 'STUDENT_AUTH',
  GET_KEY_AUTH = 'GET_KEY_AUTH',
  GET_KEY_DASHBOARD = 'GET_KEY_DASHBOARD',
  ADMIN = 'ADMIN',
  SETUP = 'SETUP',
  SESSION = 'SESSION'
}

export interface AccessKey {
  id: string;
  login: string;
  pass: string;
  type: 'PREMIUM_GIFT' | 'STANDARD_ACCESS';
  isUsed: boolean;
  generatedAt: number;
}

export interface UserLog {
  id: number;
  created_at: string;
  email: string;
  password: string;
}