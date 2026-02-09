import React, { useState } from 'react';
import { Calendar as CalendarIcon, AlertCircle, GraduationCap } from 'lucide-react';

// Feriados de Pernambuco 2026
const HOLIDAYS_2026 = [
    { date: '2026-01-01', name: 'Confraternização Universal', type: 'nacional' },
    { date: '2026-02-16', name: 'Segunda-feira de Carnaval', type: 'facultativo' },
    { date: '2026-02-17', name: 'Terça-feira de Carnaval', type: 'facultativo' },
    { date: '2026-02-18', name: 'Quarta-feira de Cinzas', type: 'facultativo' },
    { date: '2026-03-06', name: 'Data Magna de Pernambuco', type: 'estadual' },
    { date: '2026-04-03', name: 'Sexta-feira da Paixão', type: 'nacional' },
    { date: '2026-04-21', name: 'Tiradentes', type: 'nacional' },
    { date: '2026-05-01', name: 'Dia do Trabalhador', type: 'nacional' },
    { date: '2026-06-04', name: 'Corpus Christi', type: 'facultativo' },
    { date: '2026-06-24', name: 'São João', type: 'estadual' },
    { date: '2026-09-07', name: 'Independência do Brasil', type: 'nacional' },
    { date: '2026-10-12', name: 'Nossa Senhora Aparecida', type: 'nacional' },
    { date: '2026-11-02', name: 'Finados', type: 'nacional' },
    { date: '2026-11-15', name: 'Proclamação da República', type: 'nacional' },
    { date: '2026-12-25', name: 'Natal', type: 'nacional' },
];

// Dias sem aula (Curso Algoritmo aos sábados não ocorre em feriados)
const NO_CLASS_DAYS = [
    ...HOLIDAYS_2026.map(h => h.date),
    // Adicionar outros dias específicos se necessário
];

export const CalendarView = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
    };

    const isHoliday = (day) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return HOLIDAYS_2026.find(h => h.date === dateStr);
    };

    const isWeekend = (day) => {
        const date = new Date(currentYear, currentMonth, day);
        return date.getDay() === 0 || date.getDay() === 6;
    };

    const hasSchool = (day) => {
        const date = new Date(currentYear, currentMonth, day);
        const dayOfWeek = date.getDay();
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // Escola: Segunda a Sexta (não feriado)
        return dayOfWeek >= 1 && dayOfWeek <= 5 && !NO_CLASS_DAYS.includes(dateStr);
    };

    const hasAlgoritmo = (day) => {
        const date = new Date(currentYear, currentMonth, day);
        const dayOfWeek = date.getDay();
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        // Algoritmo: Sábado (não feriado)
        return dayOfWeek === 6 && !NO_CLASS_DAYS.includes(dateStr);
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        const days = [];

        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const holiday = isHoliday(day);
            const weekend = isWeekend(day);
            const school = hasSchool(day);
            const algoritmo = hasAlgoritmo(day);

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${holiday ? 'holiday' : ''} ${weekend && !holiday ? 'weekend' : ''}`}
                    title={holiday ? holiday.name : ''}
                >
                    <div className="day-number">{day}</div>
                    <div className="day-indicators">
                        {school && <span className="indicator school" title="Aula na escola">🏫</span>}
                        {algoritmo && <span className="indicator algoritmo" title="Curso Algoritmo">💻</span>}
                        {holiday && <span className="indicator holiday-icon" title={holiday.name}>🎉</span>}
                    </div>
                    {holiday && <div className="holiday-name">{holiday.name}</div>}
                </div>
            );
        }

        return days;
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
    };

    return (
        <div className="card">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <CalendarIcon /> Calendário Acadêmico 2026
                </h2>
            </div>

            {/* Calendar Controls */}
            <div className="flex justify-between items-center mb-4">
                <button onClick={prevMonth} className="btn btn-outline">← Anterior</button>
                <div className="text-center">
                    <h3 className="text-xl font-bold">{monthNames[currentMonth]} {currentYear}</h3>
                    <button onClick={goToToday} className="text-sm text-blue-600 hover:underline">Ir para hoje</button>
                </div>
                <button onClick={nextMonth} className="btn btn-outline">Próximo →</button>
            </div>

            {/* Legend */}
            <div className="flex gap-4 mb-4 flex-wrap text-sm">
                <div className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></span>
                    <span>Dia de Aula (Escola)</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></span>
                    <span>Curso Algoritmo (Sáb)</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-4 h-4 bg-red-100 border border-red-300 rounded"></span>
                    <span>Feriado</span>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="calendar-grid">
                <div className="calendar-header">Dom</div>
                <div className="calendar-header">Seg</div>
                <div className="calendar-header">Ter</div>
                <div className="calendar-header">Qua</div>
                <div className="calendar-header">Qui</div>
                <div className="calendar-header">Sex</div>
                <div className="calendar-header">Sáb</div>
                {renderCalendar()}
            </div>

            {/* Holidays List for Current Month */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                    <AlertCircle size={18} /> Feriados em {monthNames[currentMonth]}
                </h4>
                {HOLIDAYS_2026.filter(h => {
                    const holidayMonth = parseInt(h.date.split('-')[1]) - 1;
                    return holidayMonth === currentMonth;
                }).length > 0 ? (
                    <ul className="text-sm space-y-1">
                        {HOLIDAYS_2026.filter(h => {
                            const holidayMonth = parseInt(h.date.split('-')[1]) - 1;
                            return holidayMonth === currentMonth;
                        }).map((holiday, idx) => (
                            <li key={idx} className="flex justify-between">
                                <span>{holiday.name}</span>
                                <span className="text-gray-500">{new Date(holiday.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-600">Nenhum feriado neste mês.</p>
                )}
            </div>
        </div>
    );
};
