import React, { useState } from 'react';
import { Target, TrendingUp, GraduationCap, DollarSign, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// ─── Perfil do Estudante ───────────────────────────────────────────────────
// Pernambuco | Escola pública desde 5º ano | Baixa renda
// Elegível: ProUni Integral, FIES, SiSU L2 + L5

// ─── Cursos Alvo ───────────────────────────────────────────────────────────
const DEFAULT_GOALS = [
    { id: 1, course: 'Análise e Desenv. de Sistemas', univ: 'UFPE', area: 'Tecnologia', cut: 620, target: 680, notes: '' },
    { id: 2, course: 'Ciência da Computação', univ: 'UFPE', area: 'Tecnologia', cut: 700, target: 740, notes: '' },
    { id: 3, course: 'Direito', univ: 'UFPE', area: 'Humanas', cut: 750, target: 780, notes: '' },
];

// ─── SiSU cut scores (estimates 2025 ref) ──────────────────────────────────
// L1 = Ampla concorrência | L2 = Escola Pública | L5 = Escola Pub + Baixa Renda
const SISU_DATA = [
    {
        univ: 'UFPE', course: 'Análise e Desenv. de Sistemas',
        l1: 652, l2: 596, l5: 571,
        link: 'https://www.ufpe.br',
    },
    {
        univ: 'UFPE', course: 'Ciência da Computação',
        l1: 712, l2: 658, l5: 630,
        link: 'https://www.ufpe.br',
    },
    {
        univ: 'UFPE', course: 'Direito (Diurno)',
        l1: 758, l2: 708, l5: 683,
        link: 'https://www.ufpe.br',
    },
    {
        univ: 'UFRPE', course: 'Análise e Desenv. de Sistemas',
        l1: 598, l2: 547, l5: 522,
        link: 'https://www.ufrpe.br',
    },
    {
        univ: 'UFRPE', course: 'Ciência da Computação',
        l1: 625, l2: 572, l5: 548,
        link: 'https://www.ufrpe.br',
    },
    {
        univ: 'UNIVASF', course: 'Ciência da Computação',
        l1: 578, l2: 530, l5: 505,
        link: 'https://www.univasf.edu.br',
    },
];

// ─── ProUni cut scores (estimates) ─────────────────────────────────────────
const PROUNI_DATA = [
    { course: 'ADS', institutions: 'FBT, UNINASSAU, UNIFG (Recife/PE)', integral: 510, parcial: 480 },
    { course: 'Ciência da Computação', institutions: 'Faculdades de PE/RN', integral: 560, parcial: 525 },
    { course: 'Direito', institutions: 'Faculdades de PE', integral: 640, parcial: 600 },
    { course: 'Engenharia de Software', institutions: 'Faculdades de PE', integral: 530, parcial: 495 },
];

// ─── Score Simulator ────────────────────────────────────────────────────────
const ScoreSimulator = () => {
    const [scores, setScores] = useLocalStorage('enem_simulator', {
        ch: 0, cn: 0, lc: 0, mt: 0, redacao: 0,
    });

    const areas = [
        { key: 'ch', label: 'Ciências Humanas' },
        { key: 'cn', label: 'Ciências da Natureza' },
        { key: 'lc', label: 'Linguagens e Códigos' },
        { key: 'mt', label: 'Matemática' },
        { key: 'redacao', label: 'Redação (0–1000)' },
    ];

    const mediaObjFunc = () => {
        const { ch, cn, lc, mt } = scores;
        return ((parseFloat(ch) + parseFloat(cn) + parseFloat(lc) + parseFloat(mt)) / 4).toFixed(1);
    };

    const totalMedio = () => {
        const obj = parseFloat(mediaObjFunc()) || 0;
        const red = parseFloat(scores.redacao) || 0;
        return ((obj * 4 + red) / 5).toFixed(1);
    };

    return (
        <div className="score-simulator mb-4">
            <h4 className="font-bold text-sm text-secondary mb-3 uppercase tracking-wide">
                🎯 Simulador de Pontuação ENEM
            </h4>
            <div className="grid grid-3" style={{ gap: '0.625rem', marginBottom: '0.875rem' }}>
                {areas.map(a => (
                    <div key={a.key} className="input-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.65rem' }}>{a.label}</label>
                        <input
                            type="number" min="0" max="1000" step="1"
                            value={scores[a.key] || ''}
                            onChange={e => setScores({ ...scores, [a.key]: parseFloat(e.target.value) || 0 })}
                            placeholder="0–1000"
                            style={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: 700 }}
                        />
                    </div>
                ))}
            </div>
            <div className="flex gap-4 flex-wrap">
                <div style={{ textAlign: 'center', background: 'var(--accent-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.625rem 1rem' }}>
                    <div className="text-muted text-xs">Média Obj.</div>
                    <div className="font-extrabold text-accent" style={{ fontSize: '1.5rem' }}>{mediaObjFunc()}</div>
                </div>
                <div style={{ textAlign: 'center', background: 'rgba(99,102,241,0.1)', borderRadius: 'var(--radius-sm)', padding: '0.625rem 1rem' }}>
                    <div className="text-muted text-xs">Média Geral</div>
                    <div className="font-extrabold" style={{ fontSize: '1.5rem', color: 'var(--indigo)' }}>{totalMedio()}</div>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <div className="text-xs text-muted">
                        <span style={{ color: 'var(--success)' }}>✅ ProUni/FIES:</span> mínimo 450 pts (média obj.) + redação ≠ 0<br />
                        <span style={{ color: 'var(--accent-hover)' }}>ℹ️ SiSU:</span> usa média simples das 5 áreas
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Main Goals Component ──────────────────────────────────────────────────
export const Goals = () => {
    const [goals, setGoals] = useLocalStorage('goals_v3', DEFAULT_GOALS);
    const [notes, setNotes] = useLocalStorage('goal_notes_v3', {});
    const [showSisu, setShowSisu] = useState(true);
    const [showProuni, setShowProuni] = useState(true);
    const [showFies, setShowFies] = useState(false);
    const [scores] = useLocalStorage('enem_simulator', { ch: 0, cn: 0, lc: 0, mt: 0, redacao: 0 });

    const myScore = () => {
        const { ch, cn, lc, mt } = scores;
        return ((parseFloat(ch) + parseFloat(cn) + parseFloat(lc) + parseFloat(mt)) / 4).toFixed(1);
    };

    const myScoreNum = parseFloat(myScore()) || 0;
    const redacaoOk = parseFloat(scores.redacao) > 0;
    const prouniOk  = myScoreNum >= 450 && redacaoOk;
    const fiesOk    = myScoreNum >= 450 && redacaoOk;

    const reachedL2 = (row) => myScoreNum >= row.l2;
    const reachedL5 = (row) => myScoreNum >= row.l5;
    const reachedL1 = (row) => myScoreNum >= row.l1;

    return (
        <div className="animate-fade">
            <h1 className="page-title">Metas & Acesso</h1>
            <p className="page-subtitle">Cursos alvo, SiSU com cotas, ProUni, FIES e seu simulador de pontuação</p>

            {/* ── Eligibility Banner ── */}
            <div className="eligibility-banner">
                <div className="eligibility-title">Seu perfil de elegibilidade (Pernambuco · Escola Pública · Baixa Renda)</div>
                <span className="badge badge-success">✅ SiSU L2 — Escola Pública</span>
                <span className="badge badge-success">✅ SiSU L5 — EP + Baixa Renda</span>
                <span className={`badge ${prouniOk ? 'badge-success' : 'badge-warning'}`}>
                    {prouniOk ? '✅' : '⚠️'} ProUni Integral (≤ 1,5 SM/pessoa)
                </span>
                <span className={`badge ${prouniOk ? 'badge-success' : 'badge-warning'}`}>
                    {prouniOk ? '✅' : '⚠️'} ProUni Parcial (≤ 3 SM/pessoa)
                </span>
                <span className={`badge ${fiesOk ? 'badge-success' : 'badge-warning'}`}>
                    {fiesOk ? '✅' : '⚠️'} FIES
                </span>
                {!prouniOk && (
                    <div className="text-warning text-xs w-full" style={{ width: '100%' }}>
                        ⚠️ Para ProUni/FIES: atinja mínimo 450 pts (média objetivas) + redação ≠ 0
                    </div>
                )}
            </div>

            {/* ── Score Simulator ── */}
            <div className="card card-highlight">
                <ScoreSimulator />
            </div>

            {/* ── SiSU com Cotas ── */}
            <div className="program-card">
                <div className="program-card-header">
                    <div>
                        <div className="program-name">SiSU com Cotas — PE</div>
                        <div className="text-muted text-xs mt-1">
                            Universidades Federais · Entrada via ENEM · Cotas L2 e L5 disponíveis · Notas estimadas (ref. 2025)
                        </div>
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={() => setShowSisu(v => !v)}>
                        {showSisu ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                </div>

                {showSisu && (
                    <>
                        <div className="alert alert-info mb-4">
                            <p>
                                <strong>L2</strong> = Escola Pública (qualquer renda) &nbsp;|&nbsp;
                                <strong>L5</strong> = Escola Pública + Baixa Renda (per capita ≤ 1,5 SM) &nbsp;|&nbsp;
                                <strong>Você tem direito às duas!</strong>
                            </p>
                        </div>

                        <div className="table-wrapper">
                            <table className="cut-score-table">
                                <thead>
                                    <tr>
                                        <th>Universidade</th>
                                        <th>Curso</th>
                                        <th>L1 (Ampla)</th>
                                        <th style={{ color: 'var(--accent-hover)' }}>L2 (Escola Pub.)</th>
                                        <th style={{ color: 'var(--success)' }}>L5 (EP + Baixa Renda)</th>
                                        <th>Você</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {SISU_DATA.map((row, i) => (
                                        <tr key={i}>
                                            <td>
                                                <a href={row.link} target="_blank" rel="noopener noreferrer"
                                                    className="font-semibold" style={{ color: 'var(--accent-hover)' }}>
                                                    {row.univ}
                                                </a>
                                            </td>
                                            <td className="text-primary font-medium">{row.course}</td>
                                            <td className={reachedL1(row) ? 'reached' : ''}>{row.l1}</td>
                                            <td className={reachedL2(row) ? 'reached' : 'not-reached'} style={{ fontWeight: 700 }}>
                                                {row.l2} {reachedL2(row) ? '✅' : ''}
                                            </td>
                                            <td className={reachedL5(row) ? 'reached' : 'not-reached'} style={{ fontWeight: 700, color: 'var(--success)' }}>
                                                {row.l5} {reachedL5(row) ? '✅' : ''}
                                            </td>
                                            <td className="my-score">
                                                {myScoreNum > 0 ? myScoreNum : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="text-muted text-xs mt-3">
                            * Notas de corte são <strong>estimativas</strong> baseadas no SiSU 2025. Variam a cada edição. Consulte o{' '}
                            <a href="https://sisu.mec.gov.br" target="_blank" rel="noreferrer">sisu.mec.gov.br</a> para dados oficiais.
                        </div>
                    </>
                )}
            </div>

            {/* ── ProUni ── */}
            <div className="program-card">
                <div className="program-card-header">
                    <div>
                        <div className="program-name">ProUni — Bolsa de Estudos</div>
                        <div className="text-muted text-xs mt-1">
                            Bolsa integral (100%) ou parcial (50%) em faculdades particulares
                        </div>
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={() => setShowProuni(v => !v)}>
                        {showProuni ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                </div>

                {showProuni && (
                    <>
                        <div className="grid grid-2 mb-4" style={{ gap: '0.75rem' }}>
                            <div className="stat-card" style={{ background: prouniOk ? 'var(--success-bg)' : 'var(--bg-input)', borderColor: prouniOk ? 'var(--success-border)' : 'var(--border)' }}>
                                <div className="stat-label">Bolsa Integral (100%)</div>
                                <div className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--success)' }}>
                                    {prouniOk ? '✅ Pode ter direito!' : '⚠️ Verifique pontuação'}
                                </div>
                                <div className="stat-sub">Renda familiar ≤ 1,5 SM por pessoa · ENEM mín. 450 pts</div>
                            </div>
                            <div className="stat-card" style={{ background: prouniOk ? 'var(--info-bg)' : 'var(--bg-input)', borderColor: prouniOk ? 'var(--info-border)' : 'var(--border)' }}>
                                <div className="stat-label">Bolsa Parcial (50%)</div>
                                <div className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--info)' }}>
                                    {prouniOk ? '✅ Pode ter direito!' : '⚠️ Verifique pontuação'}
                                </div>
                                <div className="stat-sub">Renda familiar ≤ 3 SM por pessoa · ENEM mín. 450 pts</div>
                            </div>
                        </div>

                        <h4 className="font-semibold text-secondary mb-3 text-sm">Notas de Corte Estimadas (PE) — Bolsa Integral:</h4>
                        <div className="table-wrapper">
                            <table className="cut-score-table">
                                <thead>
                                    <tr>
                                        <th>Curso</th>
                                        <th>Instituições (PE)</th>
                                        <th style={{ color: 'var(--success)' }}>Bolsa Integral (est.)</th>
                                        <th style={{ color: 'var(--info)' }}>Bolsa Parcial (est.)</th>
                                        <th>Você</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {PROUNI_DATA.map((row, i) => (
                                        <tr key={i}>
                                            <td className="font-semibold text-primary">{row.course}</td>
                                            <td className="text-muted text-xs">{row.institutions}</td>
                                            <td className={myScoreNum >= row.integral ? 'reached' : ''}>{row.integral}</td>
                                            <td className={myScoreNum >= row.parcial ? 'reached' : ''}>{row.parcial}</td>
                                            <td className="my-score">{myScoreNum > 0 ? myScoreNum : '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="alert alert-info mt-3">
                            <p>
                                Como estudante de escola pública, você é <strong>plenamente elegível</strong> para o ProUni!
                                Inscreva-se em <a href="https://prouni.mec.gov.br" target="_blank" rel="noreferrer">prouni.mec.gov.br</a>.
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* ── FIES ── */}
            <div className="program-card">
                <div className="program-card-header">
                    <div>
                        <div className="program-name">FIES — Financiamento Estudantil</div>
                        <div className="text-muted text-xs mt-1">
                            Financiamento parcial ou total da mensalidade de faculdades particulares
                        </div>
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={() => setShowFies(v => !v)}>
                        {showFies ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                </div>

                {showFies && (
                    <div className="grid grid-2" style={{ gap: '0.75rem' }}>
                        {[
                            { label: 'Pontuação mínima', value: '450 pts', sub: 'Média das 4 áreas objetivas (sem redacao)', color: 'accent' },
                            { label: 'Redação', value: 'Nota > 0', sub: 'Não pode ter zerado a redação', color: 'warning' },
                            { label: 'Renda', value: '≤ 3 SM/pessoa', sub: 'Renda familiar bruta mensal per capita', color: 'info' },
                            { label: 'Escola pública', value: '✅ Você', sub: 'Escolaridade em escola pública desde o 5º ano', color: 'success' },
                        ].map(item => (
                            <div className="stat-card" key={item.label}>
                                <div className="stat-label">{item.label}</div>
                                <div className="stat-value" style={{ fontSize: '1.125rem', color: `var(--${item.color === 'accent' ? 'accent-hover' : item.color})` }}>
                                    {item.value}
                                </div>
                                <div className="stat-sub">{item.sub}</div>
                            </div>
                        ))}
                        <div className="alert alert-warning" style={{ gridColumn: '1 / -1' }}>
                            <p>
                                O FIES pode ser combinado com o ProUni Parcial. Verifique as regras atualizadas em{' '}
                                <a href="https://fies.mec.gov.br" target="_blank" rel="noreferrer">fies.mec.gov.br</a>.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Personal Goals Cards ── */}
            <div className="card">
                <h2 className="section-title"><Target size={20} /> Cursos Alvo Pessoais</h2>

                <div className="grid grid-2">
                    {goals.map(goal => (
                        <div key={goal.id} className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 8, right: 8, opacity: 0.06 }}>
                                <GraduationCap size={80} />
                            </div>
                            <div className="badge badge-accent mb-2">{goal.area}</div>
                            <h3 className="font-extrabold text-primary" style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>
                                {goal.course}
                            </h3>
                            <div className="text-muted text-xs mb-3">{goal.univ}</div>
                            <div className="flex justify-between items-end mb-3 pb-3" style={{ borderBottom: '1px solid var(--border-light)' }}>
                                <div>
                                    <div className="text-xs text-muted">Corte aprox.</div>
                                    <div className="font-bold text-secondary">{goal.cut}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div className="text-xs font-bold" style={{ color: 'var(--accent-hover)' }}>META PESSOAL</div>
                                    <div className="font-extrabold" style={{ fontSize: '1.75rem', color: 'var(--accent-hover)', lineHeight: 1 }}>
                                        {goal.target}
                                    </div>
                                </div>
                            </div>
                            <div className="input-group" style={{ margin: 0 }}>
                                <label>Estratégia</label>
                                <textarea
                                    value={notes[goal.id] || ''}
                                    onChange={e => setNotes({ ...notes, [goal.id]: e.target.value })}
                                    rows={2}
                                    placeholder="Focar em matemática, revisão semanal..."
                                />
                            </div>
                        </div>
                    ))}

                    {/* Motivation card */}
                    <div className="stat-card" style={{
                        background: 'linear-gradient(135deg, #1a1040, #0f1829)',
                        borderColor: 'rgba(99,102,241,0.25)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        gap: '0.75rem',
                    }}>
                        <TrendingUp size={40} style={{ color: '#a78bfa' }} />
                        <div className="font-extrabold text-primary text-lg">Constância &gt; Intensidade</div>
                        <p className="text-secondary text-sm">
                            "O sucesso é a soma de pequenos esforços repetidos dia após dia."
                        </p>
                        <div style={{
                            border: '1px solid rgba(99,102,241,0.3)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.75rem 1rem',
                            background: 'rgba(99,102,241,0.08)',
                        }}>
                            <div className="text-xs font-semibold text-muted mb-1">ENEM 2026 (Estimado)</div>
                            <div className="font-extrabold text-primary" style={{ fontSize: '1.25rem' }}>~ 01/11/2026</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
