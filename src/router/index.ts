import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../window/HomePage.vue'
import ChildPage from '../window/NoticeBox.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: () => import('../window/HomePage.vue')
    },
    {
      path: '/notice',
      component: () => import('../window/NoticeBox.vue')
    }
  ]
})

export default router
