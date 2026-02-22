import React from 'react';

const FooterSection: React.FC = () => {
    return (
        <footer className="bg-indigo-600 h-20 flex items-center justify-center">
            <div className="uppercase font-bold text-white tracking-widest text-sm">
                &copy; {new Date().getFullYear()} toi-invite.kz
            </div>
        </footer>
    );
};

export default FooterSection;
