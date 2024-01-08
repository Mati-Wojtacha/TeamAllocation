import { createRouter, createWebHistory } from 'vue-router'
import AboutView from '../views/AboutView.vue'
import Teams from '../views/Teams.vue'
import Main from '../views/Main.vue'
import Login from '../views/Login.vue'
import Matches from '../views/Matches.vue'
import NewMatches from '../views/NewMatches.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/matches',
      name: 'matches',
      component: Matches
    },
    {
      path: '/new-matches',
      name: 'new-matches',
      component: NewMatches
    },
    {
      path: '/teams',
      name: 'Teams',
      component: Teams
    },
    {
      path: '/login',
      name: 'Loign',
      component: Login
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    }
  ]
})

export default router
