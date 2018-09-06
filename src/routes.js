import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './store/store'

import Home from './components/Home.vue'
import ComponentNotFound from './components/NotFound.vue'
import Portfolio from './components/portfolio/Portfolio.vue'
import Stocks from './components/stocks/Stocks.vue'
import Login from './components/users/Login.vue'
import Signup from './components/users/Signup.vue'
import Settings from './components/settings/Settings.vue'

Vue.use(VueRouter)

const routes = [
  { 
    path: '/',
    component: Home,
    name: '00_home',
  },
  { 
    path: '/portfolio',
    component: Portfolio,
    name: '01_portfolio',
    beforeEnter (to, from, next) {
      const token = localStorage.getItem('token')
      if (token === null) {
        next('/')
      }
      next()
    }
  },
  { 
    path: '/stocks',
    component: Stocks,
    name: '02_stocks',
    beforeEnter (to, from, next) {
      const token = localStorage.getItem('token')
      if (token === null) {
        next('/')
      }
      next()
    }
  },
  {
    path: '/settings',
    component: Settings,
    name: '20_settings',
    beforeEnter (to, from, next) {
      const token = localStorage.getItem('token')
      if (token === null) {
        next('/')
      }
      next()
    }
  },
  { 
    path: '/login',
    component: Login,
    name: '50_login',
    beforeEnter (to, from, next) {
      const token = localStorage.getItem('token')
      if (token !== null) {
        next('/')
      }
      next()
    }
  },
  { 
    path: '/signup',
    component: Signup,
    name: '51_signup',
    beforeEnter (to, from, next) {
      const token = localStorage.getItem('token')
      if (token !== null) {
        next('/')
      }
      next()
    }
  },
  {
    path: '*',
    component: ComponentNotFound,
    name: '99_notfound'
  }
]

export default new VueRouter({ mode: 'history', routes })
