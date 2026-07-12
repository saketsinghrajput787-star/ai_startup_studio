import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Sparkles, UploadCloud, LayoutDashboard, Menu, X } from 'lucide-react'

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false)

    const links = [
        { to: '/', label: 'Idea Generator', icon: Sparkles },
        { to: '/dashboard', label: 'Studio Dashboard', icon: LayoutDashboard },
        { to: '/upload', label: 'Knowledge Base', icon: UploadCloud }
    ]

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 md:hidden p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:bg-slate-800"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar Container */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-64 glass border-r border-slate-800/80 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo / Header */}
                    <div className="p-6 border-b border-slate-800/80">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl shadow-lg ring-1 ring-violet-500/30">
                                <Sparkles size={20} className="text-white animate-pulse" />
                            </div>
                            <div>
                                <span className="font-bold text-lg bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">FoundrAI</span>
                                <span className="block text-[10px] text-slate-450 font-bold uppercase tracking-wider">Startup Studio</span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-grow px-4 py-6 space-y-2">
                        {links.map((link) => {
                            const Icon = link.icon
                            return (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold group ${isActive ? 'bg-violet-600/20 text-violet-400 border border-violet-500/20' : 'text-slate-400 hover:bg-slate-900/60 hover:text-white border border-transparent'}`
                                    }
                                >
                                    <Icon size={18} className="group-hover:scale-110 transition-transform" />
                                    {link.label}
                                </NavLink>
                            )
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-6 border-t border-slate-800/80">
                        <div className="p-4 bg-slate-950/70 border border-slate-800/85 rounded-2xl">
                            <span className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Status</span>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                                <span className="text-xs font-semibold text-green-400">Gemini 2.5 Flash Online</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}
