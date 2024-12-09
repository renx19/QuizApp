import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        // Increase the chunk size warning limit
        chunkSizeWarningLimit: 3000, // Size in kB (adjust as needed)

        rollupOptions: {
            output: {
                // Use manual chunks to split heavy dependencies
                manualChunks: {
                    react: ['react', 'react-dom'], // Creates a separate chunk for React
                },
            },
        },
    },
});