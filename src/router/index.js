import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: resolve => require(['@/components/login'], resolve)
    },
    {
      path: '/register',
      name: 'Register',
      component: resolve => require(['@/components/register'], resolve)
    },
    {
      path: '/home',
      name: 'Home',
      component: resolve => require(['@/components/home'], resolve),
      meta: {
        requireLogin: true
      }
    }
  ]
})
