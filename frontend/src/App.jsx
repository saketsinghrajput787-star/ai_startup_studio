import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Navbar from './components/Navbar.jsx'
import AppRoutes from './routes.jsx'

export default function App() {
    return (
        <Router>
            <div className="flex min-h-screen bg-slate-950 text-slate-100">
                <Sidebar />
                <div className="flex-1 flex flex-col md:pl-64">
                    <Navbar />
                    <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full">
                        <AppRoutes />
                    </main>
                </div>
            </div>
        </Router>
    )
}
