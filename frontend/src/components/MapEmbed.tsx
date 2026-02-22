'use client';

import React, { useState, useMemo } from 'react';

interface MapEmbedProps {
    url?: string;
}

const MapEmbed: React.FC<MapEmbedProps> = ({ url: initialUrl = '' }) => {
    const [inputUrl, setInputUrl] = useState(initialUrl);

    const embedUrl = useMemo(() => {
        if (!inputUrl) return null;

        const url = inputUrl.trim();

        // Яндекс.Карты
        if (url.includes('yandex.kz/maps') || url.includes('yandex.ru/maps')) {
            const llMatch = url.match(/ll=([\d.-]+)%2C([\d.-]+)/);
            const zMatch = url.match(/z=(\d+)/);

            if (llMatch && zMatch) {
                // const ll = `${llMatch[1]}%2C${llMatch[2]}`;
                // const z = zMatch[1];
                // Using a static example widget or trying to construct from LL
                // The original code had a hardcoded widget URL for one case
                // return `https://yandex.kz/maps/-/CHvCvUpI`; 
            }

            const coordsMatch = url.match(/~?([\d.]+),([\d.]+)/);
            if (coordsMatch) {
                const ll = `${coordsMatch[1]}%2C${coordsMatch[2]}`;
                return `https://yandex.kz/map-widget/v1/?ll=${ll}&z=15`;
            }

            // Fallback for yandex maps if it's already a widget-like URL
            if (url.includes('yandex.kz/map-widget')) return url;
        }

        // 2ГИС: пытаемся вытащить firm_id
        if (url.includes('2gis.ru') || url.includes('2gis.kz')) {
            const idMatch = url.match(/geo\/(\d{10,})/);
            if (idMatch) {
                return `https://widgets.2gis.com/widget?type=firm&firm_id=${idMatch[1]}`;
            }
            // Check for direct widget link
            if (url.includes('widgets.2gis.com')) return url;
        }

        return null;
    }, [inputUrl]);

    return (
        <div className="space-y-4 w-full">
            {!initialUrl && (
                <input
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    type="url"
                    placeholder="Яндекс.Карта немесе 2ГИС сілтемесін қойыңыз"
                    className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-amber-500"
                />
            )}

            {embedUrl ? (
                <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
                    <iframe
                        src={embedUrl}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allowFullScreen
                        title="Event Location Map"
                    ></iframe>
                </div>
            ) : (
                inputUrl && !initialUrl && <div className="text-red-600 text-sm">Бұл сілтеме бойынша картаны көрсету мүмкін емес.</div>
            )}
        </div>
    );
};

export default MapEmbed;
