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

export const baltica = localFont({
    src: '../../public/fonts/Baltica KZ.ttf',
    variable: '--font-baltica',
    display: 'swap',
});

// Primary decorative font used in many places
export const mon = localFont({
    src: '../../public/fonts/KZ_Mon_Amour_One.ttf',
    variable: '--font-mon',
    display: 'swap',
});

export const academy = localFont({
    src: '../../public/fonts/vAcade.ttf',
    variable: '--font-academy',
    display: 'swap',
});

export const vivaldi = localFont({
    src: '../../public/fonts/KZ_Vivaldi.ttf',
    variable: '--font-vivaldi',
    display: 'swap',
});

// Note: Other fonts can be loaded on-demand if needed, 
// but we optimize the ones used in the main layout/hero first.
