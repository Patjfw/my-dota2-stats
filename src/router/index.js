import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/components/MainPage'
import GameDetails from '@/components/GameDetails'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MainPage',
      component: MainPage
    },
    {
      path: '/gameDetails/:match_id',
      name: 'GameDetails',
      component: GameDetails
    }
  ]
})
