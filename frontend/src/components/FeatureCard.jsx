import React from 'react'
import { CheckSquare, Star } from 'lucide-react'

export default function FeatureCard({ blueprint }) {
    if (!blueprint) return null

    const rawFeatures = blueprint.core_features || []
    const coreFeatures = Array.isArray(rawFeatures)
        ? rawFeatures
        : typeof rawFeatures === 'string'
            ? rawFeatures.split('\n').map(f => f.trim()).filter(Boolean)
            : []

    const rawStories = blueprint.user_stories || []
    const userStories = Array.isArray(rawStories)
        ? rawStories
        : typeof rawStories === 'string'
            ? rawStories.split('\n').map(s => s.trim()).filter(Boolean)
            : []

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Core Features */}
            <div className="glass p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                        <Star size={18} />
                    </div>
                    <h3 className="font-bold text-slate-100">Core Features</h3>
                </div>
                <ul className="space-y-3">
                    {coreFeatures.map((feature, idx) => {
                        const featureStr = typeof feature === 'string' ? feature : JSON.stringify(feature)
                        return (
                            <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-350 leading-relaxed font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                                {featureStr}
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* User Stories */}
            <div className="glass p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-fuchsia-600/10 border border-fuchsia-500/20 text-fuchsia-400 rounded-xl">
                        <CheckSquare size={18} />
                    </div>
                    <h3 className="font-bold text-slate-100">User Stories</h3>
                </div>
                <ul className="space-y-3">
                    {userStories.map((story, idx) => {
                        const storyStr = typeof story === 'string' ? story : JSON.stringify(story)
                        return (
                            <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-350 leading-relaxed font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 mt-2 flex-shrink-0" />
                                {storyStr}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}
