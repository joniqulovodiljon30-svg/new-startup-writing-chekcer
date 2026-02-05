import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    ArrowLeft,
    Clock,
    Send,
    ChevronDown,
    ChevronUp,
    Lightbulb,
    AlertCircle,
    Loader2,
    Check,
    X,
    Award,
    TrendingUp,
    Edit3,
    RefreshCw,
    MessageSquare,
    AlertTriangle,
    Palette
} from 'lucide-react';
import { User, Question, AssessmentResult, Annotation } from '../types';
import { analyzeEssay } from '../services/mockAi';

// ============================================
// PROPS INTERFACE
// ============================================

interface ExamSimulatorProps {
    currentUser: User;
    topic: Question;
    onBack: () => void;
    apiKey?: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Color mapping for annotations
const getAnnotationStyles = (color: string): { bg: string; border: string; text: string } => {
    const styles: Record<string, { bg: string; border: string; text: string }> = {
        red: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400' },
        yellow: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400' },
        green: { bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400' },
        blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400' },
        orange: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400' }
    };
    return styles[color] || styles.red;
};

// ============================================
// HIGHLIGHTED ESSAY COMPONENT
// ============================================

interface HighlightedEssayProps {
    essay: string;
    annotations: Annotation[];
    onAnnotationClick: (annotation: Annotation) => void;
}

const HighlightedEssay: React.FC<HighlightedEssayProps> = ({ essay, annotations, onAnnotationClick }) => {
    // Create highlighted text with annotations
    const highlightedContent = useMemo(() => {
        if (!annotations || annotations.length === 0) {
            return <span className="text-slate-300 whitespace-pre-wrap">{essay}</span>;
        }

        let result: React.ReactNode[] = [];
        let lastIndex = 0;
        let keyIndex = 0;

        // Sort annotations by their position in the essay
        const sortedAnnotations = [...annotations]
            .map(a => ({
                ...a,
                index: essay.toLowerCase().indexOf(a.original_text.toLowerCase())
            }))
            .filter(a => a.index !== -1)
            .sort((a, b) => a.index - b.index);

        for (const annotation of sortedAnnotations) {
            const startIndex = essay.toLowerCase().indexOf(annotation.original_text.toLowerCase(), lastIndex);

            if (startIndex === -1) continue;
            if (startIndex < lastIndex) continue; // Skip overlapping

            // Add text before the annotation
            if (startIndex > lastIndex) {
                result.push(
                    <span key={keyIndex++} className="text-slate-300">
                        {essay.substring(lastIndex, startIndex)}
                    </span>
                );
            }

            // Add the highlighted annotation
            const styles = getAnnotationStyles(annotation.ui_color);
            result.push(
                <span
                    key={keyIndex++}
                    className={`${styles.bg} ${styles.border} border-b-2 cursor-pointer hover:opacity-80 transition-opacity relative group`}
                    onClick={() => onAnnotationClick(annotation)}
                    title={`${annotation.type}: ${annotation.explanation}`}
                >
                    {essay.substring(startIndex, startIndex + annotation.original_text.length)}
                    {/* Tooltip */}
                    <span className={`absolute bottom-full left-0 mb-1 px-2 py-1 text-xs rounded bg-slate-800 border border-white/10 ${styles.text} opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none`}>
                        {annotation.correction}
                    </span>
                </span>
            );

            lastIndex = startIndex + annotation.original_text.length;
        }

        // Add remaining text
        if (lastIndex < essay.length) {
            result.push(
                <span key={keyIndex++} className="text-slate-300">
                    {essay.substring(lastIndex)}
                </span>
            );
        }

        return result;
    }, [essay, annotations, onAnnotationClick]);

    return (
        <div className="bg-[#111827] border border-white/10 rounded-xl p-5 text-sm leading-relaxed whitespace-pre-wrap">
            {highlightedContent}
        </div>
    );
};

// ============================================
// ANNOTATION LEGEND
// ============================================

const AnnotationLegend: React.FC = () => (
    <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-500/30 border border-red-500/50"></span>
            <span className="text-slate-400">Grammar Error</span>
        </div>
        <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-orange-500/30 border border-orange-500/50"></span>
            <span className="text-slate-400">Spelling</span>
        </div>
        <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-yellow-500/30 border border-yellow-500/50"></span>
            <span className="text-slate-400">Vocabulary Upgrade</span>
        </div>
        <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-green-500/30 border border-green-500/50"></span>
            <span className="text-slate-400">Style Suggestion</span>
        </div>
        <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-500/30 border border-blue-500/50"></span>
            <span className="text-slate-400">Coherence</span>
        </div>
    </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

const ExamSimulator: React.FC<ExamSimulatorProps> = ({ currentUser, topic, onBack, apiKey }) => {
    // ========== STATE ==========
    const [essay, setEssay] = useState<string>('');
    const [timeRemaining, setTimeRemaining] = useState<number>(topic.type === 'task1' ? 20 * 60 : 40 * 60);
    const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
    const [showTips, setShowTips] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [result, setResult] = useState<AssessmentResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showResult, setShowResult] = useState<boolean>(false);

    // NEW: Edit mode state
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedEssay, setEditedEssay] = useState<string>('');
    const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);

    // ========== COMPUTED VALUES ==========
    const wordCount = essay.trim() ? essay.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
    const optimalMin = topic.type === 'task1' ? 150 : 250;
    const optimalMax = topic.type === 'task1' ? 200 : 300;

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
        if (wordCount >= optimalMin && wordCount <= optimalMax) return 'text-emerald-400';
        if (wordCount >= optimalMin * 0.8) return 'text-amber-400';
        return 'text-slate-400';
    };

    const getWordCountStatus = (): string => {
        if (wordCount < optimalMin * 0.6) return 'Too Short!';
        if (wordCount < optimalMin) return 'Under target';
        if (wordCount > optimalMax * 1.2) return 'Too Long!';
        if (wordCount > optimalMax) return 'Slightly long';
        return 'Good length';
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
            const assessment = await analyzeEssay(topic.question, essay, topic, apiKey);
            setResult(assessment);

            // Save to localStorage
            const saved = localStorage.getItem(`submissions_${currentUser.id}`);
            const submissions = saved ? JSON.parse(saved) : [];
            submissions.push({
                id: Date.now().toString(),
                questionId: topic.id,
                essay,
                wordCount,
                timeSpent: (topic.type === 'task1' ? 20 * 60 : 40 * 60) - timeRemaining,
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
    }, [essay, wordCount, topic, currentUser.id, timeRemaining, apiKey]);

    // ========== EDIT HANDLERS ==========
    const handleStartEdit = () => {
        setEditedEssay(essay);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedEssay('');
    };

    const handleResubmit = async () => {
        if (editedEssay.trim().split(/\s+/).length < 50) {
            setError('Please write at least 50 words to submit.');
            return;
        }

        setEssay(editedEssay);
        setIsEditing(false);
        setShowResult(false);
        setResult(null);

        // Re-submit automatically
        setIsSubmitting(true);
        setError(null);

        try {
            const assessment = await analyzeEssay(topic.question, editedEssay, topic, apiKey);
            setResult(assessment);
            setShowResult(true);
        } catch (err: any) {
            setError(err.message || 'Failed to grade essay. Please try again.');
            setShowResult(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    // ========== RETRY HANDLER ==========
    const handleRetry = () => {
        setEssay('');
        setResult(null);
        setShowResult(false);
        setError(null);
        setIsEditing(false);
        setEditedEssay('');
        setSelectedAnnotation(null);
        setTimeRemaining(topic.type === 'task1' ? 20 * 60 : 40 * 60);
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
                        {/* Word Count with Status */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                            <Edit3 className="w-4 h-4 text-slate-500" />
                            <span className={`text-sm font-semibold ${getWordCountColor()}`}>
                                {wordCount} / {optimalMin}-{optimalMax}
                            </span>
                            <span className={`text-xs ${getWordCountColor()}`}>
                                ({getWordCountStatus()})
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
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${topic.type === 'task1' ? 'text-emerald-400 bg-emerald-500/10' : 'text-indigo-400 bg-indigo-500/10'}`}>
                                    {topic.type === 'task1' ? 'Task 1' : 'Task 2'}
                                </span>
                                <span className="text-xs font-medium text-slate-500 bg-white/5 px-2 py-0.5 rounded-md">
                                    {topic.category}
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
                                    Write {optimalMin}-{optimalMax} words. Time: {topic.type === 'task1' ? '20' : '40'} minutes.
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
                                    Minimum 50 words required • Strict IELTS grading
                                </p>
                            </div>
                        </>
                    ) : isEditing ? (
                        /* Edit Mode */
                        <div className="flex-1 flex flex-col p-4 lg:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <Edit3 className="w-5 h-5 text-indigo-400" />
                                    Edit Your Essay
                                </h3>
                                <button
                                    onClick={handleCancelEdit}
                                    className="text-sm text-slate-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                            </div>

                            <textarea
                                value={editedEssay}
                                onChange={(e) => setEditedEssay(e.target.value)}
                                className="flex-1 min-h-[300px] bg-[#111827] border border-white/10 rounded-xl p-5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none text-sm leading-relaxed"
                            />

                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={handleCancelEdit}
                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleResubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="w-4 h-4" />
                                    )}
                                    Resubmit for Grading
                                </button>
                            </div>
                        </div>
                    ) : result && (
                        /* Result Display */
                        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
                            {/* Word Count Warning */}
                            {result.wordCountStatus && result.wordCountStatus !== 'Optimal' && (
                                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-amber-300">Word Count: {result.wordCountStatus}</p>
                                        <p className="text-xs text-amber-400/70 mt-1">
                                            You wrote {result.wordCount} words. Optimal range is {optimalMin}-{optimalMax}.
                                        </p>
                                    </div>
                                </div>
                            )}

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

                            {/* Criteria Breakdown - ENHANCED */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                                    Skill Assessment
                                </h3>
                                {[
                                    { key: 'taskResponse', label: 'Task Response', data: result.taskResponse, icon: '📝' },
                                    { key: 'coherenceCohesion', label: 'Coherence & Cohesion', data: result.coherenceCohesion, icon: '🔗' },
                                    { key: 'lexicalResource', label: 'Lexical Resource', data: result.lexicalResource, icon: '📚' },
                                    { key: 'grammaticalRange', label: 'Grammar & Accuracy', data: result.grammaticalRange, icon: '✍️' }
                                ].map(({ key, label, data, icon }) => (
                                    <div
                                        key={key}
                                        className="bg-white/5 border border-white/10 rounded-xl p-4"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span>{icon}</span>
                                                <span className="text-sm text-slate-300 font-medium">
                                                    {label}
                                                </span>
                                            </div>
                                            <span className={`text-xl font-bold ${getBandColor(data.score)}`}>
                                                {data.score}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            {data.feedback}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Your Essay with Annotations */}
                            {result.annotations && result.annotations.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                            <Palette className="w-4 h-4 text-purple-400" />
                                            Your Essay (Click highlights for suggestions)
                                        </h3>
                                    </div>
                                    <AnnotationLegend />
                                    <HighlightedEssay
                                        essay={essay}
                                        annotations={result.annotations}
                                        onAnnotationClick={setSelectedAnnotation}
                                    />
                                </div>
                            )}

                            {/* Selected Annotation Detail */}
                            {selectedAnnotation && (
                                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${getAnnotationStyles(selectedAnnotation.ui_color).bg} ${getAnnotationStyles(selectedAnnotation.ui_color).text}`}>
                                            {selectedAnnotation.type.replace('_', ' ')}
                                        </span>
                                        <button onClick={() => setSelectedAnnotation(null)} className="text-slate-500 hover:text-white">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-start gap-2">
                                            <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                            <p className="text-red-300 line-through">{selectedAnnotation.original_text}</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                            <p className="text-emerald-300">{selectedAnnotation.correction}</p>
                                        </div>
                                        <p className="text-xs text-slate-400 ml-6">{selectedAnnotation.explanation}</p>
                                    </div>
                                </div>
                            )}

                            {/* Corrections */}
                            {result.corrections.length > 0 && (
                                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                                        <Edit3 className="w-4 h-4 text-amber-400" />
                                        Key Corrections
                                    </h3>
                                    <div className="space-y-4">
                                        {result.corrections.slice(0, 5).map((correction, idx) => (
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
                                    onClick={handleStartEdit}
                                    className="flex-1 py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Edit & Resubmit
                                </button>
                                <button
                                    onClick={handleRetry}
                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Try Again
                                </button>
                            </div>
                            <button
                                onClick={onBack}
                                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <MessageSquare className="w-4 h-4" />
                                New Topic
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export { ExamSimulator };
