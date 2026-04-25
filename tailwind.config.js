/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#B76E79', // Rose Gold / Blush
          light: '#D4A5AF',   // Soft Pink
          dark: '#8C505A',    // Deep Rose
        },
        secondary: {
          DEFAULT: '#FDFBF9', // Warm Cream
          light: '#FFFFFF',   // Pure White
          dark: '#EADDD7',    // Warm Sand
        },
        status: {
          success: '#9EAD8C', 
          error: '#D27D77',   
          warning: '#DDBA82', 
          info: '#9CB4BD',    
        },
        neutral: {
          50: '#FFFFFF',      // Pure White
          100: '#FDFBF9',     // Minimal Cream
          200: '#F0E8E6',     // Soft Taupe Border
          600: '#8A7E7C',     // Muted Text
          800: '#4A3F3D',     // Body Text
          900: '#2D2422',     // Darkest Espresso (Headings)
        },
        // Backward compatibility mapped to the new elegant palette
        bgBase:     '#FDFBF9', 
        bgSurface:  '#FFFFFF', 
        bgElevated: '#FFFFFF', 
        accent:     '#B76E79', 
        accentDeep: '#8C505A', 
        accentGlow: '#F0E8E6', 
        gold:       '#CBA135', // Elegant soft gold
        goldLight:  '#EEDFA4', 
        textMain:   '#2D2422', 
        textBody:   '#4A3F3D', 
        textMuted:  '#8A7E7C', 
        textLight:  '#F0E8E6', 
        borderSoft: '#F0E8E6', 
        borderMed:  '#EADDD7', 
      },

      fontFamily: {
        sans:  ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'], // High-end editorial serif
      },

      borderRadius: {
        soft: '8px',  // Beautiful, gentle curves (removed the harsh 2px)
        lg:   '12px',
        xl:   '16px',
        full: '9999px',
      },

      boxShadow: {
        card: '0 4px 14px rgba(183, 110, 121, 0.04)', // Tinted rose gold shadow
        'card-hover': '0 10px 25px rgba(183, 110, 121, 0.1)',
        modal: '0 20px 40px -5px rgba(45, 36, 34, 0.08)',
      },

      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(183, 110, 121, 0)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(183, 110, 121, 0.15)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },

      animation: {
        'fade-in':    'fadeIn 0.5s ease-out forwards',
        'slide-up':   'slideUp 0.6s ease-out forwards',
        'scale-in':   'scaleIn 0.4s ease-out forwards',
        'shimmer':    'shimmer 2s linear infinite',
        'pulse-gold': 'pulseGold 2.5s ease-in-out infinite',
        'float':      'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};