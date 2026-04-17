import React, { useState } from 'react';
import { ClipboardList, Calendar, BookOpen, Award, CheckSquare, Plus, Trash2, Check, RotateCcw, MapPin, Edit2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const TABS = [
    { id: 'events',  label: 'Provas & Eventos',    icon: Calendar },
    { id: 'topics',  label: 'Assuntos p/ Estudar', icon: BookOpen },
    { id: 'certs',   label: 'Certificados',         icon: Award },
    { id: 'todo',    label: 'Checklist Geral',       icon: CheckSquare },
];

const EVENT_TYPES = [
    { value: 'somatório',    label: 'Somatório',    color: 'accent' },
    { value: 'simulado',     label: 'Simulado',     color: 'info' },
    { value: 'prova',        label: 'Prova',        color: 'warning' },
    { value: 'compromisso',  label: 'Compromisso',  color: 'success' },
    { value: 'outro',        label: 'Outro',        color: 'muted' },
];

const PRIORITIES = ['Alta', 'Média', 'Baixa'];

const formatDate = (d) => {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    return `${day}/${m}`;
};

const daysDiff = (dateStr) => {
    if (!dateStr) return null;
    const diff = new Date(dateStr + 'T00:00:00') - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// ─── Events Tab ────────────────────────────────────────────────────────────
const EventsTab = () => {
    const [events, setEvents] = useLocalStorage('agenda_events', []);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', type: 'somatório', category: '', date: '', notes: '' });
    const [editingId, setEditingId] = useState(null);

    const handleFormClose = () => {
        setShowForm(false);
        setEditingId(null);
        setForm({ name: '', type: 'somatório', category: '', date: '', notes: '' });
    };

    const addEvent = () => {
        if (!form.name.trim()) return;
        if (editingId) {
            setEvents(events.map(e => e.id === editingId ? { ...form, id: e.id, done: e.done } : e).sort((a, b) => (a.date || '9') > (b.date || '9') ? 1 : -1));
        } else {
            const newEv = { ...form, id: Date.now(), done: false };
            setEvents([...events, newEv].sort((a, b) => (a.date || '9') > (b.date || '9') ? 1 : -1));
        }
        handleFormClose();
    };

    const editEvent = (ev) => {
        setForm({ name: ev.name, type: ev.type || 'somatório', category: ev.category || '', date: ev.date || '', notes: ev.notes || '' });
        setEditingId(ev.id);
        setShowForm(true);
    };

    const toggleDone = (id) =>
        setEvents(events.map(e => e.id === id ? { ...e, done: !e.done } : e));

    const removeEvent = (id) =>
        setEvents(events.filter(e => e.id !== id));

    const typeColor = (type) =>
        EVENT_TYPES.find(t => t.value === type)?.color || 'muted';

    const upcoming = events.filter(e => !e.done);
    const done     = events.filter(e => e.done);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-primary">Próximos Eventos</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setShowForm(v => !v)}>
                    <Plus size={14} /> Adicionar
                </button>
            </div>

            {showForm && (
                <div className="add-form">
                    <div className="add-form-grid">
                        <div className="input-group" style={{ margin: 0 }}>
                            <label>Nome *</label>
                            <input type="text" placeholder="Ex: 1º Somatório de Matemática"
                                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div className="input-group" style={{ margin: 0 }}>
                            <label>Tipo</label>
                            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>
                        <div className="input-group" style={{ margin: 0 }}>
                            <label>Categoria</label>
                            <input type="text" placeholder="Ex: Matemática"
                                value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                        </div>
                        <div className="input-group" style={{ margin: 0 }}>
                            <label>Data</label>
                            <input type="date" value={form.date}
                                onChange={e => setForm({ ...form, date: e.target.value })} />
                        </div>
                    </div>
                    <div className="input-group" style={{ margin: 0, marginBottom: '0.75rem' }}>
                        <label>Observações</label>
                        <textarea rows={2} placeholder="Conteúdo, local, observações..."
                            value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                    </div>
                    <div className="flex gap-2">
                        <button className="btn btn-primary btn-sm" onClick={addEvent}>
                            {editingId ? 'Atualizar Evento' : 'Salvar Evento'}
                        </button>
                        <button className="btn btn-outline btn-sm" onClick={handleFormClose}>Cancelar</button>
                    </div>
                </div>
            )}

            {upcoming.length === 0 && !showForm && (
                <div className="alert alert-info">
                    <p>Nenhum evento próximo. Adicione somatórios, provas e compromissos!</p>
                </div>
            )}

            {upcoming.map(ev => {
                const diff = daysDiff(ev.date);
                const urgency = diff !== null && diff <= 3 ? 'danger' : diff !== null && diff <= 7 ? 'warning' : 'info';
                return (
                    <div key={ev.id} className="event-item">
                        <button onClick={() => toggleDone(ev.id)}
                            className={`btn btn-sm badge badge-${urgency}`}
                            style={{ padding: '0.35rem 0.5rem', minWidth: 48, textAlign: 'center', fontSize: '0.7rem' }}>
                            {ev.date ? formatDate(ev.date) : '?'}
                        </button>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="event-name">{ev.name}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                                <span className={`badge badge-${typeColor(ev.type)}`}>{ev.type}</span>
                                {ev.category && (
                                    <span className="badge badge-accent shadow flex items-center gap-1">
                                        <MapPin size={10} /> {ev.category}
                                    </span>
                                )}
                                {diff !== null && (
                                    <span className={`badge badge-${urgency}`}>
                                        {diff === 0 ? 'Hoje!' : diff < 0 ? 'Passou' : `em ${diff}d`}
                                    </span>
                                )}
                            </div>
                            {ev.notes && <div className="event-meta mt-1">{ev.notes}</div>}
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                            <button className="btn btn-ghost btn-sm" onClick={() => editEvent(ev)}>
                                <Edit2 size={14} />
                            </button>
                            <button className="btn btn-ghost btn-sm" onClick={() => removeEvent(ev.id)}>
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                );
            })}

            {done.length > 0 && (
                <div className="mt-4">
                    <div className="text-muted text-xs font-semibold uppercase tracking-wide mb-2">
                        Concluídos ({done.length})
                    </div>
                    {done.map(ev => (
                        <div key={ev.id} className="event-item done">
                            <span className="event-date text-muted">{formatDate(ev.date)}</span>
                            <div style={{ flex: 1 }}>
                                <div className="event-name">{ev.name}</div>
                            </div>
                            <button className="btn btn-ghost btn-sm" onClick={() => toggleDone(ev.id)}>
                                <RotateCcw size={14} />
                            </button>
                            <button className="btn btn-ghost btn-sm" onClick={() => removeEvent(ev.id)}>
                                <Trash2 size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Topics Tab ────────────────────────────────────────────────────────────
const TopicsTab = () => {
    const [topics, setTopics] = useLocalStorage('agenda_topics', []);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', subject: '', priority: 'Alta' });
    const [editingId, setEditingId] = useState(null);

    const handleFormClose = () => {
        setShowForm(false);
        setEditingId(null);
        setForm({ name: '', subject: '', priority: 'Alta' });
    };

    const addTopic = () => {
        if (!form.name.trim()) return;
        if (editingId) {
            setTopics(topics.map(t => t.id === editingId ? { ...t, ...form } : t));
        } else {
            setTopics([...topics, { ...form, id: Date.now(), done: false }]);
        }
        handleFormClose();
    };

    const editTopic = (t) => {
        setForm({ name: t.name, subject: t.subject || '', priority: t.priority || 'Alta' });
        setEditingId(t.id);
        setShowForm(true);
    };

    const toggle = (id) => setTopics(topics.map(t => t.id === id ? { ...t, done: !t.done } : t));
    const remove = (id) => setTopics(topics.filter(t => t.id !== id));

    const priColor = { Alta: 'danger', Média: 'warning', Baixa: 'info' };

    const pending = topics.filter(t => !t.done);
    const studied = topics.filter(t => t.done);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-primary">Assuntos Importantes para Estudar</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setShowForm(v => !v)}>
                    <Plus size={14} /> Adicionar
                </button>
            </div>

            {showForm && (
                <div className="add-form">
                    <div className="add-form-grid">
                        <div className="input-group" style={{ margin: 0 }}>
                            <label>Assunto *</label>
                            <input type="text" placeholder="Ex: Funções do 2º grau"
                                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                onKeyDown={e => e.key === 'Enter' && addTopic()} />
                        </div>
                        <div className="input-group" style={{ margin: 0 }}>
                            <label>Disciplina</label>
                            <input type="text" placeholder="Ex: Matemática"
                                value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                        </div>
                        <div className="input-group" style={{ margin: 0 }}>
                            <label>Prioridade</label>
                            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-1">
                        <button className="btn btn-primary btn-sm" onClick={addTopic}>{editingId ? 'Atualizar' : 'Salvar'}</button>
                        <button className="btn btn-outline btn-sm" onClick={handleFormClose}>Cancelar</button>
                    </div>
                </div>
            )}

            {pending.length === 0 && (
                <div className="alert alert-success"><p>Tudo estudado! Continue assim</p></div>
            )}

            {pending.map(t => (
                <div key={t.id} className="todo-item">
                    <input type="checkbox" checked={false} onChange={() => toggle(t.id)} style={{ width: 'auto' }} />
                    <div style={{ flex: 1 }}>
                        <div className="todo-text">{t.name}</div>
                        <div className="flex gap-1 mt-1">
                            {t.subject && <span className="badge badge-muted">{t.subject}</span>}
                            <span className={`badge badge-${priColor[t.priority]}`}>{t.priority}</span>
                        </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                        <button className="btn btn-ghost btn-sm" onClick={() => editTopic(t)}><Edit2 size={12} /></button>
                        <button className="btn btn-ghost btn-sm" onClick={() => remove(t.id)}><Trash2 size={12} /></button>
                    </div>
                </div>
            ))}

            {studied.length > 0 && (
                <div className="mt-4">
                    <div className="text-muted text-xs font-semibold uppercase tracking-wide mb-2">
                        Estudados ({studied.length})
                    </div>
                    {studied.map(t => (
                        <div key={t.id} className="todo-item done">
                            <input type="checkbox" checked onChange={() => toggle(t.id)} style={{ width: 'auto' }} />
                            <span className="todo-text">{t.name}</span>
                            <button className="btn btn-ghost btn-sm" onClick={() => remove(t.id)}><Trash2 size={12} /></button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Certificates Tab ──────────────────────────────────────────────────────
const CertsTab = () => {
    const [certs, setCerts] = useLocalStorage('agenda_certs', []);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', institution: '', date: '', area: '' });
    const [editingId, setEditingId] = useState(null);

    const AREAS = ['Tecnologia', 'Programação', 'IA / Dados', 'Inglês', 'Saúde', 'Redação', 'Marketing', 'Outro'];

    React.useEffect(() => {
        const injected = localStorage.getItem('certs_bradesco_injected');
        if (!injected) {
            const bradescoCerts = [
                { id: Date.now() + 1, name: 'Word - Básico', institution: 'Bradesco', date: '', area: 'Tecnologia' },
                { id: Date.now() + 2, name: 'Word - Intermediário', institution: 'Bradesco', date: '', area: 'Tecnologia' },
                { id: Date.now() + 3, name: 'Word - Avançado', institution: 'Bradesco', date: '', area: 'Tecnologia' },
                { id: Date.now() + 4, name: 'Excel - Básico', institution: 'Bradesco', date: '', area: 'Tecnologia' },
                { id: Date.now() + 5, name: 'Excel - Intermediário', institution: 'Bradesco', date: '', area: 'Tecnologia' },
                { id: Date.now() + 6, name: 'Excel - Avançado', institution: 'Bradesco', date: '', area: 'Tecnologia' },
                { id: Date.now() + 7, name: 'PowerPoint - Básico', institution: 'Bradesco', date: '', area: 'Tecnologia' },
                { id: Date.now() + 8, name: 'PowerPoint - Avançado', institution: 'Bradesco', date: '', area: 'Tecnologia' }
            ];
            // If certs is loaded and doesn't have these, inject them
            setTimeout(() => {
                setCerts(prev => {
                    const exists = prev.find(c => c.institution === 'Bradesco');
                    if (exists) return prev;
                    return [...prev, ...bradescoCerts];
                });
                localStorage.setItem('certs_bradesco_injected', 'true');
            }, 1500);
        }
    }, []);

    const handleFormClose = () => {
        setShowForm(false);
        setEditingId(null);
        setForm({ name: '', institution: '', date: '', area: '' });
    };

    const addCert = () => {
        if (!form.name.trim()) return;
        if (editingId) {
            setCerts(certs.map(c => c.id === editingId ? { ...c, ...form } : c));
        } else {
            setCerts([...certs, { ...form, id: Date.now() }]);
        }
        handleFormClose();
    };

    const editCert = (c) => {
        setForm({ name: c.name, institution: c.institution || '', date: c.date || '', area: c.area || '' });
        setEditingId(c.id);
        setShowForm(true);
    };

    const remove = (id) => setCerts(certs.filter(c => c.id !== id));

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-bold text-primary">Meus Certificados</h3>
                    {certs.length > 0 && (
                        <p className="text-muted text-xs mt-1">{certs.length} certificado{certs.length !== 1 ? 's' : ''} registrado{certs.length !== 1 ? 's' : ''}</p>
                    )}
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setShowForm(v => !v)}>
                    <Plus size={14} /> Adicionar
                </button>
            </div>

            {showForm && (
                <div className="add-form">
                    <div className="add-form-grid">
                        <div className="input-group" style={{ margin: 0 }}>
                            <label>Nome do Certificado *</label>
                            <input type="text" placeholder="Ex: Python para Iniciantes"
                                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div className="input-group" style={{ margin: 0 }}>
                            <label>Instituição</label>
                            <input type="text" placeholder="Ex: Bradesco, Google, FIAP..."
                                value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} />
                        </div>
                        <div className="input-group" style={{ margin: 0 }}>
                            <label>Área</label>
                            <select value={form.area} onChange={e => setForm({ ...form, area: e.target.value })}>
                                <option value="">Selecionar...</option>
                                {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                        <div className="input-group" style={{ margin: 0 }}>
                            <label>Data de Conclusão</label>
                            <input type="date" value={form.date}
                                onChange={e => setForm({ ...form, date: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-1">
                        <button className="btn btn-primary btn-sm" onClick={addCert}>{editingId ? 'Atualizar' : 'Salvar'}</button>
                        <button className="btn btn-outline btn-sm" onClick={handleFormClose}>Cancelar</button>
                    </div>
                </div>
            )}

            {certs.length === 0 && !showForm && (
                <div className="alert alert-info">
                    <p>Nenhum certificado ainda. Adicione os que você já conquistou!</p>
                </div>
            )}

            <div className="grid grid-2" style={{ gap: '0.75rem' }}>
                {certs.map(c => (
                    <div key={c.id} className="cert-item">
                        <div className="cert-icon"><Award size={20} className="text-accent"/></div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="font-bold text-primary" style={{ fontSize: '0.875rem' }}>{c.name}</div>
                            {c.institution && <div className="text-muted text-xs">{c.institution}</div>}
                            <div className="flex gap-1 mt-1 flex-wrap">
                                {c.area && <span className="badge badge-success">{c.area}</span>}
                                {c.date && <span className="badge badge-muted">{new Date(c.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>}
                            </div>
                        </div>
                        <div className="flex flex-col justify-center gap-1 flex-shrink-0">
                            <button className="btn btn-ghost btn-sm" onClick={() => editCert(c)}>
                                <Edit2 size={12} />
                            </button>
                            <button className="btn btn-ghost btn-sm" onClick={() => remove(c.id)}>
                                <Trash2 size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Todo Tab ──────────────────────────────────────────────────────────────
const TodoTab = () => {
    const [items, setItems] = useLocalStorage('agenda_todo', []);
    const [input, setInput] = useState('');
    const [category, setCategory] = useState('Escola');
    const [editingId, setEditingId] = useState(null);

    const TODO_CATEGORIES = ['Escola', 'Curso', 'Pessoal', 'Simulado', 'Prova', 'Outro'];

    const add = () => {
        const t = input.trim();
        if (!t) return;
        if (editingId) {
            setItems(items.map(i => i.id === editingId ? { ...i, text: t, category } : i));
            setEditingId(null);
        } else {
            setItems([...items, { id: Date.now(), text: t, category, done: false }]);
        }
        setInput('');
    };

    const editTodo = (item) => {
        setInput(item.text);
        setCategory(item.category || 'Escola');
        setEditingId(item.id);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setInput('');
    };

    const toggle = (id) => setItems(items.map(i => i.id === id ? { ...i, done: !i.done } : i));
    const remove = (id) => setItems(items.filter(i => i.id !== id));
    const clearDone = () => setItems(items.filter(i => !i.done));

    const pending = items.filter(i => !i.done);
    const done    = items.filter(i => i.done);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-primary">Checklist Geral</h3>
                {done.length > 0 && (
                    <button className="btn btn-outline btn-sm" onClick={clearDone}>
                        Limpar concluídos ({done.length})
                    </button>
                )}
            </div>

            {/* Add input */}
            <div className="flex gap-2 mb-4 flex-wrap">
                <input
                    type="text"
                    placeholder="Adicionar tarefa e pressionar Enter..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && add()}
                    style={{ margin: 0, flex: '1 1 200px' }}
                />
                <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                    style={{ margin: 0, padding: '0.4rem 0.8rem', width: 'auto', flex: '0 0 auto', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                >
                    {TODO_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button className="btn btn-primary" onClick={add}>
                    {editingId ? <Check size={16} /> : <Plus size={16} />}
                </button>
                {editingId && (
                    <button className="btn btn-outline" onClick={cancelEdit}>Cancelar</button>
                )}
            </div>

            {pending.length === 0 && done.length === 0 && (
                <div className="alert alert-info"><p>Lista vazia. Adicione suas tarefas!</p></div>
            )}

            {pending.map(item => (
                <div key={item.id} className="todo-item" style={{ alignItems: 'flex-start' }}>
                    <input type="checkbox" checked={false} onChange={() => toggle(item.id)} style={{ width: 'auto', flexShrink: 0, marginTop: '4px' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="todo-text">{item.text}</span>
                        {item.category && <span className="badge badge-muted" style={{ alignSelf: 'flex-start', fontSize: '0.65rem' }}>{item.category}</span>}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                        <button className="btn btn-ghost btn-sm" onClick={() => editTodo(item)}><Edit2 size={12} /></button>
                        <button className="btn btn-ghost btn-sm" onClick={() => remove(item.id)}><Trash2 size={12} /></button>
                    </div>
                </div>
            ))}

            {done.length > 0 && (
                <div className="mt-4">
                    <div className="text-muted text-xs font-semibold uppercase tracking-wide mb-2">Concluídos</div>
                    {done.map(item => (
                        <div key={item.id} className="todo-item done" style={{ alignItems: 'flex-start' }}>
                            <input type="checkbox" checked onChange={() => toggle(item.id)} style={{ width: 'auto', flexShrink: 0, marginTop: '4px' }} />
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span className="todo-text">{item.text}</span>
                                {item.category && <span className="badge badge-muted" style={{ alignSelf: 'flex-start', fontSize: '0.65rem' }}>{item.category}</span>}
                            </div>
                            <button className="btn btn-ghost btn-sm" onClick={() => remove(item.id)}><Trash2 size={12} /></button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Main Agenda Component ─────────────────────────────────────────────────
export const Agenda = () => {
    const [activeTab, setActiveTab] = useState('events');

    return (
        <div className="animate-fade">
            <h1 className="page-title">Agenda</h1>
            <p className="page-subtitle">Provas, assuntos importantes, certificados e lista de tarefas</p>

            <div className="card">
                {/* Tab bar */}
                <div className="agenda-tabs">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            className={`agenda-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div className="animate-fade">
                    {activeTab === 'events'  && <EventsTab />}
                    {activeTab === 'topics'  && <TopicsTab />}
                    {activeTab === 'certs'   && <CertsTab />}
                    {activeTab === 'todo'    && <TodoTab />}
                </div>
            </div>
        </div>
    );
};
