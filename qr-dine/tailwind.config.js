/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        orange: {
          500: "#ff9800",
          600: "#e65100",
          700: "#ff6f00",
        },
        amber: {
          200: "#ffd54f",
          300: "#ffb74d",
          400: "#ffb300",
        },
        warm: {
          50: "#fff7ed",
          100: "#fffde7",
          200: "#ffe0b2",
          300: "#fff3e0",
        },
        green: {
          300: "#81c784",
          500: "#43ea5e",
          600: "#43a047",
          700: "#388e3c",
        },
        red: {
          600: "#e74c3c",
        },
        gray: {
          100: "#f5f5f5",
          400: "#bdbdbd",
          500: "#888888",
        },
      },
      fontFamily: {
        sans: ["Monsterat"],
      },
      animation: {
        fadeInBg: "fadeInBg 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
        popIn: "popIn 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
        slideDown: "slideDown 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
        fadeInSection: "fadeInSection 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        foodCardPop: "foodCardPop 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
        fadeInModal: "fadeInModal 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        slideUp: "slideUp 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
        confirmGlow: "confirmGlow 2.5s infinite alternate",
        toastPop: "toastPop 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        thankyouPop: "thankyouPop 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
        thankyouBounce: "thankyouBounce 1.2s infinite alternate",
        waiterBgAnim: "waiterBgAnim 12s ease-in-out infinite alternate",
        statsGlow: "statsGlow 2.5s infinite alternate",
        pulseText: "pulseText 1.2s infinite alternate",
        spin: "spin 1s linear infinite",
      },
      keyframes: {
        fadeInBg: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        popIn: {
          "0%": { transform: "scale(0.92)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-60px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeInSection: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        foodCardPop: {
          "0%": { transform: "scale(0.97)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        fadeInModal: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(60px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        confirmGlow: {
          "0%": { filter: "brightness(1) drop-shadow(0 0 0 #43ea5ecc)" },
          "100%": { filter: "brightness(1.1) drop-shadow(0 0 16px #43ea5ecc)" },
        },
        toastPop: {
          "0%": { transform: "translateY(-40px) scale(0.8)", opacity: "0" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        thankyouPop: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        thankyouBounce: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-12px)" },
        },
        waiterBgAnim: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        statsGlow: {
          "0%": { boxShadow: "0 2px 8px #ffe0b2" },
          "100%": { boxShadow: "0 2px 24px #ff9800cc" },
        },
        pulseText: {
          "0%": { opacity: "0.7" },
          "100%": { opacity: "1" },
        },
        spin: {
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },
  plugins: [],
};