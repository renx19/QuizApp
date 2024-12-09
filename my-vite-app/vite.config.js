import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/Quiz-App/my-vite-app', // Ensure this is set to the root
})