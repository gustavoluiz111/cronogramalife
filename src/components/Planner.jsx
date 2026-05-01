import React, { useState, useEffect, useRef } from 'react';
import { Flame, RefreshCw, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useFirebaseData } from '../hooks/useFirebaseData';

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

const SUBJECT_AREAS = {
    exatas: ['Matemática', 'Física', 'Química'],
    humanas: ['História', 'Geografia', 'Filosofia', 'Sociologia'],
    naturezas: ['Biologia'],
    linguagens: ['Português', 'Inglês', 'Literatura', 'Redação'],
};

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const Planner = () => {
    const plannerRef = useRef(null);
    const [planner, setPlanner] = useFirebaseData('study_planner', () =>
        DAYS.reduce((acc, day) => ({ ...acc, [day]: '' }), {})
    );
    const [isExporting, setIsExporting] = useState(false);

    const handleChange = (day, val) => setPlanner(p => ({ ...p, [day]: val }));

    const generateRoutine = () => {
        if (!window.confirm('Isso substituirá o planejamento atual. Continuar?')) return;
        const plan = {};
        DAYS.forEach(day => {
            const tasks = [];
            if (['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].includes(day)) {
                tasks.push('--- Tarde (15h–18h) ---');
                if (day === 'Segunda' || day === 'Quarta') {
                    tasks.push(`[Exatas] ${rand(SUBJECT_AREAS.exatas)}`);
                    tasks.push('[Naturezas] Biologia');
                } else if (day === 'Terça' || day === 'Quinta') {
                    tasks.push(`[Humanas] ${rand(SUBJECT_AREAS.humanas)}`);
                    tasks.push('[Linguagens] Português');
                } else {
                    tasks.push('[Redação] Prática de Texto');
                    tasks.push('[Revisão] Conteúdos da Semana');
                }
                tasks.push('--- Noite ---');
                tasks.push(day === 'Sexta' ? '[Curso] Redação Vanilma (19h)' : '[Revisão/Exercícios] 1h');
            } else if (day === 'Sábado') {
                tasks.push('[Curso] Algoritmo (08h–16h)');
                tasks.push('[Descanso] Pós-curso');
            } else {
                tasks.push('[Simulado] Prova Antiga ou Lista');
                tasks.push('[Descanso] Livre');
            }
            plan[day] = tasks.join('\n');
        });
        setPlanner(plan);
    };

    const exportAsImage = async () => {
        if (!plannerRef.current) return;
        setIsExporting(true);
        try {
            await new Promise(r => setTimeout(r, 150));
            const canvas = await html2canvas(plannerRef.current, {
                backgroundColor: '#0b0f1a',
                scale: 2,
                logging: false,
                useCORS: true,
            });
            canvas.toBlob(blob => {
                const url  = URL.createObjectURL(blob);
                const link = document.createElement('a');
                const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
                link.download = `planner-${date}.png`;
                link.href     = url;
                link.click();
                URL.revokeObjectURL(url);
                setIsExporting(false);
            });
        } catch (err) {
            console.error(err);
            alert('Erro ao exportar. Tente novamente.');
            setIsExporting(false);
        }
    };

    const getWeekNum = () => {
        const now   = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        return Math.ceil(((now - start) / 86400000 + 1) / 7);
    };

    return (
        <div className="animate-fade">
            <h1 className="page-title">Planner Semanal</h1>
            <p className="page-subtitle">Organize sua semana de estudos e exporte como imagem</p>

            <div className="card">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-secondary font-semibold text-sm">
                        <Flame size={16} style={{ color: 'var(--warning)' }} />
                        Semana {getWeekNum()} · {new Date().getFullYear()}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <button onClick={generateRoutine} className="btn btn-outline btn-sm">
                            <RefreshCw size={14} /> Gerar Automático
                        </button>
                        <button onClick={exportAsImage} className="btn btn-primary btn-sm" disabled={isExporting}>
                            <Download size={14} /> {isExporting ? 'Exportando…' : 'Exportar PNG'}
                        </button>
                    </div>
                </div>

                <div ref={plannerRef} style={{ padding: isExporting ? '40px' : 0 }}>
                    {isExporting && (
                        <div style={{ textAlign: 'center', marginBottom: 32, paddingBottom: 24, borderBottom: '2px solid #3b82f6' }}>
                            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#60a5fa', marginBottom: 8 }}>
                                Planejamento Semanal
                            </h1>
                            <p style={{ color: '#94a3b8', fontSize: 14 }}>
                                Semana {getWeekNum()} · {new Date().getFullYear()} · CronogramaLife
                            </p>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                        {DAYS.map(day => (
                            <div key={day} className="planner-day">
                                <div className="planner-day-header">{day}</div>
                                {isExporting ? (
                                    <div style={{
                                        whiteSpace: 'pre-wrap', fontSize: 12,
                                        color: '#94a3b8', padding: '0.75rem', lineHeight: 1.7,
                                    }}>
                                        {planner[day] || 'Sem atividades planejadas'}
                                    </div>
                                ) : (
                                    <textarea
                                        className="planner-day textarea"
                                        value={planner[day]}
                                        onChange={e => handleChange(day, e.target.value)}
                                        placeholder="Adicionar metas…"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {isExporting && (
                        <div style={{ marginTop: 28, textAlign: 'center', color: '#64748b', fontSize: 11, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                            "Constância &gt; Intensidade" · CronogramaLife
                        </div>
                    )}
                </div>

                {!isExporting && (
                    <div className="alert alert-info mt-4">
                        <p><strong>Dica:</strong> Use "Gerar Automático" para criar uma base balanceada entre Exatas e Humanas · "Exportar PNG" salva o planner como imagem.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
