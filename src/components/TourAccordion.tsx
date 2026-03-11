import React, { useState } from 'react';
import { ChevronDown, Info, ShieldCheck, Flag } from 'lucide-react';
import TranslatedText from './TranslatedText';
import TranslatedMarkdown from './TranslatedMarkdown';

interface AccordionItem {
    id: string;
    title: {en: string, es: string} | string;
    content: {en: string, es: string} | string;
    iconName?: string;
}

const getIcon = (name?: string) => {
    switch (name) {
        case 'info': return <Info className="w-5 h-5" />;
        case 'shield': return <ShieldCheck className="w-5 h-5" />;
        case 'flag': return <Flag className="w-5 h-5" />;
        default: return <Info className="w-5 h-5" />;
    }
};

interface TourAccordionProps {
    items: AccordionItem[];
}

export default function TourAccordion({ items }: TourAccordionProps) {
    const [openId, setOpenId] = useState<string>(items[0]?.id || "");

    const toggleItem = (id: string) => {
        setOpenId(openId === id ? "" : id);
    };

    return (
        <div className="space-y-4">
            {items.map((item) => {
                const isOpen = openId === item.id;

                return (
                    <div
                        key={item.id}
                        className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen
                            ? 'bg-light-soft/5 border-primary/30 shadow-[0_0_15px_rgba(255,87,34,0.1)]'
                            : 'bg-dark-soft/50 border-white/5 hover:border-white/20'
                            }`}
                    >
                        <button
                            onClick={() => toggleItem(item.id)}
                            className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-xl transition-colors ${isOpen ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-400 group-hover:text-white'}`}>
                                    {getIcon(item.iconName)}
                                </div>
                                <h3 className={`text-lg font-bold transition-colors ${isOpen ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                    <TranslatedText content={item.title} />
                                </h3>
                            </div>
                            <div className={`p-1.5 rounded-full transition-all duration-300 ${isOpen ? 'bg-primary text-white rotate-180' : 'bg-white/10 text-gray-400 group-hover:bg-white/20'}`}>
                                <ChevronDown className="w-5 h-5" />
                            </div>
                        </button>

                        <div
                            className={`transition-all duration-500 ease-in-out px-6 overflow-hidden ${isOpen ? 'max-h-[1000px] pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'
                                }`}
                        >
                            <TranslatedMarkdown 
                                className="pt-2 text-gray-300 text-base md:text-lg leading-[1.8] font-light pl-[3.25rem] pb-4 [&>p]:mb-6 last:[&>p]:mb-0 [&_strong]:text-white [&_strong]:font-semibold [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-6 [&>ul>li]:mb-3 [&>ul>li::marker]:text-brand-orange [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-6 [&>ol>li]:mb-3 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-white [&>h3]:mb-4 [&>h3]:mt-8 first:[&>h3]:mt-0"
                                content={item.content}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
