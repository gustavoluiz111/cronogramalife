import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { School } from './components/School';
import { Courses } from './components/Courses';
import { Planner } from './components/Planner';
import { Health } from './components/Health';
import { Goals } from './components/Goals';
import { CalendarView } from './components/CalendarView';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Helper to read data for Dashboard summary (simulating global state via LS)
  const getDashboardData = () => {
    const health = JSON.parse(localStorage.getItem('health_tracker') || '{}');
    const ferreto = JSON.parse(localStorage.getItem('ferreto_progress') || '[]');
    return { health, ferreto };
  };

  const dashboardData = getDashboardData();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard
          healthData={dashboardData.health}
          ferretoProgress={dashboardData.ferreto}
        />;
      case 'school':
        return <School />;
      case 'courses':
        return <Courses />;
      case 'planner':
        return <Planner />;
      case 'calendar':
        return <CalendarView />;
      case 'health':
        return <Health />;
      case 'goals':
        return <Goals />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
