import { Quill } from 'react-quill-new';

const Font = Quill.import('formats/font') as any;

Font.whitelist = [
    'vAcade', 'Mon', 'Balmoral', 'RosaMarena',
    'Baltica', 'Vivaldi', 'Boyarsky', 'Taurus', 'Cooper',
    'Downtown', 'Poster', 'Bernn', 'Handel'
];

Quill.register(Font, true);

export const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    [{ font: Font.whitelist }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ['clean'],
];

export { Font };
