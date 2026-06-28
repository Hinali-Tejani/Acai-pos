/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                purple: {
                    DEFAULT: '#4a154b'
                },
                'brand-purple': '#4a154b'
            }
        },
    },
    plugins: [],
};
