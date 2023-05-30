import axios from 'axios'
import { removeToken } from './token';
import router from '@/routes';


// 统一判断是否携带token
function needToken(config) {
    if (config.url.indexOf('mainContent') == -1 && config.url.indexOf('search') == -1 && config.url.indexOf('playMusic') == -1) {
        return true;
    }
    return false;
}

// 创建axios实例
const request = axios.create({
    baseURL: 'http://43.143.220.188:3001',// 所有的请求地址前缀部分(没有后端请求不用写)
    timeout: 80000, // 请求超时时间(毫秒)
    // withCredentials: true,// 异步请求携带cookie
    // headers: {
    // 设置后端需要的传参类型
    // 'Content-Type': 'application/json',
    // 'token': x-auth-token',//一开始就要token
    // 'X-Requested-With': 'XMLHttpRequest',
    // },
})

// request拦截器
request.interceptors.request.use(
    config => {
        // 如果你要去localStorage获取token
        let token = localStorage.getItem("token");

        // 对音乐端口的请求不携带Authorization请求头
        if (token && needToken(config)) {
            //添加请求头
            config.headers["Authorization"] = "Bearer " + token
        }

        return config
    },
    error => {
        // 对请求错误做些什么
        Promise.reject(error)
    }
)

// response 拦截器
request.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        // 对响应错误做点什么
        if (error.response.status == 403) {
            router.push({ path: '/login' });
            removeToken();
            ElMessage.error(error.response.data.message)
        }
        return Promise.reject(error)
    }
)
export default request