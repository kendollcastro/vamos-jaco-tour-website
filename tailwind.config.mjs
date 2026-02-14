/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Outfit', 'sans-serif'],
				script: ['Kaushan Script', 'cursive'],
			},
			borderRadius: {
				'card': '25px',
			},
			colors: {
				primary: '#D92818', // Red from logo
				'primary-dark': '#B02113',
				'brand-teal': '#03A696', // POINTER Teal
				'brand-orange': '#F27F1B', // POINTER Orange
				'brand-yellow': '#F2AB27', // Sunset Yellow (kept as accent)
				dark: '#0D0B08',    // Black from logo
				'dark-soft': '#1A1816',
				light: '#F2F2F2',   // White/Light Gray
			},
			boxShadow: {
				'soft': '0 10px 30px rgba(0,0,0,0.05)',
				'hover': '0 20px 40px rgba(0,0,0,0.1)',
				'neon': '0 0 10px rgba(3, 166, 150, 0.5), 0 0 20px rgba(3, 166, 150, 0.3)',
			},
			animation: {
				'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
				'zoom-in': 'zoomIn 0.5s ease-out forwards',
				'float': 'float 6s ease-in-out infinite',
			},
			keyframes: {
				fadeInUp: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				zoomIn: {
					'0%': { opacity: '0', transform: 'scale(0.9)' },
					'100%': { opacity: '1', transform: 'scale(1)' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				}
			}
		},
	},
	plugins: [],
}
