import React from 'react'
import { Link2 } from 'lucide-react'

export default function ApiCard({ blueprint }) {
    if (!blueprint) return null

    const rawEndpoints = blueprint.api_endpoints || []
    const endpoints = Array.isArray(rawEndpoints)
        ? rawEndpoints
        : typeof rawEndpoints === 'string'
            ? rawEndpoints.split('\n').map(e => e.trim()).filter(Boolean)
            : []

    if (endpoints.length === 0) return null

    return (
        <div className="glass p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl">
                    <Link2 size={18} />
                </div>
                <h3 className="font-bold text-slate-100">REST API Endpoints</h3>
            </div>
            <div className="divide-y divide-slate-800/80">
                {endpoints.map((endpoint, idx) => {
                    const endpointStr = typeof endpoint === 'string'
                        ? endpoint
                        : JSON.stringify(endpoint)

                    const parts = endpointStr.split(' ')
                    const method = parts[0] || 'GET'
                    const path = parts.slice(1).join(' ') || endpointStr

                    const methodColor = {
                        'GET': 'text-green-400 bg-green-500/10 border-green-500/20',
                        'POST': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
                        'PUT': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
                        'DELETE': 'text-red-400 bg-red-500/10 border-red-500/20',
                    }[method.toUpperCase()] || 'text-slate-400 bg-slate-500/10 border-slate-500/20'

                    return (
                        <div key={idx} className="flex gap-4 items-center py-3.5 first:pt-0 last:pb-0">
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 border rounded-md uppercase tracking-wider ${methodColor}`}>
                                {method}
                            </span>
                            <span className="text-sm font-mono text-slate-300 font-semibold">{path || endpointStr}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
