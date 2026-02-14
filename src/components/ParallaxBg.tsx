import React, { useEffect, useState } from 'react';

// Sparkle particle configs — defined outside component to avoid re-creation
const SPARKLES = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: 2 + (i % 4) * 1.5,
    left: `${5 + (i * 5.3) % 90}%`,
    top: `${5 + (i * 13.7) % 85}%`,
    delay: `${(i * 0.7) % 6}s`,
    duration: `${3 + (i % 4) * 1.5}s`,
    color: i % 3 === 0
        ? 'rgba(217,40,24,0.6)'
        : i % 3 === 1
            ? 'rgba(3,166,150,0.5)'
            : 'rgba(242,171,39,0.5)',
}));

const DUST = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: 60 + i * 30,
    left: `${10 + i * 15}%`,
    startTop: 300 + i * 400,
    color: i % 2 === 0
        ? 'radial-gradient(circle, rgba(217,40,24,0.04) 0%, transparent 70%)'
        : 'radial-gradient(circle, rgba(3,166,150,0.03) 0%, transparent 70%)',
    delay: `${i * 1.2}s`,
    duration: `${4 + i * 0.8}s`,
}));

export default function ParallaxBg() {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setOffset(window.scrollY);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            {/* ── ATV silhouette #1 — right side, parallax + subtle rotation ── */}
            <div
                className="absolute opacity-[0.03]"
                style={{
                    right: '-5%',
                    top: `${200 + offset * -0.15}px`,
                    width: '600px',
                    height: '400px',
                    transform: `rotate(${offset * 0.003}deg)`,
                    transition: 'none',
                }}
            >
                <svg viewBox="0 0 800 500" fill="currentColor" className="w-full h-full text-white">
                    <ellipse cx="200" cy="380" rx="95" ry="95" />
                    <ellipse cx="600" cy="380" rx="95" ry="95" />
                    <ellipse cx="200" cy="380" rx="60" ry="60" fill="black" />
                    <ellipse cx="600" cy="380" rx="60" ry="60" fill="black" />
                    <path d="M140,340 L250,250 L400,220 L550,250 L660,340 L600,350 L500,280 L300,280 L200,350 Z" />
                    <rect x="300" y="260" width="200" height="80" rx="10" />
                    <path d="M550,250 Q650,200 680,300 L660,340 L580,290 Z" />
                    <path d="M250,250 Q150,200 120,300 L140,340 L220,290 Z" />
                    <path d="M560,250 L600,160 L640,150 M600,160 L560,150" strokeWidth="12" stroke="currentColor" fill="none" />
                    <path d="M300,240 Q400,200 500,240 L480,260 L320,260 Z" />
                    <path d="M420,200 L440,120 L460,100 M440,120 L400,80 L420,40 L460,40 L480,80 L460,120 M420,80 Q400,60 420,40 Q460,20 480,40 Q500,60 480,80 Q460,100 420,80" />
                    <path d="M430,140 L400,200 L380,240 M430,140 L470,200 L490,240 M430,140 L430,200" strokeWidth="10" stroke="currentColor" fill="none" strokeLinecap="round" />
                    <ellipse cx="660" cy="280" rx="15" ry="12" />
                    <path d="M150,320 L80,300 L70,310 L140,330" />
                </svg>
            </div>

            {/* ── ATV silhouette #2 — left side, mirrored, parallax + subtle counter-rotation ── */}
            <div
                className="absolute opacity-[0.02]"
                style={{
                    left: '-8%',
                    top: `${1200 + offset * -0.08}px`,
                    width: '500px',
                    height: '350px',
                    transform: `scaleX(-1) rotate(${-5 + offset * -0.002}deg)`,
                    transition: 'none',
                }}
            >
                <svg viewBox="0 0 800 500" fill="currentColor" className="w-full h-full text-white">
                    <ellipse cx="200" cy="380" rx="95" ry="95" />
                    <ellipse cx="600" cy="380" rx="95" ry="95" />
                    <ellipse cx="200" cy="380" rx="60" ry="60" fill="black" />
                    <ellipse cx="600" cy="380" rx="60" ry="60" fill="black" />
                    <path d="M140,340 L250,250 L400,220 L550,250 L660,340 L600,350 L500,280 L300,280 L200,350 Z" />
                    <rect x="300" y="260" width="200" height="80" rx="10" />
                    <path d="M550,250 Q650,200 680,300 L660,340 L580,290 Z" />
                    <path d="M250,250 Q150,200 120,300 L140,340 L220,290 Z" />
                    <path d="M560,250 L600,160 L640,150 M600,160 L560,150" strokeWidth="12" stroke="currentColor" fill="none" />
                    <path d="M300,240 Q400,200 500,240 L480,260 L320,260 Z" />
                </svg>
            </div>

            {/* ── Scroll-driven small particles ── */}
            <div className="absolute inset-0">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-primary/20"
                        style={{
                            width: `${3 + (i % 4) * 2}px`,
                            height: `${3 + (i % 4) * 2}px`,
                            left: `${8 + (i * 7.5) % 90}%`,
                            top: `${(offset * (0.02 + i * 0.005) + i * 200) % (typeof window !== 'undefined' ? window.innerHeight * 3 : 3000)}px`,
                            opacity: 0.15 + (i % 3) * 0.1,
                            transition: 'none',
                        }}
                    />
                ))}
            </div>

            {/* ── CSS-animated sparkle particles — twinkle independently ── */}
            <div className="absolute inset-0">
                {SPARKLES.map((s) => (
                    <div
                        key={`sparkle-${s.id}`}
                        className="absolute rounded-full"
                        style={{
                            width: `${s.size}px`,
                            height: `${s.size}px`,
                            left: s.left,
                            top: s.top,
                            backgroundColor: s.color,
                            boxShadow: `0 0 ${s.size * 3}px ${s.color}`,
                            animation: `sparkle ${s.duration} ${s.delay} ease-in-out infinite`,
                        }}
                    />
                ))}
            </div>

            {/* ── Floating dust — CSS glowPulse animation + scroll position ── */}
            <div className="absolute inset-0">
                {DUST.map((d) => (
                    <div
                        key={`dust-${d.id}`}
                        className="absolute rounded-full"
                        style={{
                            width: `${d.size}px`,
                            height: `${d.size}px`,
                            left: d.left,
                            top: `${(offset * (0.03 + d.id * 0.01) + d.startTop) % (typeof window !== 'undefined' ? window.innerHeight * 3 : 3000)}px`,
                            background: d.color,
                            animation: `glowPulse ${d.duration} ${d.delay} ease-in-out infinite`,
                            transition: 'none',
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
