import React from 'react';
import Link from 'next/link';

const DownloadSection: React.FC = () => {
    const advantages = [
        {
            icon: '/icons/computer.png',
            title: 'Ақпараттар',
            description: 'Сайт арқылы қонақтарыңызға қажетті ақпараттармен бөлісіңіз.'
        },
        {
            icon: '/icons/information.png',
            title: 'Қонақтар',
            description: 'Келетін және келмейтін қонақтарыңыз туралы мәлімет алыңыз.'
        },
        {
            icon: '/icons/profits.png',
            title: 'Тиімді',
            description: 'Қағазбен салыстырғанда арзан әрі тез дайындалады.'
        }
    ];

    return (
        <div id="download-section" className="container mx-auto px-5 md:w-4/5">
            <section className="py-16">
                <div className="w-full md:w-4/5 lg:w-3/5 mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
                        Біздің сервисті қолданудың артықшылықтары!
                    </h2>
                    <p className="text-gray-500 text-center text-lg mt-7">
                        Сіз форманы толтыру арқылы тез әрі оңай шақыру сайтын жасай аласыз
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mt-16">
                    {advantages.map((advantage, index) => (
                        <div key={index} className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition duration-300 border border-gray-100">
                            <div className="w-24 h-24 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                                <img
                                    className="w-16 h-16 object-contain"
                                    src={advantage.icon}
                                    alt={advantage.title}
                                    title={advantage.title}
                                />
                            </div>
                            <div className="mb-4 text-xl font-bold text-gray-900">{advantage.title}</div>
                            <p className="text-center text-gray-600 leading-relaxed">
                                {advantage.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default DownloadSection;
