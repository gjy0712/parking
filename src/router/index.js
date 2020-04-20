import Vue from 'vue';
import Router from 'vue-router'
import { TOKEN } from '@/config/webstore'
import { getLocalStore } from '@/utils/webstore-utils'

Vue.use(Router)

export const defaultRouterMap = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: () => import('../page/login.vue'),
        meta: { title:'登录' }
    },
    {
        path: '/employee',
        redirect: '/employee/home'
    },
    // 管理员模块
    {
        path: '/home',
        component: () => import('../components/component/home'),
        meta: { title: '管理员模块'},
        children: [
            {
                path: '/home',
                component: () => import('../page/home/home'),
                meta: { title: '首页' }
            },
            {
                path: '/userInfo',
                component: () => import('../page/userInfo/user-info'),
                meta: { title: '个人信息' }
            },
            {
                path: '/carInfo',
                component: () => import('../page/home/vehicle-storage'),
                meta: { title: '车辆入库' }
            },
            {
                path: '/employee',
                component: () => import('../page/people-management'),
                meta: { title: '人员管理' }
            },
            {
                path: '/carStationList',
                component: () => import('../page/garage-management'),
                meta: { title: '车库管理' }
            },
            {
                path: '/carStationDetail',
                component: () => import('../page/garage-management-detail'),
                meta: { title: '车库管理详情' }
            },
            {
                path: '/message',
                component: () => import('../page/announce'),
                meta: { title: '发布公告' }
            },
            {
                path: '/todayWork',
                component: () => import('../page/work-today'),
                meta: { title: '今日工作'}
            }
        ]
    },
    // 普通职员模块
    {
        path: '/employee/home',
        component: () => import('../components/component/employee-aside/employee-home'),
        meta: { title: '普通职员模块'},
        children: [
            {
                path: '/employee/home',
                component: () => import('../page/employee/home/home'),
                meta: { title: '首页' }
            },
            {
                path: '/employee/userInfo',
                component: () => import('../page/employee/userInfo/user-info'),
                meta: { title: '普通职员个人信息' }
            },
            {
                path: '/employee/carInfo',
                component: () => import('../page/employee/home/vehicle-storage'),
                meta: { title: '普通职员车辆入库' }
            },
            {
                path: '/employee/todayWork',
                component: () => import('../page/employee/work-today'),
                meta: { title: '普通职员今日工作'}
            }
        ]
    },

]

const router = new Router({
    routes: defaultRouterMap
})

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next();
    } else {
        let token = getLocalStore(TOKEN)
        if (token === 'null' || token === '') {
            next('/login');
        } else {
            next();
        }
    }
});

export default router