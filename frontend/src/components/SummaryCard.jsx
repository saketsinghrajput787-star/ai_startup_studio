import React from 'react'
import { FileText, Target, AlertCircle, Sparkles, Cpu, CreditCard } from 'lucide-react'

export default function SummaryCard({ blueprint }) {
    if (!blueprint) return null

    return (
        <div className="space-y-6">
            {/* Executive Summary & UVP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-2xl relative overflow-hidden space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-xl">
                            <FileText size={18} />
                        </div>
                        <h3 className="font-bold text-slate-100">Executive Summary</h3>
                    </div>
                    <p className="text-sm text-slate-350 leading-relaxed font-semibold">
                        {blueprint.executive_summary}
                    </p>
                </div>

                <div className="glass p-6 rounded-2xl relative overflow-hidden space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-fuchsia-600/10 border border-fuchsia-500/20 text-fuchsia-400 rounded-xl">
                            <Sparkles size={18} />
                        </div>
                        <h3 className="font-bold text-slate-100">Unique Value Proposition</h3>
                    </div>
                    <p className="text-sm text-fuchsia-350 leading-relaxed font-semibold">
                        {blueprint.unique_value_proposition}
                    </p>
                </div>
            </div>

            {/* Target Audience & Problem Statement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                            <Target size={18} />
                        </div>
                        <h3 className="font-bold text-slate-100">Target Audience</h3>
                    </div>
                    <p className="text-sm text-slate-350 leading-relaxed font-medium">
                        {blueprint.target_audience}
                    </p>
                </div>

                <div className="glass p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-600/10 border border-amber-500/20 text-amber-400 rounded-xl">
                            <AlertCircle size={18} />
                        </div>
                        <h3 className="font-bold text-slate-100">Problem Statement</h3>
                    </div>
                    <p className="text-sm text-slate-350 leading-relaxed font-medium">
                        {blueprint.problem_statement}
                    </p>
                </div>
            </div>

            {/* System Architecture & Business Model */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-2xl space-y-4 flex flex-col">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl">
                            <Cpu size={18} />
                        </div>
                        <h3 className="font-bold text-slate-100">System Architecture</h3>
                    </div>
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 whitespace-pre-wrap flex-grow leading-relaxed">
                        {blueprint.architecture}
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl space-y-4 flex flex-col">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-600/10 border border-rose-500/20 text-rose-400 rounded-xl">
                            <CreditCard size={18} />
                        </div>
                        <h3 className="font-bold text-slate-100">Business Model</h3>
                    </div>
                    <p className="text-sm text-slate-350 leading-relaxed font-medium flex-grow">
                        {blueprint.business_model}
                    </p>
                </div>
            </div>
        </div>
    )
}
