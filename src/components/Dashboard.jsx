import React, { useState, useEffect, useRef } from 'react';
import { Clock, Book, Activity, Zap, Play, Pause, RotateCcw, TrendingUp, Calendar, Bell } from 'lucide-react';

const getLocalDateString = (d = new Date()) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};
import { useFirebaseData } from '../hooks/useFirebaseData';
import { useAuth } from '../contexts/AuthContext';

// ─── ENEM Countdown ─────────────────────────────────────────────────────────
const ENEM_DATE = new Date('2026-11-01T00:00:00');

const getEnemDays = () => {
    const diff = ENEM_DATE - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// ─── Pomodoro Timer ──────────────────────────────────────────────────────────
const Pomodoro = () => {
    const WORK  = 25 * 60;
    const BREAK =  5 * 60;

    const [seconds, setSeconds]   = useState(WORK);
    const [running, setRunning]   = useState(false);
    const [isWork, setIsWork]     = useState(true);
    const [sessions, setSessions] = useFirebaseData('pomodoro_sessions_today', 0);
    const [pomodoroDate, setPomodoroDate, pomodoroDateLoading] = useFirebaseData('pomodoro_date', new Date().toDateString());
    const intervalRef             = useRef(null);

    // Reset sessions daily
    useEffect(() => {
        const today = new Date().toDateString();
        if (pomodoroDateLoading) return;
        if (pomodoroDate !== today) {
            setSessions(0);
            setPomodoroDate(today);
        }
    }, [pomodoroDate, pomodoroDateLoading, setSessions, setPomodoroDate]);

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(() => {
                setSeconds(s => {
                    if (s <= 1) {
                        clearInterval(intervalRef.current);
                        const next = isWork ? BREAK : WORK;
                        if (isWork) setSessions(p => p + 1);
                        setIsWork(w => !w);
                        setRunning(false);
                        return next;
                    }
                    return s - 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [running, isWork]);

    const total  = isWork ? WORK : BREAK;
    const pct    = (seconds / total) * 100;
    const radius = 52;
    const circ   = 2 * Math.PI * radius;
    const offset = circ * (1 - pct / 100);
    const mins   = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs   = String(seconds % 60).padStart(2, '0');

    const reset = () => {
        setRunning(false);
        setIsWork(true);
        setSeconds(WORK);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.875rem' }}>
            <div className="pomodoro-ring">
                <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                    <circle
                        cx="60" cy="60" r={radius}
                        fill="none"
                        stroke={isWork ? 'var(--accent)' : 'var(--success)'}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        strokeDashoffset={offset}
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>
                <div className="pomodoro-time">
                    <span>{mins}:{secs}</span>
                    <span>{isWork ? 'Foco' : 'Pausa'}</span>
                </div>
            </div>

            <div className="flex gap-2">
                <button
                    className={`btn btn-sm ${running ? 'btn-warning' : 'btn-primary'}`}
                    onClick={() => setRunning(r => !r)}
                    style={{ minWidth: 80 }}
                >
                    {running ? <><Pause size={14} /> Pausar</> : <><Play size={14} /> Iniciar</>}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={reset} title="Reiniciar">
                    <RotateCcw size={14} />
                </button>
            </div>

            <div className="text-xs text-muted">
                {sessions} sessão{sessions !== 1 ? 'ões' : ''} hoje
            </div>
        </div>
    );
};

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const Dashboard = () => {
    const { userProfile } = useAuth();
    const [healthHistory] = useFirebaseData('health_history', {});
    const [ferreto] = useFirebaseData('ferreto_progress', []);
    const [grades]  = useFirebaseData('school_grades_v3', {});
    const [config]  = useFirebaseData('school_config_v2', { passingGrade: 5, numSomatórios: 2, somatórioMax: [8, 8], hasSimulado: true, simuladoMax: 4, divideBy: 2 });

    const enemDays = getEnemDays();
    const firstName = (userProfile?.nome || 'Estudante').split(' ')[0];

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Bom dia';
        if (h < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    const ferretoTotal = () => {
        if (!ferreto || ferreto.length === 0) return 0;
        const total  = ferreto.reduce((a, w) => a + w.total,   0);
        const done   = ferreto.reduce((a, w) => a + w.current, 0);
        return total > 0 ? Math.round((done / total) * 100) : 0;
    };

    const subjectsAtRisk = () => {
        if (!grades || !config) return 0;
        const maxT = config.somatórioMax.reduce((a, b) => a + b, 0) + (config.hasSimulado ? config.simuladoMax : 0);
        if (maxT === 0) return 0;
        return Object.values(grades).filter(g => {
            if (!g) return false;
            const soma = (g.somatórios || []).reduce((a, b) => a + (parseFloat(b) || 0), 0);
            const sim  = config.hasSimulado ? (parseFloat(g.simulado) || 0) : 0;
            return (soma + sim) / config.divideBy < config.passingGrade;
        }).length;
    };

    const todayStr = getLocalDateString();
    const todaySleep = healthHistory[todayStr]?.sleep || 0;
    
    let workoutsThisWeek = 0;
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        if (healthHistory[getLocalDateString(d)]?.workout) {
            workoutsThisWeek++;
        }
    }

    return (
        <div className="animate-fade">
            <h1 className="page-title">{getGreeting()}, {firstName}!</h1>
            <p className="page-subtitle mb-4">Foco na aprovação. Seu futuro começa hoje.</p>

            {/* ─── Countdown ENEM ─── */}
            <div className="card countdown-card mb-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <div className="stat-label mb-2">Dias para o ENEM 2026</div>
                        <div className="countdown-number">{enemDays}</div>
                        <div className="text-muted text-sm mt-1">dias restantes · 01/11/2026</div>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <div className="badge badge-accent">ENEM: Foco Total</div>
                        <div className="badge badge-warning">SSA: Em progresso</div>
                        <div className="badge badge-info">SiSU L2 + L5</div>
                    </div>
                </div>
            </div>

            {/* ─── Avisos Simulados ─── */}
            <div className="card mb-4" style={{ border: '1px solid rgba(255, 215, 0, 0.2)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #ffd700, #ff8c00)' }} />
                <h3 className="section-title mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffd700' }}>
                    <Bell size={20} /> Avisos e Horários de Simulados
                </h3>
                <div className="grid grid-3" style={{ gap: '1rem' }}>
                    <div className="card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <Calendar size={16} className="text-muted" /> <span className="font-bold" style={{ fontSize: '1.1rem' }}>27/04</span>
                        </div>
                        <div className="text-sm">
                            <p className="mb-2">
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>07:40 – 09:40</span><br/>
                                <strong>História, Física</strong>
                            </p>
                            <p>
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>10:00 – 12:00</span><br/>
                                <strong>Português, Artes</strong>
                            </p>
                        </div>
                    </div>
                    
                    <div className="card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <Calendar size={16} className="text-muted" /> <span className="font-bold" style={{ fontSize: '1.1rem' }}>29/04</span>
                        </div>
                        <div className="text-sm">
                            <p className="mb-2">
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>07:40 – 09:40</span><br/>
                                <strong>Biologia, Filosofia</strong>
                            </p>
                            <p>
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>10:00 – 12:00</span><br/>
                                <strong>Química, Inglês</strong>
                            </p>
                        </div>
                    </div>

                    <div className="card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <Calendar size={16} className="text-muted" /> <span className="font-bold" style={{ fontSize: '1.1rem' }}>04/05</span>
                        </div>
                        <div className="text-sm">
                            <p className="mb-2">
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>07:40 – 09:40</span><br/>
                                <strong>Educação Física, Matemática</strong>
                            </p>
                            <p>
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>10:00 – 12:00</span><br/>
                                <strong>Geografia, Sociologia</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Stats grid ─── */}
            <div className="grid grid-3 mb-4" style={{ gap: '0.75rem' }}>
                <div className="stat-card">
                    <div className="stat-label"><Activity size={12} style={{ display: 'inline', marginRight: 4 }} />Sono Hoje</div>
                    <div className="stat-value" style={{ color: todaySleep >= 8 ? 'var(--success)' : todaySleep >= 6 ? 'var(--warning)' : 'var(--danger)' }}>
                        {todaySleep}h
                    </div>
                    <div className="stat-sub">{todaySleep >= 8 ? 'Excelente!' : todaySleep >= 6 ? 'Atenção ao sono' : 'Durma mais!'}</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label"><Zap size={12} style={{ display: 'inline', marginRight: 4 }} />Treinos Semana</div>
                    <div className="stat-value" style={{ color: workoutsThisWeek >= 3 ? 'var(--success)' : 'var(--warning)' }}>
                        {workoutsThisWeek}/3
                    </div>
                    <div className="stat-sub">Meta: 3 treinos</div>
                </div>

                <div className="stat-card">
                    <div className="stat-label"><TrendingUp size={12} style={{ display: 'inline', marginRight: 4 }} />Matérias em Risco</div>
                    <div className="stat-value" style={{ color: subjectsAtRisk() === 0 ? 'var(--success)' : 'var(--danger)' }}>
                        {subjectsAtRisk()}
                    </div>
                    <div className="stat-sub">abaixo da média mínima</div>
                </div>
            </div>

            {/* ─── Pomodoro + Ferreto ─── */}
            <div className="grid grid-2" style={{ gap: '1.25rem' }}>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 className="section-title" style={{ margin: 0 }}>
                        <Clock size={18} /> Timer Pomodoro
                    </h3>
                    <p className="text-muted text-xs mb-2">25 min trabalho · 5 min pausa</p>
                    <Pomodoro />
                </div>

                <div className="card">
                    <h3 className="section-title"><Book size={18} /> Curso Ferreto</h3>
                    <div className="flex justify-between mb-2">
                        <span className="text-secondary text-sm">Progresso Geral</span>
                        <span className="font-extrabold text-accent">{ferretoTotal()}%</span>
                    </div>
                    <div className="progress-bar" style={{ height: 10 }}>
                        <div className="progress-fill thick" style={{ width: `${ferretoTotal()}%`, height: 10 }} />
                    </div>
                    <div className="text-muted text-xs mt-2">
                        {ferretoTotal() === 0 ? 'Registre seu progresso na aba Cursos' : 'Continue! Consistência é tudo.'}
                    </div>
                </div>
            </div>
        </div>
    );
};
