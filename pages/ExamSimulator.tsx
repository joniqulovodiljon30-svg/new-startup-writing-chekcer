import React, { useState, useEffect, useCallback } from 'react';
import {
    ArrowLeft,
    Clock,
    Send,
    ChevronDown,
    ChevronUp,
    Lightbulb,
    BookOpen,
    AlertCircle,
    Loader2,
    Check,
    X,
    Award,
    TrendingUp,
    Edit3,
    RefreshCw,
    MessageSquare
} from 'lucide-react';
import { User, Question, AssessmentResult } from '../types';
import { analyzeEssay } from '../services/mockAi';

// ============================================
// PROPS INTERFACE
// ============================================

interface ExamSimulatorProps {
    currentUser: User;
    topic: Question;
    onBack: () => void;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// ============================================
// MAIN COMPONENT
// ============================================

const ExamSimulator: React.FC<ExamSimulatorProps> = ({ currentUser, topic, onBack }) => {
    // ========== STATE ==========
    const [essay, setEssay] = useState<string>('');
    const [timeRemaining, setTimeRemaining] = useState<number>(40 * 60); // 40 minutes in seconds
    const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
    const [showModelAnswer, setShowModelAnswer] = useState<boolean>(false);
    const [showTips, setShowTips] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [result, setResult] = useState<AssessmentResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showResult, setShowResult] = useState<boolean>(false);

    // ========== COMPUTED VALUES ==========
    const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;

    // ========== TIMER EFFECT ==========
    useEffect(() => {
        if (!isTimerRunning || timeRemaining <= 0) return;

        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    setIsTimerRunning(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isTimerRunning, timeRemaining]);

    // ========== HELPER FUNCTIONS ==========
    const getTimerColor = (): string => {
        if (timeRemaining <= 5 * 60) return 'text-red-400 bg-red-500/20 border-red-500/30';
        if (timeRemaining <= 10 * 60) return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
    };

    const getWordCountColor = (): string => {
        if (wordCount >= 250) return 'text-emerald-400';
        if (wordCount >= 200) return 'text-amber-400';
        return 'text-slate-400';
    };

    const getBandColor = (band: number): string => {
        if (band >= 7) return 'text-emerald-400';
        if (band >= 5.5) return 'text-amber-400';
        return 'text-red-400';
    };

    const getBandBg = (band: number): string => {
        if (band >= 7) return 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30';
        if (band >= 5.5) return 'from-amber-500/20 to-amber-500/5 border-amber-500/30';
        return 'from-red-500/20 to-red-500/5 border-red-500/30';
    };

    // ========== SUBMIT HANDLER ==========
    const handleSubmit = useCallback(async () => {
        if (wordCount < 50) {
            setError('Please write at least 50 words to submit.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const assessment = await analyzeEssay(topic.question, essay);
            setResult(assessment);

            // Save to localStorage
            const saved = localStorage.getItem(`submissions_${currentUser.id}`);
            const submissions = saved ? JSON.parse(saved) : [];
            submissions.push({
                id: Date.now().toString(),
                questionId: topic.id,
                essay,
                wordCount,
                timeSpent: 40 * 60 - timeRemaining,
                assessment,
                submittedAt: new Date().toISOString()
            });
            localStorage.setItem(`submissions_${currentUser.id}`, JSON.stringify(submissions));

            setShowResult(true);
            setIsTimerRunning(false);
        } catch (err: any) {
            setError(err.message || 'Failed to grade essay. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }, [essay, wordCount, topic, currentUser.id, timeRemaining]);

    // ========== RETRY HANDLER ==========
    const handleRetry = () => {
        setEssay('');
        setResult(null);
        setShowResult(false);
        setError(null);
        setTimeRemaining(40 * 60);
        setIsTimerRunning(true);
    };

    // ========== RENDER ==========
    return (
        <div className="min-h-screen bg-[#0a0f1a] flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#0a0f1a]/95 backdrop-blur-xl border-b border-white/5 px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline font-medium">Back to Topics</span>
                    </button>

                    <div className="flex items-center gap-3">
                        {/* Word Count */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                            <Edit3 className="w-4 h-4 text-slate-500" />
                            <span className={`text-sm font-semibold ${getWordCountColor()}`}>
                                {wordCount} words
                            </span>
                        </div>

                        {/* Timer */}
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getTimerColor()}`}>
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-bold font-mono">
                                {formatTime(timeRemaining)}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Split Screen */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Left Panel - Question & Info */}
                <div className="lg:w-1/2 bg-[#111827] border-b lg:border-b-0 lg:border-r border-white/5 overflow-y-auto">
                    <div className="p-6 lg:p-8 space-y-6">
                        {/* Question Section */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                                    {topic.category}
                                </span>
                                <span className="text-xs font-medium text-slate-500 bg-white/5 px-2 py-0.5 rounded-md">
                                    Task 2
                                </span>
                            </div>

                            <h1 className="text-xl lg:text-2xl font-bold text-white mb-4">
                                {topic.title}
                            </h1>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                                <p className="text-slate-300 leading-relaxed text-sm lg:text-base">
                                    {topic.question}
                                </p>
                                <p className="text-slate-500 text-sm mt-4 italic">
                                    Write at least 250 words. You should spend about 40 minutes.
                                </p>
                            </div>
                        </div>

                        {/* Tips Accordion */}
                        <div className="border border-white/10 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setShowTips(!showTips)}
                                className="w-full flex items-center justify-between p-4 bg-amber-500/5 hover:bg-amber-500/10 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5 text-amber-400" />
                                    <span className="font-semibold text-amber-300">Writing Tips</span>
                                </div>
                                {showTips ? (
                                    <ChevronUp className="w-5 h-5 text-amber-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-amber-400" />
                                )}
                            </button>

                            {showTips && (
                                <div className="p-4 bg-amber-500/5 border-t border-white/5">
                                    <ul className="space-y-2">
                                        {topic.tips.map((tip, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                                                <span className="text-amber-400 mt-0.5">•</span>
                                                {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Writing Area or Results */}
                <div className="lg:w-1/2 flex flex-col bg-[#0a0f1a] overflow-hidden">
                    {!showResult ? (
                        <>
                            {/* Textarea */}
                            <div className="flex-1 p-4 lg:p-6 overflow-hidden">
                                <textarea
                                    value={essay}
                                    onChange={(e) => setEssay(e.target.value)}
                                    placeholder="Start writing your essay here..."
                                    disabled={isSubmitting}
                                    className="w-full h-full min-h-[300px] lg:min-h-0 bg-[#111827] border border-white/10 rounded-2xl p-5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-none text-sm lg:text-base leading-relaxed transition-all"
                                />
                            </div>

                            {/* Error Display */}
                            {error && (
                                <div className="mx-4 lg:mx-6 mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-300">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="p-4 lg:p-6 border-t border-white/5">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || wordCount < 50}
                                    className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 disabled:shadow-none"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Analyzing Your Essay...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Submit for AI Grading
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-xs text-slate-600 mt-3">
                                    Minimum 50 words required • AI will analyze in ~2 seconds
                                </p>
                            </div>
                        </>
                    ) : result && (
                        /* Result Display */
                        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
                            {/* Overall Score */}
                            <div className={`bg-gradient-to-br ${getBandBg(result.overallBand)} border rounded-2xl p-6 text-center`}>
                                <p className="text-slate-400 text-sm font-medium mb-2">Overall Band Score</p>
                                <p className={`text-6xl font-black ${getBandColor(result.overallBand)}`}>
                                    {result.overallBand}
                                </p>
                                <div className="flex items-center justify-center gap-2 mt-3">
                                    <Award className={`w-5 h-5 ${getBandColor(result.overallBand)}`} />
                                    <span className={`text-sm font-semibold ${getBandColor(result.overallBand)}`}>
                                        {result.overallBand >= 7 ? 'Excellent!' : result.overallBand >= 5.5 ? 'Good Progress' : 'Keep Practicing'}
                                    </span>
                                </div>
                            </div>

                            {/* Criteria Breakdown */}
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { key: 'taskResponse', label: 'Task Response', data: result.taskResponse },
                                    { key: 'coherenceCohesion', label: 'Coherence & Cohesion', data: result.coherenceCohesion },
                                    { key: 'lexicalResource', label: 'Lexical Resource', data: result.lexicalResource },
                                    { key: 'grammaticalRange', label: 'Grammar & Accuracy', data: result.grammaticalRange }
                                ].map(({ key, label, data }) => (
                                    <div
                                        key={key}
                                        className="bg-white/5 border border-white/10 rounded-xl p-4"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-slate-500 font-medium uppercase">
                                                {label}
                                            </span>
                                            <span className={`text-xl font-bold ${getBandColor(data.score)}`}>
                                                {data.score}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 line-clamp-3">
                                            {data.feedback}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Corrections */}
                            {result.corrections.length > 0 && (
                                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                        <Edit3 className="w-4 h-4 text-amber-400" />
                                        Key Corrections
                                    </h3>
                                    <div className="space-y-4">
                                        {result.corrections.slice(0, 3).map((correction, idx) => (
                                            <div key={idx} className="text-sm">
                                                <div className="flex items-start gap-2 mb-1">
                                                    <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                                    <p className="text-red-300 line-through">{correction.original}</p>
                                                </div>
                                                <div className="flex items-start gap-2 mb-1">
                                                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                                    <p className="text-emerald-300">{correction.corrected}</p>
                                                </div>
                                                <p className="text-xs text-slate-500 ml-6">{correction.explanation}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Summary */}
                            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-5">
                                <h3 className="text-sm font-semibold text-indigo-300 mb-3 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Assessment Summary
                                </h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {result.summary}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleRetry}
                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Try Again
                                </button>
                                <button
                                    onClick={onBack}
                                    className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    New Topic
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export { ExamSimulator };
