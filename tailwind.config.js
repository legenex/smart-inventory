/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
  			display: ['"Newsreader"', 'Georgia', 'serif'],
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'var(--bg)',
  			foreground: 'var(--ink)',
  			card: {
  				DEFAULT: 'var(--surface)',
  				foreground: 'var(--ink)'
  			},
  			popover: {
  				DEFAULT: 'var(--surface)',
  				foreground: 'var(--ink)'
  			},
  			primary: {
  				DEFAULT: 'var(--accent)',
  				foreground: 'var(--accentInk)'
  			},
  			secondary: {
  				DEFAULT: 'var(--soft)',
  				foreground: 'var(--ink)'
  			},
  			muted: {
  				DEFAULT: 'var(--soft)',
  				foreground: 'var(--muted)'
  			},
  			accent: {
  				DEFAULT: 'var(--soft)',
  				foreground: 'var(--ink)'
  			},
  			destructive: {
  				DEFAULT: '#EF4444',
  				foreground: '#FFFFFF'
  			},
  			border: 'var(--line)',
  			input: 'var(--line)',
  			ring: 'var(--accent)',
  			chart: {
  				'1': 'var(--accent)',
  				'2': 'var(--soft)',
  				'3': 'var(--muted)',
  				'4': 'var(--ink)',
  				'5': 'var(--line)'
  			},
  			sidebar: {
  				DEFAULT: 'var(--surface)',
  				foreground: 'var(--ink)',
  				primary: 'var(--accent)',
  				'primary-foreground': 'var(--accentInk)',
  				accent: 'var(--soft)',
  				'accent-foreground': 'var(--ink)',
  				border: 'var(--line)',
  				ring: 'var(--accent)'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
