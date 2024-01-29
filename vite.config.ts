import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const baseUrl = process.env.BASE_URL ?? "/"

// https://vitejs.dev/config/
export default defineConfig({
  base: baseUrl.startsWith("/") ? baseUrl : `/${baseUrl}`,
  plugins: [react()],
})
