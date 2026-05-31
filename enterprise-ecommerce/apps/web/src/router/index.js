import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/RegisterPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/pages/DashboardPage.vue'),
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/pages/ProductsPage.vue'),
      },
      {
        path: 'products/:id',
        name: 'ProductDetail',
        component: () => import('@/pages/ProductDetailPage.vue'),
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/pages/CategoriesPage.vue'),
      },
      {
        path: 'brands',
        name: 'Brands',
        component: () => import('@/pages/BrandsPage.vue'),
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/pages/OrdersPage.vue'),
      },
      {
        path: 'orders/:id',
        name: 'OrderDetail',
        component: () => import('@/pages/OrderDetailPage.vue'),
      },
      {
        path: 'payments',
        name: 'Payments',
        component: () => import('@/pages/PaymentsPage.vue'),
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: () => import('@/pages/AnalyticsPage.vue'),
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/pages/ProfilePage.vue'),
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
