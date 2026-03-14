import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { language } from '../store';
import ShieldAlert from 'lucide-react/dist/esm/icons/shield-alert';
import Route from 'lucide-react/dist/esm/icons/route';
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';
import Hand from 'lucide-react/dist/esm/icons/hand';
import FileText from 'lucide-react/dist/esm/icons/file-text';

export default function AtvRulesFaq() {
    const $language = useStore(language);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const rules = [
        {
            icon: <ShieldAlert className="w-6 h-6 text-brand-orange" />,
            title: {
                en: 'Helmet Policy & Minimum Age',
                es: 'Uso de Casco y Edad Mínima'
            },
            content: {
                en: 'Wearing a helmet is a must! It is Costa Rica\'s law. For the ATV tour, only adults 18+ are allowed to drive.',
                es: 'Utilizar casco es obligatorio por ley en Costa Rica. Para manejar ATV, solo se permiten adultos mayores de 18 años.'
            }
        },
        {
            icon: <Route className="w-6 h-6 text-brand-teal" />,
            title: {
                en: 'Tour Formation / Route',
                es: 'Formación del Recorrido'
            },
            content: {
                en: 'Once the tour starts, stay in a single line. Passing other riders is strictly forbidden. The guide always goes in front—please follow all their instructions.',
                es: 'Una vez que el tour comience, manténgase en una sola fila. Está prohibido rebasar a otros pasajeros. El guía siempre va al frente—por favor siga todas sus indicaciones.'
            }
        },
        {
            icon: <AlertTriangle className="w-6 h-6 text-primary" />,
            title: {
                en: 'Safety & Prohibited Maneuvers',
                es: 'Seguridad y Maniobras Prohibidas'
            },
            content: {
                en: 'Any kind of trick is forbidden (wheelies, power slides, fishtails, & jumps). You must keep a safe distance between vehicles at all times.',
                es: 'Prohibido hacer cualquier tipo de truco (derrapes, saltos, levantar la moto). Debe mantener una distancia prudente entre los vehículos en todo momento.'
            }
        },
        {
            icon: <Hand className="w-6 h-6 text-brand-yellow" />,
            title: {
                en: 'Driving Instructions',
                es: 'Instrucciones de Manejo'
            },
            content: {
                en: 'When stopping, always use both the front and rear brakes. Pay close attention to all instructions on how to operate the vehicle. Do not put your feet on the fenders, as you could break them!',
                es: 'Al detenerse, use siempre ambos frenos (delantero y trasero). Preste mucha atención a cómo operar el vehículo. ¡No ponga los pies en los guardabarros, podría quebrarlos!'
            }
        },
        {
            icon: <FileText className="w-6 h-6 text-gray-400" />,
            title: {
                en: 'Vehicle Responsibility',
                es: 'Responsabilidad del Vehículo'
            },
            content: {
                en: 'You differ any doubts? Ask! We are pleased to answer them. Remember! You are fully responsible for the vehicle, and any damage occurred will be charged to you.',
                es: '¿Dudas? ¡Pregunte! Con gusto le atenderemos. ¡Recuerde! Usted es totalmente responsable por su vehículo, cualquier daño ocurrido será cargado a su cuenta.'
            }
        }
    ];

    return (
        <section className="py-20 bg-dark relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 text-primary font-bold text-sm tracking-[0.2em] uppercase mb-4">
                        {$language === 'en' ? 'Important Rules' : 'Reglas Importantes'}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
                        {$language === 'en' ? 'ATV & Buggy' : 'Reglas ATV & Buggy'}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-primary italic">
                            {$language === 'en' ? 'Safety Rules' : 'Seguridad'}
                        </span>
                    </h2>
                    <p className="text-gray-400">
                        {$language === 'en'
                            ? 'Please read these rules carefully before your off-road adventure.'
                            : 'Por favor lea estas reglas cuidadosamente antes de su aventura todoterreno.'}
                    </p>
                </div>

                <div className="space-y-4">
                    {rules.map((rule, idx) => (
                        <div
                            key={idx}
                            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/20"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-dark-soft rounded-xl shadow-inner border border-white/5">
                                        {rule.icon}
                                    </div>
                                    <h3 className="text-white font-bold md:text-lg">
                                        {rule.title[$language]}
                                    </h3>
                                </div>
                                <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-transform duration-300 ${openIndex === idx ? 'rotate-180 bg-brand-orange/20 text-brand-orange' : 'text-gray-400'}`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === idx ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5 ml-[88px] mr-6">
                                    {rule.content[$language]}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
