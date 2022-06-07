import Vue from 'vue'
import Router from 'vue-router'

import _includes from 'lodash/includes'

import Home from '@/views/home/Home.vue'
import Login from '@/views/auth/Login.vue'

import { vueLocalStorage } from '@/assets/js/mixins/base/VueLocalStorage'

Vue.use(Router)

const lazyLoad = component => import(/* webpackChunkName: "[request]" */ `@/${component}.vue`)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login/:hash?',
    name: 'login',
    component: Login
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => lazyLoad('views/auth/Logout')
  },
  {
    path: '/register',
    name: 'register',
    component: () => lazyLoad('views/auth/Register')
  },
  {
    path: '/sample/page1',
    name: 'page1',
    component: () => lazyLoad('views/sample/Page1')
  },
  {
    path: '/sample/page2/page2a',
    name: 'page2a',
    component: () => lazyLoad('views/sample/Page2a')
  },
  {
    path: '/sample/page2/page2b',
    name: 'page2b',
    component: () => lazyLoad('views/sample/Page2b')
  },
  {
    path: '*',
    name: 'page-not-found',
    component: () => lazyLoad('views/errors/PageNotFound')
  }
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const unauthRoutes = [
  'login',
  'logout',
  'page-not-found'
]

router.beforeEach((to, from, next) => {
  // const hasToken = vueLocalStorage.has('token')
  //
  // if (!hasToken && !_includes(unauthRoutes, to.name)) {
  //   return next({ name: 'login' })
  // }

  return next()
})

router.beforeResolve((to, from, next) => {
  let toPage, fromPage

  if (to.name !== 'page-not-found') {
    toPage = to.name + '-page'
    fromPage = from.name + '-page'
  } else {
    toPage = to.name
    fromPage = from.name
  }

  document.body.classList.add(toPage)

  if (toPage !== fromPage) {
    document.body.classList.remove(fromPage)
  }

  if (document.body.classList.contains(toPage)) {
    document.body.classList.add(toPage)
  }

  next()
})

// handles Navigation Duplicate
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
