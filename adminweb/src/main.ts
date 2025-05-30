// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/el-message.css';
import { setFavicon } from './utils/setFavicon';
const app = createApp(App);
const appTitle = import.meta.env.VITE_APP_TITLE;
const faviconPath = import.meta.env.VITE_APP_FAVICON;

// 设置初始标题和 favicon
document.title = appTitle;
setFavicon(faviconPath);

// 注册插件
app.use(ElementPlus);
app.use(router);

app.mount('#app');
