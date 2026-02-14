import React, { useState } from 'react';
import { Search, Calendar, Users, MapPin } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { language } from '../store';

export default function HeroSearch() {
    const $language = useStore(language);

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

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-dark-soft/80 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-black/20 p-2 md:p-3 flex flex-col md:flex-row items-center gap-1 md:gap-2 ring-1 ring-white/10">

                {/* Activity Input */}
                <div className="flex-1 w-full px-4 py-2 md:px-6 md:py-3 hover:bg-white/5 rounded-[1.5rem] md:rounded-[2rem] transition-colors cursor-pointer group">
                    <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5 md:mb-1 group-hover:text-primary transition-colors">{t.activity}</label>
                    <div className="flex items-center gap-2 md:gap-3 text-gray-400 group-hover:text-white">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary/70" />
                        <input
                            type="text"
                            placeholder={t.activityPlaceholder}
                            className="w-full bg-transparent border-none outline-none text-sm md:text-base placeholder-gray-500 font-medium text-white"
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-10 bg-white/10"></div>

                {/* Date Input */}
                <div className="flex-1 w-full px-4 py-2 md:px-6 md:py-3 hover:bg-white/5 rounded-[1.5rem] md:rounded-[2rem] transition-colors cursor-pointer group">
                    <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5 md:mb-1 group-hover:text-primary transition-colors">{t.date}</label>
                    <div className="flex items-center gap-2 md:gap-3 text-gray-400 group-hover:text-white">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary/70" />
                        <input
                            type="date"
                            className="w-full bg-transparent border-none outline-none text-sm md:text-base font-medium text-white"
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-10 bg-white/10"></div>

                {/* People Input */}
                <div className="flex-1 w-full px-4 py-2 md:px-6 md:py-3 hover:bg-white/5 rounded-[1.5rem] md:rounded-[2rem] transition-colors cursor-pointer group">
                    <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5 md:mb-1 group-hover:text-primary transition-colors">{t.people}</label>
                    <div className="flex items-center gap-2 md:gap-3 text-gray-400 group-hover:text-white">
                        <Users className="w-4 h-4 md:w-5 md:h-5 text-primary/70" />
                        <input
                            type="number"
                            min="1"
                            placeholder={t.peoplePlaceholder}
                            className="w-full bg-transparent border-none outline-none text-sm md:text-base placeholder-gray-500 font-medium text-white"
                        />
                    </div>
                </div>

                {/* Search Button */}
                <div className="p-1 w-full md:w-auto mt-1 md:mt-0">
                    <button className="bg-primary text-white p-4 rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 w-full md:w-auto md:aspect-square">
                        <Search className="w-6 h-6" />
                        <span className="md:hidden font-bold">{t.search}</span>
                    </button>
                </div>

            </div>
        </div>
    );
}
