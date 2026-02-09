import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Calculator } from 'lucide-react';

const SUBJECTS = [
    'Biologia', 'Artes', 'Português', 'APF Matemática', 'Química',
    'Física', 'Geografia', 'Filosofia', 'Sociologia', 'Matemática',
    'Inglês', 'História', 'APF Humanas', 'APF Química'
];

const SCHOOL_SCHEDULE = {
    'Segunda': ['Biologia', 'Artes', 'Português', 'APF Mat/Ciên', 'Química', 'Física'],
    'Terça': ['Geografia', 'Filosofia', 'Sociologia', 'Matemática', 'Inglês', 'APF Matem.'],
    'Quarta': ['Química', 'Ed. Física', 'Matemática', 'APF Química', 'Biologia', '-'],
    'Quinta': ['Matemática', 'Inglês', 'APF Matem.', 'Português', 'Física', 'Português'],
    'Sexta': ['Português', 'APF Química', 'Geografia', 'História', 'Matemática', 'APF Mat/Hum']
};

export const School = () => {
    const [grades, setGrades] = useState(() => {
        const saved = localStorage.getItem('school_grades');
        return saved ? JSON.parse(saved) : SUBJECTS.reduce((acc, sub) => ({ ...acc, [sub]: [0, 0, 0] }), {});
    });

    useEffect(() => {
        localStorage.setItem('school_grades', JSON.stringify(grades));
    }, [grades]);

    const handleGradeChange = (subject, term, value) => {
        const newGrades = { ...grades };
        newGrades[subject][term] = parseFloat(value) || 0;
        setGrades(newGrades);
    };

    const calculateTotal = (subject) => {
        return grades[subject].reduce((a, b) => a + b, 0).toFixed(1);
    };

    const getStatus = (total) => {
        if (total >= 18) return { text: 'Aprovado (Folga)', class: 'tag-success' };
        if (total >= 12) return { text: 'No Caminho', class: 'tag-warning' };
        return { text: 'Atenção', class: 'tag-danger' };
    };

    return (
        <div className="grid grid-1 gap-4">
            <div className="card">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><BookOpen size={20} /> Horário Escolar</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                <th className="p-2 text-left">Hora</th>
                                {Object.keys(SCHOOL_SCHEDULE).map(day => <th key={day} className="p-2 text-left">{day}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {[0, 1, 2, 3, 4, 5].map((period) => (
                                <tr key={period} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td className="p-2 text-gray-500 font-mono text-sm">{period + 1}º Aula</td>
                                    {Object.keys(SCHOOL_SCHEDULE).map(day => (
                                        <td key={day} className="p-2">{SCHOOL_SCHEDULE[day][period] || '-'}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Calculator size={20} /> Notas & Médias (Meta: 18.0)</h2>
                <div className="grid grid-2 gap-4">
                    {SUBJECTS.map(subj => {
                        const total = calculateTotal(subj);
                        const status = getStatus(total);
                        return (
                            <div key={subj} className="p-4 border rounded-lg bg-gray-50 flex flex-col justify-between">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-lg">{subj}</h3>
                                    <span className={`tag ${status.class}`}>{status.text}</span>
                                </div>

                                <div className="grid grid-cols-3 gap-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                    {[0, 1, 2].map((term) => (
                                        <div key={term}>
                                            <label className="text-xs text-gray-500 block mb-1">{term + 1}º Trim</label>
                                            <input
                                                type="number"
                                                min="0" max="10" step="0.1"
                                                value={grades[subj][term] || ''}
                                                onChange={(e) => handleGradeChange(subj, term, e.target.value)}
                                                className="w-full text-center font-mono"
                                                placeholder="-"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-3 text-right">
                                    <span className="text-sm text-gray-500 mr-2">Total:</span>
                                    <span className={`font-bold text-xl ${total < 18 ? 'text-red-600' : 'text-green-600'}`}>{total}</span>
                                    <span className="text-xs text-gray-400 ml-1">/ 18.0</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
