import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/components/Layout'

Vue.use(VueRouter)

export const routes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Product',
        component: () => import('@/views/product/index'),
        meta: { title: '商品管理', icon: 'product' }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Order',
        component: () => import('@/views/order/index'),
        meta: { title: '订单管理', icon: 'order' }
      }
    ]
  },
  {
    path: '/machine',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Machine',
        component: () => import('@/views/machine/index'),
        meta: { title: '售货柜管理', icon: 'machine' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: { title: '用户管理', icon: 'user' }
      }
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Statistics',
        component: () => import('@/views/statistics/index'),
        meta: { title: '数据统计', icon: 'statistics' }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // const token = getToken()
  // if (to.path === '/login') {
  //   if (token) {
  //     next('/')
  //   } else {
  //     next()
  //   }
  // } else {
  //   if (token) {
  //     next()
  //   } else {
      next('/login')
    // }
  // }
})

export default router
