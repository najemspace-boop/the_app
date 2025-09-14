import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    
    // Add this line to include HeroUI components
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        glass: {
          DEFAULT: "var(--glass-border-light)",
          strong: "var(--glass-border-light-strong)",
          subtle: "var(--glass-border-light-subtle)",
        },
        'glass-light': {
          DEFAULT: "rgba(255, 255, 255, 0.25)",
          strong: "rgba(255, 255, 255, 0.35)",
          subtle: "rgba(255, 255, 255, 0.15)",
        },
        'glass-dark': {
          DEFAULT: "rgba(15, 23, 42, 0.12)",
          strong: "rgba(15, 23, 42, 0.20)",
          subtle: "rgba(15, 23, 42, 0.06)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backdropBlur: {
        'glass': '16px',
        'glass-subtle': '8px',
        'glass-strong': '24px',
        'glass-intense': '32px',
      },
      boxShadow: {
        'glass': 'var(--glass-shadow-light)',
        'glass-strong': 'var(--glass-shadow-light-strong)',
        'glass-subtle': 'var(--glass-shadow-light-subtle)',
        'glass-light': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'glass-light-strong': '0 12px 40px rgba(0, 0, 0, 0.18)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.25)',
        'glass-dark-strong': '0 12px 40px rgba(0, 0, 0, 0.35)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "glass-shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glass-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.02)" },
        },
        "glass-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glass-shimmer": "glass-shimmer 2s infinite",
        "glass-pulse": "glass-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glass-float": "glass-float 3s ease-in-out infinite",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui(), require("tailwindcss-animate")],
};