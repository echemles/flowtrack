import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mode: {
          air: '#3B82F6',
          sea: '#0EA5E9',
          road: '#F59E0B',
          ecom: '#A855F7',
          courier: '#10B981',
        },
        surface: {
          canvas: '#F8FAFC',
          card: '#FFFFFF',
          elevated: '#FFFFFF',
          inverse: '#0B1220',
        },
        border: {
          subtle: '#E5E7EB',
          strong: '#CBD5E1',
        },
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
          inverse: '#F8FAFC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
