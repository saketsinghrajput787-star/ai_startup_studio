import React, { useState, useEffect } from 'react'
import { FileText, Database, Trash2 } from 'lucide-react'
import UploadBox from '../components/UploadBox.jsx'
import { getKnowledgeDocuments, uploadDocument, clearKnowledgeBase } from '../services/knowledge.js'

export default function Upload() {
    const [docs, setDocs] = useState([])
    const [isUploading, setIsUploading] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)

    const fetchDocs = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await getKnowledgeDocuments()
            setDocs(data)
        } catch (e) {
            console.error(e)
            setError('Could not fetch knowledge base documents.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchDocs()
    }, [])

    const handleUpload = async (file) => {
        setIsUploading(true)
        setError(null)
        setMessage(null)
        try {
            const res = await uploadDocument(file)
            setMessage(res.message || 'File uploaded and indexed successfully!')
            fetchDocs()
        } catch (e) {
            console.error(e)
            setError(e.response?.data?.detail || 'Failed to upload and index document.')
        } finally {
            setIsUploading(false)
        }
    }

    const handleClear = async () => {
        if (!window.confirm('Are you sure you want to clear the vector DB and delete user uploaded files?')) {
            return
        }
        setError(null)
        setMessage(null)
        try {
            const res = await clearKnowledgeBase()
            setMessage(res.message || 'Knowledge base cleared successfully.')
            setDocs([])
        } catch (e) {
            console.error(e)
            setError('Failed to clear knowledge base.')
        }
    }

    return (
        <div className="space-y-8 animate-fade-in-up py-4">
            {/* Title */}
            <div>
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <Database size={24} className="text-violet-400" />
                    Knowledge Base Manager
                </h2>
                <p className="text-sm text-slate-4050 mt-1">
                    Customize the startup blueprint generation by uploading your own reference texts. Uploaded files will be chunked and indexed into ChromaDB.
                </p>
            </div>

            {/* Notifications */}
            {error && (
                <div className="p-4 bg-red-950/20 border border-red-850 rounded-xl text-sm font-semibold text-red-400">
                    {error}
                </div>
            )}
            {message && (
                <div className="p-4 bg-green-950/20 border border-green-850 rounded-xl text-sm font-semibold text-green-400">
                    {message}
                </div>
            )}

            {/* Upload and details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* left column: upload */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-base font-bold text-slate-300">Add Documents</h3>
                        <p className="text-xs text-slate-450">
                            Only files with a `.md` extension are supported. Ensure their language is clear and professional so retriever chunks work effectively.
                        </p>
                    </div>
                    <UploadBox onUpload={handleUpload} isUploading={isUploading} />

                    <button
                        onClick={handleClear}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-950/20 hover:bg-red-900/30 border border-red-900/40 hover:border-red-550/50 text-red-400 rounded-xl text-sm font-bold transition duration-200"
                    >
                        <Trash2 size={16} />
                        Wipe Vetor Database
                    </button>
                </div>

                {/* right column: lists */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-350">Indexes & Files ({docs.length})</h3>
                        <button
                            onClick={fetchDocs}
                            className="text-xs text-violet-400 hover:text-violet-300 font-bold"
                        >
                            Refresh
                        </button>
                    </div>

                    <div className="glass rounded-2xl overflow-hidden border border-slate-8050/80">
                        {isLoading ? (
                            <div className="p-8 text-center text-sm font-semibold text-slate-400">
                                Loading files...
                            </div>
                        ) : docs.length === 0 ? (
                            <div className="p-8 text-center text-sm text-slate-450 font-semibold bg-slate-900/20">
                                No articles or reference frameworks stored.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-800/80 max-h-[420px] overflow-y-auto">
                                {docs.map((doc, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-900/30 transition duration-150">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-slate-950/60 border border-slate-850 rounded-xl text-slate-300">
                                                <FileText size={16} />
                                            </div>
                                            <div>
                                                <span className="block text-sm font-bold text-slate-200">{doc.name}</span>
                                                <span className="block text-[11px] text-slate-450 mt-0.5">{doc.path}</span>
                                            </div>
                                        </div>
                                        {doc.source === 'system' ? (
                                            <span className="text-[10px] font-extrabold px-2 py-0.5 border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 rounded-full uppercase">
                                                System Default
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-extrabold px-2 py-0.5 border border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-400 rounded-full uppercase">
                                                User Ingested
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
