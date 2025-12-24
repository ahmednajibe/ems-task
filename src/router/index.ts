import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
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
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView
  },
  {
    path: '/companies',
    name: 'Companies',
    component: () => import('@/views/CompaniesView.vue')
  },
  {
    path: '/companies/:id',
    name: 'CompanyDetail',
    component: () => import('@/views/CompanyDetailView.vue')
  },
  {
    path: '/departments',
    name: 'Departments',
    component: () => import('@/views/DepartmentsView.vue')
  }
]

// Create router instance (إنشاء Router)
const router = createRouter({
  history: createWebHistory(),  // استخدام HTML5 History API
  routes
})

export default router