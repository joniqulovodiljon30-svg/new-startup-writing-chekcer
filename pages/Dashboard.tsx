import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    Clock,
    Star,
    ChevronRight,
    GraduationCap,
    LogOut,
    TrendingUp,
    FileText,
    Filter
} from 'lucide-react';
import { User, Question } from '../types';
import { EXAM_TOPICS } from '../data/examQuestions';

// ============================================
// PROPS INTERFACE
// ============================================

interface DashboardProps {
    currentUser: User;
    onStartExam: (topic: Question) => void;
    onLogout: () => void;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
        case 'Easy':
            return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
        case 'Medium':
            return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
        case 'Hard':
            return 'text-red-400 bg-red-500/10 border-red-500/30';
        default:
            return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
};

const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
        'Education': 'text-blue-400 bg-blue-500/10',
        'Technology': 'text-purple-400 bg-purple-500/10',
        'Environment': 'text-green-400 bg-green-500/10',
        'Health': 'text-pink-400 bg-pink-500/10',
        'Society': 'text-orange-400 bg-orange-500/10',
    };
    return colors[category] || 'text-indigo-400 bg-indigo-500/10';
};

// ============================================
// MAIN COMPONENT
// ============================================

const Dashboard: React.FC<DashboardProps> = ({ currentUser, onStartExam, onLogout }) => {
    // State
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [submissions, setSubmissions] = useState<any[]>([]);

    // Get unique categories
    const categories = ['All', ...Array.from(new Set(EXAM_TOPICS.map(t => t.category)))];

    // Filter topics by category
    const filteredTopics = selectedCategory === 'All'
        ? EXAM_TOPICS
        : EXAM_TOPICS.filter(t => t.category === selectedCategory);

    // Load submissions from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(`submissions_${currentUser.id}`);
        if (saved) {
            try {
                setSubmissions(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load submissions:', e);
            }
        }
    }, [currentUser.id]);

    // Calculate stats
    const essayCount = submissions.length;
    const avgBand = essayCount > 0
        ? (submissions.reduce((acc, s) => acc + (s.assessment?.overallBand || 0), 0) / essayCount).toFixed(1)
        : '0.0';

    return (
        <div className="min-h-screen bg-[#0a0f1a]">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#0a0f1a]/95 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">IELTS Writing AI</h1>
                                <p className="text-sm text-slate-400">Welcome, {currentUser.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-[#111827] border border-white/5 rounded-2xl p-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 rounded-lg">
                                <FileText className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{essayCount}</p>
                                <p className="text-sm text-slate-400">Essays Written</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#111827] border border-white/5 rounded-2xl p-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{avgBand}</p>
                                <p className="text-sm text-slate-400">Avg. Band Score</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#111827] border border-white/5 rounded-2xl p-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Clock className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">40</p>
                                <p className="text-sm text-slate-400">Min per Essay</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#111827] border border-white/5 rounded-2xl p-5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Star className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{EXAM_TOPICS.length}</p>
                                <p className="text-sm text-slate-400">Topics Available</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                    <Filter className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === category
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Topics Grid */}
                <div className="grid gap-4">
                    {filteredTopics.map(topic => (
                        <div
                            key={topic.id}
                            className="group bg-[#111827] border border-white/5 rounded-2xl p-6 hover:border-indigo-500/30 transition-all"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                {/* Topic Info */}
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-md ${getCategoryColor(topic.category)}`}>
                                            {topic.category}
                                        </span>
                                        <span className={`text-xs font-medium px-2 py-1 rounded-md border ${getDifficultyColor(topic.difficulty)}`}>
                                            {topic.difficulty}
                                        </span>
                                        <span className="text-xs font-medium px-2 py-1 rounded-md bg-white/5 text-slate-400">
                                            {topic.type}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                                        {topic.title}
                                    </h3>
                                    <p className="text-sm text-slate-400 line-clamp-2">
                                        {topic.question}
                                    </p>
                                </div>

                                {/* Action Button */}
                                <button
                                    onClick={() => onStartExam(topic)}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    Start Practice
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredTopics.length === 0 && (
                    <div className="text-center py-12">
                        <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">No topics found in this category.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export { Dashboard };
export { EXAM_TOPICS };
