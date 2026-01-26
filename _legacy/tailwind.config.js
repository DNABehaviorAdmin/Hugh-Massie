/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./assets/js/**/*.js"],
    theme: {
        extend: {
            colors: {
                navy: '#0f172a',
                accent: '#2dd4bf', /* Teal base */
                'accent-purple': '#a78bfa',
                'accent-blue': '#60a5fa',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'glow': '0 0 40px rgba(45, 212, 191, 0.1)',
            }
        },
    },
    plugins: [],
}
