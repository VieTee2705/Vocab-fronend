import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DashboardView
    },
    {
      path: '/flashcard/:id?',
      name: 'flashcard',
      component: () => import('../views/FlashcardView.vue')
    }
  ]
})

export default router
