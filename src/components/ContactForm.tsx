import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { language } from '../store';
import Phone from 'lucide-react/dist/esm/icons/phone';
import Mail from 'lucide-react/dist/esm/icons/mail';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Send from 'lucide-react/dist/esm/icons/send';
import MessageSquare from 'lucide-react/dist/esm/icons/message-square';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';

export default function ContactForm() {
    const $language = useStore(language);
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Sanitize inputs
        const sanitized = {
            name: formState.name.trim().slice(0, 100),
            email: formState.email.trim().slice(0, 200),
            message: formState.message.trim().slice(0, 2000),
        };

        if (!sanitized.name || !sanitized.email || !sanitized.message) return;

        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSent(true);
        setFormState({ name: '', email: '', message: '' });
        // Reset success message after 3s
        setTimeout(() => setIsSent(false), 3000);
    };

    const t = {
        en: {
            title: "Send a Message",
            name: "Your Name",
            email: "Email Address",
            message: "How can we help?",
            send: "Send Message",
            sending: "Sending...",
            sent: "Message Sent!",
            infoTitle: "Contact Information",
            call: "Call Us",
            emailLabel: "Email Us",
            visit: "Visit Us",
            address: "Pastor Diaz Avenue, Jacó, Garabito, Puntarenas, Costa Rica"
        },
        es: {
            title: "Envía un Mensaje",
            name: "Tu Nombre",
            email: "Correo Electrónico",
            message: "¿Cómo podemos ayudarte?",
            send: "Enviar Mensaje",
            sending: "Enviando...",
            sent: "¡Mensaje Enviado!",
            infoTitle: "Información de Contacto",
            call: "Llámanos",
            emailLabel: "Escríbenos",
            visit: "Visítanos",
            address: "Avenida Pastor Díaz, Jacó, Garabito, Puntarenas, Costa Rica"
        }
    };

    const content = $language === 'en' ? t.en : t.es;

    return (
        <section className="py-24 bg-dark relative -mt-20 z-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="bg-dark-soft rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col lg:flex-row ring-1 ring-white/10">

                    {/* Left: Contact Info (Dark Highlight) */}
                    <div className="lg:w-2/5 bg-[#1A4D45] p-12 text-white relative overflow-hidden flex flex-col justify-between">
                        {/* Decimal Pattern overlay */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                        <div>
                            <h3 className="text-3xl font-bold mb-8">{content.infoTitle}</h3>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4 hover:translate-x-2 transition-transform duration-300">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0 backdrop-blur-sm">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-sm font-medium mb-1">{content.call}</p>
                                        <p className="text-lg font-bold">+506 8888-8888</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 hover:translate-x-2 transition-transform duration-300">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0 backdrop-blur-sm">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-sm font-medium mb-1">{content.emailLabel}</p>
                                        <p className="text-lg font-bold">info@vamosjaco.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 hover:translate-x-2 transition-transform duration-300">
                                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0 backdrop-blur-sm">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-sm font-medium mb-1">{content.visit}</p>
                                        <p className="text-lg font-bold leading-relaxed max-w-[250px]">{content.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 lg:mt-0 relative">
                            {/* Decorative Circles */}
                            <div className="w-32 h-32 bg-brand-yellow rounded-full absolute -bottom-20 -right-20 blur-2xl opacity-50"></div>
                            <div className="w-32 h-32 bg-primary rounded-full absolute -bottom-10 -left-10 blur-3xl opacity-40"></div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="lg:w-3/5 p-12 lg:p-16">
                        <h3 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            {content.title} <MessageSquare className="w-6 h-6 text-primary" />
                        </h3>
                        <p className="text-gray-400 mb-10">
                            {$language === 'en' ? "Don't hesitate to reach out. We are here to help you plan the perfect trip." : "No dudes en contactarnos. Estamos aquí para ayudarte a planear el viaje perfecto."}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative group">
                                <input
                                    id="contact-name"
                                    type="text"
                                    required
                                    maxLength={100}
                                    autoComplete="name"
                                    value={formState.name}
                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                    placeholder=" "
                                    className="peer w-full bg-white/5 border-2 border-white/10 rounded-xl px-6 py-4 outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-white font-medium"
                                />
                                <label htmlFor="contact-name" className="absolute left-6 top-4 text-gray-400 text-sm font-medium transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-primary peer-focus:bg-dark-soft peer-focus:px-2 rounded-full cursor-text pointer-events-none transform -translate-y-1/2 peer-placeholder-shown:translate-y-0 peer-focus:translate-y-0">
                                    {content.name}
                                </label>
                            </div>

                            <div className="relative group">
                                <input
                                    id="contact-email"
                                    type="email"
                                    required
                                    maxLength={200}
                                    autoComplete="email"
                                    value={formState.email}
                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                    placeholder=" "
                                    className="peer w-full bg-white/5 border-2 border-white/10 rounded-xl px-6 py-4 outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-white font-medium"
                                />
                                <label htmlFor="contact-email" className="absolute left-6 top-4 text-gray-400 text-sm font-medium transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-primary peer-focus:bg-dark-soft peer-focus:px-2 rounded-full cursor-text pointer-events-none transform -translate-y-1/2 peer-placeholder-shown:translate-y-0 peer-focus:translate-y-0">
                                    {content.email}
                                </label>
                            </div>

                            <div className="relative group">
                                <textarea
                                    id="contact-message"
                                    required
                                    rows={4}
                                    maxLength={2000}
                                    value={formState.message}
                                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                    placeholder=" "
                                    className="peer w-full bg-white/5 border-2 border-white/10 rounded-xl px-6 py-4 outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-white font-medium resize-none"
                                ></textarea>
                                <label htmlFor="contact-message" className="absolute left-6 top-4 text-gray-400 text-sm font-medium transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-[-10px] peer-focus:text-xs peer-focus:text-primary peer-focus:bg-dark-soft peer-focus:px-2 rounded-full cursor-text pointer-events-none transform -translate-y-1/2 peer-placeholder-shown:translate-y-0 peer-focus:translate-y-0">
                                    {content.message}
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || isSent}
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${isSent ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary-dark hover:-translate-y-1 hover:shadow-xl shadow-primary/30'}`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2 animate-pulse">{content.sending}</span>
                                ) : isSent ? (
                                    <span className="flex items-center gap-2">{content.sent}</span>
                                ) : (
                                    <>
                                        {content.send} <Send className="w-5 h-5" />
                                    </>
                                )}
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
