import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import routes from "./routes";
import { useUser } from "@/store/user"
import { createPinia } from "pinia"
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

// 路由
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    NProgress.start();
    const user = useUser();
    const token = localStorage.getItem('token')
    const userName = user.user.name
    if (token) {
        if (to.path === '/login') {
            next('/home')
            NProgress.done();
        } else {
            try {
                user.getUserInfo()
                next()
            } catch (error) {
                // token失效
                user.userLogout()
                let toPath = to.path
                if (toPath.indexOf('/userpage') != -1) {
                    next('/login?redirect=' + toPath)
                } else {
                    next('/login')
                }
                NProgress.done();
                localStorage.removeItem('token')
                alert(error.message)
            }
        }
    } else {
        if (to.fullPath == '/login') {
            next();
        } else {
            next('/login')
        }
    }
})

router.afterEach(()=>{
    NProgress.done();
})
// 导出
export default router