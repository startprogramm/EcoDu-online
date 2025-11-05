import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        login: 'login.html',
        register: 'register.html',
        plastik: 'plastik-ifloslanish.html',
        ormonlar: 'o\'rmonlar-kesilishi.html',
        havo: 'havo-ifloslanishi.html',
        suv: 'suv-ifloslanishi.html',
        yovvyi: 'yovvyi-tabiat.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
