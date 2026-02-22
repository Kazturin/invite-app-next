import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        laravel(['resources/admin/app.js', 'resources/admin/app.css', 'resources/js/app.js']),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        tailwindcss(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('fabric')) {
                            return 'fabric';
                        }
                        if (id.includes('leaflet')) {
                            return 'maps';
                        }
                        if (id.includes('chart')) {
                            return 'charts';
                        }
                        if (id.includes('vue') || id.includes('router') || id.includes('vuex') || id.includes('i18n')) {
                            return 'vendor-vue';
                        }
                        if (id.includes('@headlessui') || id.includes('@heroicons')) {
                            return 'vendor-ui';
                        }
                        return 'vendor';
                    }
                }
            }
        }
    },
    resolve: {
        alias: {
            $public: resolve(__dirname, 'public'),
            $fonts: resolve(__dirname, 'public/fonts')
        }
    },
});
