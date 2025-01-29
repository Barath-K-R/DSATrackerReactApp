/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
  extend: {
    colors: {
      customGray: "#2f3136",
      customDark: "#202225",
      easy: "#00ac5e",
      medium: "#feba00",
      hard: "#e82e54",
    },
    boxShadow: {
      glow: '0 0 10px rgba(255, 255, 255, 0.8)',
    }
  },
};
export const plugins = [];
