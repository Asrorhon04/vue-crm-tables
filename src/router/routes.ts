import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'home',
        path: '',
        component: () => import('pages/ClientsPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        name: 'login',
        path: 'login',
        component: () => import('pages/LoginPage.vue'),
        meta: { requiresGuest: true }
      },
      {
        name: 'register',
        path: 'register',
        component: () => import('pages/RegisterPage.vue'),
        meta: { requiresGuest: true }
      }
    ]
  },
  {
    name: 'notfound',
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: { requiresAuth: true }
  }
];

export default routes;
