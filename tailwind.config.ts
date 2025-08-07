import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // LCARS Design System Colors
        'lcars-gold': '#FF9C00',
        'lcars-orange': '#FF6B35',
        'lcars-purple': '#CC99CC',
        'lcars-lavender': '#E6CCE6',
        'lcars-blue': '#6699CC',
        'lcars-light-blue': '#99CCFF',
        'lcars-dark-blue': '#336699',
        'lcars-black': '#000000',
        'lcars-dark-grey': '#1A1A1A',
        'lcars-grey': '#666666',
        'lcars-light-grey': '#CCCCCC',
        'lcars-white': '#FFFFFF',
        'lcars-red': '#CC6666',
        'lcars-green': '#66CC66',
        'lcars-yellow': '#CCCC66',
        
        // Background and text colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'lcars': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'lcars-xs': 'var(--lcars-font-size-xs)',
        'lcars-sm': 'var(--lcars-font-size-sm)',
        'lcars-base': 'var(--lcars-font-size-base)',
        'lcars-lg': 'var(--lcars-font-size-lg)',
        'lcars-xl': 'var(--lcars-font-size-xl)',
        'lcars-2xl': 'var(--lcars-font-size-2xl)',
        'lcars-3xl': 'var(--lcars-font-size-3xl)',
        'lcars-4xl': 'var(--lcars-font-size-4xl)',
      },
      spacing: {
        'lcars-1': 'var(--lcars-spacing-1)',
        'lcars-2': 'var(--lcars-spacing-2)',
        'lcars-3': 'var(--lcars-spacing-3)',
        'lcars-4': 'var(--lcars-spacing-4)',
        'lcars-6': 'var(--lcars-spacing-6)',
        'lcars-8': 'var(--lcars-spacing-8)',
        'lcars-12': 'var(--lcars-spacing-12)',
        'lcars-16': 'var(--lcars-spacing-16)',
      },
      boxShadow: {
        'lcars-sm': 'var(--lcars-shadow-sm)',
        'lcars-md': 'var(--lcars-shadow-md)',
        'lcars-lg': 'var(--lcars-shadow-lg)',
        'lcars-xl': 'var(--lcars-shadow-xl)',
      },
      animation: {
        'lcars-pulse': 'lcars-pulse 2s infinite',
        'lcars-slide-in': 'lcars-slide-in 0.5s ease-out',
        'lcars-glow': 'lcars-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'lcars-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'lcars-slide-in': {
          'from': {
            transform: 'translateX(-100%)',
            opacity: '0',
          },
          'to': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'lcars-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 5px var(--lcars-gold)' 
          },
          '50%': { 
            boxShadow: '0 0 20px var(--lcars-gold), 0 0 30px var(--lcars-gold)' 
          },
        },
      },
    },
  },
  plugins: [],
};

export default config; 