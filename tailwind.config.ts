import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],

  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],

  prefix: "",

  // ✅ SAFELIST
  safelist: [
    "bg-gradient-to-r",
    // Keep existing safelist or update as needed for the new category colors if used dynamically
    "from-purple-500", "to-pink-500",
    "from-orange-500", "to-amber-500",
    "from-blue-500", "to-cyan-500",
    "from-pink-500", "to-rose-500",
    "from-green-500", "to-emerald-500",
    "from-yellow-500", "to-orange-500",
    "from-cyan-500", "to-blue-500",
    "from-red-500", "to-rose-600",
    "from-amber-700", "to-yellow-600",
    "from-green-600", "to-lime-500",
    "from-orange-500", "to-red-500",
    "from-sky-400", "to-blue-300",
  ],

  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },

    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Outfit", "sans-serif"],
        telugu: ["Noto Sans Telugu", "Inter", "sans-serif"],
        hindi: ["Noto Sans Devanagari", "Inter", "sans-serif"],
      },

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

        // Category colors
        category: {
          clothing: "hsl(var(--clothing-color))",
          utensils: "hsl(var(--utensils-color))",
          electronics: "hsl(var(--electronics-color))",
          makeup: "hsl(var(--makeup-color))",
          food: "hsl(var(--food-color))",
          snacks: "hsl(var(--snacks-color))",
          drinks: "hsl(var(--drinks-color))",
          meat: "hsl(var(--meat-color))",
          chocolate: "hsl(var(--chocolate-color))",
          vegetables: "hsl(var(--vegetables-color))",
          fruits: "hsl(var(--fruits-color))",
          dairy: "hsl(var(--dairy-color))",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },

      boxShadow: {
        fresh: "var(--shadow-md)",
        glow: "var(--shadow-glow)",
        "card-hover": "var(--shadow-card-hover)",
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(100%)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
      },
    },
  },

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;