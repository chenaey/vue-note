import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/login.vue'
import My from '../views/my.vue'
import Edit from '../views/edit.vue'
import feedBack from '../views/feedBack.vue'
import Detail from '../views/detail.vue'
import Shares from '../views/shares.vue'
import adminHome from '../views/admin/home.vue'
import adminFeeback from '../views/admin/feedback.vue'
import adminSHares from '../views/admin/shares.vue'
import adminUser from '../views/admin/user.vue'
import adminVersion from '../views/admin/version.vue'
import adminLogin from '../views/admin/adminLogin.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect: '/login',
    meta: {
      showTabBar: false,//该路由显示tabBar
    }
  }, {
    path: '/home',
    name: 'home123',
    component: Home,
    meta: {
      requireAuth: true,  // 该路由项需要权限校验
      showTabBar: true,
    }
  }, {
    path: '/my',
    name: 'my',
    component: My,
    meta: {
      requireAuth: true,
      showTabBar: true,
    }
  }, {
    path: '/edit',
    name: 'edit',
    component: Edit, meta: {
      requireAuth: true,
      showTabBar: true,
    }
  }, {
    path: '/detail',
    name: 'detail',
    component: Detail,
    meta: {
      requireAuth: true,
      showTabBar: false,
    }
  },
  {
    path: '/shares',
    name: 'Shares',
    component: Shares,
    meta: {
      requireAuth: true,
      showTabBar: true,
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/feedback',
    name: 'feedBack',
    component: feedBack,
    meta: {
      requireAuth: true,
      showTabBar: false,
    }
  },

  {
    path: '/admin/home',
    name: 'adminHome',
    component: adminHome,
    meta: {
      requireAuth: false,
      requireAdminAuth: true,
      showTabBar: false
    }
  },

  {
    path: '/admin/shares',
    name: 'adminSHares',
    component: adminSHares,
    meta: {
      requireAdminAuth: true,
      requireAuth: false,

      showTabBar: false
    }
  }, {
    path: '/admin/user',
    name: 'adminUser',
    component: adminUser,
    meta: {
      requireAuth: false,

      requireAdminAuth: true,
      showTabBar: false
    }
  },
  {
    path: '/admin/feedback',
    name: 'adminFeeback',
    component: adminFeeback,
    meta: {
      requireAuth: false,

      requireAdminAuth: true,
      showTabBar: false
    }
  },
  {
    path: '/admin/version',
    name: 'adminVersion',
    component: adminVersion,
    meta: {
      requireAuth: false,
      requireAdminAuth: true,
      showTabBar: false
    }
  }, {
    path: '/adminlogin',
    name: 'adminlogin',
    component: adminLogin,
    meta: {
      requireAuth: false,
      requireAdminAuth: false,
      showTabBar: false
    }
  },
]


const router = new VueRouter({
  // mode: 'hash',
  routes
})

router.beforeEach((to, from, next) => {
  console.log(to.meta.requireAuth)
  if (to.meta.requireAuth) {
    var isLogin = sessionStorage.getItem('isLogin');
    var isAdmins = sessionStorage.getItem('isAdmin');

    if (isLogin || isAdmins) {
      next();
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else if (to.meta.requireAdminAuth) {
    var isAdmin = sessionStorage.getItem('isAdmin');
    if (isAdmin) {
      next()
    } else {
      next({
        path: '/adminlogin',
        query: { redirect: to.fullPath }
      })
    }
  }
  else {
    next();
  }
})
export default router
