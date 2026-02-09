import React from 'react';
import { Clock, Book, Activity, CheckCircle } from 'lucide-react';

export const Dashboard = ({ schoolSchedule, healthData, ferretoProgress }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    const getNextActivity = () => {
        // Logic to determine next class or study block could go here
        // For now, placeholder
        return "Estudos (15:00)";
    };

    const calculateFerretoTotal = () => {
        if (!ferretoProgress) return 0;
        // Assuming ferretoProgress is an array of objects { week: 1, current: 0, total: 53 }
        const totalVideos = ferretoProgress.reduce((acc, week) => acc + week.total, 0);
        const completedVideos = ferretoProgress.reduce((acc, week) => acc + week.current, 0);
        return Math.round((completedVideos / totalVideos) * 100) || 0;
    };

    return (
        <div className="grid grid-2">
            <div className="card" style={{ gridColumn: '1 / -1' }}>
                <h2>{getGreeting()}, Estudante!</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Foco na aprovação. Seu futuro começa hoje.</p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div className="tag tag-success">ENEM: Foco Total</div>
                    <div className="tag tag-warning">SSA: Em progresso</div>
                </div>
            </div>

            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h3>Próxima Atividade</h3>
                    <Clock size={20} color="var(--accent-dark-blue)" />
                </div>
                <p className="text-2xl font-bold">{getNextActivity()}</p>
                <p className="text-sm text-gray-500">Mantenha a constância.</p>
            </div>

            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h3>Saúde Hoje</h3>
                    <Activity size={20} color="var(--danger)" />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <span>Sono (8h min)</span>
                        <span style={{ fontWeight: 'bold' }}>{healthData?.sleep || 0}h</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Treino</span>
                        <span>{healthData?.workout ? "Feito ✅" : "Pendente ⏳"}</span>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h3>Curso Ferreto</h3>
                    <Book size={20} color="var(--warning)" />
                </div>
                <div className="mb-2 flex justify-between">
                    <span>Progresso Geral</span>
                    <span className="font-bold">{calculateFerretoTotal()}%</span>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${calculateFerretoTotal()}%` }}></div>
                </div>
            </div>
        </div>
    );
};
