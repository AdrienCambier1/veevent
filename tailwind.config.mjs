/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EBF1FF",
          100: "#DBE4FF",
          200: "#BECEFF",
          300: "#97ACFF",
          400: "#6E7EFF",
          500: "#4C52FF",
          600: "#3B32FF", // couleur principale
          700: "#2D20E2",
          800: "#241DB6",
          900: "#23208F",
          950: "#161353",
        },
        secondary: {
          50: "#EBFFE4",
          100: "#D1FFC4",
          200: "#A6FF90",
          300: "#6CFF50",
          400: "#20FF00", // couleur secondaire
          500: "#17E600",
          600: "#00B807",
          700: "#0A8B00",
          800: "#0D6D07",
          900: "#0F5C0B",
          950: "#003400",
        },
        background: "#f7f7f7",
      },
    },
  },
  plugins: [],
};
