import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, MessageCircle, Phone, Mail, ArrowRight, CreditCard } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { language } from '../store';

export default function Footer() {
    const $language = useStore(language);

    const t = {
        en: {
            inquiry: { title: "More Inquiry?", subtitle: "Don't hesitate to contact Vamos Jacó Tours." },
            whatsapp: { title: "WhatsApp", subtitle: "+506 8585 8462" },
            mail: { title: "Mail Us", subtitle: "info@vamosjacotours.com" },
            call: { title: "Call Us", subtitle: "+506 8585 8462" },
            brand: { address: "Jacó, Puntarenas, Costa Rica" },
            cols: {
                destinations: "Top Destinations",
                search: "Popular Activities",
                resources: "Quick Links"
            },
            rights: "All Rights Reserved.",
            payment: "Accepted Payment Methods:"
        },
        es: {
            inquiry: { title: "¿Más Información?", subtitle: "No dudes en contactar a Vamos Jacó Tours." },
            whatsapp: { title: "WhatsApp", subtitle: "+506 8585 8462" },
            mail: { title: "Escríbenos", subtitle: "info@vamosjacotours.com" },
            call: { title: "Llámanos", subtitle: "+506 8585 8462" },
            brand: { address: "Jacó, Puntarenas, Costa Rica" },
            cols: {
                destinations: "Destinos Top",
                search: "Actividades Populares",
                resources: "Enlaces Rápidos"
            },
            rights: "Todos los derechos reservados.",
            payment: "Métodos de Pago Aceptados:"
        }
    };

    const content = $language === 'en' ? t.en : t.es;

    return (
        <footer className="bg-[#0B0F19] text-white relative overflow-hidden font-sans">
            {/* Background Map Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
                    alt="World Map"
                    className="w-full h-full object-cover grayscale invert"
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">

                {/* Top Info Bar */}
                <div className="border-b border-gray-800 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Inquiry */}
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center shrink-0 text-primary">
                                <MessageCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">{content.inquiry.title}</h4>
                                <p className="text-gray-400 text-sm">{content.inquiry.subtitle}</p>
                            </div>
                        </div>
                        {/* WhatsApp */}
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center shrink-0 text-green-500">
                                <MessageCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">{content.whatsapp.title}</h4>
                                <p className="text-gray-400 text-sm">{content.whatsapp.subtitle}</p>
                            </div>
                        </div>
                        {/* Mail */}
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center shrink-0 text-blue-400">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">{content.mail.title}</h4>
                                <p className="text-gray-400 text-sm">{content.mail.subtitle}</p>
                            </div>
                        </div>
                        {/* Call */}
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center shrink-0 text-yellow-400">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">{content.call.title}</h4>
                                <p className="text-gray-400 text-sm">{content.call.subtitle}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Column 1: Brand Info */}
                    <div>
                        <a href="/" className="mb-6 block">
                            <img
                                src="/logo.png"
                                alt="Vamos Jacó Tours Logo"
                                className="h-16 md:h-20 w-auto object-contain"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    if (e.currentTarget.parentElement) {
                                        e.currentTarget.parentElement.innerHTML = '<span class="text-3xl font-bold font-[\'Inter\'] text-white"><span class="text-primary">V</span>amos Jacó</span>';
                                    }
                                }}
                            />
                        </a>
                        <p className="text-gray-400 text-sm mb-2 font-bold">Vamos Jacó Tours Agency</p>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            {content.brand.address}
                        </p>

                        <div className="flex gap-3 mb-8">
                            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors text-white"><Facebook className="w-4 h-4" /></a>
                            <a href="https://www.instagram.com/vamosjacotours" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors text-white"><Instagram className="w-4 h-4" /></a>
                            <a href="https://wa.me/50685858462" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-600 transition-colors text-white"><MessageCircle className="w-4 h-4" /></a>
                        </div>
                    </div>

                    {/* Column 2: Top Destination */}
                    <div>
                        <h4 className="text-lg font-bold mb-8">{content.cols.destinations}</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><a href="/tours" className="hover:text-primary transition-colors">Jacó Beach</a></li>
                            <li><a href="/tours" className="hover:text-primary transition-colors">Herradura</a></li>
                            <li><a href="/tours" className="hover:text-primary transition-colors">Los Sueños</a></li>
                            <li><a href="/tours" className="hover:text-primary transition-colors">Hermosa Beach</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Popular Search */}
                    <div>
                        <h4 className="text-lg font-bold mb-8">{content.cols.search}</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><a href="/tours" className="hover:text-primary transition-colors">ATV Tours</a></li>
                            <li><a href="/tours" className="hover:text-primary transition-colors">Side by Side (Buggy)</a></li>
                            <li><a href="/tours" className="hover:text-primary transition-colors">Jet Ski</a></li>
                            <li><a href="/tours" className="hover:text-primary transition-colors">Zipline Canopy</a></li>
                            <li><a href="/tours" className="hover:text-primary transition-colors">Surfing Lessons</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Resources */}
                    <div>
                        <h4 className="text-lg font-bold mb-8">{content.cols.resources}</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><a href="/" className="hover:text-primary transition-colors">{$language === 'en' ? 'Home' : 'Inicio'}</a></li>
                            <li><a href="/tours" className="hover:text-primary transition-colors">Tours & Adventures</a></li>
                            <li><a href="/about" className="hover:text-primary transition-colors">{$language === 'en' ? 'About Us' : 'Nosotros'}</a></li>
                            <li><a href="/contact" className="hover:text-primary transition-colors">{$language === 'en' ? 'Contact' : 'Contacto'}</a></li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm">
                        Copyright {new Date().getFullYear()} Vamos Jacó. {content.rights}
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-500 text-sm hidden md:block">{content.payment}</span>
                        <div className="flex gap-2">
                            {/* Simple Payment Icons Placeholders */}
                            <div className="bg-white px-2 py-1 rounded h-6 flex items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="Mastercard" /></div>
                            <div className="bg-white px-2 py-1 rounded h-6 flex items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3" alt="Visa" /></div>
                            <div className="bg-white px-2 py-1 rounded h-6 flex items-center"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-3" alt="PayPal" /></div>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
}
