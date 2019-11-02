import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/login.vue'
import My from '../views/my.vue'
import Edit from '../views/edit.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect: '/login',
  }, {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      requireAuth: true,  // 该路由项需要权限校验
    },
  }, {
    path: '/my',
    name: 'my',
    component: My,
    meta: {
      requireAuth: true,  // 该路由项需要权限校验
    },
  }, {
    path: '/edit',
    name: 'edit',
    component: Edit, meta: {
      requireAuth: true,  // 该路由项需要权限校验
    },
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Login,
  }
]



const router = new VueRouter({
  mode: 'history',
  routes
})
// router.beforeEach((to, from, next) => {
//   if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
//     if (localStorage.token) {  // 获取当前的token是否存在
//       console.log("token存在");
//       next();
//     } else {
//       console.log("token不存在");
//       next({
//         path: '/login', // 将跳转的路由path作为参数，登录成功后跳转到该路由
//         query: { redirect: to.fullPath }
//       })
//     }
//   }
//   else { // 如果不需要权限校验，直接进入路由界面
//     next();
//   }
// });
export default router
