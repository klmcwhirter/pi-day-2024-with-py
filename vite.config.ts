import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import solidPlugin from 'vite-plugin-solid';
// import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [
    // basicSsl(),

    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
  ],
  server: {
    host: '0.0.0.0',
    port: 9000,
    // https: true,
  },
  build: {
    target: 'esnext',
  },
});
