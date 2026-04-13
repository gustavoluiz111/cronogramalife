import React, { useState } from 'react';
import { Calendar as CalendarIcon, AlertCircle } from 'lucide-react';

const HOLIDAYS_2026 = [
    { date: '2026-01-01', name: 'Confraternização Universal', type: 'nacional' },
    { date: '2026-02-16', name: 'Segunda de Carnaval', type: 'facultativo' },
    { date: '2026-02-17', name: 'Terça de Carnaval', type: 'facultativo' },
    { date: '2026-02-18', name: 'Quarta de Cinzas', type: 'facultativo' },
    { date: '2026-03-06', name: 'Data Magna de Pernambuco', type: 'estadual' },
    { date: '2026-04-03', name: 'Sexta-feira da Paixão', type: 'nacional' },
    { date: '2026-04-21', name: 'Tiradentes', type: 'nacional' },
    { date: '2026-05-01', name: 'Dia do Trabalhador', type: 'nacional' },
    { date: '2026-06-04', name: 'Corpus Christi', type: 'facultativo' },
    { date: '2026-06-24', name: 'São João', type: 'estadual' },
    { date: '2026-09-07', name: 'Independência do Brasil', type: 'nacional' },
    { date: '2026-10-12', name: 'N. Sra. Aparecida', type: 'nacional' },
    { date: '2026-11-02', name: 'Finados', type: 'nacional' },
    { date: '2026-11-01', name: 'ENEM 2026 (Est.)', type: 'enem' },
    { date: '2026-11-15', name: 'Proclamação da República', type: 'nacional' },
    { date: '2026-12-25', name: 'Natal', type: 'nacional' },
];

const NO_CLASS_DAYS = HOLIDAYS_2026.map(h => h.date);

export const CalendarView = () => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear,  setCurrentYear]  = useState(today.getFullYear());

    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ];

    const dateStr = (day) =>
        `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const isToday = (day) => {
        return (
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        );
    };

    const getHoliday = (day) => HOLIDAYS_2026.find(h => h.date === dateStr(day));

    const isWeekend = (day) => {
        const dow = new Date(currentYear, currentMonth, day).getDay();
        return dow === 0 || dow === 6;
    };

    const hasSchool = (day) => {
        const dow = new Date(currentYear, currentMonth, day).getDay();
        return dow >= 1 && dow <= 5 && !NO_CLASS_DAYS.includes(dateStr(day));
    };

    const hasAlgoritmo = (day) => {
        const dow = new Date(currentYear, currentMonth, day).getDay();
        return dow === 6 && !NO_CLASS_DAYS.includes(dateStr(day));
    };

    const renderCalendar = () => {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDay    = new Date(currentYear, currentMonth, 1).getDay();
        const cells = [];

        for (let i = 0; i < firstDay; i++) cells.push(<div key={`e${i}`} className="calendar-day empty" />);

        for (let day = 1; day <= daysInMonth; day++) {
            const holiday   = getHoliday(day);
            const weekend   = isWeekend(day);
            const school    = hasSchool(day);
            const algoritmo = hasAlgoritmo(day);
            const todayDay  = isToday(day);
            const isEnem    = holiday?.type === 'enem';

            cells.push(
                <div
                    key={day}
                    className={[
                        'calendar-day',
                        todayDay  ? 'today'   : '',
                        isEnem    ? 'holiday' : '',
                        holiday && !isEnem ? 'holiday' : '',
                        weekend && !holiday ? 'weekend' : '',
                    ].join(' ')}
                    title={holiday?.name || ''}
                >
                    <div className="day-number">{day}</div>
                    <div className="day-indicators">
                        {school    && <span className="indicator" title="Escola">🏫</span>}
                        {algoritmo && <span className="indicator" title="Algoritmo">💻</span>}
                        {holiday   && !isEnem && <span className="indicator">🎉</span>}
                        {isEnem    && <span className="indicator" title="ENEM 2026">🎯</span>}
                    </div>
                    {holiday && <div className="holiday-name">{holiday.name}</div>}
                </div>
            );
        }
        return cells;
    };

    const nextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
        else setCurrentMonth(m => m + 1);
    };
    const prevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
        else setCurrentMonth(m => m - 1);
    };
    const goToToday = () => {
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
    };

    const monthHolidays = HOLIDAYS_2026.filter(h => parseInt(h.date.split('-')[1]) - 1 === currentMonth);

    return (
        <div className="animate-fade">
            <h1 className="page-title">Calendário 2026</h1>
            <p className="page-subtitle">Calendário acadêmico com feriados de Pernambuco e datas do ENEM</p>

            <div className="card">
                {/* Controls */}
                <div className="flex justify-between items-center mb-4">
                    <button className="btn btn-outline btn-sm" onClick={prevMonth}>← Anterior</button>
                    <div className="text-center">
                        <h3 className="font-bold text-primary">{monthNames[currentMonth]} {currentYear}</h3>
                        <button className="text-accent text-xs font-semibold" onClick={goToToday}>
                            Ir para hoje
                        </button>
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={nextMonth}>Próximo →</button>
                </div>

                {/* Legend */}
                <div className="flex gap-3 mb-4 flex-wrap text-xs text-secondary">
                    {[
                        { color: 'var(--accent-subtle)', border: 'var(--accent)', label: 'Hoje' },
                        { color: 'rgba(255,255,255,0.02)', border: 'var(--border-light)', label: 'Fim de semana' },
                        { color: 'var(--danger-bg)', border: 'var(--danger-border)', label: 'Feriado' },
                    ].map(item => (
                        <div key={item.label} className="flex items-center gap-1">
                            <span style={{ width: 14, height: 14, background: item.color, border: `1px solid ${item.border}`, borderRadius: 3, display: 'inline-block' }} />
                            <span>{item.label}</span>
                        </div>
                    ))}
                    <span>🏫 Aula &nbsp; 💻 Algoritmo &nbsp; 🎯 ENEM</span>
                </div>

                {/* Calendar Grid */}
                <div className="calendar-grid">
                    {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => (
                        <div key={d} className="calendar-header-cell">{d}</div>
                    ))}
                    {renderCalendar()}
                </div>

                {/* Holidays list */}
                {monthHolidays.length > 0 && (
                    <div className="alert alert-info mt-4">
                        <div className="flex items-center gap-2 font-bold mb-2">
                            <AlertCircle size={16} /> Datas em {monthNames[currentMonth]}
                        </div>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                            {monthHolidays.map((h, i) => (
                                <li key={i} className="flex justify-between text-sm">
                                    <span>{h.type === 'enem' ? '🎯' : '🎉'} {h.name}</span>
                                    <span className="text-muted">{new Date(h.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
