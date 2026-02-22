import { Quill } from '@vueup/vue-quill';

const Font = Quill.import('formats/font');

// Whitelist of fonts
Font.whitelist = [
    'vAcade', 'Mon', 'Balmoral', 'RosaMarena',
    'Baltica', 'Vivaldi', 'Boyarsky', 'Taurus', 'Cooper',
    'Downtown', 'Poster', 'Bernn', 'Handel'
];

// Register custom Font format
Quill.register(Font, true);

export const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // standard buttons
    [{ font: Font.whitelist }], // font selection
    [{ size: ['small', false, 'large', 'huge'] }], // font size
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // headers
    [{ color: [] }, { background: [] }], // text and background color
    [{ align: [] }], // alignment
    ['clean'], // remove formatting
];

export { Font };
