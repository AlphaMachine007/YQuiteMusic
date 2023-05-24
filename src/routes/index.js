import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import routes from "./routes";
import { useUser } from "@/store/user"
import { createPinia } from "pinia"

// 路由
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const user = useUser();
    const token = localStorage.getItem('token')
    const userName = user.user.name
    if (token) {
        if (to.path === '/login') {
            next('/home')
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

// 导出
export default router