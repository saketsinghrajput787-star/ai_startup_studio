import React, { useState, useEffect, useCallback } from 'react'
import {
    ShieldCheck,
    KeyRound,
    TrendingUp,
    Calendar,
    Search,
    Filter,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Layers,
    Clock,
    Lock,
    LogOut,
    Eye,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    AlertCircle
} from 'lucide-react'
import api from '../services/api.js'

export default function AdminDashboard() {
    const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem('foundrai_admin_key') || '')
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isAuthenticating, setIsAuthenticating] = useState(false)
    const [authError, setAuthError] = useState('')

    // Analytics data state
    const [stats, setStats] = useState(null)
    const [requestsData, setRequestsData] = useState({ items: [], total: 0, page: 1, limit: 15, total_pages: 1 })
    const [isLoadingStats, setIsLoadingStats] = useState(false)
    const [isLoadingRequests, setIsLoadingRequests] = useState(false)

    // Filters state
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    // Modal state for viewing full idea text
    const [selectedIdea, setSelectedIdea] = useState(null)

    // Helper for admin headers
    const getAuthHeaders = useCallback((key = adminKey) => {
        return {
            headers: {
                'X-Admin-Key': key
            }
        }
    }, [adminKey])

    // Verify key on mount if present
    useEffect(() => {
        if (adminKey) {
            handleVerify(adminKey)
        }
    }, [])

    const handleVerify = async (keyToVerify = adminKey) => {
        if (!keyToVerify.trim()) {
            setAuthError('Please enter the admin security key.')
            return
        }

        setIsAuthenticating(true)
        setAuthError('')

        try {
            await api.post('/admin/verify', {}, getAuthHeaders(keyToVerify))
            sessionStorage.setItem('foundrai_admin_key', keyToVerify)
            setAdminKey(keyToVerify)
            setIsAuthenticated(true)
        } catch (err) {
            console.error('Admin authentication failed:', err)
            setIsAuthenticated(false)
            if (err.response?.status === 403) {
                setAuthError('Access Denied: Invalid admin key (403 Forbidden).')
            } else {
                setAuthError('Unable to connect to admin verification service.')
            }
        } finally {
            setIsAuthenticating(false)
        }
    }

    const handleLogout = () => {
        sessionStorage.removeItem('foundrai_admin_key')
        setAdminKey('')
        setIsAuthenticated(false)
        setStats(null)
        setRequestsData({ items: [], total: 0, page: 1, limit: 15, total_pages: 1 })
    }

    // Fetch Stats
    const fetchStats = useCallback(async () => {
        if (!isAuthenticated) return
        setIsLoadingStats(true)
        try {
            const res = await api.get('/admin/ideas/stats', getAuthHeaders())
            setStats(res.data)
        } catch (err) {
            console.error('Failed to fetch stats:', err)
            if (err.response?.status === 403) {
                setIsAuthenticated(false)
                setAuthError('Session expired or admin key revoked.')
            }
        } finally {
            setIsLoadingStats(false)
        }
    }, [isAuthenticated, getAuthHeaders])

    // Fetch Requests with filters & pagination
    const fetchRequests = useCallback(async (page = 1) => {
        if (!isAuthenticated) return
        setIsLoadingRequests(true)
        try {
            const params = {
                page,
                limit: 15
            }
            if (searchQuery.trim()) params.search = searchQuery.trim()
            if (statusFilter !== 'ALL') params.status = statusFilter
            if (startDate) params.start_date = startDate + 'T00:00:00'
            if (endDate) params.end_date = endDate + 'T23:59:59'

            const res = await api.get('/admin/ideas', {
                ...getAuthHeaders(),
                params
            })
            setRequestsData(res.data)
            setCurrentPage(res.data.page || page)
        } catch (err) {
            console.error('Failed to fetch requests:', err)
            if (err.response?.status === 403) {
                setIsAuthenticated(false)
                setAuthError('Session expired or admin key revoked.')
            }
        } finally {
            setIsLoadingRequests(false)
        }
    }, [isAuthenticated, getAuthHeaders, searchQuery, statusFilter, startDate, endDate])

    // Load data when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchStats()
            fetchRequests(1)
        }
    }, [isAuthenticated, fetchStats, fetchRequests])

    // Trigger filter search
    const handleFilterSubmit = (e) => {
        e.preventDefault()
        fetchRequests(1)
    }

    const resetFilters = () => {
        setSearchQuery('')
        setStatusFilter('ALL')
        setStartDate('')
        setEndDate('')
        fetchRequests(1)
    }

    // Format ISO Date
    const formatDate = (isoString) => {
        if (!isoString) return 'N/A'
        try {
            const d = new Date(isoString)
            return d.toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return isoString
        }
    }

    // If not authenticated, render secure login gate
    if (!isAuthenticated) {
        return (
            <div className="min-h-[75vh] flex items-center justify-center p-4">
                <div className="glass max-w-md w-full p-8 rounded-3xl space-y-6 border border-slate-800 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl -z-10" />
                    
                    <div className="text-center space-y-3">
                        <div className="w-14 h-14 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-violet-600/30">
                            <Lock size={28} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-100">Private Admin Analytics</h2>
                        <p className="text-xs text-slate-450 font-semibold max-w-xs mx-auto">
                            Strict backend authorization required. Enter the configured administrative secret key to proceed.
                        </p>
                    </div>

                    {authError && (
                        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs font-semibold">
                            <AlertCircle size={18} className="flex-shrink-0" />
                            <span>{authError}</span>
                        </div>
                    )}

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleVerify()
                        }}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-350 uppercase tracking-wider">
                                Admin Secret Key
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={adminKey}
                                    onChange={(e) => setAdminKey(e.target.value)}
                                    placeholder="Enter admin secret key..."
                                    className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-3 pl-10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-mono"
                                    required
                                />
                                <KeyRound size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isAuthenticating}
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/25 transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isAuthenticating ? (
                                <>
                                    <RefreshCw size={16} className="animate-spin" />
                                    Verifying Authorization...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={18} />
                                    Access Admin Dashboard
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-fade-in-up py-4">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-400 mb-1">
                        <ShieldCheck size={16} />
                        Authorized Administrator Session
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">
                        Idea Analytics & Request Stream
                    </h1>
                    <p className="text-xs text-slate-450 font-semibold mt-1">
                        Live monitoring of startup generation queries, success rates, and category trends.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            fetchStats()
                            fetchRequests(currentPage)
                        }}
                        disabled={isLoadingStats || isLoadingRequests}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition duration-200 disabled:opacity-50"
                    >
                        <RefreshCw size={14} className={isLoadingStats || isLoadingRequests ? 'animate-spin' : ''} />
                        Refresh Data
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold transition duration-200"
                    >
                        <LogOut size={14} />
                        End Session
                    </button>
                </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Ideas */}
                <div className="glass p-5 rounded-2xl border border-slate-800/80 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Total Ideas Generated</span>
                        <div className="p-2 bg-indigo-600/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                            <Layers size={18} />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-slate-100">
                        {stats ? stats.total_ideas : '—'}
                    </div>
                    <div className="text-[11px] text-slate-400 font-semibold">
                        Lifetime generation attempts
                    </div>
                </div>

                {/* Ideas Today */}
                <div className="glass p-5 rounded-2xl border border-slate-800/80 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Generated Today</span>
                        <div className="p-2 bg-emerald-600/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                            <Clock size={18} />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-emerald-400">
                        {stats ? stats.ideas_today : '—'}
                    </div>
                    <div className="text-[11px] text-slate-400 font-semibold">
                        Past 24-hour activity
                    </div>
                </div>

                {/* Ideas This Week */}
                <div className="glass p-5 rounded-2xl border border-slate-800/80 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Generated This Week</span>
                        <div className="p-2 bg-violet-600/10 text-violet-400 rounded-xl border border-violet-500/20">
                            <Calendar size={18} />
                        </div>
                    </div>
                    <div className="text-3xl font-black text-violet-400">
                        {stats ? stats.ideas_this_week : '—'}
                    </div>
                    <div className="text-[11px] text-slate-400 font-semibold">
                        Active 7-day velocity
                    </div>
                </div>

                {/* Success vs Failures */}
                <div className="glass p-5 rounded-2xl border border-slate-800/80 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Generation Health</span>
                        <div className="p-2 bg-blue-600/10 text-blue-400 rounded-xl border border-blue-500/20">
                            <TrendingUp size={18} />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <span className="text-2xl font-black text-green-400">
                            {stats ? stats.successful_ideas : 0} <span className="text-xs text-slate-400 font-normal">ok</span>
                        </span>
                        {stats?.failed_ideas > 0 && (
                            <span className="text-lg font-bold text-red-400">
                                {stats.failed_ideas} <span className="text-xs text-slate-400 font-normal">err</span>
                            </span>
                        )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-semibold">
                        Pipeline completion status
                    </div>
                </div>
            </div>

            {/* Categories Distribution */}
            {stats?.top_categories && stats.top_categories.length > 0 && (
                <div className="glass p-6 rounded-2xl border border-slate-800/80 space-y-4">
                    <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
                        <Sparkles size={16} className="text-amber-400" />
                        Top Startup Categories & Industry Distribution
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {stats.top_categories.map((cat, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-2 px-3.5 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200"
                            >
                                <span className="w-2 h-2 rounded-full bg-violet-400" />
                                <span>{cat.category}</span>
                                <span className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-300 font-bold text-[11px] border border-violet-500/20">
                                    {cat.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Filter and Search Bar */}
            <form onSubmit={handleFilterSubmit} className="glass p-5 rounded-2xl border border-slate-800/80 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Search Input */}
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search ideas or keywords..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 pl-9 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 font-medium"
                        />
                        <Search size={14} className="absolute left-3 top-3 text-slate-500" />
                    </div>

                    {/* Status Dropdown */}
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-violet-500 font-medium"
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="SUCCESS">Success Only</option>
                            <option value="FAILED">Failed Only</option>
                        </select>
                    </div>

                    {/* Start Date */}
                    <div>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-violet-500"
                        />
                    </div>

                    {/* End Date */}
                    <div>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-violet-500"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="text-xs text-slate-450 hover:text-slate-200 font-semibold transition-colors"
                    >
                        Clear Filters
                    </button>

                    <button
                        type="submit"
                        className="flex items-center gap-2 px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-600/20 transition duration-200"
                    >
                        <Filter size={14} />
                        Apply Filters
                    </button>
                </div>
            </form>

            {/* Requests Table */}
            <div className="glass rounded-2xl border border-slate-800/80 overflow-hidden space-y-0">
                <div className="p-4 bg-slate-900/50 border-b border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Generation Requests ({requestsData.total} total)
                    </span>
                    <span className="text-xs text-slate-450 font-medium">
                        Page {requestsData.page} of {requestsData.total_pages}
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-slate-800/80 bg-slate-950/40 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                                <th className="p-4">ID</th>
                                <th className="p-4">Startup Idea</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Timestamp</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {isLoadingRequests ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-450 font-medium">
                                        <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-violet-400" />
                                        Loading idea request logs...
                                    </td>
                                </tr>
                            ) : requestsData.items.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-450 font-medium">
                                        No startup requests found matching the current criteria.
                                    </td>
                                </tr>
                            ) : (
                                requestsData.items.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-900/40 transition-colors">
                                        <td className="p-4 font-mono text-slate-400">
                                            #{req.id}
                                        </td>
                                        <td className="p-4 max-w-md font-medium text-slate-200">
                                            <p className="line-clamp-2 leading-relaxed">
                                                {req.idea_text}
                                            </p>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 font-medium text-[11px]">
                                                {req.category || 'General Tech'}
                                            </span>
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                                            {formatDate(req.created_at)}
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            {req.generation_status === 'SUCCESS' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 font-bold text-[11px]">
                                                    <CheckCircle2 size={12} />
                                                    SUCCESS
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-[11px]">
                                                    <XCircle size={12} />
                                                    FAILED
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => setSelectedIdea(req)}
                                                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-100 rounded-lg transition-colors"
                                                title="View Full Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination bar */}
                <div className="p-4 bg-slate-950/40 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-450 font-medium">
                        Showing {requestsData.items.length} of {requestsData.total} requests
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => fetchRequests(currentPage - 1)}
                            disabled={currentPage <= 1 || isLoadingRequests}
                            className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg disabled:opacity-30 transition-colors"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        <span className="text-xs font-bold text-slate-300 px-2 font-mono">
                            {currentPage} / {requestsData.total_pages}
                        </span>
                        <button
                            onClick={() => fetchRequests(currentPage + 1)}
                            disabled={currentPage >= requestsData.total_pages || isLoadingRequests}
                            className="p-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-lg disabled:opacity-30 transition-colors"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal for full idea inspection */}
            {selectedIdea && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="glass max-w-lg w-full p-6 rounded-3xl space-y-4 border border-slate-800 shadow-2xl animate-fade-in">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-100 text-sm">Request #{selectedIdea.id}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedIdea.generation_status === 'SUCCESS' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {selectedIdea.generation_status}
                                </span>
                            </div>
                            <button
                                onClick={() => setSelectedIdea(null)}
                                className="text-slate-400 hover:text-slate-100 text-xs font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-450">Startup Idea Text</span>
                            <div className="p-4 bg-slate-900/90 rounded-xl text-xs text-slate-200 leading-relaxed font-normal whitespace-pre-wrap max-h-60 overflow-y-auto border border-slate-800">
                                {selectedIdea.idea_text}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800">
                            <div>
                                <span className="block text-[10px] text-slate-400 uppercase font-bold">Category</span>
                                <span className="font-semibold text-slate-200">{selectedIdea.category || 'General Tech'}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] text-slate-400 uppercase font-bold">Timestamp</span>
                                <span className="font-mono text-slate-300">{formatDate(selectedIdea.created_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
