import React from 'react'
import { Sparkles } from 'lucide-react'

export default function Navbar() {
    return (
        <header className="sticky top-0 z-30 w-full glass border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
            <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">Studio Console</h1>
                <p className="text-xs text-slate-450">Turn startup ideas into validation-ready blueprints</p>
            </div>

            <div className="flex items-center gap-4">
                <a
                    href="https://ai.google.dev/gemini-api/docs"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-white transition-colors font-semibold"
                >
                    Docs
                </a>
                <div className="h-4 w-px bg-slate-850" />
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-850 rounded-lg">
                    <Sparkles size={14} className="text-violet-400" />
                    <span className="text-xs font-bold text-slate-300">RAG Active</span>
                </div>
            </div>
        </header>
    )
}
