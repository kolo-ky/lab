import store from '@/store/index';
import Vue from 'vue';
import Router from 'vue-router';

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }
  next('/');
};
const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
    return;
  }
  next('/login');
};

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'operator',
      component: () => import('./views/Operator.vue'),
      beforeEnter: (to, from, next) => {
        ifAuthenticated(to, from, next);
        next();
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue'),
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('./views/Reports.vue'),
      beforeEnter: (to, from, next) => {
        ifAuthenticated(to, from, next);
        next();
      },
    },
    {
      path: '/logging',
      name: 'logging',
      component: () => import('./views/Logging.vue'),
      beforeEnter: (to, from, next) => {
        ifAuthenticated(to, from, next);
        next();
      },
    },
    {
      path: '/new-request',
      name: 'new-request',
      component: () => import('./views/NewRequest.vue'),
      beforeEnter: (to, from, next) => {
        ifAuthenticated(to, from, next);
        next();
      },
    },
    {
      path: '/edit-request/:id',
      name: 'edit-request',
      component: () => import('./views/EditRequest.vue'),
      beforeEnter: (to, from, next) => {
        ifAuthenticated(to, from, next);
        next();
      },
    },
    {
      path: '/analytics/:id',
      name: 'analytics',
      component: () => import('./views/Analytics.vue'),
      beforeEnter: (to, from, next) => {
        ifAuthenticated(to, from, next);
        next();
      },
      children: [
        {
          path: 'lenta',
          component: () => import('@/components/editRequest/analytics/lenta.vue'),
          beforeEnter: (to, from, next) => {
            ifAuthenticated(to, from, next);
            next();
          },
        },
        {
          path: 'report',
          component: () => import('@/components/editRequest/analytics/report.vue'),
          beforeEnter: (to, from, next) => {
            ifAuthenticated(to, from, next);
            next();
          },
        },
        {
          path: 'comments',
          component: () => import('@/components/editRequest/analytics/comments.vue'),
          beforeEnter: (to, from, next) => {
            ifAuthenticated(to, from, next);
            next();
          },
        },
        {
          path: 'public',
          component: () => import('@/components/editRequest/analytics/public.vue'),
          beforeEnter: (to, from, next) => {
            ifAuthenticated(to, from, next);
            next();
          },
        },
        {
          path: 'list',
          component: () => import('@/components/editRequest/analytics/list.vue'),
          beforeEnter: (to, from, next) => {
            ifAuthenticated(to, from, next);
            next();
          },
        },
        {
          path: 'communication',
          component: () => import('@/components/editRequest/analytics/communication.vue'),
          beforeEnter: (to, from, next) => {
            ifAuthenticated(to, from, next);
            next();
          },
        },
      ],
    },
  ],
});
