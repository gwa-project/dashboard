import Vue from "vue";
import Router from "vue-router";
import AppHeader from "./layout/AppHeader";
import AppFooter from "./layout/AppFooter";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";

// Dashboard Layout and Views
import DashboardLayout from "./layout/DashboardLayout.vue";
import Dashboard from "./views/dashboard/Dashboard.vue";
import ProfileView from "./views/dashboard/ProfileView.vue";
import UsersView from "./views/dashboard/UsersView.vue";
import QRISPayment from "./views/dashboard/QRISPayment.vue";
import SettingsView from "./views/dashboard/SettingsView.vue";

Vue.use(Router);

const router = new Router({
  linkExactActiveClass: "active",
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      name: "login",
      components: {
        header: AppHeader,
        default: Login,
        footer: AppFooter
      }
    },
    {
      path: "/register",
      name: "register",
      components: {
        header: AppHeader,
        default: Register,
        footer: AppFooter
      }
    },
    {
      path: "/dashboard",
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: "",
          name: "dashboard",
          component: Dashboard
        },
        {
          path: "profile",
          name: "profile",
          component: ProfileView
        },
        {
          path: "users",
          name: "users",
          component: UsersView,
          meta: { requiresAdmin: true }
        },
        {
          path: "qris",
          name: "qris",
          component: QRISPayment
        },
        {
          path: "settings",
          name: "settings",
          component: SettingsView
        }
      ]
    }
  ],
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  }
});

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('gwa_access_token');
  const user = JSON.parse(localStorage.getItem('gwa_user') || '{}');

  // Prevent infinite redirect loops
  if (to.path === from.path) {
    next(false);
    return;
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next('/login');
    } else if (to.matched.some(record => record.meta.requiresAdmin)) {
      if (user.role === 'admin') {
        next();
      } else {
        next('/dashboard');
      }
    } else {
      next();
    }
  } else {
    if (token && (to.path === '/login' || to.path === '/register')) {
      next('/dashboard');
    } else {
      next();
    }
  }
});

export default router;
