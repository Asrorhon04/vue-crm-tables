import { route } from 'quasar/wrappers';
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'stores/auth';

export default route(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    history: createHistory(process.env.VUE_ROUTER_BASE),
    routes,
    scrollBehavior: () => ({ left: 0, top: 0 })
  });

  Router.beforeEach((to) => {
    const auth = useAuthStore();

    // 1) Приватным — требует авторизации
    if (to.meta.requiresAuth && !auth.user) {
      return { name: 'login' };
    }

    // 2) Гостевым — только для неавторизованных
    if (to.meta.requiresGuest && auth.user) {
      return { name: 'home' };
    }

    // 3) Всё остальное — проходим
  });

  return Router;
});
