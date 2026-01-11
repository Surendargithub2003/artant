/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                // Strict monochrome
                primary: '#000000',
                secondary: '#333333',
                background: '#ffffff',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                marquee: 'marquee 25s linear infinite',
                'float-slow': 'float 6s ease-in-out infinite',
                'float-medium': 'float 5s ease-in-out infinite',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
