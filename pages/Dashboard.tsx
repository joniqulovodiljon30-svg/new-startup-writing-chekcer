import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen,
    PenTool,
    Layout,
    Clock,
    ChevronRight,
    LogOut,
    GraduationCap,
    TrendingUp,
    FileText,
    Star
} from 'lucide-react';
import { User, Question } from '../types';
import { EXAM_TOPICS } from '../data/examQuestions';

// ============================================
// PROPS INTERFACE
// ============================================

interface DashboardProps {
    currentUser: User;
    onStartExam?: (topic: Question) => void;
    onViewExample?: (topic: Question) => void;
    onLogout: () => void;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
        'Education': 'text-blue-400 bg-blue-500/10',
        'Technology': 'text-purple-400 bg-purple-500/10',
        'Environment': 'text-green-400 bg-green-500/10',
        'Health': 'text-pink-400 bg-pink-500/10',
        'Society': 'text-orange-400 bg-orange-500/10',
        'Bar Chart': 'text-emerald-400 bg-emerald-500/10',
        'Map': 'text-amber-400 bg-amber-500/10',
        'Line Graph': 'text-cyan-400 bg-cyan-500/10'
    };
    return colors[category] || 'text-indigo-400 bg-indigo-500/10';
};

// ============================================
// MAIN COMPONENT
// ============================================

const Dashboard: React.FC<DashboardProps> = ({ currentUser, onStartExam, onViewExample, onLogout }: DashboardProps) => {
    const navigate = useNavigate();
    // Filtrlash uchun state: 'all', 'task1', yoki 'task2'
    const [filterType, setFilterType] = useState<'all' | 'task1' | 'task2'>('all');
    const [submissions, setSubmissions] = useState<any[]>([]);

    // Savollarni filtrlash logikasi
    const filteredTopics = EXAM_TOPICS.filter(topic => {
        if (filterType === 'all') return true;
        return topic.type === filterType;
    });

    // Load submissions from localStorage (Optional stats)
    useEffect(() => {
        if (currentUser?.id) {
            const saved = localStorage.getItem(`submissions_${currentUser.id}`);
            if (saved) {
                try {
                    setSubmissions(JSON.parse(saved));
                } catch (e) {
                    console.error('Failed to load submissions:', e);
                }
            }
        }
    }, [currentUser]);

    // Handle Start Exam
    const handleStartExam = (topic: Question) => {
        if (onStartExam) {
            onStartExam(topic);
        } else {
            navigate(`/exam/${topic.id}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f1a] text-white p-6">
            <header className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">IELTS Writing Simulator</h1>
                    <p className="text-slate-400">Master both Task 1 and Task 2 with AI grading.</p>
                </div>
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </header>

            <main className="max-w-6xl mx-auto">
                {/* --- FILTR TUGMALARI --- */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`px-6 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${filterType === 'all' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                        All Tasks
                    </button>
                    <button
                        onClick={() => setFilterType('task1')}
                        className={`px-6 py-2 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap ${filterType === 'task1' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                        <Layout className="w-4 h-4" /> Task 1 (Reports)
                    </button>
                    <button
                        onClick={() => setFilterType('task2')}
                        className={`px-6 py-2 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap ${filterType === 'task2' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                    >
                        <PenTool className="w-4 h-4" /> Task 2 (Essays)
                    </button>
                </div>

                {/* --- SAVOLLAR RO'YXATI --- */}
                <div className="grid md:grid-cols-2 gap-4">
                    {filteredTopics.map((topic: Question) => (
                        <div key={topic.id} className="bg-[#111827] border border-white/5 p-6 rounded-2xl hover:border-indigo-500/50 transition-colors group">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-lg text-xs font-medium ${topic.type === 'task1' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                    {topic.type === 'task1' ? 'Task 1' : 'Task 2'}
                                </span>
                                <span className={`text-xs font-medium px-2 py-1 rounded-md ${getCategoryColor(topic.category)}`}>{topic.category}</span>
                            </div>

                            <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-400 transition-colors">{topic.title}</h3>
                            <p className="text-slate-400 text-sm line-clamp-2 mb-4">{topic.question}</p>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-2 text-slate-500 text-xs">
                                    <Clock className="w-4 h-4" />
                                    {topic.type === 'task1' ? '20 mins' : '40 mins'}
                                </div>
                                <button
                                    onClick={() => handleStartExam(topic)}
                                    className="flex items-center gap-2 text-indigo-400 font-medium text-sm group-hover:translate-x-1 transition-transform"
                                >
                                    Start Practice <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                                <button
                                    onClick={() => onViewExample?.(topic)}
                                    className="text-xs font-semibold text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                                >
                                    <BookOpen className="w-3.5 h-3.5" />
                                    View Model Answers
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {filteredTopics.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400">No topics found for this filter.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
