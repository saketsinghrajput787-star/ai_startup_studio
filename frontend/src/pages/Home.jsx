import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Hammer, Zap, ShieldCheck } from 'lucide-react'
import PromptInput from '../components/PromptInput.jsx'
import Loading from '../components/Loading.jsx'
import { generateStartup } from '../services/startup.js'

export default function Home() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleGenerate = async (idea) => {
        setIsLoading(true)
        setError(null)
        try {
            const blueprint = await generateStartup(idea)
            navigate('/dashboard', { state: { blueprint } })
        } catch (e) {
            console.error(e)
            const detail = e.response?.data?.detail
            const errorMessage = typeof detail === 'string'
                ? detail
                : detail
                    ? JSON.stringify(detail)
                    : e.message || 'An error occurred during blueprint generation. Please verify your connection or settings.'
            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-12 py-8">
            {isLoading ? (
                <Loading message="Curating your startup blueprint..." />
            ) : (
                <>
                    {/* Hero Section */}
                    <div className="text-center max-w-2xl mx-auto space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-xs font-bold text-violet-400">
                            <Sparkles size={12} className="animate-spin" />
                            FoundrAI Startup Studio v1.0
                        </div>
                        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                            Build your startup blueprint in seconds
                        </h2>
                        <p className="text-slate-400 text-base font-semibold max-w-lg mx-auto">
                            Feed FoundrAI your initial idea. Our RAG engine searches top-tier system documents to draft code architecture, roadmap and business models.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="max-w-3xl mx-auto">
                        {error && (
                            <div className="mb-6 p-4 bg-red-950/20 border border-red-850 rounded-xl text-sm font-semibold text-red-400">
                                {error}
                            </div>
                        )}
                        <PromptInput onSubmit={handleGenerate} isLoading={isLoading} />
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6">
                        <div className="glass p-5 rounded-2xl space-y-2">
                            <div className="p-2 w-fit bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
                                <Zap size={16} />
                            </div>
                            <h3 className="font-bold text-slate-200">Rapid Generation</h3>
                            <p className="text-xs text-slate-400">Returns standard database schema, system architecture diagram outlines, User Stories, and API endpoints instantly.</p>
                        </div>
                        <div className="glass p-5 rounded-2xl space-y-2">
                            <div className="p-2 w-fit bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                                <ShieldCheck size={16} />
                            </div>
                            <h3 className="font-bold text-slate-200">RAG Secured</h3>
                            <p className="text-xs text-slate-400">Pulls template frameworks from the internal knowledge base to ensure technical consistency instead of direct LLM guessing.</p>
                        </div>
                        <div className="glass p-5 rounded-2xl space-y-2">
                            <div className="p-2 w-fit bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
                                <Hammer size={16} />
                            </div>
                            <h3 className="font-bold text-slate-200">Production Ready</h3>
                            <p className="text-xs text-slate-400">Output schema aligns with standard FastAPI structures so you can immediately begin software prototyping.</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
