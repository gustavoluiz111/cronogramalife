import React, { useState } from 'react';
import { Calculator, BookOpen, Settings, Check, X, Plus, Download } from 'lucide-react';
import { useFirebaseData } from '../hooks/useFirebaseData';
import html2canvas from 'html2canvas';

const DEFAULT_SUBJECTS = [
    'Matematica', 'Portugues', 'Biologia', 'Historia', 'Quimica',
    'Fisica', 'Geografia', 'Filosofia', 'Sociologia', 'Ingles',
    'Artes', 'Ed. Fisica', 'Ciencias Natureza e Tec.', 'Mat. e suas Tec.',
    'Mat. e Humanas',
];

const DEFAULT_SUBJECT_CONFIG = {
    numSom: 2,
    somNames: ['1º Somatório', '2º Somatório'],
    somMax: [5, 5],
    hasSimulado: true,
    simuladoName: 'Simulado',
    simuladoMax: 10,
    divideBy: 2,
    passingGrade: 5.0,
};

const DEFAULT_SCHEDULE = {
    Segunda: ['Geografia', 'Mat. e Humanas', 'Filosofia', 'Quimica', 'Ingles', 'Fisica'],
    Terca:   ['Matematica', 'Biologia', 'Historia', 'Ciencias Natureza e Tec.', 'Matematica', 'Portugues'],
    Quarta:  ['Portugues', 'Ed. Fisica', 'Portugues', 'Mat. e suas Tec.', 'Geografia', 'Ingles'],
    Quinta:  ['Fisica', 'Ciencias Natureza e Tec.', 'Artes', 'Historia', 'Biologia', 'Mat. e Humanas'],
    Sexta:   ['Mat. e suas Tec.', 'Matematica', 'Sociologia', 'Matematica', 'Portugues', 'Quimica'],
};

// SIEPE Rounding Rule
const applySIEPE = (val) => {
    let num = parseFloat(val) || 0;
    return Math.ceil(num * 2) / 2;
};

const makeDefaultGrades = (subjects) =>
    subjects.reduce((acc, sub) => ({
        ...acc,
        [sub]: {
            config: { ...DEFAULT_SUBJECT_CONFIG },
            trimesters: [
                { soms: [0, 0], simulado: 0 },
                { soms: [0, 0], simulado: 0 },
                { soms: [0, 0], simulado: 0 }
            ]
        },
    }), {});

export const School = () => {
    const [schedule, setSchedule] = useFirebaseData('school_sched_mul', DEFAULT_SCHEDULE);
    const [subjects, setSubjects] = useFirebaseData('school_subj_mul', DEFAULT_SUBJECTS);
    const [grades, setGrades]     = useFirebaseData('school_gr_mul_v4', null);

    const activeGrades = grades || makeDefaultGrades(subjects);

    const [editingSchedule, setEditingSchedule] = useState(false);
    const [newSubject, setNewSubject]           = useState('');
    const [localSched, setLocalSched]           = useState(null);
    const [configModal, setConfigModal]         = useState(null);
    const [activeTri, setActiveTri]             = useState(0); // 0, 1, 2 = 1º, 2º, 3º Trimestre
    const [showReport, setShowReport]           = useState(false);

    // Helpers
    const getGradeData = (sub) => {
        let data = activeGrades[sub];
        if (!data) {
            data = {
                config: { ...DEFAULT_SUBJECT_CONFIG },
                trimesters: [{soms:[], simulado:0}, {soms:[], simulado:0}, {soms:[], simulado:0}]
            };
        }
        
        let config = data.config || {};
        if (config.somMax && config.somMax[0] === 8) {
            config = { ...DEFAULT_SUBJECT_CONFIG };
        } else {
            config = { ...DEFAULT_SUBJECT_CONFIG, ...config };
        }

        // Migrate if trimesters don't exist
        let trimesters = data.trimesters;
        if(!trimesters) {
            trimesters = [
                { soms: data.soms || [], simulado: data.simulado || 0 },
                { soms: [], simulado: 0 },
                { soms: [], simulado: 0 }
            ];
        }
        
        return { ...data, config, trimesters };
    };

    const maxTotal = (sub) => {
        const { config } = getGradeData(sub);
        const somSum = (config.somMax || []).reduce((a, b) => a + b, 0);
        return somSum + (config.hasSimulado ? (config.simuladoMax || 0) : 0);
    };

    const maxMedia = (sub) => {
        const { config } = getGradeData(sub);
        const divBy = config.divideBy || 1;
        return (maxTotal(sub) / divBy).toFixed(1);
    };

    const calcTotalTri = (sub, triIndex) => {
        const data = getGradeData(sub);
        const config = data.config;
        const tri = data.trimesters[triIndex] || { soms: [], simulado: 0 };
        const soms = (tri.soms || []).slice(0, config.numSom || 2);
        const somSum = soms.reduce((a, b) => a + (parseFloat(b) || 0), 0);
        const sim = config.hasSimulado ? (parseFloat(tri.simulado) || 0) : 0;
        return somSum + sim;
    };

    const calcMediaTri = (sub, triIndex) => {
        const { config } = getGradeData(sub);
        const divBy = config.divideBy || 1;
        let final = calcTotalTri(sub, triIndex) / divBy;
        return applySIEPE(final).toFixed(1);
    };

    const calcYearlyMedia = (sub) => {
        const m1 = parseFloat(calcMediaTri(sub, 0));
        const m2 = parseFloat(calcMediaTri(sub, 1));
        const m3 = parseFloat(calcMediaTri(sub, 2));
        let final = (m1 + m2 + m3) / 3;
        return applySIEPE(final).toFixed(1);
    };

    const getStatus = (sub) => {
        const media = parseFloat(calcYearlyMedia(sub)); // Status runs off yearly
        const { config } = getGradeData(sub);
        const pass = config.passingGrade || 5;
        if (media >= pass * 1.4) return { text: 'Excelente', cls: 'success' };
        if (media >= pass)       return { text: 'Aprovado', cls: 'warning' };
        return { text: 'Em Risco', cls: 'danger' };
    };

    const handleSomChange = (sub, idx, val, onBlur = false) => {
        const data = getGradeData(sub);
        const max = (data.config.somMax || [])[idx] || 10;
        
        // Only enforce SIEPE snapping on blur to avoid breaking typing
        let v = parseFloat(val) || 0;
        if(onBlur) v = applySIEPE(v);

        if (v > max) v = max;
        if (v < 0) v = 0;

        const tris = [...data.trimesters];
        const soms = [...(tris[activeTri].soms || [])];
        while (soms.length <= idx) soms.push(0);

        // if typing, we store the raw string/number. If blur, the rounded one.
        soms[idx] = onBlur ? v : val;
        tris[activeTri] = { ...tris[activeTri], soms };

        setGrades({ ...activeGrades, [sub]: { ...data, trimesters: tris } });
    };

    const handleSimChange = (sub, val, onBlur = false) => {
        const data = getGradeData(sub);
        const max = data.config.simuladoMax || 4;
        
        let v = parseFloat(val) || 0;
        if(onBlur) v = applySIEPE(v);

        if (v > max) v = max;
        if (v < 0) v = 0;

        const tris = [...data.trimesters];
        // Same here, if typing store string to not interrupt, clamp to rounded on blur
        tris[activeTri] = { ...tris[activeTri], simulado: onBlur ? v : val };

        setGrades({ ...activeGrades, [sub]: { ...data, trimesters: tris } });
    };

    const addSubject = () => {
        const s = newSubject.trim();
        if (!s || subjects.includes(s)) return;
        setSubjects([...subjects, s]);
        setGrades({ 
            ...activeGrades, 
            [s]: { 
                config: { ...DEFAULT_SUBJECT_CONFIG }, 
                trimesters: [
                    { soms: new Array(DEFAULT_SUBJECT_CONFIG.numSom).fill(0), simulado: 0 },
                    { soms: new Array(DEFAULT_SUBJECT_CONFIG.numSom).fill(0), simulado: 0 },
                    { soms: new Array(DEFAULT_SUBJECT_CONFIG.numSom).fill(0), simulado: 0 }
                ]
            } 
        });
        setNewSubject('');
    };

    const removeSubject = (sub) => {
        if (!window.confirm(`Remover "${sub}"?`)) return;
        setSubjects(subjects.filter(s => s !== sub));
    };

    const startEditSchedule = () => { setLocalSched(JSON.parse(JSON.stringify(schedule))); setEditingSchedule(true); };
    const saveSchedule = () => { setSchedule(localSched); setEditingSchedule(false); setLocalSched(null); };
    const cancelSchedule = () => { setEditingSchedule(false); setLocalSched(null); };
    const handleCellEdit = (day, period, value) => {
        setLocalSched(prev => ({
            ...prev,
            [day]: (prev[day] || []).map((v, i) => i === period ? value : v),
        }));
    };

    const exportReportCard = async () => {
        const el = document.getElementById('report-card-capture');
        if (!el) return;
        try {
            const canvas = await html2canvas(el, { backgroundColor: '#101825', scale: 2 });
            const imgData = canvas.toDataURL('image/jpeg', 0.9);
            const link = document.createElement('a');
            link.download = 'boletim_escolar.jpg';
            link.href = imgData;
            link.click();
        } catch(e) {
            console.error('Falha ao exportar boletim', e);
            alert('Erro ao gerar a imagem do boletim.');
        }
    };

    return (
        <div className="animate-fade">
            <h1 className="page-title">Escola</h1>
            <p className="page-subtitle">Padrão SIEPE ativo: notas quebradas arredondam para a metade mais próxima (ex: 1.2 vira 1.5). Controle seus 3 trimestres!</p>

            <div className="card mb-4">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <h2 className="section-title" style={{ margin: 0 }}>
                            <Calculator size={20} /> Minhas Notas
                        </h2>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.25rem', borderRadius: '12px' }}>
                        {[0, 1, 2].map(t => (
                            <button
                                key={t}
                                onClick={() => setActiveTri(t)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontWeight: 'bold',
                                    background: activeTri === t ? 'var(--accent)' : 'transparent',
                                    color: activeTri === t ? 'white' : 'rgba(255,255,255,0.5)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {t + 1}º Trimestre
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button className="btn btn-outline btn-sm" onClick={() => setShowReport(true)} title="Gerar Boletim Escolar (JPEG)">
                            <Download size={14} /> Boletim
                        </button>
                        <input
                            type="text"
                            placeholder="Nova matéria..."
                            value={newSubject}
                            onChange={e => setNewSubject(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addSubject()}
                            style={{ width: 140, margin: 0 }}
                        />
                        <button className="btn btn-primary btn-sm" onClick={addSubject}><Plus size={14} /></button>
                    </div>
                </div>
            </div>

            <div className="grades-grid">
                {(subjects || DEFAULT_SUBJECTS).map(sub => {
                    const data = getGradeData(sub);
                    const { config, trimesters } = data;
                    const activeT = trimesters[activeTri] || { soms: [], simulado: 0 };
                    
                    const totalT = calcTotalTri(sub, activeTri);
                    const mediaT = calcMediaTri(sub, activeTri); 
                    const yearly = calcYearlyMedia(sub);
                    const status = getStatus(sub);
                    const maxT = maxTotal(sub);
                    const maxM = maxMedia(sub);
                    const pct = maxT > 0 ? (totalT / maxT) * 100 : 0;

                    return (
                        <div key={sub} className={`grade-card ${status.cls}`}>
                            <div className="grade-card-header">
                                <h3>{sub}</h3>
                                <div className="flex items-center gap-1">
                                    <button className="btn btn-ghost btn-sm" style={{ padding: '0.3rem', color: 'var(--muted)' }} onClick={() => setConfigModal(sub)} title="Configurar Metas da Disciplina">
                                        <Settings size={14} />
                                    </button>
                                    <button className="btn btn-ghost btn-sm" style={{ padding: '0.3rem', color: 'var(--danger)' }} onClick={() => removeSubject(sub)} title="Apagar">
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="grade-inputs">
                                {(config.somNames || []).map((name, i) => (
                                    <div key={i} className="grade-input-group">
                                        <label>{name}</label>
                                        <div className="input-with-max">
                                            <input
                                                type="number" min="0" max={(config.somMax || [])[i] || 10} step="0.1"
                                                value={(activeT.soms || [])[i] != null ? (activeT.soms || [])[i] : ''}
                                                onChange={e => handleSomChange(sub, i, e.target.value, false)}
                                                onBlur={e => handleSomChange(sub, i, e.target.value, true)} // SIEPE snap
                                                placeholder="0" style={{ textAlign: 'center' }}
                                            />
                                            <span className="max-label">/{(config.somMax || [])[i] || 10}</span>
                                        </div>
                                    </div>
                                ))}

                                {config.hasSimulado && (
                                    <div className="grade-input-group">
                                        <label>{config.simuladoName || 'Simulado'}</label>
                                        <div className="input-with-max">
                                            <input
                                                type="number" min="0" max={config.simuladoMax || 4} step="0.1"
                                                value={activeT.simulado != null ? activeT.simulado : ''}
                                                onChange={e => handleSimChange(sub, e.target.value, false)}
                                                onBlur={e => handleSimChange(sub, e.target.value, true)} // SIEPE snap
                                                placeholder="0" style={{ textAlign: 'center' }}
                                            />
                                            <span className="max-label">/{config.simuladoMax || 4}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grade-result" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
                                <div className="progress-bar">
                                    <div className={`progress-fill ${status.cls}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                                </div>
                                <div className="grade-total">
                                    <span className="text-muted text-xs">Soma {activeTri + 1}º Tri: {totalT.toFixed(1)}/{maxT}</span>
                                    <span style={{ fontWeight: 'bold' }}>
                                        Média {activeTri + 1}º Tri: <span style={{color: 'var(--text-primary)'}}>{mediaT}</span>
                                    </span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                                 <span className="badge badge-muted" style={{ fontWeight: 'bold', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}>Média Anual</span>
                                 <div style={{ fontWeight: '900', fontSize: '1.2rem', color: `var(--${status.cls})`}}>
                                    {yearly} <span style={{fontSize: '0.7rem', color: 'var(--text-muted)'}}>/{maxM}</span>
                                 </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Schedule ── */}
            <div className="card mt-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="section-title" style={{ margin: 0 }}>
                        <BookOpen size={20} />
                        Horário Escolar (3º B)
                    </h2>
                    <div className="flex gap-2">
                        {editingSchedule ? (
                            <>
                                <button className="btn btn-success btn-sm" onClick={saveSchedule}>
                                    <Check size={14} /> Salvar
                                </button>
                                <button className="btn btn-outline btn-sm" onClick={cancelSchedule}>
                                    <X size={14} /> Cancelar
                                </button>
                            </>
                        ) : (
                            <button className="btn btn-outline btn-sm" onClick={startEditSchedule}>
                                <Settings size={14} /> Editar Horário
                            </button>
                        )}
                    </div>
                </div>

                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ minWidth: 80 }}>Horário</th>
                                {Object.keys(schedule || DEFAULT_SCHEDULE).map(d => <th key={d}>{d}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {['1 Aula', '2 Aula', '3 Aula', '4 Aula', '5 Aula', '6 Aula'].map((period, pi) => (
                                <tr key={pi}>
                                    <td className="font-mono text-muted text-xs">{period}</td>
                                    {Object.keys(schedule || DEFAULT_SCHEDULE).map(day => (
                                        <td key={day}>
                                            {editingSchedule ? (
                                                <input
                                                    type="text"
                                                    value={((editingSchedule ? localSched : schedule)[day] || [])[pi] || ''}
                                                    onChange={e => handleCellEdit(day, pi, e.target.value)}
                                                    style={{ padding: '0.3rem 0.5rem', fontSize: '0.78rem', margin: 0 }}
                                                />
                                            ) : (
                                                <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                                                    {(schedule[day] || [])[pi] || '-'}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Config Modal */}
            {configModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="card animate-fade" style={{ maxWidth: 500, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Parâmetros: <span style={{color: 'var(--accent)'}}>{configModal}</span></h2>
                            <button className="btn btn-ghost" onClick={() => setConfigModal(null)}><X size={18} /></button>
                        </div>
                        
                        {(() => {
                            const data = getGradeData(configModal);
                            let cfg = data.config || DEFAULT_SUBJECT_CONFIG;
                            const setLocalCfg = (newCfg) => setGrades({...activeGrades, [configModal]: {...data, config: newCfg}});

                            return (
                                <div className="config-grid">
                                    <div className="input-group">
                                        <label>Número de Avaliações (Somatórios)</label>
                                        <select
                                            value={cfg.numSom || 2}
                                            onChange={e => {
                                                const num = parseInt(e.target.value);
                                                const newNames = [...(cfg.somNames || [])];
                                                const newMax = [...(cfg.somMax || [])];
                                                while(newNames.length < num) newNames.push(`${newNames.length+1} Somatório`);
                                                while(newMax.length < num) newMax.push(8);
                                                setLocalCfg({...cfg, numSom: num, somNames: newNames.slice(0,num), somMax: newMax.slice(0,num)});
                                            }}
                                        >
                                            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Avaliação{n>1?'s':''}</option>)}
                                        </select>
                                    </div>

                                    {(cfg.somNames || []).map((name, i) => (
                                        <React.Fragment key={i}>
                                            <div className="input-group">
                                                <label>Nome da {i + 1}ª Avaliação</label>
                                                <input
                                                    type="text" value={name}
                                                    onChange={e => {
                                                        const n = [...cfg.somNames]; n[i] = e.target.value;
                                                        setLocalCfg({ ...cfg, somNames: n });
                                                    }}
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label>Pontos Máximos na {i + 1}ª Avaliação</label>
                                                <input
                                                    type="number" min="1" max="50"
                                                    value={(cfg.somMax || [])[i] || 8}
                                                    onChange={e => {
                                                        const m = [...cfg.somMax]; m[i] = parseFloat(e.target.value) || 1;
                                                        setLocalCfg({ ...cfg, somMax: m });
                                                    }}
                                                />
                                            </div>
                                        </React.Fragment>
                                    ))}

                                    <div className="input-group" style={{ gridColumn: '1 / -1', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox" checked={!!cfg.hasSimulado}
                                                onChange={e => setLocalCfg({ ...cfg, hasSimulado: e.target.checked })}
                                            />
                                            <strong>Incluir Nota Extra / Simulado</strong>
                                        </label>
                                    </div>

                                    {cfg.hasSimulado && (
                                        <>
                                            <div className="input-group">
                                                <label>Nome do Extra</label>
                                                <input
                                                    type="text" value={cfg.simuladoName || 'Simulado'}
                                                    onChange={e => setLocalCfg({ ...cfg, simuladoName: e.target.value })}
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label>Pontos Máximos - Extra</label>
                                                <input
                                                    type="number" min="1" max="20"
                                                    value={cfg.simuladoMax || 4}
                                                    onChange={e => setLocalCfg({ ...cfg, simuladoMax: parseFloat(e.target.value) || 1 })}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="input-group">
                                        <label>No fim, dividir a soma por:</label>
                                        <input
                                            type="number" min="1" max="10" step="0.5"
                                            value={cfg.divideBy || 2}
                                            onChange={e => setLocalCfg({ ...cfg, divideBy: parseFloat(e.target.value) || 1 })}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>Média mínima para Aprovação (Status)</label>
                                        <input
                                            type="number" min="0" max="100" step="0.1"
                                            value={cfg.passingGrade || 5}
                                            onChange={e => setLocalCfg({ ...cfg, passingGrade: parseFloat(e.target.value) || 5 })}
                                        />
                                    </div>
                                </div>
                            );
                        })()}

                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => setConfigModal(null)}>
                            Salvar Regras
                        </button>
                    </div>
                </div>
            )}

            {/* Boletim Modal */}
            {showReport && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '1rem'
                }}>
                    <div className="animate-fade" style={{ maxWidth: 800, width: '100%', maxHeight: '95vh', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="flex items-center justify-between">
                            <h2 style={{color: 'white', margin: 0}}>Boletim Escolar</h2>
                            <div className="flex gap-2">
                                <button className="btn btn-success" onClick={exportReportCard}>
                                    <Download size={18} /> Baixar JPEG
                                </button>
                                <button className="btn btn-ghost" onClick={() => setShowReport(false)} style={{color: 'white'}}>
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                        
                        <div style={{ overflow: 'auto', background: 'var(--bg-card)', borderRadius: '16px', boxShadow: 'var(--card-shadow)' }}>
                            <div id="report-card-capture" style={{
                                background: '#101825',
                                color: '#eef2ff',
                                padding: '2.5rem',
                                fontFamily: 'Inter, system-ui, sans-serif'
                            }}>
                                <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem' }}>
                                    <h1 style={{ fontSize: '2.2rem', margin: 0, background: 'linear-gradient(135deg, #7eb3ff, #9b59ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        Boletim Escolar
                                    </h1>
                                    <p style={{ margin: '0.5rem 0 0 0', color: '#8b9fc4', fontSize: '1.1rem' }}>Desempenho Anual - Notas e Médias</p>
                                </div>

                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid rgba(79, 142, 247, 0.3)' }}>
                                            <th style={{ padding: '1rem', color: '#8b9fc4' }}>Disciplina</th>
                                            <th style={{ padding: '1rem', textAlign: 'center', color: '#8b9fc4' }}>1º Tri</th>
                                            <th style={{ padding: '1rem', textAlign: 'center', color: '#8b9fc4' }}>2º Tri</th>
                                            <th style={{ padding: '1rem', textAlign: 'center', color: '#8b9fc4' }}>3º Tri</th>
                                            <th style={{ padding: '1rem', textAlign: 'center', color: '#8b9fc4' }}>Média Anual</th>
                                            <th style={{ padding: '1rem', textAlign: 'center', color: '#8b9fc4' }}>Situação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(subjects || DEFAULT_SUBJECTS).map((sub, i) => {
                                            const m1 = calcMediaTri(sub, 0);
                                            const m2 = calcMediaTri(sub, 1);
                                            const m3 = calcMediaTri(sub, 2);
                                            const yearly = calcYearlyMedia(sub);
                                            const status = getStatus(sub);
                                            
                                            // Get matching hex colors to ensure html2canvas paints correctly
                                            const statusColors = {
                                                success: '#10b981',
                                                warning: '#f59e0b',
                                                danger: '#ef4444'
                                            };
                                            const badgeBg = {
                                                success: 'rgba(16, 185, 129, 0.15)',
                                                warning: 'rgba(245, 158, 11, 0.15)',
                                                danger: 'rgba(239, 68, 68, 0.15)'
                                            };
                                            
                                            const sColor = statusColors[status.cls] || '#fff';
                                            const sBg = badgeBg[status.cls] || 'transparent';
                                            
                                            return (
                                                <tr key={sub} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent' }}>
                                                    <td style={{ padding: '1rem', fontWeight: '600' }}>{sub}</td>
                                                    <td style={{ padding: '1rem', textAlign: 'center' }}>{m1}</td>
                                                    <td style={{ padding: '1rem', textAlign: 'center' }}>{m2}</td>
                                                    <td style={{ padding: '1rem', textAlign: 'center' }}>{m3}</td>
                                                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: sColor }}>{yearly}</td>
                                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                        <span style={{
                                                            padding: '0.4rem 0.8rem',
                                                            borderRadius: '999px',
                                                            fontSize: '0.8rem',
                                                            backgroundColor: sBg,
                                                            color: sColor,
                                                            fontWeight: 'bold',
                                                            border: `1px solid ${sColor}40`
                                                        }}>
                                                            {status.text}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                
                                <div style={{ marginTop: '2.5rem', textAlign: 'center', color: '#536077', fontSize: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                                    Gerado por CronogramaLife • {new Date().toLocaleDateString('pt-BR')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
