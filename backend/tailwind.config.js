/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

export default {

    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.vue",
    ],
    theme: {
        container: {
            screens: {
                // 'xs': '390px',
                'sm': '640px',
                'md': '768px',
                'lg': '1024px',
                'xl': '1280px',
            }
        },
        extend: {
            keyframes: {
                'fade-in-down': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(-20px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    },
                },
                'fade-in-up': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateX(-20px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateX(0)'
                    },
                }
            },
            animation: {
                'fade-in-down': 'fade-in-down 0.6s ease-out',
                'fade-in-up': 'fade-in-up 0.6s ease-out'
            },
            backgroundImage: {
                'hero-pattern': "linear-gradient(270deg,#fafafa 0,hsla(0,0%,98%,0))",
                //    'hero-pattern-l': "linear-gradient(0.25turn, #ffffff 0, #dbdbdb, hsla(0,0%,102%,0))"
                'hero-pattern-l': "linear-gradient(0.25turn, #ffffff 0, #c7c7c7, hsla(0,0%,102%,0))",
            },
            colors: {
                danger: colors.rose,
                primary: colors.purple,
                success: colors.green,
                warning: colors.yellow,
                custom: colors.purple,
                'light-blue': '#396195',
                'strong-blue': '#0c1c56',
                "theme-primary": "rgb(2, 132 ,199)",
                "theme-secondary": "#CB997E",
                "theme-grayish-blue": "#9194A1",
                "theme-dark-blue": "rgb(37, 43, 70)",
                "theme-dark-blue-tp": "rgba(37, 43, 70, 0.9)",
            },
            fontFamily: {
                academy: ["vAcade"],
                mon: ["Mon"],
                balmoral: ["Balmoral"],
                marena: ["RosaMarena"],
                russoOne: ["'RussoOne-Regular' , sans-serif"],
                baltica: ["Baltica"],
                vivaldi: ["Vivaldi"],
                boyarsky: ["Boyarsky"],
                taurus: ["Taurus"],
                cooper: ["Cooper"],
                downtown: ["Downtown"],
                stars: ["TimpaniStars"],
                blondie: ["SanasoftBlondie"],
                poster: ["Poster"],
                bernn: ["Bernn"],
                handel: ["Handel"],
            },
        },
    },
    safelist: [
        'font-academy',
        'font-mon',
        'font-balmoral',
        'font-marena',
        'font-russoOne',
        'font-baltica',
        'font-vivaldi',
        'font-boyarsky',
        'font-taurus',
        'font-cooper',
        'font-downtown',
        'font-stars',
        'font-blondie',
        'font-poster',
        'font-bernn',
        'font-handel',
    ],
    plugins: [
    ],
}

