import Vue from "vue";
import Router from "vue-router";
import store from "./store/index";

Vue.use(Router);

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
  if (!store.getters.isAuthenticated) {
    next('/login');
  }
};

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./layouts/main/Main"),
      beforeEnter: ifAuthenticated,
      children: [
        {
          path: "/thread-id-:id?",
          component: () => import("./views/home/Home"),
          name: "threadId",
          props: true
        },
        {
          path: "/thread-id-:id/report",
          component: () => import("./views/report/Report"),
          name: "report",
          props: true
        },
        {
          path: "/thread-id-:id/picture",
          component: () => import("./views/picture/Picture"),
          name: "picture",
          props: true
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./layouts/login/Login"),
      beforeEnter: ifNotAuthenticated
    }
  ]
});
