import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/


// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     proxy: {
//       '/coding': {
//         target: 'http://localhost:8001',
//         changeOrigin: true,
//         secure: false,
//       },
//     }
//   },
// })


const backendURL = "https://coding-contest-8pre.onrender.com/"
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/coding': {
        target: backendURL,
        changeOrigin: true,
        secure: false,
      },
    }
  },
})



