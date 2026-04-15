import React, { useState } from 'react';
import { BookOpen, Video, MapPin, Code, ExternalLink, Edit3, Plus, Trash2, TrendingUp, Layout as LayoutIcon } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// ─── Ferreto Data ───
const FERRETO_WEEKS = [
    { week: 1, total: 53 }, { week: 2, total: 76 }, { week: 3, total: 72 }, { week: 4, total: 66 },
    { week: 5, total: 69 }, { week: 6, total: 62 }, { week: 7, total: 76 }, { week: 8, total: 78 },
];

const TECH_COURSES = [
    { name: 'FGV — IA e Ciência de Dados', desc: '216 cursos gratuitos', url: 'https://educacao-executiva.fgv.br/cursos/online', cert: 'FGV' },
    { name: 'Lúmina UFRGS', desc: 'MOOCs em Tecnologia', url: 'https://lumina.ufrgs.br', cert: 'UFRGS' },
];

// ─── REDAÇÃO MANAGER ───
const RedacaoManager = () => {
    const [redacoes, setRedacoes] = useLocalStorage('agenda_redacoes', []);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [form, setForm] = useState({ tema: '', status: 'pendente', nota: '', introducao: '' });

    const addRedacao = () => {
        if (!form.tema.trim()) return;
        setRedacoes([...redacoes, { id: Date.now(), ...form, nota: parseFloat(form.nota) || null, data: new Date().toISOString() }]);
        setForm({ tema: '', status: 'pendente', nota: '', introducao: '' });
        setIsFormOpen(false);
    };

    const removeRedacao = (id) => {
        if(window.confirm('Apagar redação?')) setRedacoes(redacoes.filter(r => r.id !== id));
    };

    const editStatus = (id, newStatus) => {
        setRedacoes(redacoes.map(r => r.id === id ? { ...r, status: newStatus } : r));
    };

    const concluidas = redacoes.filter(r => r.status === 'concluída' && r.nota !== null);
    const notas = concluidas.map(r => r.nota);
    const media = notas.length > 0 ? (notas.reduce((a,b)=>a+b,0) / notas.length).toFixed(1) : 0;
    const maxNota = notas.length > 0 ? Math.max(...notas) : 0;

    return (
        <div className="card mb-4" style={{ border: '1px solid rgba(10,30,80,0.5)' }}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="section-title" style={{ margin: 0, color: 'var(--accent)' }}><Edit3 size={20} /> Laboratório de Redação</h2>
                <button className="btn btn-primary btn-sm" onClick={() => setIsFormOpen(!isFormOpen)}>
                    {isFormOpen ? 'Fechar' : <><Plus size={16}/> Nova Redação</>}
                </button>
            </div>

            {isFormOpen && (
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="grid grid-2" style={{ gap: '1rem' }}>
                        <div className="input-group" style={{ margin: 0 }}>
                            <label>Tema da Redação</label>
                            <input type="text" placeholder="Ex: Caminhos para combater a intolerância..." value={form.tema} onChange={e => setForm({...form, tema: e.target.value})} />
                        </div>
                        <div className="input-group" style={{ margin: 0 }}>
                            <label>Status</label>
                            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                                <option value="pendente">Pendente / Para Fazer</option>
                                <option value="aguardando_nota">Escrita / Esperando Nota</option>
                                <option value="concluída">Concluída / Corrigida</option>
                            </select>
                        </div>
                        {form.status === 'concluída' && (
                            <div className="input-group" style={{ margin: 0 }}>
                                <label>Nota (0 a 1000)</label>
                                <input type="number" min="0" max="1000" step="10" placeholder="Ex: 920" value={form.nota} onChange={e => setForm({...form, nota: e.target.value})} />
                            </div>
                        )}
                        <div className="input-group" style={{ gridColumn: '1 / -1', margin: 0 }}>
                            <label>Modelo de Introdução / Repertório Utilizado (Opcional)</label>
                            <textarea rows="2" placeholder="Ex: Na obra 'Utopia' de Thomas More..." value={form.introducao} onChange={e => setForm({...form, introducao: e.target.value})}></textarea>
                        </div>
                    </div>
                    <button className="btn btn-success mt-3" style={{ width: '100%' }} onClick={addRedacao}>Salvar Redação</button>
                </div>
            )}

            {/* Gráficos e Resumo */}
            {concluidas.length > 0 && (
                <div className="grid grid-2 mb-4" style={{ gap: '1rem' }}>
                    <div className="stat-card" style={{ background: 'rgba(10,30,80,0.3)', borderColor: 'rgba(10,30,80,0.5)' }}>
                        <div className="stat-label"><TrendingUp size={14} style={{ display:'inline', marginRight:4}} /> Média Geral</div>
                        <div className="stat-value" style={{ color: '#4da6ff' }}>{media}</div>
                        <div className="text-xs text-muted mt-1">Baseado em {concluidas.length} redações</div>
                    </div>
                    <div className="stat-card" style={{ background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.2)' }}>
                        <div className="stat-label"><TrendingUp size={14} style={{ display:'inline', marginRight:4}} /> Maior Nota</div>
                        <div className="stat-value text-success">{maxNota}</div>
                        <div className="text-xs text-muted mt-1">Muito bem!</div>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <div className="text-xs text-muted mb-2 font-bold uppercase tracking-wide">Evolução Mensal (Gráfico em Barras)</div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100px', background: 'rgba(0,0,0,0.1)', padding: '10px', borderRadius: '8px' }}>
                            {concluidas.slice(-10).map((r, i) => (
                                <div key={i} title={`${r.tema} - Nota: ${r.nota}`} style={{ flex: 1, minWidth: '20px', background: 'linear-gradient(to top, #0e277c, #4da6ff)', height: `${(r.nota / 1000) * 100}%`, borderRadius: '4px 4px 0 0', position: 'relative' }}>
                                    <span style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', color: '#fff', fontWeight: 'bold' }}>{r.nota}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Tabela de Redacões */}
            <h3 className="section-title text-sm mt-4 mb-2"><LayoutIcon size={14}/> Minhas Redações</h3>
            {redacoes.length === 0 ? (
                <div className="alert alert-info">Nenhuma redação registrada. Crie uma nova para começar!</div>
            ) : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Tema</th>
                                <th>Status</th>
                                <th>Nota</th>
                                <th>Introdução/Repertório</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {redacoes.map(r => (
                                <tr key={r.id} style={{ background: r.status === 'pendente' ? 'rgba(255, 165, 0, 0.1)' : r.status === 'aguardando_nota' ? 'rgba(77, 166, 255, 0.1)' : 'transparent', borderLeft: r.status === 'pendente' ? '4px solid orange' : r.status === 'aguardando_nota' ? '4px solid #4da6ff' : 'none' }}>
                                    <td style={{ fontWeight: 'bold', maxWidth: '200px' }}>
                                        {r.tema}
                                        {r.status === 'pendente' && <div style={{ fontSize: '0.7rem', color: 'orange', marginTop: '4px', fontWeight: 'normal' }}>⚠️ Em destaque - Pendente</div>}
                                    </td>
                                    <td>
                                        {r.status === 'concluída' ? (
                                            <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 'bold' }}>✅ Concluída</span>
                                        ) : r.status === 'aguardando_nota' ? (
                                            <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                                                <span style={{ fontSize: '0.75rem', color: '#4da6ff', fontWeight: 'bold' }}>⏳ Esperando Nota</span>
                                                <button className="btn btn-sm btn-outline" style={{ fontSize: '0.65rem', padding: '0.2rem 0.4rem', borderColor: '#4da6ff', color: '#4da6ff', background: 'transparent' }} onClick={() => {
                                                    const notaStr = window.prompt("Qual foi a sua nota? (0-1000):");
                                                    if (notaStr !== null) {
                                                        const notaNum = parseInt(notaStr);
                                                        setRedacoes(redacoes.map(item => item.id === r.id ? { ...item, status: 'concluída', nota: isNaN(notaNum) ? 0 : notaNum } : item));
                                                    }
                                                }}>✔️ Lançar Nota</button>
                                            </div>
                                        ) : (
                                            <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                                                <button className="btn btn-sm btn-outline" style={{ fontSize: '0.65rem', padding: '0.2rem 0.4rem', borderColor: 'orange', color: 'orange', background: 'transparent' }} onClick={() => {
                                                    setRedacoes(redacoes.map(item => item.id === r.id ? { ...item, status: 'aguardando_nota' } : item));
                                                }}>⏳ Escrita (Esperando Nota)</button>
                                                <button className="btn btn-sm btn-outline" style={{ fontSize: '0.65rem', padding: '0.2rem 0.4rem', borderColor: 'var(--success)', color: 'var(--success)', background: 'transparent' }} onClick={() => {
                                                    const notaStr = window.prompt("Redação concluída! Qual foi a sua nota? (0-1000):");
                                                    if (notaStr !== null) {
                                                        const notaNum = parseInt(notaStr);
                                                        setRedacoes(redacoes.map(item => item.id === r.id ? { ...item, status: 'concluída', nota: isNaN(notaNum) ? 0 : notaNum } : item));
                                                    }
                                                }}>✔️ Lançar Nota Direto</button>
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ fontWeight: '900', color: r.nota >= 900 ? 'var(--success)' : r.nota > 0 ? 'var(--accent)' : 'var(--muted)' }}>
                                        {r.nota !== undefined && r.nota !== null ? r.nota : '-'}
                                    </td>
                                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {r.introducao || '-'}
                                    </td>
                                    <td>
                                        <button className="btn btn-ghost btn-sm" onClick={() => removeRedacao(r.id)}><Trash2 size={14}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};


export const Courses = () => {
    const [ferretoData, setFerretoData] = useLocalStorage('ferreto_progress', () =>
        FERRETO_WEEKS.map(w => ({ ...w, current: 0 }))
    );

    const merged = FERRETO_WEEKS.map(w => {
        const found = ferretoData.find(p => p.week === w.week);
        return { ...w, current: found ? found.current : 0 };
    });

    const updateProgress = (index, value) => {
        const newData = [...merged];
        let val = parseInt(value) || 0;
        if (val > newData[index].total) val = newData[index].total;
        if (val < 0) val = 0;
        newData[index] = { ...newData[index], current: val };
        setFerretoData(newData);
    };

    const totalPct = () => {
        const total = merged.reduce((a, w) => a + w.total, 0);
        const done  = merged.reduce((a, w) => a + w.current, 0);
        return total > 0 ? Math.round((done / total) * 100) : 0;
    };

    return (
        <div className="animate-fade">
            <h1 className="page-title">Cursos & Redação</h1>
            <p className="page-subtitle">Acompanhe seus cursos, planeje suas redações e registre suas notas.</p>

            {/* Módulo de Redação */}
            <RedacaoManager />

            {/* Cursos Recomendados */}
            <div className="card mb-4" style={{ borderLeft: '4px solid var(--accent)' }}>
                <h2 className="section-title"><Code size={20} /> Cursos Extras / Tecnologia</h2>
                <div className="grid grid-2" style={{ gap: '0.75rem' }}>
                    {TECH_COURSES.map(course => (
                        <div key={course.name} className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '3px solid var(--accent)' }}>
                            <div className="font-bold text-primary" style={{ fontSize: '0.875rem' }}>{course.name}</div>
                            <div className="text-muted text-xs mt-1">{course.desc}</div>
                            <div className="flex justify-between items-center mt-1">
                                <span className="badge badge-success">⭐ Certificado {course.cert}</span>
                                <a href={course.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">Acessar <ExternalLink size={11} /></a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ferreto Tracker */}
            <div className="card">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                    <h2 className="section-title" style={{ margin: 0 }}><Video size={20} /> Progresso Ferreto</h2>
                    <div style={{ textAlign: 'right' }}>
                        <div className="text-muted text-xs">Total Geral</div>
                        <div className="font-extrabold text-accent" style={{ fontSize: '1.75rem', lineHeight: 1 }}>{totalPct()}%</div>
                    </div>
                </div>

                <div className="progress-bar mb-4" style={{ height: 10 }}>
                    <div className="progress-fill thick" style={{ width: `${totalPct()}%`, height: 10 }} />
                </div>

                <div className="grid grid-2" style={{ gap: '0.5rem' }}>
                    {merged.map((week, i) => {
                        const weekPct = week.total > 0 ? (week.current / week.total) * 100 : 0;
                        return (
                            <div key={week.week} className="flex items-center gap-3 p-2" style={{ background: week.current === week.total ? 'var(--success-bg)' : 'transparent' }}>
                                <span className="text-muted font-mono text-xs" style={{ minWidth: 70 }}>Sem. {week.week}</span>
                                <div style={{ flex: 1 }}>
                                    <div className="progress-bar">
                                        <div className={`progress-fill ${weekPct === 100 ? 'success' : ''}`} style={{ width: `${weekPct}%` }} />
                                    </div>
                                </div>
                                <input
                                    type="number" value={week.current === 0 ? '' : week.current}
                                    onChange={e => updateProgress(i, e.target.value)}
                                    placeholder="0" style={{ width: 56, textAlign: 'center', fontSize: '0.8rem', margin: 0, padding: '0.35rem' }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
