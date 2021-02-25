import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout/'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '首页',
    icon: 'home',
    component: Layout
  },
  {
    path: '/customer',
    name: '客户管理',
    icon: 'user',
    component: Layout,
    children: [
      {
        path: '/member',
        name: '会员列表',
        component: () => import('@/views/customer/member')
      }
    ]
  },
  {
    path: '/planing',
    name: '运营管理',
    component: Layout,
    icon: 'dot-chart',
    children: [
      {
        path: '/label',
        name: '标签管理',
        component: () => import('@/views/planing/label')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
