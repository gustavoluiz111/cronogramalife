import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, RefreshCw, Save, Download, Image as ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

const SUBJECT_AREAS = {
    exatas: ['Matemática', 'Física', 'Química'],
    humanas: ['História', 'Geografia', 'Filosofia', 'Sociologia'],
    naturezas: ['Biologia'],
    linguagens: ['Português', 'Inglês', 'Literatura', 'Redação']
};

export const Planner = () => {
    const plannerRef = useRef(null);
    const [planner, setPlanner] = useState(() => {
        const saved = localStorage.getItem('study_planner');
        if (saved) return JSON.parse(saved);
        return DAYS.reduce((acc, day) => ({ ...acc, [day]: '' }), {});
    });
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        localStorage.setItem('study_planner', JSON.stringify(planner));
    }, [planner]);

    const handleCellChange = (day, value) => {
        setPlanner(prev => ({ ...prev, [day]: value }));
    };

    const generateRoutine = () => {
        if (!window.confirm("Isso substituirá o planejamento atual. Continuar?")) return;

        const newPlanner = {};

        // Base structure
        DAYS.forEach(day => {
            let tasks = [];

            // Weekdays (Mon-Fri)
            if (['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].includes(day)) {
                tasks.push("--- Tarde (15h - 18h) ---");

                // Logic based on day (Alternating areas)
                if (day === 'Segunda' || day === 'Quarta') {
                    tasks.push(`[Exatas] ${SUBJECT_AREAS.exatas[Math.floor(Math.random() * SUBJECT_AREAS.exatas.length)]}`);
                    tasks.push(`[Naturezas] Biologia`);
                } else if (day === 'Terça' || day === 'Quinta') {
                    tasks.push(`[Humanas] ${SUBJECT_AREAS.humanas[Math.floor(Math.random() * SUBJECT_AREAS.humanas.length)]}`);
                    tasks.push(`[Linguagens] Português`);
                } else {
                    // Sexta
                    tasks.push(`[Redação] Prática de Texto`);
                    tasks.push(`[Revisão] Conteúdos da Semana`);
                }

                tasks.push("--- Noite ---");
                if (day === 'Sexta') tasks.push("[Curso] Redação Vanilma (19h)");
                else tasks.push("[Revisão/Exercícios] 1h");
            } else if (day === 'Sábado') {
                tasks.push("[Curso] Algoritmo (08h - 16h)");
                tasks.push("[Descanso] Pós-curso");
            } else {
                // Domingo
                tasks.push("[Simulado] Prova Antiga ou Lista");
                tasks.push("[Descanso] Livre");
            }

            newPlanner[day] = tasks.join('\n');
        });

        setPlanner(newPlanner);
    };

    const exportAsImage = async () => {
        if (!plannerRef.current) return;

        setIsExporting(true);

        try {
            // Wait a bit for the export state to render
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(plannerRef.current, {
                backgroundColor: '#f5f5f7',
                scale: 2, // Higher quality
                logging: false,
                useCORS: true,
                allowTaint: true
            });

            // Convert to blob and download
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
                link.download = `planner-semanal-${date}.png`;
                link.href = url;
                link.click();
                URL.revokeObjectURL(url);
                setIsExporting(false);
            });
        } catch (error) {
            console.error('Erro ao exportar:', error);
            alert('Erro ao exportar imagem. Tente novamente.');
            setIsExporting(false);
        }
    };

    const getCurrentWeek = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const diff = now - start;
        const oneWeek = 1000 * 60 * 60 * 24 * 7;
        return Math.ceil(diff / oneWeek);
    };

    return (
        <div className="card">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <CalendarIcon /> Planejamento Semanal
                </h2>
                <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                    <button onClick={generateRoutine} className="btn btn-outline gap-2">
                        <RefreshCw size={18} /> Gerar Automático
                    </button>
                    <button onClick={exportAsImage} className="btn btn-primary gap-2" disabled={isExporting}>
                        <Download size={18} /> {isExporting ? 'Exportando...' : 'Exportar PNG'}
                    </button>
                </div>
            </div>

            {/* Exportable Area */}
            <div ref={plannerRef} style={{
                padding: isExporting ? '40px' : '0',
                backgroundColor: isExporting ? '#ffffff' : 'transparent'
            }}>
                {/* Header for export */}
                {isExporting && (
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '30px',
                        borderBottom: '3px solid #003366',
                        paddingBottom: '20px'
                    }}>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: 'bold',
                            color: '#003366',
                            marginBottom: '8px'
                        }}>
                            Planejamento Semanal
                        </h1>
                        <p style={{
                            fontSize: '16px',
                            color: '#666',
                            fontWeight: '500'
                        }}>
                            Semana {getCurrentWeek()} • {new Date().getFullYear()}
                        </p>
                    </div>
                )}

                <div className="grid grid-3 gap-4">
                    {DAYS.map((day, index) => (
                        <div
                            key={day}
                            className="flex flex-col rounded-lg p-3 border-2"
                            style={{
                                backgroundColor: isExporting ? '#f8f9fa' : '#f9fafb',
                                borderColor: isExporting ? '#003366' : '#e5e7eb',
                                minHeight: '200px'
                            }}
                        >
                            <h3
                                className="font-bold text-center mb-2 rounded py-2"
                                style={{
                                    backgroundColor: isExporting ? '#003366' : 'white',
                                    color: isExporting ? 'white' : '#1d1d1f',
                                    fontSize: isExporting ? '18px' : '16px',
                                    boxShadow: isExporting ? 'none' : '0 1px 3px rgba(0,0,0,0.1)'
                                }}
                            >
                                {day}
                            </h3>

                            {isExporting ? (
                                <div style={{
                                    whiteSpace: 'pre-wrap',
                                    fontSize: '13px',
                                    lineHeight: '1.6',
                                    color: '#1d1d1f',
                                    padding: '8px',
                                    fontFamily: 'system-ui, -apple-system, sans-serif'
                                }}>
                                    {planner[day] || 'Sem atividades planejadas'}
                                </div>
                            ) : (
                                <textarea
                                    className="flex-1 w-full min-h-[150px] p-2 text-sm font-sans resize-none focus:bg-white transition-colors bg-transparent border-0"
                                    value={planner[day]}
                                    onChange={(e) => handleCellChange(day, e.target.value)}
                                    placeholder="Adicionar metas..."
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer for export */}
                {isExporting && (
                    <div style={{
                        marginTop: '30px',
                        textAlign: 'center',
                        paddingTop: '20px',
                        borderTop: '2px solid #e5e7eb',
                        color: '#666',
                        fontSize: '12px'
                    }}>
                        <p style={{ fontWeight: '600', marginBottom: '4px' }}>
                            "Constância &gt; Intensidade"
                        </p>
                        <p>SystemLife • Organização Acadêmica</p>
                    </div>
                )}
            </div>

            {!isExporting && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                    <p><strong>Dica:</strong> Use o botão "Gerar Automático" para criar uma base de estudos balanceada entre Exatas e Humanas. Clique em "Exportar PNG" para salvar como imagem.</p>
                </div>
            )}
        </div>
    );
};
