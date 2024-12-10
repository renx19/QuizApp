import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        // Warning threshold for chunk size (in KB)
        chunkSizeWarningLimit: 600, // Warn if any chunk exceeds 500 KB

        // Maximum chunk size (in bytes)
        // You can also use 'maxChunkSize' to split chunks if a chunk exceeds the size limit
        maxChunkSize: 1000000, // Set maximum chunk size to 1 MB (adjust as needed)
    },
})