/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': { max: '640px' },

      'md': {max: '767px'},
      
      'lg': {max: '991px'},

      'ls': {max: '1024px'},
      'll': {min: '1440px'},

      'xl': {max: '1460px'},
    },
    extend: {
      boxShadow: {
        'custom-1px': '0 0 1px 0 rgba(0, 0, 0, 0.5)',
        'custom-sm': '0 5px 7px rgba(0, 0, 0, 0.15)',
        'custom-md': '0 8px 20px rgba(0, 0, 0, 0.2)',
        'custom-lg': '0 12px 25px rgba(0, 0, 0, 0.25)',
        'custom-xl': '0 15px 30px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
