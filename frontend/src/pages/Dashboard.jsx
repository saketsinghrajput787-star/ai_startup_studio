import React, { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { FileText, Database, ShieldAlert, Calendar, Sparkles, ArrowLeft, Server } from 'lucide-react'
import SummaryCard from '../components/SummaryCard.jsx'
import FeatureCard from '../components/FeatureCard.jsx'
import DatabaseCard from '../components/DatabaseCard.jsx'
import ApiCard from '../components/ApiCard.jsx'
import RoadmapCard from '../components/RoadmapCard.jsx'
import ArchitectureCard from '../components/ArchitectureCard.jsx'

export default function Dashboard() {
    const location = useLocation()
    const blueprint = location.state?.blueprint || null
    const [activeTab, setActiveTab] = useState('summary')

    if (!blueprint) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-fade-in-up">
                <div className="p-4 bg-slate-900 border border-slate-800 text-slate-400 rounded-3xl">
                    <Database size={40} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-100">No Blueprint Generated</h2>
                    <p className="text-sm text-slate-450 max-w-sm font-semibold">
                        Please navigate back and provide a startup idea for our RAG builder to generate a blueprint.
                    </p>
                </div>
                <Link
                    to="/"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold transition duration-2050"
                >
                    <ArrowLeft size={16} />
                    Go to Generator
                </Link>
            </div>
        )
    }

    const tabs = [
        { id: 'summary', name: 'Overview', icon: FileText },
        { id: 'features', name: 'Features', icon: Sparkles },
        { id: 'tech', name: 'Tech Stack', icon: Database },
        { id: 'architecture', name: '🏗️ System Architecture', icon: Server },
        { id: 'strategy', name: 'Strategy', icon: Calendar }
    ]

    return (
        <div className="space-y-8 animate-fade-in-up py-4">
            {/* Back Button */}
            <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors"
            >
                <ArrowLeft size={14} />
                Generate Another Idea
            </Link>

            {/* Title section */}
            <div>
                <h2 className="text-2xl font-bold text-slate-100 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    Startup Blueprint Details
                </h2>
                <p className="text-sm text-slate-450 mt-1">
                    Complete production-ready startup specifications built with RAG context.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-800/80 gap-2 md:gap-4 overflow-x-auto pb-px">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-bold transition duration-200 focus:outline-none whitespace-nowrap ${isActive ? 'border-violet-550 text-violet-400' : 'border-transparent text-slate-400 hover:text-slate-250 hover:border-slate-850'}`}
                        >
                            <Icon size={16} />
                            {tab.name}
                        </button>
                    )
                })}
            </div>

            {/* Render active content */}
            <div className="space-y-6">
                {activeTab === 'summary' && <SummaryCard blueprint={blueprint} />}

                {activeTab === 'features' && <FeatureCard blueprint={blueprint} />}

                {activeTab === 'tech' && (
                    <div className="space-y-6">
                        <DatabaseCard blueprint={blueprint} />
                        <ApiCard blueprint={blueprint} />
                    </div>
                )}

                {activeTab === 'architecture' && <ArchitectureCard blueprint={blueprint} />}

                {activeTab === 'strategy' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <RoadmapCard blueprint={blueprint} />
                        </div>

                        <div className="space-y-6">
                            {/* Risks */}
                            <div className="glass p-6 rounded-2xl space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-600/10 border border-red-500/20 text-red-500 rounded-xl">
                                        <ShieldAlert size={18} />
                                    </div>
                                    <h3 className="font-bold text-slate-100">Risks</h3>
                                </div>
                                <ul className="space-y-2">
                                    {(Array.isArray(blueprint.risks)
                                        ? blueprint.risks
                                        : typeof blueprint.risks === 'string'
                                            ? blueprint.risks.split('\n').map(r => r.trim()).filter(Boolean)
                                            : []
                                    ).map((risk, idx) => {
                                        const riskStr = typeof risk === 'string' ? risk : JSON.stringify(risk)
                                        return (
                                            <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-350 leading-relaxed font-semibold">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                                                {riskStr}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>

                            {/* Future Scope */}
                            <div className="glass p-6 rounded-2xl space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-600/10 border border-green-500/20 text-green-400 rounded-xl">
                                        <Sparkles size={18} />
                                    </div>
                                    <h3 className="font-bold text-slate-100">Future Scope</h3>
                                </div>
                                <ul className="space-y-2">
                                    {(Array.isArray(blueprint.future_scope)
                                        ? blueprint.future_scope
                                        : typeof blueprint.future_scope === 'string'
                                            ? blueprint.future_scope.split('\n').map(f => f.trim()).filter(Boolean)
                                            : []
                                    ).map((scope, idx) => {
                                        const scopeStr = typeof scope === 'string' ? scope : JSON.stringify(scope)
                                        return (
                                            <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-350 leading-relaxed font-semibold">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                                                {scopeStr}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
