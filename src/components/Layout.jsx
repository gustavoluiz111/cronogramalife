import { Home, School, BookOpen, Calendar, Heart, Award, ClipboardList, Flame, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LaserFlow from './LaserFlow';
import { StaggeredMenu } from './StaggeredMenu';

const tabs = [
    { id: 'dashboard', label: 'Dashboard',   icon: Home,          group: 'Principal' },
    { id: 'school',    label: 'Escola',       icon: School,        group: 'Acadêmico' },
    { id: 'courses',   label: 'Cursos',       icon: BookOpen,      group: 'Acadêmico' },
    { id: 'agenda',    label: 'Agenda',       icon: ClipboardList, group: 'Acadêmico' },
    { id: 'ai',        label: 'Mentoria IA',  icon: MessageSquare, group: 'Acadêmico' },
    { id: 'planner',   label: 'Planner',      icon: Flame,         group: 'Planejamento' },
    { id: 'calendar',  label: 'Calendário',   icon: Calendar,      group: 'Planejamento' },
    { id: 'health',    label: 'Saúde',        icon: Heart,         group: 'Bem-estar' },
    { id: 'goals',     label: 'Metas',        icon: Award,         group: 'Bem-estar' },
];

export const Layout = ({ children, activeTab, setActiveTab }) => {
    return (
        <div className="app-wrapper">
            {/* ── LaserFlow BG ── */}
            <div className="laser-bg">
                <LaserFlow
                    color="#5d0404"
                    wispDensity={1}
                    flowSpeed={0.35}
                    verticalSizing={2}
                    horizontalSizing={0.5}
                    fogIntensity={0.45}
                    fogScale={0.3}
                    wispSpeed={15}
                    wispIntensity={5}
                    flowStrength={0.25}
                    decay={1.1}
                    horizontalBeamOffset={0}
                    verticalBeamOffset={-0.5}
                />
            </div>

            {/* ── Staggered Menu Navigation ── */}
            <StaggeredMenu 
                tabs={tabs} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
            />

            {/* ── Main Content ── */}
            <main className="main-content">
                <div className="page-container animate-fade">
                    {children}
                </div>
            </main>
        </div>
    );
};
