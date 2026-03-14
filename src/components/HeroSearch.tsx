import React, { useState } from 'react';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import Users from 'lucide-react/dist/esm/icons/users';
import Search from 'lucide-react/dist/esm/icons/search';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import { useStore } from '@nanostores/react';
import { language } from '../store';

export default function HeroSearch() {
    const $language = useStore(language);

    const [activity, setActivity] = useState('');
    const [date, setDate] = useState('');
    const [people, setPeople] = useState('');

    const translations = {
        en: {
            activity: 'Activity',
            activityPlaceholder: 'What do you want to do?',
            date: 'Date',
            people: 'People',
            peoplePlaceholder: 'Add guests',
            search: 'Search'
        },
        es: {
            activity: 'Actividad',
            activityPlaceholder: '¿Qué quieres hacer?',
            date: 'Fecha',
            people: 'Personas',
            peoplePlaceholder: 'Agregar huéspedes',
            search: 'Buscar'
        }
    };

    const t = translations[$language];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        // Build query string
        const params = new URLSearchParams();
        if (activity) params.append('q', activity);
        if (date) params.append('date', date);
        if (people) params.append('guests', people);

        // Redirect to tours page with query params
        window.location.href = `/tours?${params.toString()}`;
    };

    return (
        <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto">
            <div className="bg-dark-soft/80 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-black/20 p-2 md:p-3 flex flex-col md:flex-row items-center gap-1 md:gap-2 ring-1 ring-white/10">

                {/* Activity Input */}
                <div className="flex-1 w-full px-4 py-2 md:px-6 md:py-3 hover:bg-white/5 rounded-[1.5rem] md:rounded-[2rem] transition-colors cursor-pointer group">
                    <label htmlFor="hero-activity" className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5 md:mb-1 group-hover:text-primary transition-colors">{t.activity}</label>
                    <div className="flex items-center gap-2 md:gap-3 text-gray-400 group-hover:text-white">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary/70" />
                        <input
                            id="hero-activity"
                            type="text"
                            value={activity}
                            onChange={(e) => setActivity(e.target.value)}
                            placeholder={t.activityPlaceholder}
                            className="w-full bg-transparent border-none outline-none text-sm md:text-base placeholder-gray-500 font-medium text-white"
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-10 bg-white/10"></div>

                {/* Date Input */}
                <div className="flex-1 w-full px-4 py-2 md:px-6 md:py-3 hover:bg-white/5 rounded-[1.5rem] md:rounded-[2rem] transition-colors cursor-pointer group">
                    <label htmlFor="hero-date" className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5 md:mb-1 group-hover:text-primary transition-colors">{t.date}</label>
                    <div className="flex items-center gap-2 md:gap-3 text-gray-400 group-hover:text-white">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary/70" />
                        <input
                            id="hero-date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-sm md:text-base font-medium text-white [&::-webkit-calendar-picker-indicator]:hidden"
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-10 bg-white/10"></div>

                {/* People Input */}
                <div className="flex-1 w-full px-4 py-2 md:px-6 md:py-3 hover:bg-white/5 rounded-[1.5rem] md:rounded-[2rem] transition-colors cursor-pointer group">
                    <label htmlFor="hero-people" className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5 md:mb-1 group-hover:text-primary transition-colors">{t.people}</label>
                    <div className="flex items-center gap-2 md:gap-3 text-gray-400 group-hover:text-white">
                        <Users className="w-4 h-4 md:w-5 md:h-5 text-primary/70" />
                        <input
                            id="hero-people"
                            type="number"
                            min="1"
                            value={people}
                            onChange={(e) => setPeople(e.target.value)}
                            placeholder={t.peoplePlaceholder}
                            className="w-full bg-transparent border-none outline-none text-sm md:text-base placeholder-gray-500 font-medium text-white"
                        />
                    </div>
                </div>

                {/* Search Button */}
                <div className="p-1 w-full md:w-auto mt-1 md:mt-0">
                    <button 
                        type="submit" 
                        aria-label={t.search}
                        className="bg-primary text-white p-4 rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 w-full md:w-auto md:aspect-square"
                    >
                        <Search className="w-6 h-6" />
                        <span className="md:hidden font-bold">{t.search}</span>
                    </button>
                </div>

            </div>
        </form>
    );
}
