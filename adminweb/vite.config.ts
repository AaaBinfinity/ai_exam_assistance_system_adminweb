import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// 获取当前文件的路径
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // 使用 @ 代表 src 目录
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: true,
    hmr: {
      overlay: false
    }
  }
});
