import { createApp } from 'vue';
import App from './App.vue'
// pinia
import { createPinia } from 'pinia'
const pinia = createPinia()
//引入echarts
import * as echarts from 'echarts';
//ant-design-vue
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
// 路由
import router from './routes/index'
// elementPlus中文配置
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(App)
//放入全局
app.config.globalProperties.$echarts = echarts
app.use(router)
app.use(pinia)
app.use(Antd)
app.use(ElementPlus, {
    locale: zhCn,
})
app.mount('#app')