import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Lodisna-inspired brand tokens (single source of truth)
        brand: {
          navy: '#011C4D',
          ink: '#0A1326',
          red: '#F32735',
          redInk: '#C61F2C',
          bone: '#F4F1EB',
          paper: '#FFFFFF',
          rule: 'rgba(1,28,77,0.10)',
          ruleStrong: 'rgba(1,28,77,0.18)',
          ruleDark: 'rgba(255,255,255,0.10)',
          mute: 'rgba(1,28,77,0.55)',
          muteDark: 'rgba(244,241,235,0.55)',
        },
        // Mode dot palette — distinguishable but harmonized
        mode: {
          air: '#011C4D',
          sea: '#1F4FA8',
          road: '#F32735',
          ecom: '#5A6F94',
          courier: '#0A1326',
        },
        // Legacy semantic tokens remapped onto brand palette so existing
        // pages inherit the new look without per-file rewrites.
        surface: {
          canvas: '#F4F1EB', // bone
          card: '#FFFFFF',
          elevated: '#FFFFFF',
          inverse: '#0A1326', // ink
        },
        border: {
          subtle: 'rgba(1,28,77,0.10)',
          strong: 'rgba(1,28,77,0.18)',
        },
        text: {
          primary: '#011C4D',
          secondary: 'rgba(1,28,77,0.70)',
          muted: 'rgba(1,28,77,0.50)',
          inverse: '#F4F1EB',
        },
      },
      fontFamily: {
        sans: ['Switzer', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Switzer', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        // Sharper, editorial radii. Tailwind defaults still available.
        md: '6px',
      },
      letterSpacing: {
        eyebrow: '0.18em',
        micro: '0.16em',
      },
      fontSize: {
        // Working sizes — NOT hero scale.
        'display-xl': ['42px', { lineHeight: '1.04', letterSpacing: '-0.01em', fontWeight: '300' }],
        'display-lg': ['30px', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '300' }],
        'display-md': ['22px', { lineHeight: '1.2', letterSpacing: '-0.005em', fontWeight: '400' }],
        'body-lg': ['15px', { lineHeight: '1.5', fontWeight: '400' }],
        body: ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '1.4', fontWeight: '400' }],
        eyebrow: ['11px', { lineHeight: '1', letterSpacing: '0.18em', fontWeight: '700' }],
        micro: ['10px', { lineHeight: '1', letterSpacing: '0.16em', fontWeight: '700' }],
      },
    },
  },
  plugins: [],
} satisfies Config;
