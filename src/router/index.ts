import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/auth/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import { useAuthStore } from '@/store/auth'
const routes = [
  {
    path: '/',
    redirect: '/login'
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
  },
  {
    path: '/departments/:id',
    name: 'DepartmentDetail',
    component: () => import('@/views/DepartmentDetailView.vue')
  },
  {
    path: '/employees',
    name: 'Employees',
    component: () => import('@/views/EmployeesView.vue')
  },
  {
    path: '/employees/create',
    name: 'EmployeeCreate',
    component: () => import('@/views/EmployeeFormView.vue')
  },
  {
    path: '/employees/:id',
    name: 'EmployeeDetail',
    component: () => import('@/views/EmployeeDetailView.vue')
  },
  {
    path: '/employees/:id/edit',
    name: 'EmployeeEdit',
    component: () => import('@/views/EmployeeFormView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route Guard
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  
  // Public routes
  const publicRoutes = ['/login']
  const requiresAuth = !publicRoutes.includes(to.path)
  
  if (requiresAuth && !authStore.isAuthenticated) {
    // Not logged in, redirect to login
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    // Already logged in, redirect to dashboard
    next('/dashboard')
  } else {
    // Proceed
    next()
  }
})

export default router