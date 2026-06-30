/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: '#0f0f17',
        neon: {
          pink: '#FF10F0',
          blue: '#00E5FF',
          magenta: '#FF2CFB',
          hotpink: '#FF1493',
          cyan: '#00E5FF',
          lime: '#C3FF00',
          violet: '#7C4DFF',
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(255,16,240,0.5), 0 0 40px rgba(0,229,255,0.4)',
        'glow-strong': '0 0 40px rgba(255,16,240,0.5), 0 0 80px rgba(0,229,255,0.5)',
        'neon-pink': '0 0 15px rgba(255,16,240,0.6), 0 0 30px rgba(0,229,255,0.4)',
        'neon-pink-glow': '0 0 25px rgba(255,16,240,0.8), 0 0 50px rgba(0,229,255,0.5)',
        'neon-purple': '0 0 20px rgba(138,43,226,0.5), 0 0 40px rgba(138,43,226,0.35), 0 0 60px rgba(138,43,226,0.2)',
        'neon-purple-hover': '0 0 28px rgba(138,43,226,0.6), 0 0 50px rgba(138,43,226,0.45), 0 0 80px rgba(138,43,226,0.3)',
      },
      backgroundImage: {
        'grid-faint': 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
        'neon-gradient': 'linear-gradient(135deg, rgba(255,16,240,0.3), rgba(0,229,255,0.25) 50%, rgba(255,44,251,0.2))',
      },
      animation: {
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'sheen': 'sheen 2s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'neon-flicker': 'neon-flicker 3s ease-in-out infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        sheen: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,16,240,0.5), 0 0 30px rgba(0,229,255,0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(255,16,240,0.8), 0 0 50px rgba(0,229,255,0.6)' }
        },
        'neon-flicker': {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1', textShadow: '0 0 10px rgba(255,16,240,0.8), 0 0 20px rgba(0,229,255,0.6)' },
          '20%, 24%, 55%': { opacity: '0.9', textShadow: '0 0 5px rgba(255,16,240,0.5)' }
        },
        'neon-pulse': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(255,16,240,0.6), 0 0 30px rgba(0,229,255,0.4)' },
          '50%': { boxShadow: '0 0 25px rgba(255,16,240,0.9), 0 0 50px rgba(0,229,255,0.6)' }
        }
      }
    },
  },
  plugins: [],
}


