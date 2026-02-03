import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Star, CheckCircle, Copy, Check } from 'lucide-react';
import { Question } from '../types';

interface ExampleViewerProps {
    topic: Question;
    onBack: () => void;
}

const ExampleViewer: React.FC<ExampleViewerProps> = ({ topic, onBack }) => {
    const [activeBand, setActiveBand] = useState<'band9' | 'band7'>('band9');
    const [copied, setCopied] = useState(false);

    if (!topic) return null;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#0a0f1a] text-white flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#0a0f1a]/95 backdrop-blur-xl border-b border-white/5 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Dashboard</span>
                    </button>
                    <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                        <BookOpen className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Study Mode</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-6xl mx-auto w-full p-6 grid lg:grid-cols-2 gap-8">
                {/* Left Column: Question & Analysis */}
                <div className="space-y-6">
                    <div>
                        <span className="inline-block px-3 py-1 rounded-lg bg-white/5 text-slate-400 text-xs font-medium mb-3 border border-white/10">
                            {topic.category} • {topic.type === 'task1' ? 'Task 1 (Report)' : 'Task 2 (Essay)'}
                        </span>
                        <h1 className="text-3xl font-bold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white">
                            {topic.title}
                        </h1>
                        <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 shadow-xl">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Question Prompt</h3>
                            <p className="text-lg text-slate-200 leading-relaxed font-serif">
                                {topic.question}
                            </p>
                        </div>
                    </div>

                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Star className="w-4 h-4" /> Key Tips
                        </h3>
                        <ul className="space-y-3">
                            {topic.tips.map((tip, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                                    <CheckCircle className="w-4 h-4 text-amber-500/50 flex-shrink-0 mt-0.5" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Column: Model Answers */}
                <div className="flex flex-col h-full bg-[#111827] border border-white/10 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5">
                    {/* Tabs */}
                    <div className="flex border-b border-white/5 bg-[#0d121f]">
                        <button
                            onClick={() => setActiveBand('band9')}
                            className={`flex-1 py-4 text-sm font-bold tracking-wide transition-all relative ${activeBand === 'band9'
                                ? 'text-emerald-400 bg-emerald-500/5'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                }`}
                        >
                            Band 9.0 Answer
                            {activeBand === 'band9' && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveBand('band7')}
                            className={`flex-1 py-4 text-sm font-bold tracking-wide transition-all relative ${activeBand === 'band7'
                                ? 'text-amber-400 bg-amber-500/5'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                }`}
                        >
                            Band 7.0 Answer
                            {activeBand === 'band7' && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500" />
                            )}
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 lg:p-8 overflow-y-auto relative custom-scrollbar">
                        <div className="absolute top-6 right-6">
                            <button
                                onClick={() => handleCopy(activeBand === 'band9' ? topic.band9Answer : topic.band7Answer)}
                                className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="Copy to clipboard"
                            >
                                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className={`prose prose-invert max-w-none ${activeBand === 'band9' ? 'text-slate-200' : 'text-slate-300'}`}>
                            <p className="whitespace-pre-wrap leading-loose text-base lg:text-lg font-light">
                                {activeBand === 'band9' ? topic.band9Answer : topic.band7Answer}
                            </p>
                        </div>

                        {/* Footer Analysis */}
                        <div className={`mt-8 pt-6 border-t ${activeBand === 'band9' ? 'border-emerald-500/20' : 'border-amber-500/20'}`}>
                            <h4 className={`text-sm font-bold uppercase tracking-wider mb-2 ${activeBand === 'band9' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                Examiner's Note
                            </h4>
                            <p className="text-sm text-slate-500">
                                {activeBand === 'band9'
                                    ? "This answer demonstrates sophisticated vocabulary, varied sentence structures, and a highly coherent argument. It fully addresses all parts of the task."
                                    : "This answer is good and addresses the task. It has clear organization and vocabulary, but may contain minor errors or less complex sentence structures compared to a Band 9."}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ExampleViewer;
