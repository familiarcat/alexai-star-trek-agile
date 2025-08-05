/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Star Trek LCARS colors
        lcars: {
          orange: '#FF6B35',
          red: '#D7263D',
          purple: '#7209B7',
          blue: '#4361EE',
          green: '#4CC9F0',
          yellow: '#F72585',
        },
        // Enterprise dashboard colors
        enterprise: {
          primary: '#1E40AF',
          secondary: '#7C3AED',
          accent: '#059669',
          warning: '#D97706',
          danger: '#DC2626',
          success: '#16A34A',
        },
      },
      animation: {
        'lcars-pulse': 'lcars-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'lcars-scan': 'lcars-scan 3s linear infinite',
        'lcars-glow': 'lcars-glow 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        'lcars-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'lcars-scan': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'lcars-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 5px currentColor',
          },
          '50%': { 
            boxShadow: '0 0 20px currentColor, 0 0 30px currentColor',
          },
        },
        'fadeIn': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slideUp': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slideDown': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'scaleIn': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'enterprise-gradient': 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 50%, #059669 100%)',
        'lcars-gradient': 'linear-gradient(45deg, #FF6B35, #D7263D, #7209B7, #4361EE)',
      },
      fontFamily: {
        'lcars': ['Orbitron', 'monospace'],
        'enterprise': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'lcars': '0 0 20px rgba(67, 97, 238, 0.3)',
        'enterprise': '0 4px 20px rgba(30, 64, 175, 0.15)',
        'holographic': '0 0 30px rgba(124, 58, 237, 0.4)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
} 