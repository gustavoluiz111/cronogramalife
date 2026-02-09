import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, AlertCircle } from 'lucide-react';

const GOALS = [
    { course: 'Análise e Desenv. de Sistemas', area: 'Tecnologia', cut: 680, target: 720 },
    { course: 'Ciência da Computação', area: 'Tecnologia', cut: 740, target: 760 },
    { course: 'Direito', area: 'Humanas', cut: 730, target: 750 }
];

export const Goals = () => {
    const [notes, setNotes] = useState(() => {
        const saved = localStorage.getItem('goal_notes');
        return saved ? JSON.parse(saved) : GOALS.reduce((acc, g) => ({ ...acc, [g.course]: '' }), {});
    });

    useEffect(() => {
        localStorage.setItem('goal_notes', JSON.stringify(notes));
    }, [notes]);

    return (
        <div className="grid grid-2 bg-gray-50 p-4 rounded-xl">
            {GOALS.map((goal) => (
                <div key={goal.course} className="card relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20">
                        <Target size={100} />
                    </div>

                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-600 mb-1">
                        {goal.course}
                    </h3>
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4 block">
                        {goal.area}
                    </span>

                    <div className="flex justify-between items-end mb-4 border-b pb-4">
                        <div className="text-center">
                            <span className="text-xs text-gray-400 block">Corte Aprox.</span>
                            <span className="font-bold text-gray-600">{goal.cut}</span>
                        </div>
                        <div className="text-center">
                            <span className="text-xs text-blue-500 font-bold block">META PESSOAL</span>
                            <span className="text-2xl font-black text-blue-900">{goal.target}</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Estratégia / Obs:</label>
                        <textarea
                            value={notes[goal.course]}
                            onChange={(e) => setNotes({ ...notes, [goal.course]: e.target.value })}
                            className="w-full text-sm bg-gray-50 border-gray-200 focus:bg-white resize-none"
                            rows="3"
                            placeholder="Focar em matemática..."
                        />
                    </div>
                </div>
            ))}

            <div className="card bg-blue-900 text-white flex flex-col justify-center items-center text-center p-8">
                <TrendingUp size={48} className="mb-4 text-blue-300" />
                <h3 className="text-2xl font-bold mb-2">Constância &gt; Intensidade</h3>
                <p className="text-blue-200 text-sm">
                    "O sucesso é a soma de pequenos esforços repetidos dia após dia."
                </p>
                <div className="mt-6 border border-blue-700 rounded-lg p-4 w-full bg-blue-800 bg-opacity-50">
                    <p className="font-mono text-xs text-blue-300 mb-1">DATA DO ENEM 2026 (Estimada)</p>
                    <p className="text-xl font-bold">~ 01/11/2026</p>
                </div>
            </div>
        </div>
    );
};
