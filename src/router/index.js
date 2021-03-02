import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout/'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    name: '首页',
    icon: 'home',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/index')
      }
    ]
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
      },
      {
        path: '/cards',
        name: '活动套装',
        component: () => import('@/views/planing/cards')
      },
      {
        path: '/discount',
        name: '折扣管理',
        component: () => import('@/views/planing/discount')
      }
    ]
  },
  {
    path: '/systeam',
    name: '系统设置',
    component: Layout,
    icon: 'setting',
    children: [
      {
        path: '/staff',
        name: '员工管理',
        component: () => import('@/views/systeam/staff')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
