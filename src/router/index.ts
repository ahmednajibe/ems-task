import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'

// Define routes (تعريف المسارات)
const routes = [
  {
    path: '/',
    redirect: '/login'  // الصفحة الرئيسية تحول تلقائياً للـ login
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  }
]

// Create router instance (إنشاء Router)
const router = createRouter({
  history: createWebHistory(),  // استخدام HTML5 History API
  routes
})

export default router