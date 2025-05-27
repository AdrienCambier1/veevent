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
        "primary-blue": "#3b32ff",
        "secondary-blue": "#171291",
        "third-blue": "#1e1a78",
        "primary-green": "#20ff00",
        background: "#f7f7f7",
      },
    },
  },
  plugins: [],
};
