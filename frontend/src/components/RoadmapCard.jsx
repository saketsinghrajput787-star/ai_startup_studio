import React from 'react'
import { Calendar } from 'lucide-react'

export default function RoadmapCard({ blueprint }) {
    if (!blueprint) return null

    const rawRoadmap = blueprint.roadmap || []
    const roadmap = Array.isArray(rawRoadmap)
        ? rawRoadmap
        : typeof rawRoadmap === 'string'
            ? rawRoadmap.split('\n').map(s => s.trim()).filter(Boolean)
            : []

    if (roadmap.length === 0) return null

    return (
        <div className="glass p-6 rounded-2xl space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-600/10 border border-amber-500/20 text-amber-400 rounded-xl">
                    <Calendar size={18} />
                </div>
                <h3 className="font-bold text-slate-100">Development Roadmap</h3>
            </div>

            <div className="relative border-l-2 border-slate-800 ml-4 space-y-8">
                {roadmap.map((step, idx) => {
                    const stepStr = typeof step === 'string'
                        ? step
                        : JSON.stringify(step)
                    return (
                        <div key={idx} className="relative pl-8 animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                            {/* Dot */}
                            <span className="absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-950 border-2 border-amber-500">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                            </span>
                            <div className="space-y-1">
                                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">Phase {idx + 1}</span>
                                <p className="text-sm font-semibold text-slate-200">{stepStr}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
