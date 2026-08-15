import React from 'react'
import {
    Server,
    Database,
    Cloud,
    Shield,
    Zap,
    Activity,
    GitBranch,
    Cpu,
    Lock,
    Layers,
    AlertTriangle,
    CheckCircle2,
    ArrowDown
} from 'lucide-react'

// Helper to safely format array/string/object fields
const safeArray = (data) => {
    if (Array.isArray(data)) return data.filter(Boolean)
    if (typeof data === 'string') {
        return data.split('\n').map(s => s.trim().replace(/^[-*•\d.]\s*/, '')).filter(Boolean)
    }
    if (data && typeof data === 'object') {
        return Object.entries(data).map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
    }
    return []
}

const safeText = (data, fallback = 'Not specified.') => {
    if (typeof data === 'string' && data.trim()) return data
    if (Array.isArray(data) && data.length) return data.join('\n')
    if (data && typeof data === 'object') {
        return Object.entries(data)
            .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
            .join('\n')
    }
    return fallback
}

export default function ArchitectureCard({ blueprint }) {
    // Check both standard system_architecture and fallback to blueprint.architecture string
    const arch = blueprint?.system_architecture || (typeof blueprint?.architecture === 'object' ? blueprint.architecture : null)
    const fallbackArchitecture = typeof blueprint?.architecture === 'string' ? blueprint.architecture : null

    if (!arch && !fallbackArchitecture) {
        return (
            <div className="glass p-8 rounded-2xl text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                    <Server size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-200">Architecture Blueprint</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto font-medium">
                    Architecture specifications will automatically generate when creating startup blueprints.
                </p>
            </div>
        )
    }

    const flowItems = safeArray(arch?.diagram_flow)
    const componentsList = safeArray(arch?.components)

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Architecture Overview & High-Level Pattern */}
            <div className="glass p-6 rounded-2xl space-y-3 relative overflow-hidden border border-slate-800/80">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 rounded-xl">
                        <Server size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-100 text-base">High-Level System Architecture & Rationale</h3>
                        <p className="text-xs text-slate-450">Adaptive tech stack tailored to workload, scalability, and domain needs.</p>
                    </div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-normal pt-1 whitespace-pre-wrap">
                    {safeText(arch?.overview || fallbackArchitecture, "Comprehensive adaptive system architecture designed for reliability, scalability, and performance.")}
                </p>
            </div>

            {/* Visual Dynamic Architecture Flowchart */}
            <div className="glass p-6 rounded-2xl space-y-5 border border-slate-800/80">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-600/15 border border-blue-500/30 text-blue-400 rounded-xl">
                            <GitBranch size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-100 text-base">System Flow & Data Pipeline</h3>
                            <p className="text-xs text-slate-450">End-to-end request lifecycle and component topology</p>
                        </div>
                    </div>
                    <span className="hidden sm:inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        Dynamic Topology
                    </span>
                </div>

                {flowItems.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2 pt-2">
                        {flowItems.map((step, idx) => {
                            const stepText = typeof step === 'string' ? step : JSON.stringify(step)
                            return (
                                <React.Fragment key={idx}>
                                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition duration-200">
                                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                            {idx + 1}
                                        </div>
                                        <span className="text-xs text-slate-200 font-medium tracking-wide">
                                            {stepText}
                                        </span>
                                    </div>
                                    {idx < flowItems.length - 1 && (
                                        <div className="flex justify-center -my-1">
                                            <ArrowDown size={14} className="text-slate-600 animate-bounce" />
                                        </div>
                                    )}
                                </React.Fragment>
                            )
                        })}
                    </div>
                ) : (
                    <div className="bg-slate-900/60 p-4 rounded-xl font-mono text-xs text-slate-400 border border-slate-800">
                        User / Client → API Gateway → Application Services → Primary DB / Cache → Async Workers
                    </div>
                )}
            </div>

            {/* Key Components Breakdown */}
            <div className="glass p-6 rounded-2xl space-y-4 border border-slate-800/80">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-violet-600/15 border border-violet-500/30 text-violet-400 rounded-xl">
                        <Layers size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-100 text-base">Key Architecture Components & Technology Choices</h3>
                        <p className="text-xs text-slate-450">Specific technology recommendations with architectural justifications</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {componentsList.length > 0 ? (
                        componentsList.map((comp, idx) => {
                            const compText = typeof comp === 'string' ? comp : JSON.stringify(comp)
                            const [title, ...descParts] = compText.includes(':') ? compText.split(':') : [null, compText]
                            return (
                                <div key={idx} className="p-4 bg-slate-900/60 border border-slate-800/90 rounded-xl space-y-1 hover:border-violet-500/30 transition-all">
                                    {title && (
                                        <div className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                                            {title.trim()}
                                        </div>
                                    )}
                                    <div className="text-xs text-slate-300 font-normal leading-relaxed">
                                        {descParts.length ? descParts.join(':').trim() : compText}
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="col-span-2 text-xs text-slate-400 font-medium">
                            Component details generated dynamically based on chosen stack.
                        </div>
                    )}
                </div>
            </div>

            {/* 2x2 Grid for Strategies: DB & Caching, API & Scalability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Database Strategy */}
                <div className="glass p-6 rounded-2xl space-y-3 border border-slate-800/80">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 rounded-xl">
                            <Database size={18} />
                        </div>
                        <h3 className="font-bold text-slate-100 text-sm">Database Choice & Storage Strategy</h3>
                    </div>
                    <p className="text-xs text-slate-350 leading-relaxed font-normal whitespace-pre-wrap">
                        {safeText(arch?.database_strategy, "Primary database selected based on data structure, ACID compliance needs, and query volume.")}
                    </p>
                </div>

                {/* Caching & Messaging */}
                <div className="glass p-6 rounded-2xl space-y-3 border border-slate-800/80">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-600/15 border border-amber-500/30 text-amber-400 rounded-xl">
                            <Zap size={18} />
                        </div>
                        <h3 className="font-bold text-slate-100 text-sm">Caching & Message Queues</h3>
                    </div>
                    <p className="text-xs text-slate-350 leading-relaxed font-normal whitespace-pre-wrap">
                        {safeText(arch?.caching_strategy, "In-memory caching and queuing mechanisms tuned to prevent database saturation and support asynchronous workloads.")}
                    </p>
                </div>

                {/* API Architecture */}
                <div className="glass p-6 rounded-2xl space-y-3 border border-slate-800/80">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-fuchsia-600/15 border border-fuchsia-500/30 text-fuchsia-400 rounded-xl">
                            <Activity size={18} />
                        </div>
                        <h3 className="font-bold text-slate-100 text-sm">API Architecture & Gateway</h3>
                    </div>
                    <p className="text-xs text-slate-350 leading-relaxed font-normal whitespace-pre-wrap">
                        {safeText(arch?.api_architecture, "REST / GraphQL interface with rate limiting, SSL termination, and request routing.")}
                    </p>
                </div>

                {/* Scalability Strategy */}
                <div className="glass p-6 rounded-2xl space-y-3 border border-slate-800/80">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-600/15 border border-cyan-500/30 text-cyan-400 rounded-xl">
                            <Cloud size={18} />
                        </div>
                        <h3 className="font-bold text-slate-100 text-sm">Scalability & Growth Roadmap</h3>
                    </div>
                    <p className="text-xs text-slate-350 leading-relaxed font-normal whitespace-pre-wrap">
                        {safeText(arch?.scalability, "Horizontal auto-scaling with stateless application containers and read replica offloading.")}
                    </p>
                </div>

                {/* Reliability & Failure Handling */}
                <div className="glass p-6 rounded-2xl space-y-3 border border-slate-800/80">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-600/15 border border-green-500/30 text-green-400 rounded-xl">
                            <CheckCircle2 size={18} />
                        </div>
                        <h3 className="font-bold text-slate-100 text-sm">Reliability & Failure Handling</h3>
                    </div>
                    <p className="text-xs text-slate-350 leading-relaxed font-normal whitespace-pre-wrap">
                        {safeText(arch?.reliability, "Automated health checks, circuit breakers, multi-zone failover, and continuous automated backups.")}
                    </p>
                </div>

                {/* Security Considerations */}
                <div className="glass p-6 rounded-2xl space-y-3 border border-slate-800/80">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-600/15 border border-rose-500/30 text-rose-400 rounded-xl">
                            <Lock size={18} />
                        </div>
                        <h3 className="font-bold text-slate-100 text-sm">Security & Access Control</h3>
                    </div>
                    <p className="text-xs text-slate-350 leading-relaxed font-normal whitespace-pre-wrap">
                        {safeText(arch?.security, "Role-based access control (RBAC), TLS 1.3 in transit, AES-256 at rest, and secret token isolation.")}
                    </p>
                </div>
            </div>

            {/* Potential Bottlenecks & Mitigations */}
            <div className="glass p-6 rounded-2xl space-y-3 border border-amber-500/20 bg-amber-950/10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-600/20 border border-amber-500/30 text-amber-400 rounded-xl">
                        <AlertTriangle size={18} />
                    </div>
                    <h3 className="font-bold text-slate-100 text-sm">Critical Architecture Bottlenecks & Mitigations</h3>
                </div>
                <p className="text-xs text-slate-350 leading-relaxed font-normal whitespace-pre-wrap">
                    {safeText(arch?.bottlenecks, "Identified potential throughput bottlenecks and recommended proactive mitigations.")}
                </p>
            </div>
        </div>
    )
}
