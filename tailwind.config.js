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
          300: '#9FE2BA',  // Medium light
          400: '#65C466',  // Active states, medium green
          500: '#3D6B5C',  // PRIMARY - Buttons, dark green
          600: '#325A4B',  // Hover dark
          700: '#284739',  // Deeper dark
          800: '#1E3428',  // Very dark
          900: '#142217',  // Almost black
        },
        // Lime Accent (for highlights and special elements)
        accent: {
          100: '#F4FCE3',  // Very light lime
          200: '#E8F5BA',  // Light lime
          300: '#D9F99D',  // Medium lime
          400: '#BEF264',  // Bright lime
          500: '#A3E635',  // PRIMARY ACCENT - Budget, highlights
          600: '#84CC16',  // Darker lime
        },
        // Neutral Grays
        neutral: {
          50: '#F9FAFB',   // Almost white
          100: '#F5F5F5',  // Page background
          200: '#E5E7EB',  // Borders
          300: '#D1D5DB',  // Disabled
          400: '#9CA3AF',  // Placeholder
          500: '#718096',  // Text light
          600: '#4A5568',  // Text medium
          700: '#2D3748',  // Text dark
          800: '#1A202C',  // Headings
          900: '#111827',  // Almost black
        },
      },
      borderRadius: {
        '4xl': '2rem',    // 32px
        '5xl': '2.5rem',  // 40px - for very large cards
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'strong': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}