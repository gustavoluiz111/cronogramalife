import React, { useState } from 'react';
import { Heart, Moon, Zap, Activity, CalendarDays, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const getLocalDateString = (d = new Date()) => {
    // Returns YYYY-MM-DD in local time
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

const getDisplayDate = (dateStr) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}`;
};

export const Health = () => {
    // history in format: { "YYYY-MM-DD": { sleep: 8, workout: true } }
    const [history, setHistory] = useLocalStorage('health_history', {});

    const todayStr = getLocalDateString();
    
    // Initialize today if empty
    const todayData = history[todayStr] ?? { sleep: 8, workout: false };
    
    const [savedFeedback, setSavedFeedback] = useState(false);

    const handleSaveSleep = () => {
        setSavedFeedback(true);
        setTimeout(() => setSavedFeedback(false), 2000);
    };

    const updateToday = (updates) => {
        setHistory(prev => ({
            ...prev,
            [todayStr]: { ...todayData, ...updates }
        }));
    };

    // Calculate Stats for last N days
    const getStatsForDays = (numDays) => {
        const stats = { sleepTotal: 0, workoutCount: 0, daysCount: 0, days: [] };
        
        for (let i = numDays - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const str = getLocalDateString(d);
            
            const entry = history[str];
            const sleep = entry ? entry.sleep : 0;
            const workout = entry ? entry.workout : false;
            
            if (entry || i === 0) { // count only logged days + today
                stats.sleepTotal += sleep;
                if (workout) stats.workoutCount++;
                stats.daysCount++;
            }
            stats.days.push({
                dateStr: str,
                display: getDisplayDate(str),
                sleep,
                workout,
                isToday: i === 0
            });
        }
        return stats;
    };

    const weekStats = getStatsForDays(7);
    const monthStats = getStatsForDays(30);

    const avgSleepWeek = weekStats.daysCount ? (weekStats.sleepTotal / weekStats.daysCount).toFixed(1) : 0;
    const avgSleepMonth = monthStats.daysCount ? (monthStats.sleepTotal / monthStats.daysCount).toFixed(1) : 0;

    const getSleepStatus = (sleep) => {
        if (sleep >= 8) return { text: 'Excelente', cls: 'success' };
        if (sleep >= 6) return { text: 'Atenção', cls: 'warning' };
        return { text: 'Crítico', cls: 'danger' };
    };

    const todayStatus = getSleepStatus(todayData.sleep);

    return (
        <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
            <div>
                <h1 className="page-title">Saúde</h1>
                <p className="page-subtitle">Acompanhe seu sono e rotina de treinos para maximizar seu desempenho.</p>
            </div>

            <div className="grid grid-2">
                {/* ── REGISTRO DE HOJE ── */}
                <div className="card" style={{ border: '1px solid rgba(255, 102, 102, 0.2)' }}>
                    <h2 className="section-title"><Activity size={20} /> Registro de Hoje</h2>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                                <Moon size={16} /> Horas de Sono
                            </label>
                            <span className={`badge badge-${todayStatus.cls}`}>{todayStatus.text}</span>
                        </div>
                        
                        <div className="sleep-display" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                            <input
                                type="range"
                                min="0" max="14" step="0.5"
                                value={todayData.sleep}
                                onChange={e => updateToday({ sleep: parseFloat(e.target.value) })}
                                style={{ flex: 1, accentColor: `var(--${todayStatus.cls})` }}
                            />
                            <div className="sleep-value" style={{ fontSize: '1.5rem', fontWeight: '800', width: '60px', textAlign: 'right' }}>
                                {todayData.sleep}h
                            </div>
                        </div>
                        
                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '4px' }}>
                           {Array.from({ length: 12 }, (_, i) => (
                               <div key={i} style={{
                                   flex: 1, height: 6, borderRadius: 3,
                                   background: i < todayData.sleep 
                                      ? `var(--${todayStatus.cls})` 
                                      : 'rgba(255,255,255,0.08)',
                                   transition: 'all 0.3s ease'
                               }} />
                           ))}
                        </div>

                        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                                onClick={handleSaveSleep}
                                className={`btn btn-sm ${savedFeedback ? 'btn-success' : 'btn-primary'}`}
                                style={{ minWidth: '120px' }}
                            >
                                {savedFeedback ? 'Salvo na Nuvem!' : 'Salvar Horas'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                            <Zap size={16} /> Treinou hoje?
                        </label>
                        <button 
                            onClick={() => updateToday({ workout: !todayData.workout })}
                            style={{
                                background: todayData.workout ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))' : 'rgba(255,255,255,0.05)',
                                color: todayData.workout ? '#4ade80' : 'rgba(255,255,255,0.6)',
                                border: `1px solid ${todayData.workout ? 'rgba(34, 197, 94, 0.4)' : 'rgba(255,255,255,0.1)'}`,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                fontSize: '1rem', fontWeight: 'bold', transition: 'all 0.2s'
                            }}
                        >
                            <Heart fill={todayData.workout ? 'currentColor' : 'none'} size={20} />
                            {todayData.workout ? 'Sim, treino concluído! 💪' : 'Ainda não / Descanso'}
                        </button>
                    </div>
                </div>

                {/* ── HISTÓRICO RECENTE ── */}
                <div className="card">
                    <h2 className="section-title"><TrendingUp size={20} /> Desempenho Recente (Últimos 7 dias)</h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Média de Sono</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>{avgSleepWeek}h <span style={{fontSize:'0.8rem', fontWeight:'500', color:'var(--text-muted)'}}>/noite</span></div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Dias de Treino</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--success)' }}>{weekStats.workoutCount} <span style={{fontSize:'0.8rem', fontWeight:'500', color:'var(--text-muted)'}}>treinos</span></div>
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', padding: '0 0.25rem' }}>
                            <span>Dia</span>
                            <span>Sono</span>
                            <span>Treino</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[...weekStats.days].reverse().map(d => {
                                const st = getSleepStatus(d.sleep);
                                return (
                                    <div key={d.dateStr} style={{ 
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                                        padding: '0.75rem 1rem', background: d.isToday ? 'rgba(119, 3, 3, 0.15)' : 'rgba(0,0,0,0.2)', 
                                        borderRadius: '8px', border: d.isToday ? '1px solid rgba(119,3,3,0.3)' : '1px solid transparent'
                                    }}>
                                        <span style={{ fontWeight: '600', color: d.isToday ? '#ff8888' : 'white', width: '50px' }}>
                                            {d.isToday ? 'Hoje' : d.display}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}>
                                            <span style={{ color: `var(--${st.cls})`, fontWeight: 'bold' }}>{d.sleep}h</span>
                                            <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                                                <div style={{ width: `${Math.min(d.sleep/10*100, 100)}%`, height: '100%', background: `var(--${st.cls})`, borderRadius: '2px' }}/>
                                            </div>
                                        </div>
                                        <span style={{ width: '50px', textAlign: 'right' }}>
                                            {d.workout ? <span style={{color: 'var(--success)'}}>💪 Sim</span> : <span style={{color: 'var(--text-muted)'}}>-</span>}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                 {/* ── ESTATÍSTICA MENSAL ── */}
                 <div className="card" style={{ gridColumn: '1 / -1' }}>
                    <h2 className="section-title"><CalendarDays size={20} /> Resumo Mensal (Últimos 30 dias)</h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '12px' }}>
                            <div style={{ background: 'rgba(119,3,3,0.2)', color: '#ff6666', padding: '1rem', borderRadius: '50%' }}>
                                <Moon size={24} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Média de Sono / Noite</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{avgSleepMonth}h</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '12px' }}>
                            <div style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', padding: '1rem', borderRadius: '50%' }}>
                                <Activity size={24} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total de Treinos</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{monthStats.workoutCount}</div>
                            </div>
                        </div>
                    </div>

                    {/* Mensal Heatmap representation */}
                    <div style={{ marginTop: '1.5rem' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Frequência de Treinos (30 dias)</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                             {monthStats.days.map((d, i) => (
                                 <div 
                                    key={i} 
                                    title={`${d.display}: ${d.workout ? 'Treinou' : 'Descansou'}, Sono: ${d.sleep}h`}
                                    style={{
                                        width: '18px', height: '18px', borderRadius: '4px',
                                        background: d.workout ? 'var(--success)' : 'rgba(255,255,255,0.06)',
                                        opacity: d.dateStr > todayStr ? 0 : 1, // hide future if somehow generated
                                        border: d.isToday ? '2px solid white' : 'none'
                                    }}
                                 />
                             ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
