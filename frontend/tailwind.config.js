/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EAEEFE",
          100: "#D4D9FD",
          200: "#A9B3FB",
          300: "#7D8DF8",
          400: "#5267F6",
          500: "#183EC2", // Primary Blue
          600: "#1332A8",
          700: "#0E258E",
          800: "#0A1974",
          900: "#001E80", // Deep Navy
          950: "#010D3E", // Dark Navy
        },
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
          950: "#222222",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "5xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "6xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "7xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-brand":
          "radial-gradient(circle at center, #183EC2 0%, #EAEEFE 100%)",
        "text-gradient": "linear-gradient(to bottom, #000000 0%, #001E80 100%)",
      },
      borderColor: {
        default: "rgba(34, 34, 34, 0.1)",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        "card-hover":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        button: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
