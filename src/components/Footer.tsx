import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, MessageCircle, Phone, Mail, ArrowRight, CreditCard } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { language } from '../store';

export default function Footer() {
    const $language = useStore(language);

    const t = {
        en: {
            inquiry: { title: "To More Inquiry", subtitle: "Don't hesitate Call to Vamos Jacó." },
            whatsapp: { title: "WhatsApp", subtitle: "+506 1234 5678" },
            mail: { title: "Mail Us", subtitle: "info@vamosjaco.com" },
            call: { title: "Call Us", subtitle: "+506 8765 4321" },
            brand: { address: "Jacó, Puntarenas, Costa Rica" },
            cols: {
                destinations: "Top Destination",
                search: "Popular Search",
                resources: "Resources"
            },
            rights: "All Right Reserved.",
            payment: "Accepted Payment Methods :"
        },
        es: {
            inquiry: { title: "Más Información", subtitle: "No dudes en llamar a Vamos Jacó." },
            whatsapp: { title: "WhatsApp", subtitle: "+506 1234 5678" },
            mail: { title: "Escríbenos", subtitle: "info@vamosjaco.com" },
            call: { title: "Llámanos", subtitle: "+506 8765 4321" },
            brand: { address: "Jacó, Puntarenas, Costa Rica" },
            cols: {
                destinations: "Destinos Top",
                search: "Búsquedas Populares",
                resources: "Recursos"
            },
            rights: "Todos los derechos reservados.",
            payment: "Métodos de Pago Aceptados :"
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
                        <a href="/" className="text-3xl font-bold font-['Inter'] text-white items-center gap-2 flex mb-6">
                            <span className="text-primary">V</span>amos Jacó
                        </a>
                        <p className="text-gray-400 text-sm mb-2 font-bold">Vamos Jacó Tours Agency</p>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            {content.brand.address}
                        </p>

                        <div className="flex gap-3 mb-8">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors text-white"><Facebook className="w-4 h-4" /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-black transition-colors text-white"><ArrowRight className="w-4 h-4 rotate-[-45deg]" /></a> {/* Creating a custom X icon or similar */}
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors text-white"><Instagram className="w-4 h-4" /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors text-white"><Linkedin className="w-4 h-4" /></a>
                        </div>
                    </div>

                    {/* Column 2: Top Destination */}
                    <div>
                        <h4 className="text-lg font-bold mb-8">{content.cols.destinations}</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li className="hover:text-primary transition-colors cursor-pointer">Jacó Beach</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Manuel Antonio</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Tortuga Island</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Monteverde</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Arenal Volcano</li>
                        </ul>
                    </div>

                    {/* Column 3: Popular Search */}
                    <div>
                        <h4 className="text-lg font-bold mb-8">{content.cols.search}</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li className="hover:text-primary transition-colors cursor-pointer">Adventure Tours</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Water Rafting</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Zip Lining</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Surfing Lessons</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">ATV Jungle</li>
                        </ul>
                    </div>

                    {/* Column 4: Resources */}
                    <div>
                        <h4 className="text-lg font-bold mb-8">{content.cols.resources}</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li className="hover:text-primary transition-colors cursor-pointer">About Us</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Safety Measures</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Travel Guides</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Terms & Conditions</li>
                            <li className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</li>
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
