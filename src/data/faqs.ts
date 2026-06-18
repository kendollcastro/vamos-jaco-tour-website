export interface FAQItem {
    question: string;
    answer: string;
}

export const faqs: { en: FAQItem[]; es: FAQItem[] } = {
    en: [
        {
            question: "How far in advance should I book my tour?",
            answer: "We recommend booking at least 2-3 days in advance, especially during the high season (December to April) to ensure availability for your preferred dates."
        },
        {
            question: "Is round-trip transportation included?",
            answer: "Yes! Many of our tours include free round-trip transportation from hotels and rentals within the Jaco and Herradura areas. Please check the specific details of your chosen tour."
        },
        {
            question: "Are the tours suitable for children?",
            answer: "Most tours are family-friendly. For example, the Crocodile Safari and Banana Boat have very low minimum ages. However, ATV and Jet Ski driving is strictly for adults (18+)."
        },
        {
            question: "What is your cancellation policy?",
            answer: "We offer a full refund for cancellations made at least 48 hours prior to the tour start time. Cancellations within 48 hours are non-refundable. Please note that deposit refunds take approximately 24 hours to process due to bank policies."
        },
        {
            question: "Do I need prior experience for the ATV or Jet Ski tours?",
            answer: "No prior experience is necessary. Our professional guides provide a full safety briefing and operational instructions before every tour begins."
        },
        {
            question: "What should I bring to the tours?",
            answer: "It depends on the tour, but generally we highly recommend sunscreen, insect repellent, comfortable clothes, closed-toe shoes (for ATV/Zipline), and a swimsuit/towel for water tours."
        },
        {
            question: "Do tours operate if it rains?",
            answer: "Yes, we operate rain or shine. In fact, ATV and Rafting tours are even more fun in the rain! We only cancel in case of extreme weather conditions that compromise safety."
        },
        {
            question: "Do you offer options for large groups or corporate events?",
            answer: "Absolutely! We can organize unforgettable experiences for groups, weddings, or corporate events. Contact us directly for special rates and custom packages."
        }
    ],
    es: [
        {
            question: "¿Con cuánta anticipación debo reservar mi tour?",
            answer: "Recomendamos reservar con al menos 2 o 3 días de anticipación, especialmente durante la temporada alta (diciembre a abril) para asegurar su lugar."
        },
        {
            question: "¿Está incluido el transporte de ida y vuelta?",
            answer: "¡Sí! Muchos de nuestros tours incluyen transporte gratuito desde hoteles en Jacó y Herradura. Por favor revise los detalles específicos del tour elegido."
        },
        {
            question: "¿Los tours son aptos para niños?",
            answer: "La mayoría son ideales para familias, como el Safari de Cocodrilos o Banana Boat. Sin embargo, manejar ATV y Jet Ski es estrictamente para adultos (18+)."
        },
        {
            question: "¿Cuál es su política de cancelación?",
            answer: "Ofrecemos reembolso completo para cancelaciones realizadas al menos 48 horas antes del inicio del tour. Cancelaciones en menos de 48 horas no son reembolsables. Tome en cuenta que el reembolso del depósito tiene una duración de 24 horas después del trámite por políticas bancarias."
        },
        {
            question: "¿Necesito experiencia previa para los ATV o Jet Ski?",
            answer: "No se requiere experiencia previa. Nuestros guías profesionales brindan una sesión completa de seguridad y manejo antes de iniciar cada recorrido."
        },
        {
            question: "¿Qué debo llevar a los tours?",
            answer: "Depende del tour, pero en general recomendamos: protector solar, repelente de insectos, ropa cómoda, zapatos cerrados (para ATV/Zipline) y traje de baño/toalla para tours acuáticos."
        },
        {
            question: "¿Los tours se realizan si llueve?",
            answer: "Sí, operamos bajo lluvia o sol. De hecho, ¡los tours de ATV y Rafting son aún más divertidos con lluvia! Solo cancelamos en caso de condiciones climáticas extremas que comprometan la seguridad."
        },
        {
            question: "¿Ofrecen opciones para grupos grandes o eventos corporativos?",
            answer: "¡Por supuesto! Podemos organizar experiencias inolvidables para grupos, bodas o eventos corporativos. Contáctenos directamente para tarifas y paquetes especiales."
        }
    ]
};
