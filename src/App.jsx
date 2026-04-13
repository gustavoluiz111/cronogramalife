import React, { useState } from 'react';
import './App.css';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { School } from './components/School';
import { Courses } from './components/Courses';
import { Planner } from './components/Planner';
import { Health } from './components/Health';
import { Goals } from './components/Goals';
import { CalendarView } from './components/CalendarView';
import { Agenda } from './components/Agenda';
import { AuthScreen } from './components/AuthScreen';
import { AiAssistant } from './components/AiAssistant';
import { useAuth } from './contexts/AuthContext';

function App() {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');

    if (!currentUser) {
        return <AuthScreen />;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <Dashboard />;
            case 'school':    return <School />;
            case 'courses':   return <Courses />;
            case 'agenda':    return <Agenda />;
            case 'planner':   return <Planner />;
            case 'calendar':  return <CalendarView />;
            case 'health':    return <Health />;
            case 'goals':     return <Goals />;
            case 'ai':        return <AiAssistant />;
            default:          return <Dashboard />;
        }
    };

    return (
        <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
            {renderContent()}
        </Layout>
    );
}

export default App;
