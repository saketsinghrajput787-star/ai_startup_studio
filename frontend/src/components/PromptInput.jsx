import React, { useState } from 'react'

export default function PromptInput({ onSubmit, isLoading }) {
    const [idea, setIdea] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (idea.trim().length >= 10) {
            onSubmit(idea)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto space-y-4 animate-fade-in-up">
            <div className="relative group">
                {/* Glow glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl blur opacity-30 group-focus-within:opacity-70 transition duration-300" />
                <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Describe your startup idea in detail (e.g., 'An AI-powered recipe planner that scans user fridge images and suggests low-waste meals...')"
                    className="relative w-full h-44 p-5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50 resize-none text-base font-medium transition duration-200"
                    disabled={isLoading}
                />
            </div>
            <div className="flex justify-between items-center px-2">
                <span className="text-xs text-slate-450 font-bold">Minimum 10 characters</span>
                <button
                    type="submit"
                    disabled={idea.trim().length < 10 || isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-violet-500/20 disabled:opacity-40 disabled:pointer-events-none transition duration-200"
                >
                    {isLoading ? 'Processing...' : 'Build Blueprint 🚀'}
                </button>
            </div>
        </form>
    )
}
