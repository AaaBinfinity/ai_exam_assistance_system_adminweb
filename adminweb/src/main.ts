
import App from './App.vue';
import router from './router'; // 导入路由
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createApp } from 'vue';
import { ElImage, ElInput } from 'element-plus';
const app = createApp(App);
app.use(ElementPlus);

app.use(router);  // 使用 Vue Router
app.mount('#app');
