import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import icon1 from './src/assets/android-launchericon-192-192.png'
import icon2 from './src/assets/android-launchericon-512-512.png'
import icon3 from './src/assets/512.png'
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Quiz App',
                short_name: 'Quiz App',
                description: 'Quiz App',
                theme_color: '#ffffff',
                background_color: '#ffffff',
                display: 'standalone',
                icons: [{
                        // src: '/android-launchericon-192-192.png',
                        src: icon1,
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        // src: '/android-launchericon-512-512.png',
                        src: icon2,
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {

                        // src: '/512.png',
                        src: icon3,
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
            },
        }),
    ],
    build: {
        rollupOptions: {
            // You can add custom rollup options here
            output: {
                manualChunks(id) {
                    // Adjust chunk splitting logic if necessary
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                },
            },
        },
    },
});