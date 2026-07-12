import React from 'react'
import { Database } from 'lucide-react'

export default function DatabaseCard({ blueprint }) {
    if (!blueprint) return null

    const rawSchema = blueprint.database_schema || []
    const schemas = Array.isArray(rawSchema)
        ? rawSchema
        : typeof rawSchema === 'string'
            ? rawSchema.split('\n').map(s => s.trim()).filter(Boolean)
            : []

    if (schemas.length === 0) return null

    return (
        <div className="glass p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                    <Database size={18} />
                </div>
                <h3 className="font-bold text-slate-100">Database Schema</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schemas.map((schemaStr, idx) => {
                    const text = typeof schemaStr === 'string'
                        ? schemaStr
                        : JSON.stringify(schemaStr, null, 2)
                    return (
                        <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                            {text}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
