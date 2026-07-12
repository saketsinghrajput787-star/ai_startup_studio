import React, { useState } from 'react'
import { UploadCloud } from 'lucide-react'

export default function UploadBox({ onUpload, isUploading }) {
    const [dragActive, setDragActive] = useState(false)

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            if (file.name.endsWith('.md')) {
                onUpload(file)
            }
        }
    }

    const handleChange = (e) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            if (file.name.endsWith('.md')) {
                onUpload(file)
            }
        }
    }

    return (
        <div
            className={`glass min-h-60 rounded-2xl flex flex-col justify-center items-center p-6 border-2 border-dashed transition-all relative ${dragActive ? 'border-violet-500 bg-violet-500/5' : 'border-slate-800'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input
                type="file"
                id="file-upload"
                accept=".md"
                onChange={handleChange}
                disabled={isUploading}
                className="hidden"
            />
            <label
                htmlFor="file-upload"
                className="flex flex-col items-center cursor-pointer text-center space-y-3"
            >
                <div className="p-4 bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-2xl">
                    <UploadCloud size={28} className={isUploading ? 'animate-bounce' : ''} />
                </div>
                <div>
                    <p className="font-bold text-slate-200">{isUploading ? 'Uploading & Indexing...' : 'Drag & drop a file here'}</p>
                    <p className="text-xs text-slate-450 mt-1 font-semibold">{isUploading ? 'Ingesting chunks into ChromaDB...' : 'or click to browse'}</p>
                </div>
                <div className="text-[10px] bg-slate-900 border border-slate-850 px-2 py-1 rounded text-slate-450 uppercase font-extrabold tracking-wider">
                    *.md (Markdown files only)
                </div>
            </label>
        </div>
    )
}
