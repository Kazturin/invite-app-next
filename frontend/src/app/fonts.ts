import localFont from 'next/font/local';

export const roboto = localFont({
    src: [
        {
            path: '../../public/fonts/Roboto-Regular.ttf',
            weight: '400',
            style: 'normal',
        },
    ],
    variable: '--font-roboto',
    display: 'swap',
});

// Decorative fonts are now managed directly in globals.css via @font-face 
// to support legacy classes like .ql-font-Mon without preloading issues.
