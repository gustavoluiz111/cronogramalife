import React, { useState } from 'react';
import { Heart, Moon, Zap } from 'lucide-react';

export const Health = () => {
    const [health, setHealth] = useState(() => {
        const saved = localStorage.getItem('health_tracker');
        return saved ? JSON.parse(saved) : { sleep: 8, workouts: { seg: false, qua: false, sex: false } };
    });

    const updateWorkout = (day) => {
        const newHealth = { ...health, workouts: { ...health.workouts, [day]: !health.workouts[day] } };
        setHealth(newHealth);
        localStorage.setItem('health_tracker', JSON.stringify(newHealth));
    };

    const updateSleep = (val) => {
        const newHealth = { ...health, sleep: val };
        setHealth(newHealth);
        localStorage.setItem('health_tracker', JSON.stringify(newHealth));
    };

    const getSleepStatus = () => {
        if (health.sleep >= 8) return { text: "Excelente! Mantenha o ritmo.", color: "text-green-600" };
        if (health.sleep >= 6) return { text: "Atenção! Dormir pouco prejudica a memória.", color: "text-yellow-600" };
        return { text: "CRÍTICO! Priorize o sono hoje.", color: "text-red-600" };
    };

    return (
        <div className="grid grid-2 gap-4">
            <div className="card">
                <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
                    <Moon /> Monitor de Sono
                </h2>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Horas dormidas na última noite</label>
                        <div className="flex items-center gap-4 mt-2">
                            <input
                                type="range"
                                min="0" max="12" step="0.5"
                                value={health.sleep}
                                onChange={(e) => updateSleep(parseFloat(e.target.value))}
                                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-2xl font-bold bg-blue-100 px-3 py-1 rounded">{health.sleep}h</span>
                        </div>
                    </div>
                    <div className={`p-4 rounded-lg bg-gray-50 border border-l-4 ${getSleepStatus().color.replace('text-', 'border-')}`}>
                        <p className={`font-bold ${getSleepStatus().color}`}>{getSleepStatus().text}</p>
                    </div>
                </div>
            </div>

            <div className="card">
                <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
                    <Zap /> Treinos (Semana)
                </h2>
                <p className="text-sm text-gray-500 mb-4">Meta: 3 treinos de constância</p>

                <div className="space-y-4">
                    {['seg', 'qua', 'sex'].map(day => (
                        <div key={day}
                            onClick={() => updateWorkout(day)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex justify-between items-center
                                ${health.workouts[day] ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-blue-300'}`}
                        >
                            <span className="font-bold capitalize">{day === 'seg' ? 'Segunda' : day === 'qua' ? 'Quarta' : 'Sexta'}</span>
                            {health.workouts[day] ? <Heart fill="currentColor" className="text-green-600" /> : <Heart className="text-gray-300" />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
