/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // OrgManager Green Palette
        primary: {
          50: '#F0F9F4',   // Lightest green tint
          100: '#E6F7ED',  // Light green backgrounds
          200: '#C8EDD6',  // Subtle highlights
          300: '#e8f0e9',  // Medium light #e8f0e9
          400: '#65C466',  // Active states, medium green
          500: '#2D5A43',  // PRIMARY - Buttons, dark green
          600: '#325A4B',  // Hover dark
          700: '#284739',  // Deeper dark
          800: '#1E3428',  // Very dark
          900: '#142217',  // Almost black
        },
        // Lime Accent (for highlights and special elements)
        accent: {
          100: '#F4FCE3',
          200: '#E8F5BA',
          300: '#D9F99D',
          400: '#BEF264',
          500: '#A3E635',
          600: '#84CC16',
        },
        // Neutral Grays
        neutral: {
          50:  '#F9FAFB',   // Almost white
          100: '#F7FAF7',  // Page background
          200: '#E5E7EB',  // Borders
          300: '#D1D5DB',  // Disabled
          400: '#9CA3AF',  // Placeholder
          500: '#81998D',  // Text light
          600: '#336C51',  // Text medium
          700: '#336C51',  // Text dark
          800: '#2D5A43 ',  // Headings
          900: '#2D6348',  // Almost black
        },
        card: '#FFFFFF',
      },
      borderRadius: {
        '4xl': '2rem',    // 32px
        '5xl': '2.5rem',  // 40px - for very large cards
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.06)',
        'strong': '0 10px 25px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}