import React, { useState, useEffect } from 'react';
import { BookOpen, Video, MapPin, Code } from 'lucide-react';

const FERRETO_WEEKS = [
    { week: 1, total: 53 }, { week: 2, total: 76 }, { week: 3, total: 72 },
    { week: 4, total: 66 }, { week: 5, total: 69 }, { week: 6, total: 62 },
    { week: 7, total: 76 }, { week: 8, total: 78 }, { week: 9, total: 77 },
    { week: 10, total: 73 }, { week: 11, total: 80 }, { week: 12, total: 68 },
    { week: 13, total: 75 }, { week: 14, total: 75 }, { week: 15, total: 70 },
    { week: 16, total: 75 }, { week: 17, total: 65 }, { week: 18, total: 58 },
    { week: 19, total: 70 }, { week: 20, total: 67 }, { week: 21, total: 77 },
    { week: 22, total: 88 }, { week: 23, total: 68 }, { week: 24, total: 83 },
    { week: 25, total: 80 }, { week: 26, total: 66 }, { week: 27, total: 71 },
    { week: 28, total: 70 }, { week: 29, total: 61 }, { week: 30, total: 76 },
    { week: 31, total: 39 }
];

const OTHER_COURSES = [
    { name: 'Fernanda Pessoa', desc: 'Complementar Teórico (ENEM)', icon: BookOpen, category: 'preparatorio' },
    { name: 'Redação - Vanilma Carla', desc: 'Sex 19h-20h30 (EAD + Prática)', icon: Video, category: 'preparatorio' },
    { name: 'Algoritmo', desc: 'Sáb 08h-16h (Presencial não-feriado)', icon: MapPin, category: 'preparatorio' },
];

const TECH_COURSES_RECOMMENDED = [
    {
        name: 'FGV - IA e Ciência de Dados',
        desc: '216 cursos gratuitos com certificado',
        url: 'https://educacao-executiva.fgv.br/cursos/online',
        icon: Code,
        value: '⭐ Gratuito + Certificado FGV'
    },
    {
        name: 'Lúmina UFRGS - Saúde Digital',
        desc: 'MOOCs em Ciências da Saúde e Tecnologia',
        url: 'https://lumina.ufrgs.br',
        icon: Code,
        value: '⭐ Gratuito + Certificado UFRGS'
    },
    {
        name: 'Fiocruz - IA na Saúde',
        desc: 'IA e futuro dos sistemas de saúde + Análise de dados SUS',
        url: 'https://www.ead.fiocruz.br',
        icon: Code,
        value: '⭐ Gratuito + Certificado Fiocruz'
    },
    {
        name: 'Educa e-SUS (UFMG)',
        desc: 'Saúde Digital - Recursos digitais no cuidado',
        url: 'https://www.ufmg.br/ead',
        icon: Code,
        value: '⭐ Gratuito + Certificado UFMG'
    },
    {
        name: 'Santander + Alura - IA',
        desc: 'Skills do Futuro, Análise de Dados e IA',
        url: 'https://app.santanderopenacademy.com',
        icon: Code,
        value: '⭐ Gratuito + Certificado'
    },
    {
        name: 'Portal Cate SP - TI e IA',
        desc: 'Introdução à TI e Fluência em IA',
        url: 'https://cate.prefeitura.sp.gov.br',
        icon: Code,
        value: '⭐ Gratuito + Certificado'
    },
    {
        name: 'Fundação Bradesco - Office',
        desc: 'Excel, Word, PowerPoint (Essencial)',
        url: 'https://www.ev.org.br',
        icon: Code,
        value: '⭐ Gratuito'
    },
    {
        name: 'Google Ateliê Digital',
        desc: 'Marketing Digital e Análise de Dados',
        url: 'https://learndigital.withgoogle.com/ateliedigital',
        icon: Code,
        value: '⭐ Gratuito + Certificado Google'
    },
    {
        name: 'IBM SkillsBuild',
        desc: 'Cloud, IA, Cibersegurança',
        url: 'https://skillsbuild.org',
        icon: Code,
        value: '⭐ Gratuito + Certificado IBM'
    },
    {
        name: 'FIAP - Python',
        desc: 'Programação Python para iniciantes',
        url: 'https://www.fiap.com.br',
        icon: Code,
        value: '💰 Pago (Bom custo-benefício)'
    },
    {
        name: 'Microsoft Learn',
        desc: 'Azure, Power BI, IA',
        url: 'https://learn.microsoft.com/pt-br',
        icon: Code,
        value: '⭐ Gratuito + Certificados Microsoft'
    },
];

export const Courses = () => {
    const [ferretoData, setFerretoData] = useState(() => {
        const saved = localStorage.getItem('ferreto_progress');
        const parsed = saved ? JSON.parse(saved) : [];

        // Merge logic: Use current structure, preserve 'current' from saved if matches week
        return FERRETO_WEEKS.map(w => {
            const found = parsed.find(p => p.week === w.week);
            return { ...w, current: found ? found.current : 0 };
        });
    });

    useEffect(() => {
        localStorage.setItem('ferreto_progress', JSON.stringify(ferretoData));
    }, [ferretoData]);

    const updateProgress = (index, value) => {
        const newData = [...ferretoData];
        let val = parseInt(value) || 0;
        if (val > newData[index].total) val = newData[index].total;
        if (val < 0) val = 0;
        newData[index].current = val;
        setFerretoData(newData);
    };

    const calculateTotalProgress = () => {
        const total = ferretoData.reduce((acc, item) => acc + item.total, 0);
        const completed = ferretoData.reduce((acc, item) => acc + item.current, 0);
        return Math.round((completed / total) * 100);
    };

    return (
        <div className="grid grid-1 gap-4">

            {/* Course Info Cards */}
            <div className="grid grid-2 gap-4">
                {OTHER_COURSES.map((course) => {
                    const Icon = course.icon;
                    return (
                        <div key={course.name} className="card flex items-start gap-4 hover:shadow-lg transition-shadow">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <Icon size={24} color="var(--accent-dark-blue)" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{course.name}</h3>
                                <p className="text-gray-600 text-sm">{course.desc}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Recommended Tech Courses */}
            <div className="card">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Code /> Cursos de Programação Recomendados (Saúde + Tech)
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                    Cursos gratuitos e com bom custo-benefício focados em tecnologia aplicada à saúde, IA, análise de dados e programação.
                </p>

                <div className="grid grid-2 gap-4">
                    {TECH_COURSES_RECOMMENDED.map((course) => {
                        const Icon = course.icon;
                        return (
                            <div key={course.name} className="card flex flex-col gap-3 hover:shadow-lg transition-all border-l-4 border-blue-900">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Icon size={20} color="var(--accent-dark-blue)" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-base">{course.name}</h3>
                                        <p className="text-gray-600 text-xs mt-1">{course.desc}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                    <span className="text-xs font-bold text-green-700">{course.value}</span>
                                    <a
                                        href={course.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:underline font-medium"
                                    >
                                        Acessar →
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg text-sm text-green-800">
                    <p><strong>💡 Dica:</strong> Priorize cursos com certificado de instituições reconhecidas (FGV, UFRGS, Fiocruz, UFMG). Foque em IA aplicada à saúde para se destacar no mercado!</p>
                </div>
            </div>

            {/* Ferreto Tracker */}
            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Video /> Progresso Ferreto
                    </h2>
                    <div className="text-right">
                        <span className="text-sm text-gray-500 block">Total Geral</span>
                        <span className="text-2xl font-bold text-blue-900">{calculateTotalProgress()}%</span>
                    </div>
                </div>

                <div className="grid grid-2 gap-x-8 gap-y-4">
                    {ferretoData.map((week, index) => (
                        <div key={week.week} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <span className="text-gray-500 font-mono w-24">Semana {week.week}</span>
                            <div className="flex-1">
                                <div className="progress-bar mb-1">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${(week.current / week.total) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>{week.current} concluídos</span>
                                    <span>Meta: {week.total}</span>
                                </div>
                            </div>
                            <input
                                type="number"
                                value={week.current === 0 ? '' : week.current}
                                onChange={(e) => updateProgress(index, e.target.value)}
                                className="w-20 text-center font-bold"
                                placeholder="0"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
