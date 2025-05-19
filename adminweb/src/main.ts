// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/el-message.css';

const app = createApp(App);

// 注册插件（顺序很重要）
app.use(ElementPlus);
app.use(router);

app.mount('#app');
