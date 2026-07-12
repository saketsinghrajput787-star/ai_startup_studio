import React from 'react'

export default function Loading({ message = "Generating blueprint..." }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="relative w-20 h-20 mb-6">
                {/* Outer Ring */}
                <div className="absolute inset-0 border-4 border-violet-500/20 rounded-full animate-pulse-slow" />
                {/* Spinning Gradient Ring */}
                <div className="absolute inset-0 border-4 border-t-violet-500 border-r-fuchsia-500 rounded-full animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2 animate-pulse">{message}</h3>
            <p className="text-xs text-slate-400 max-w-sm text-center">
                This may take up to a minute. Gemini is cross-referencing your seed templates and creating comprehensive startup insights.
            </p>
        </div>
    )
}
