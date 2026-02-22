import React from 'react';

const StepsSection: React.FC = () => {
    const steps = [
        {
            id: 1,
            title: 'Шаблон таңдаңыз',
            description: 'Таңдалған шаблонның мәтінін өз қалауыңызша өзгертіңіз'
        },
        {
            id: 2,
            title: 'Форманы толтырыңыз',
            description: 'Қонақтарға көрсеткіңіз келетін ақпаратты енгізіңіз'
        },
        {
            id: 3,
            title: 'Қонақтарға шақырту жіберіңіз',
            description: 'Жеке кабинетте әлеуметтік желілер арқылы қонақтарды шақырыңыз'
        }
    ];

    return (
        <div className="container mx-auto px-5 py-20 lg:py-28">
            <div className="max-w-xl mb-16 md:mx-auto text-center lg:max-w-2xl">
                <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">
                    Бұл сіз ойлағаннан да оңай
                </h2>
                <p className="text-lg text-gray-600">
                    Интуитивті түсінікті интерфейс
                </p>
            </div>

            <div className="grid gap-12 row-gap-8 lg:grid-cols-3">
                {steps.map((step) => (
                    <div key={step.id} className="text-center group">
                        <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6 transition-transform duration-500 group-hover:scale-110">
                            <div className="absolute inset-0 bg-indigo-100 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <span className="relative text-5xl font-extrabold text-indigo-600">
                                {step.id}
                            </span>
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-gray-900">{step.title}</h3>
                        <p className="max-w-xs mx-auto text-gray-600 leading-relaxed">
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StepsSection;
