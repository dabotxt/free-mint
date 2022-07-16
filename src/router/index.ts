import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { setupRouterGuard } from './guard'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Root',
    redirect: '/home',
    component: () => import('src/views/layout/index.vue'),
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('src/views/home/index.vue'),
        meta: {
          title: 'Home'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
setupRouterGuard(router)

export default router
