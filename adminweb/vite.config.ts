import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';  // 引入 fileURLToPath
import { dirname, resolve } from 'path';  // 引入 dirname 和 resolve

// 获取当前文件的路径
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),  // 让 @ 指向 src 目录
    },
  },
});
