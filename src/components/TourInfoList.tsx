import React from 'react';
import { useStore } from '@nanostores/react';
import { language } from '../store';
import TranslatedMarkdown from './TranslatedMarkdown';
import TranslatedText from './TranslatedText';

interface TourInfoListProps {
    type: 'highlights' | 'includes';
    data?: { en: string[]; es: string[] };
}

export default function TourInfoList({ type, data }: TourInfoListProps) {
    const $language = useStore(language);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => { setMounted(true); }, []);

    // Initial check (hydration match)
    const listEn = data?.en || [];
    if (listEn.length === 0) return null;

    const list = mounted && data?.[$language] && data[$language].length > 0 ? data[$language] : listEn;

    if (type === 'highlights') {
        return (
            <div className="relative bg-dark-soft rounded-3xl p-8 md:p-10 border border-white/5 shadow-2xl overflow-hidden mt-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none" />

                <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-4 uppercase tracking-tight italic relative z-10">
                    <span className="w-10 h-1 bg-gradient-to-r from-brand-orange to-primary rounded-full shadow-[0_0_15px_rgba(242,127,27,0.5)]" />
                    <TranslatedText content={{ en: "Important Info", es: "Información Importante" }} />
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative z-10">
                    {list.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-5 bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl group hover:bg-brand-orange/5 hover:border-brand-orange/30 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-10 h-10 rounded-xl bg-brand-orange/20 flex items-center justify-center flex-shrink-0 text-brand-orange shadow-[0_0_15px_rgba(242,127,27,0.2)] group-hover:scale-110 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <TranslatedMarkdown
                                content={item}
                                inline={true}
                                className="text-gray-300 text-sm md:text-base font-medium leading-relaxed pt-1"
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (type === 'includes') {
        return (
            <div className="mt-8">
                <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-4 uppercase tracking-tight italic">
                    <span className="w-10 h-1 bg-gradient-to-r from-brand-teal to-primary rounded-full shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
                    <TranslatedText content={{ en: "What's Included", es: "Qué Incluye" }} />
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {list.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 transition-all duration-300 hover:bg-white/10 hover:border-brand-teal/50 hover:shadow-[0_0_20px_rgba(45,212,191,0.15)] group">
                            <div className="w-8 h-8 rounded-full bg-brand-teal/20 flex items-center justify-center flex-shrink-0 text-brand-teal group-hover:scale-110 group-hover:bg-brand-teal group-hover:text-white transition-all duration-300">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <TranslatedMarkdown
                                content={item}
                                inline={true}
                                className="text-sm md:text-base font-bold text-gray-200"
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return null;
}
