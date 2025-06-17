import { defineConfig as defineTestConfig, mergeConfig } from 'vitest/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

// https://vite.dev/config/
export default mergeConfig(
  defineConfig({
    plugins: [react()],
    base: '/simple-clean-code-project/', // GitHub Pages 저장소 이름에 맞게 설정
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          step1: resolve(__dirname, 'step1.html'),
          step2: resolve(__dirname, 'step2.html'),
          step3: resolve(__dirname, 'step3.html'),
          step4: resolve(__dirname, 'step4.html'),
          step5: resolve(__dirname, 'step5.html'),
        },
      },
    },
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      exclude: ['./tests', './node_modules', './dist'],
    },
  })
);
