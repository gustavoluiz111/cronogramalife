import React from 'react';
import { Home, School, BookOpen, Calendar, Heart, Award } from 'lucide-react';

export const Layout = ({ children, activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'school', label: 'Escola', icon: School },
        { id: 'courses', label: 'Cursos', icon: BookOpen },
        { id: 'planner', label: 'Planner', icon: Calendar },
        { id: 'calendar', label: 'Calendário', icon: Calendar },
        { id: 'health', label: 'Saúde', icon: Heart },
        { id: 'goals', label: 'Metas', icon: Award },
    ];

    return (
        <div className="flex flex-col h-screen">
            {/* Mountain Background Effect */}
            <div className="mountain-bg"></div>

            <header className="layout-header">
                <div className="logo">
                    System<span style={{ color: 'var(--accent-dark-blue)' }}>Life</span>
                </div>
                <nav className="nav-desktop">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                            >
                                <Icon size={20} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </header>

            {/* Mobile Specfic Nav (Bottom Bar) */}
            <nav className="nav-mobile">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                        >
                            <Icon size={20} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </nav>

            <main className="container" style={{ flex: 1, paddingBottom: '80px' }}>
                {children}
            </main>
        </div>
    );
};
