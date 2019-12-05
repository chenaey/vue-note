import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/login.vue'
import My from '../views/my.vue'
import Edit from '../views/edit.vue'
import feedBack from '../views/feedBack.vue'
import Detail from '../views/detail.vue'
import Shares from '../views/shares.vue'
import About from '../views/about.vue'
import myInfo from '../views/myinfo.vue'
import findPasswd from '../views/findPasswd.vue'
import myTag from '../views/tag.vue'
import version from '../views/version.vue'

import myshare from '../views/myshare.vue'

//移动端管理后台 废弃
import adminHome from '../views/admin/home.vue'
import adminFeeback from '../views/admin/feedback.vue'
import adminSHares from '../views/admin/shares.vue'
import adminUser from '../views/admin/user.vue'
import adminVersion from '../views/admin/version.vue'
import adminLogin from '../views/admin/adminLogin.vue'

//PC管理后台 
import admin_home from '../views/admin-pc/home.vue'
import admin_feeback from '../views/admin-pc/feedback.vue'
import admin_shares from '../views/admin-pc/shares.vue'
import admin_user from '../views/admin-pc/user.vue'
import admin_version from '../views/admin-pc/version.vue'
import admin_login from '../views/admin-pc/adminLogin.vue'
import admin_uservip from '../views/admin-pc/vipuser.vue'
import admin_detail from '../views/admin-pc/adminDetail.vue'
import admin_his from '../views/admin-pc/hisversion.vue'
import admin_info from '../views/admin-pc/adminInfo.vue'

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
  }, {
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      requireAuth: true,
      showTabBar: false,
    }
  }, {
    path: '/myinfo',
    name: 'myinfo',
    component: myInfo,
    meta: {
      requireAuth: true,
      showTabBar: false,
    }
  }, {
    path: '/mytag',
    name: 'mytag',
    component: myTag,
    meta: {
      requireAuth: true,
      showTabBar: false,
    }
  }, {
    path: '/myshare',
    name: 'myshare',
    component: myshare,
    meta: {
      requireAuth: true,
      showTabBar: false,
    }
  }, {
    path: '/version',
    name: 'version',
    component: version,
    meta: {
      requireAuth: true,
      showTabBar: false,
    }
  },
  {
    path: '/findpasswd',
    name: 'findPasswd',
    component: findPasswd,
    meta: {
      requireAuth: false,
      showTabBar: false,
    }
  },

  //移动端管理
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
  //pc端管理
  {
    path: '/admin-pc/home',
    name: 'adminHome-pc',
    component: admin_home,
    meta: {
      requireAuth: false,
      requireAdminAuth: true,
      showTabBar: false,
    }
  },

  {
    path: '/admin-pc/shares',
    name: 'adminSHares-pc',
    component: admin_shares,
    meta: {
      requireAdminAuth: true,
      requireAuth: false,

      showTabBar: false
    }
  }, {
    path: '/admin-pc/user',
    name: 'adminUser-pc',
    component: admin_user,
    meta: {
      requireAuth: false,

      requireAdminAuth: true,
      showTabBar: false
    }
  },
  {
    path: '/admin-pc/uservip',
    name: 'adminUser-pc',
    component: admin_uservip,
    meta: {
      requireAuth: false,
      requireAdminAuth: true,
      showTabBar: false
    }
  },

  {
    path: '/admin-pc/feedback',
    name: 'adminFeeback-pc',
    component: admin_feeback,
    meta: {
      requireAuth: false,

      requireAdminAuth: true,
      showTabBar: false
    }
  },
  {
    path: '/admin-pc/version',
    name: 'adminVersion-pc',
    component: admin_version,
    meta: {
      requireAuth: false,
      requireAdminAuth: true,
      showTabBar: false
    }
  },

  {
    path: '/admin-pc/detail',
    name: 'admin_detail-pc',
    component: admin_detail,
    meta: {
      requireAuth: false,
      requireAdminAuth: true,
      showTabBar: false
    }
  },

  {
    path: '/admin-pc/login',
    name: 'adminlogin-pc',
    component: admin_login,
    meta: {
      requireAuth: false,
      requireAdminAuth: false,
      showTabBar: false
    }
  }, {
    path: '/admin-pc/hisversion',
    name: 'admin_his-pc',
    component: admin_his,
    meta: {
      requireAuth: false,
      requireAdminAuth: true,
      showTabBar: false
    }
  }, {
    path: '/admin-pc/admininfo',
    name: 'admin_info-pc',
    component: admin_info,
    meta: {
      requireAuth: false,
      requireAdminAuth: true,
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
        path: '/admin-pc/login',
        query: { redirect: to.fullPath }
      })
    }
  }
  else {
    next();
  }
})
export default router
